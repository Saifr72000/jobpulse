import type { Request, Response, NextFunction } from "express";
import * as valueCardService from "../services/valueCard.service.js";

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
  };
}

export const getTiers = (_req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json(valueCardService.getTierCatalog());
  } catch (error) {
    next(error);
  }
};

export const getAccount = async (
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

    const account = await valueCardService.getAccountForUser(userId);
    res.status(200).json(account);
  } catch (error) {
    next(error);
  }
};

export const purchase = async (
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

    const { tierId } = req.body as { tierId?: string };
    const result = await valueCardService.purchaseValueCard(userId, tierId ?? "");

    res.status(201).json(result);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "User not found") {
        res.status(404).json({ error: error.message });
        return;
      }
      if (error.message === "Invalid tier") {
        res.status(400).json({ error: error.message });
        return;
      }
    }
    next(error);
  }
};
