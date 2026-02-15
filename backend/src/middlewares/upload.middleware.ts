import multer from "multer"; // multer is a middleware for handling multipart/form-data, which is used for file uploads

const storage = multer.memoryStorage(); // storage is the storage engine for multer, which is used to store the file in memory

/** Single file upload (10 MB) – use field name "file" */
export const uploadSingle = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
}).single("file");

/** Multiple files (e.g. images + videos); field name "files". 50 files max, 100 MB per file. */
export const uploadMultiple = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100 MB per file (videos)
    files: 50,
  },
}).array("files", 50);
