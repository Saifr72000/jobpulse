import { Router } from "express";
import {
  createComment,
  getCommentsByOrder,
} from "../controllers/comment.controller.js";
import {
  createCommentValidator,
  getCommentsValidator,
} from "../validators/comment.validator.js";
import { requestValidator } from "../middlewares/requestValidator.middleware.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = Router();

// Get all comments for an order, paginated (auth required)
router.get(
  "/order/:orderId",
  authenticateUser,
  getCommentsValidator,
  requestValidator,
  getCommentsByOrder
);

// Post a new comment on an order (auth required)
router.post(
  "/order/:orderId",
  authenticateUser,
  createCommentValidator,
  requestValidator,
  createComment
);

export default router;
