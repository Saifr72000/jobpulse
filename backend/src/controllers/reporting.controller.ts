import type { Request, Response, NextFunction } from "express";
import * as reportingService from "../services/reporting/reporting.service.js";
import { PlatformToken } from "../models/platformToken.model.js";
import type { PlatformName } from "../models/platformToken.model.js";

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

const VALID_PLATFORMS: PlatformName[] = [
  "meta",
  "linkedin",
  "tiktok",
  "snapchat",
];

export const upsertToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { platform, accessToken, refreshToken, expiresAt } = req.body as {
      platform?: string;
      accessToken?: string;
      refreshToken?: string;
      expiresAt?: string;
    };

    if (!platform || !VALID_PLATFORMS.includes(platform as PlatformName)) {
      res.status(400).json({
        error: `'platform' must be one of: ${VALID_PLATFORMS.join(", ")}.`,
      });
      return;
    }

    if (!accessToken || typeof accessToken !== "string") {
      res.status(400).json({ error: "'accessToken' is required." });
      return;
    }

    const update: Record<string, unknown> = { accessToken };
    if (refreshToken) update["refreshToken"] = refreshToken;
    if (expiresAt) update["expiresAt"] = new Date(expiresAt);

    const token = await PlatformToken.findOneAndUpdate({ platform }, update, {
      upsert: true,
      new: true,
    });

    res.status(200).json({ message: `Token for '${platform}' saved.`, token });
  } catch (err) {
    next(err);
  }
};

export const getSummary = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const orderId = String(req.params["orderId"]);
    const dateRange = parseDateRange(req.query["since"], req.query["until"]);

    if (!dateRange) {
      res.status(400).json({
        error: "Query params 'since' and 'until' are required (YYYY-MM-DD).",
      });
      return;
    }

    const result = await reportingService.getSummary(orderId, dateRange);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const getTimeSeries = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const orderId = String(req.params["orderId"]);
    const dateRange = parseDateRange(req.query["since"], req.query["until"]);

    if (!dateRange) {
      res.status(400).json({
        error: "Query params 'since' and 'until' are required (YYYY-MM-DD).",
      });
      return;
    }

    const result = await reportingService.getTimeSeries(orderId, dateRange);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const getDemographics = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const orderId = String(req.params["orderId"]);
    const dateRange = parseDateRange(req.query["since"], req.query["until"]);

    if (!dateRange) {
      res.status(400).json({
        error: "Query params 'since' and 'until' are required (YYYY-MM-DD).",
      });
      return;
    }

    const result = await reportingService.getDemographics(orderId, dateRange);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
