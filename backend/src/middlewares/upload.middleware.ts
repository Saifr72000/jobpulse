import multer from "multer";
import type { Request, Response, NextFunction } from "express";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "video/mp4",
  "video/quicktime",
  "video/webm",
  "application/pdf",
]);

const FILE_SIZE_LIMIT = 5 * 1024 * 1024; // 5 MB

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  if (ALLOWED_MIME_TYPES.has(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type "${file.mimetype}" is not allowed. Accepted types: images (JPEG, PNG, GIF, WebP), videos (MP4, MOV, WebM), PDF.`));
  }
};

const storage = multer.memoryStorage();

/** Single file upload – field name "file" */
export const uploadSingle = multer({
  storage,
  fileFilter,
  limits: { fileSize: FILE_SIZE_LIMIT },
}).single("file");

const _uploadMultiple = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: FILE_SIZE_LIMIT,
    files: 10,
  },
}).array("files", 10);

/**
 * Multer middleware for multiple file uploads with graceful error handling.
 * Returns 400 with a clear message on file size or type violations
 * instead of letting the error bubble to the global handler.
 */
export const uploadMultiple = (req: Request, res: Response, next: NextFunction): void => {
  _uploadMultiple(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        res.status(400).json({ error: "File too large. Maximum allowed size is 5 MB per file." });
        return;
      }
      if (err.code === "LIMIT_FILE_COUNT") {
        res.status(400).json({ error: "Too many files. Maximum 10 files per upload." });
        return;
      }
      res.status(400).json({ error: err.message });
      return;
    }
    if (err instanceof Error) {
      res.status(400).json({ error: err.message });
      return;
    }
    next();
  });
};
