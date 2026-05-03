import type { Request, Response, NextFunction } from "express";
import {
  buildLinkedInMockAdAnalyticsResponse,
  type LinkedInMockAdAnalyticsQuery,
} from "../services/mock/linkedinMockAdAnalytics.service.js";

function oneQuery(req: Request, key: string): string {
  const v = req.query[key];
  if (Array.isArray(v)) return String(v[0] ?? "");
  return String(v ?? "");
}

/**
 * Optional `fields` is a comma-separated list (same as LinkedIn).
 * Express/qs may represent it as a string or split into an array — normalize to one string.
 */
function fieldsQuery(req: Request): string | undefined {
  const v = req.query["fields"];
  if (v === undefined) return undefined;
  if (Array.isArray(v)) {
    const joined = v
      .map((x) => String(x))
      .join(",")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .join(",");
    return joined || undefined;
  }
  const s = String(v).trim();
  return s || undefined;
}

export const getLinkedInMockAdAnalytics = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const q = oneQuery(req, "q");
    const pivot = oneQuery(req, "pivot");
    const campaigns = oneQuery(req, "campaigns");
    const dateRange = oneQuery(req, "dateRange");
    const timeRaw = oneQuery(req, "timeGranularity").toUpperCase();
    const fields = fieldsQuery(req);

    if (!q || !pivot || !campaigns || !dateRange) {
      res.status(400).json({
        error: "q, pivot, campaigns, and dateRange are required.",
      });
      return;
    }

    if (timeRaw !== "ALL" && timeRaw !== "DAILY") {
      res.status(400).json({
        error: "timeGranularity must be ALL or DAILY.",
      });
      return;
    }

    const query: LinkedInMockAdAnalyticsQuery = {
      q,
      pivot,
      campaigns,
      dateRange,
      timeGranularity: timeRaw,
    };
    if (fields !== undefined) query.fields = fields;

    const body = await buildLinkedInMockAdAnalyticsResponse(query);
    res.status(200).json(body);
  } catch (err) {
    next(err);
  }
};
