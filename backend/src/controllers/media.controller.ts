import type { Request, Response, NextFunction } from "express";
import * as mediaService from "../services/media.service.js";
import { generateUploadUrl, generateDownloadUrl } from "../services/s3.service.js";

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
  };
  file?: Express.Multer.File | undefined;
  files?: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] } | undefined;
}

const parsePagination = (query: Request["query"]) => {
  const page = Math.max(1, parseInt(query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit as string) || 20));
  return { page, limit };
};

const enrichWithUrls = async (mediaList: Awaited<ReturnType<typeof mediaService.getMediaByCompany>>["data"]) => {
  return Promise.all(
    mediaList.map(async (m) => ({
      ...m.toObject(),
      url: await generateDownloadUrl({ key: m.s3Key, expiresIn: 60 * 60 }),
    }))
  );
};

/**
 * Upload one or more files for an order.
 * Requires multipart/form-data with field "files". orderId and folderId are optional.
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
        error: "No files uploaded. Use multipart/form-data with field 'files' (array).",
      });
      return;
    }

    const orderId = req.body.orderId as string | undefined;
    const folderId = req.body.folderId as string | undefined;

    const uploaded = await Promise.all(
      files.map((file) =>
        mediaService.uploadMedia({
          buffer: file.buffer,
          originalFilename: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          userId,
          ...(orderId ? { orderId } : {}),
          ...(folderId ? { folderId } : {}),
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
        folderId: m.folderId,
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
    const id = req.params.id as string;
    const media = await mediaService.getMediaById(id);

    if (!media) {
      res.status(404).json({ error: "Media not found" });
      return;
    }

    const url = await generateDownloadUrl({ key: media.s3Key, expiresIn: 60 * 60 });
    res.status(200).json({ ...media.toObject(), url });
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
    const companyId = req.params.companyId as string;
    const { page, limit } = parsePagination(req.query);

    const result = await mediaService.getMediaByCompany(companyId, page, limit);
    const enriched = await enrichWithUrls(result.data);

    res.status(200).json({ data: enriched, pagination: result.pagination });
  } catch (error) {
    next(error);
  }
};

export const getMediaByFolder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const folderId = req.params.folderId as string;
    const { page, limit } = parsePagination(req.query);

    const result = await mediaService.getMediaByFolder(folderId, page, limit);
    const enriched = await enrichWithUrls(result.data);

    res.status(200).json({ data: enriched, pagination: result.pagination });
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
    const orderId = req.params.orderId as string;
    const { page, limit } = parsePagination(req.query);

    const result = await mediaService.getMediaByOrder(orderId, page, limit);
    const enriched = await enrichWithUrls(result.data);

    res.status(200).json({ data: enriched, pagination: result.pagination });
  } catch (error) {
    next(error);
  }
};

/**
 * Assigns a media item to a folder, or removes it from any folder (pass folderId: null).
 */
export const assignMediaFolder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id as string;
    const { folderId } = req.body as { folderId: string | null };

    const media = await mediaService.assignMediaFolder(id, folderId ?? null);
    if (!media) {
      res.status(404).json({ error: "Media not found" });
      return;
    }

    res.status(200).json(media);
  } catch (error) {
    next(error);
  }
};

export const deleteMedia = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id as string;
    await mediaService.deleteMedia(id);
    res.status(200).json({ message: "Media deleted successfully" });
  } catch (error) {
    if (error instanceof Error && error.message === "Media not found") {
      res.status(404).json({ error: error.message });
      return;
    }
    next(error);
  }
};

/**
 * DEV ONLY — verifies S3 credentials and shows what presigned URLs look like.
 */
export const s3Test = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const testKey = `s3-test/ping-${Date.now()}.txt`;

    const [uploadUrl, downloadUrl] = await Promise.all([
      generateUploadUrl({ key: testKey, contentType: "text/plain" }),
      generateDownloadUrl({ key: testKey }),
    ]);

    res.status(200).json({
      message: "S3 credentials are valid — presigned URLs generated successfully",
      bucket: process.env.S3_BUCKET_NAME,
      region: process.env.AWS_REGION,
      testKey,
      uploadUrl,
      downloadUrl,
    });
  } catch (error) {
    next(error);
  }
};
