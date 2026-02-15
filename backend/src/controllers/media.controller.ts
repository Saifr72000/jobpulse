import type { Request, Response, NextFunction } from "express";
import * as mediaService from "../services/media.service.js";

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
  };
  file?: Express.Multer.File | undefined;
  /** Set by uploadMultiple middleware; can be array or keyed by field name */
  files?: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] } | undefined;
}

/**
 * Upload one or more files (images/videos) for an order.
 * Requires multipart/form-data with field "files" (array) and "orderId".
 * Only orders belonging to the logged-in user are accepted.
 */
export const uploadMedia = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    const rawFiles = req.files;
    const files = Array.isArray(rawFiles) ? rawFiles : rawFiles?.files;
    if (!files?.length) {
      res.status(400).json({
        error: "No files uploaded. Use multipart/form-data with field 'files' (array) and 'orderId'.",
      });
      return;
    }

    const orderId = req.body.orderId as string | undefined;
    if (!orderId) {
      res.status(400).json({ error: "orderId is required" });
      return;
    }

    const uploaded = await Promise.all(
      files.map((file) =>
        mediaService.uploadMedia({
          buffer: file.buffer,
          originalFilename: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          userId,
          orderId,
        })
      )
    );

    res.status(201).json({
      message: "Media uploaded successfully",
      media: uploaded.map((m) => ({
        _id: m._id,
        companyId: m.companyId,
        uploadedBy: m.uploadedBy,
        orderId: m.orderId,
        s3Key: m.s3Key,
        originalFilename: m.originalFilename,
        mimetype: m.mimetype,
        size: m.size,
        createdAt: m.createdAt,
      })),
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("Order does not belong to this user")) {
        res.status(403).json({ error: error.message });
        return;
      }
      if (error.message.includes("not found") || error.message.includes("no company")) {
        res.status(404).json({ error: error.message });
        return;
      }
      if (error.message.includes("not configured")) {
        res.status(503).json({ error: error.message });
        return;
      }
    }
    next(error);
  }
};

export const getMediaById = async ( 
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    if (typeof id !== "string") {
      res.status(400).json({ error: "Invalid media ID" });
      return;
    }
    const media = await mediaService.getMediaById(id);

    if (!media) {
      res.status(404).json({ error: "Media not found" });
      return;
    }

    res.status(200).json(media);
  } catch (error) {
    next(error);
  }
};

export const getMediaByCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const companyId = req.params.companyId;
    if (typeof companyId !== "string") {
      res.status(400).json({ error: "Invalid company ID" });
      return;
    }
    const media = await mediaService.getMediaByCompany(companyId);
    res.status(200).json(media);
  } catch (error) {
    next(error);
  }
};

export const getMediaByOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orderId = req.params.orderId;
    if (typeof orderId !== "string") {
      res.status(400).json({ error: "Invalid order ID" });
      return;
    }
    const media = await mediaService.getMediaByOrder(orderId);
    res.status(200).json(media);
  } catch (error) {
    next(error);
  }
};
