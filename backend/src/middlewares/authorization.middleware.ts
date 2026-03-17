import type { Request, Response, NextFunction } from "express";
import { User } from "../models/user.model.js";

/**
 * Middleware to verify that the authenticated user belongs to the same company
 * as the one specified in the request params (companyId).
 * Must be used after authenticateUser middleware.
 */
export const requireSameCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    const { companyId } = req.params;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!companyId) {
      res.status(400).json({ message: "Company ID is required" });
      return;
    }

    // Get user's company
    const user = await User.findById(userId).select("company");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Check if user's company matches the requested company
    if (user.company.toString() !== companyId) {
      res.status(403).json({ message: "Access denied: You don't have permission to access this company's resources" });
      return;
    }

    next();
  } catch (error) {
    console.error("Error in authorization middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
