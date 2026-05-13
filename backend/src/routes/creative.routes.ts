import { Router } from "express";
import {
  createCreative,
  getCreativesByOrder,
  updateCreativeStatus,
  deleteCreative,
} from "../controllers/creative.controller.js";
import {
  createCreativeValidator,
  updateCreativeStatusValidator,
  creativeIdValidator,
  orderIdParamValidator,
} from "../validators/creative.validator.js";
import { requestValidator } from "../middlewares/requestValidator.middleware.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { requireOrderAccess } from "../middlewares/authorization.middleware.js";

const router = Router();

// Get all creatives for an order (auth required)
router.get(
  "/order/:orderId",
  authenticateUser,
  requireOrderAccess("orderId"),
  orderIdParamValidator,
  requestValidator,
  getCreativesByOrder,
);

// Admin creates a creative (auth required)
router.post(
  "/",
  authenticateUser,
  createCreativeValidator,
  requestValidator,
  createCreative
);

// Admin or client updates creative status (auth required)
router.patch(
  "/:id/status",
  authenticateUser,
  updateCreativeStatusValidator,
  requestValidator,
  updateCreativeStatus
);

// Admin removes a creative (auth required)
router.delete(
  "/:id",
  authenticateUser,
  creativeIdValidator,
  requestValidator,
  deleteCreative
);

export default router;
