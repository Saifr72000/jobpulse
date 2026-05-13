import type { Request, Response, NextFunction } from "express";
import { User } from "../models/user.model.js";
import { Order } from "../models/order.model.js";
import { Media } from "../models/media.model.js";

/**
 * Middleware to verify that the authenticated user belongs to the same company
 * as the one specified in `companyId` or `id` request params, **or** is a platform admin.
 * Must be used after `authenticateUser`.
 */
export const requireSameCompany = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = (req as { user?: { userId: string } }).user?.userId;
    const targetCompanyId = req.params.companyId ?? req.params.id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!targetCompanyId) {
      res.status(400).json({ message: "Company ID is required" });
      return;
    }

    const user = await User.findById(userId).select("company role").lean();
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (user.role === "admin") {
      next();
      return;
    }

    if (user.company.toString() !== targetCompanyId) {
      res.status(403).json({
        message:
          "Access denied: You don't have permission to access this company's resources",
      });
      return;
    }

    next();
  } catch (error) {
    console.error("Error in authorization middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Like `requireSameCompany`, but **never** grants access based on platform `admin` role.
 * Use with `requireAdmin` when the caller must be an org admin **and** the URL `companyId` / `id`
 * must match their own company (so platform admins cannot act on another org by ID alone).
 */
export const requireSameCompanyStrict = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = (req as { user?: { userId: string } }).user?.userId;
    const targetCompanyId = req.params.companyId ?? req.params.id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!targetCompanyId) {
      res.status(400).json({ message: "Company ID is required" });
      return;
    }

    const user = await User.findById(userId).select("company").lean();
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (user.company.toString() !== targetCompanyId) {
      res.status(403).json({
        message:
          "Access denied: You don't have permission to access this company's resources",
      });
      return;
    }

    next();
  } catch (error) {
    console.error("Error in requireSameCompanyStrict middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Ensures the media item's `companyId` matches the authenticated user's company.
 * No platform-admin bypass. Intended to run after `requireAdmin`.
 */
export function requireMediaCompanyOwnership(param: "id") {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as { user?: { userId: string } }).user?.userId;
      const mediaId = req.params[param];

      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      if (!mediaId) {
        res.status(400).json({ message: "Media ID is required" });
        return;
      }

      const [media, user] = await Promise.all([
        Media.findById(mediaId).select("companyId").lean(),
        User.findById(userId).select("company").lean(),
      ]);

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      if (!media) {
        res.status(404).json({ error: "Media not found" });
        return;
      }

      if (user.company.toString() !== media.companyId.toString()) {
        res.status(403).json({
          message: "Access denied: media belongs to another company",
        });
        return;
      }

      next();
    } catch (error) {
      console.error("Error in requireMediaCompanyOwnership middleware:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
}

/**
 * Ensures the user may access the order identified by `req.params[param]`
 * (same company as the order, or platform admin). Must run after `authenticateUser`.
 */
export function requireOrderAccess(param: "id" | "orderId") {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = (req as { user?: { userId: string } }).user?.userId;
      const orderId = req.params[param];

      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      if (!orderId) {
        res.status(400).json({ message: "Order ID is required" });
        return;
      }

      const [order, user] = await Promise.all([
        Order.findById(orderId).select("company").lean(),
        User.findById(userId).select("company role").lean(),
      ]);

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      if (!order) {
        res.status(404).json({ error: "Order not found" });
        return;
      }

      if (user.role === "admin") {
        next();
        return;
      }

      if (user.company.toString() !== order.company.toString()) {
        res.status(403).json({
          message: "Access denied: you do not have access to this order",
        });
        return;
      }

      next();
    } catch (error) {
      console.error("Error in requireOrderAccess middleware:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
}
