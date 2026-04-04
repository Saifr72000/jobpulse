import type { Request, Response, NextFunction } from "express";
import * as creativeService from "../services/creative.service.js";
import type { CreativeStatus } from "../models/creative.model.js";

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    companyId?: string;
  };
}

export const createCreative = async (
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

    const { orderId, headline, subline, url } = req.body;

    const creative = await creativeService.createCreative(userId, {
      orderId,
      headline,
      subline,
      url,
    });

    res.status(201).json(creative);
  } catch (error) {
    if (error instanceof Error && error.message.includes("not found")) {
      res.status(404).json({ error: error.message });
      return;
    }
    next(error);
  }
};

export const getCreativesByOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orderId } = req.params;
    const creatives = await creativeService.getCreativesByOrder(orderId);
    res.status(200).json(creatives);
  } catch (error) {
    next(error);
  }
};

export const updateCreativeStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { status } = req.body as { status: CreativeStatus };

    const creative = await creativeService.updateCreativeStatus(id, status);
    if (!creative) {
      res.status(404).json({ error: "Creative not found" });
      return;
    }

    res.status(200).json(creative);
  } catch (error) {
    next(error);
  }
};

export const deleteCreative = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const creative = await creativeService.deleteCreative(id);
    if (!creative) {
      res.status(404).json({ error: "Creative not found" });
      return;
    }

    res.status(200).json({ message: "Creative deleted successfully" });
  } catch (error) {
    next(error);
  }
};
