import multer from "multer";

const storage = multer.memoryStorage();

export const uploadSingle = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
}).single("file");
