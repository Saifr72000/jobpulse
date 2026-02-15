import type { Request, Response, NextFunction } from "express";
import * as mediaService from "../services/media.service.js";

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
  };
  file?: {
    buffer: Buffer;
    originalname: string;
    mimetype: string;
    size: number;
  };
}

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

    const file = req.file;
    if (!file) {
      res.status(400).json({ error: "No file uploaded. Use multipart/form-data with field 'file'." });
      return;
    }

    const orderId = req.body.orderId as string | undefined;

    const media = await mediaService.uploadMedia({
      buffer: file.buffer,
      originalFilename: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      userId,
      ...(orderId && { orderId }),
    });

    res.status(201).json({
      message: "Media uploaded successfully",
      media: {
        _id: media._id,
        companyId: media.companyId,
        uploadedBy: media.uploadedBy,
        orderId: media.orderId,
        s3Key: media.s3Key,
        originalFilename: media.originalFilename,
        mimetype: media.mimetype,
        size: media.size,
        createdAt: media.createdAt,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
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
