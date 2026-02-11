import { Router } from "express";
import {
  uploadMedia,
  getMediaById,
  getMediaByCompany,
  getMediaByOrder,
} from "../controllers/media.controller.js";
import { uploadSingle } from "../middlewares/upload.middleware.js";
import {
  uploadMediaValidator,
  mediaIdValidator,
  companyIdValidator,
  orderIdParamValidator,
} from "../validators/media.validator.js";
import { requestValidator } from "../middlewares/requestValidator.middleware.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = Router();

// All media routes require authentication unless otherwise specified
router.post(
  "/",
  authenticateUser,
  uploadSingle,
  uploadMediaValidator,
  requestValidator,
  uploadMedia
);

router.get("/company/:companyId", companyIdValidator, requestValidator, getMediaByCompany);
router.get("/order/:orderId", orderIdParamValidator, requestValidator, getMediaByOrder);
router.get("/:id", mediaIdValidator, requestValidator, getMediaById);

export default router;
