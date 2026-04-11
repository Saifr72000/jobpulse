import type { Request, Response, NextFunction } from "express";
import {
  buildSnapchatMockStatsResponse,
  type SnapchatMockStatsQuery,
} from "../services/mock/snapchatMockStats.service.js";

export const getSnapchatMockCampaignStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const campaignId = String(req.params["campaignId"] ?? "");
    const start_time = String(req.query["start_time"] ?? "");
    const end_time = String(req.query["end_time"] ?? "");
    const granularityRaw = String(req.query["granularity"] ?? "DAY").toUpperCase();
    const fields = req.query["fields"]
      ? String(req.query["fields"])
      : undefined;
    const report_dimension = req.query["report_dimension"]
      ? String(req.query["report_dimension"])
      : undefined;

    if (!campaignId || !start_time || !end_time) {
      res.status(400).json({
        error: "campaignId, start_time, and end_time are required.",
      });
      return;
    }

    if (granularityRaw !== "TOTAL" && granularityRaw !== "DAY") {
      res.status(400).json({
        error: "granularity must be TOTAL or DAY.",
      });
      return;
    }

    const q: SnapchatMockStatsQuery = {
      start_time,
      end_time,
      granularity: granularityRaw,
    };
    if (fields !== undefined) q.fields = fields;
    if (report_dimension !== undefined) q.report_dimension = report_dimension;

    const body = await buildSnapchatMockStatsResponse(campaignId, q);

    res.status(200).json(body);
  } catch (err) {
    next(err);
  }
};
