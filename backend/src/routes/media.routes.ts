import { Router } from "express";
import {
  uploadMedia,
  getMediaById,
  getMediaByCompany,
  getMediaByFolder,
  getMediaByOrder,
  assignMediaFolder,
  deleteMedia,
  s3Test,
} from "../controllers/media.controller.js";
import { uploadMultiple } from "../middlewares/upload.middleware.js";
import {
  uploadMediaValidator,
  mediaIdValidator,
  companyIdValidator,
  orderIdParamValidator,
} from "../validators/media.validator.js";
import { param, body } from "express-validator";
import { requestValidator } from "../middlewares/requestValidator.middleware.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import {
  requireOrderAccess,
  requireSameCompany,
  requireMediaCompanyOwnership,
} from "../middlewares/authorization.middleware.js";
import { requireAdmin } from "../middlewares/requireAdmin.middleware.js";

const router = Router();

// DEV — S3 connectivity check
router.get("/s3-test", authenticateUser, s3Test);

// Upload files
router.post(
  "/",
  authenticateUser,
  uploadMultiple,
  uploadMediaValidator,
  requestValidator,
  uploadMedia
);

// Get media by folder (paginated) — must come before /:id
router.get(
  "/folder/:folderId",
  authenticateUser,
  [param("folderId").isMongoId().withMessage("Invalid folder ID")],
  requestValidator,
  getMediaByFolder
);

// Get media by company (paginated)
router.get(
  "/company/:companyId",
  authenticateUser,
  requireSameCompany,
  companyIdValidator,
  requestValidator,
  getMediaByCompany,
);

// Get media by order (paginated)
router.get(
  "/order/:orderId",
  authenticateUser,
  requireOrderAccess("orderId"),
  orderIdParamValidator,
  requestValidator,
  getMediaByOrder,
);

// Assign / move to a folder (pass folderId: null to move to root)
router.patch(
  "/:id/folder",
  authenticateUser,
  [
    param("id").isMongoId().withMessage("Invalid media ID"),
    body("folderId").optional({ nullable: true }).isMongoId().withMessage("Invalid folder ID"),
  ],
  requestValidator,
  requireAdmin,
  requireMediaCompanyOwnership("id"),
  assignMediaFolder
);

// Delete media
router.delete(
  "/:id",
  authenticateUser,
  mediaIdValidator,
  requestValidator,
  requireAdmin,
  requireMediaCompanyOwnership("id"),
  deleteMedia
);

// Get single media item
router.get(
  "/:id",
  authenticateUser,
  mediaIdValidator,
  requestValidator,
  requireMediaCompanyOwnership("id"),
  getMediaById
);

export default router;
