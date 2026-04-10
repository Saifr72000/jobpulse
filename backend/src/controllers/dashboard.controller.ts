import type { Request, Response, NextFunction } from "express";
import { getDashboardData } from "../services/dashboard.service.js";

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    companyId?: string;
  };
}

function parseDateRange(
  since: unknown,
  until: unknown,
): { since: string; until: string } | null {
  if (
    typeof since !== "string" ||
    typeof until !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(since) ||
    !/^\d{4}-\d{2}-\d{2}$/.test(until)
  ) {
    return null;
  }
  return { since, until };
}

export const getDashboard = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized." });
      return;
    }

    const dateRange = parseDateRange(req.query["since"], req.query["until"]);

    if (!dateRange) {
      res.status(400).json({
        error: "Query params 'since' and 'until' are required (YYYY-MM-DD).",
      });
      return;
    }

    const result = await getDashboardData(userId, dateRange);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
