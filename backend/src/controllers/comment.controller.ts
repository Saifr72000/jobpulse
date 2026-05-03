import type { Request, Response, NextFunction } from "express";
import * as commentService from "../services/comment.service.js";
import type { CommentRole } from "../models/comment.model.js";
import { stringParam } from "../utils/expressParams.js";

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    companyId?: string;
  };
}

export const createComment = async (
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

    const orderId = stringParam(req.params.orderId);
    if (!orderId) {
      res.status(400).json({ error: "orderId is required" });
      return;
    }
    const { message, role } = req.body as { message: string; role: CommentRole };

    const comment = await commentService.createComment(userId, {
      orderId,
      message,
      role,
    });

    res.status(201).json(comment);
  } catch (error) {
    if (error instanceof Error && error.message.includes("not found")) {
      res.status(404).json({ error: error.message });
      return;
    }
    next(error);
  }
};

export const getCommentsByOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orderId = stringParam(req.params.orderId);
    if (!orderId) {
      res.status(400).json({ error: "orderId is required" });
      return;
    }
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 50;

    const result = await commentService.getCommentsByOrder(orderId, page, limit);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
