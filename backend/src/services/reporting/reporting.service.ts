import { Order } from "../../models/order.model.js";
import { PlatformToken } from "../../models/platformToken.model.js";
// import mongoose from "mongoose";
// import { ReportSnapshot } from "../../models/reportSnapshot.model.js";
import type {
  DateRange,
  IReportingAdapter,
  NormalizedDemographic,
  NormalizedSummary,
  NormalizedTimeSeriesPoint,
} from "./adapters/adapter.interface.js";
import { MetaAdapter } from "./adapters/meta.adapter.js";
import { LinkedInAdapter } from "./adapters/linkedin.adapter.js";
import { TikTokAdapter } from "./adapters/tiktok.adapter.js";
import { SnapchatAdapter } from "./adapters/snapchat.adapter.js";

// const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour — re-enable for production

const ADAPTERS: Record<string, IReportingAdapter> = {
  meta: new MetaAdapter(),
  linkedin: new LinkedInAdapter(),
  tiktok: new TikTokAdapter(),
  snapchat: new SnapchatAdapter(),
};

export interface SummaryResult {
  platforms: NormalizedSummary[];
  totals: {
    impressions: number;
    clicks: number;
    spend: number;
    reach: number;
    conversions: number;
    ctr: number;
    cpc: number;
  };
}

// ─── Helpers ────────────────────────────────────────────────────────────────

async function getOrderCampaigns(orderId: string) {
  const order = await Order.findById(orderId).lean();
  if (!order) throw new Error(`Order not found: ${orderId}`);
  return order.platformCampaigns ?? [];
}

/** Avoid leading/trailing spaces in stored IDs (breaks LinkedIn List(urn:...) and mock DB lookups). */
function trimCampaignFields<T extends { externalCampaignId: string; platform: string }>(
  c: T
): T {
  return {
    ...c,
    platform: c.platform.trim(),
    externalCampaignId: c.externalCampaignId.trim(),
  };
}

async function getToken(platform: string): Promise<string> {
  if (platform === "snapchat" && process.env.SNAPCHAT_USE_MOCK === "true") {
    return process.env.SNAPCHAT_MOCK_BEARER ?? "mock";
  }
  if (platform === "linkedin" && process.env.LINKEDIN_USE_MOCK === "true") {
    return process.env.LINKEDIN_MOCK_BEARER ?? "mock";
  }
  const doc = await PlatformToken.findOne({ platform }).lean();
  if (!doc) throw new Error(`No token found for platform: ${platform}`);
  return doc.accessToken;
}

export async function getSummary(
  orderId: string,
  dateRange: DateRange,
): Promise<SummaryResult> {
  const campaigns = await getOrderCampaigns(orderId);
  const results: NormalizedSummary[] = [];

  for (const campaign of campaigns) {
    const c = trimCampaignFields(campaign);
    const adapter = ADAPTERS[c.platform];
    if (!adapter) continue;

    try {
      const token = await getToken(c.platform);
      const summary = await adapter.fetchSummary(
        c.externalCampaignId,
        campaign.adAccountId?.trim() ?? "",
        dateRange,
        token,
      );
      results.push(summary);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(
        `[reporting] getSummary skipped platform=${c.platform} campaign=${c.externalCampaignId}:`,
        msg,
      );
    }
  }

  const totals = results.reduce(
    (acc, s) => ({
      impressions: acc.impressions + s.impressions,
      clicks: acc.clicks + s.clicks,
      spend: acc.spend + s.spend,
      reach: acc.reach + s.reach,
      conversions: acc.conversions + s.conversions,
    }),
    { impressions: 0, clicks: 0, spend: 0, reach: 0, conversions: 0 },
  );

  return {
    platforms: results,
    totals: {
      ...totals,
      ctr:
        totals.impressions > 0 ? (totals.clicks / totals.impressions) * 100 : 0,
      cpc: totals.clicks > 0 ? totals.spend / totals.clicks : 0,
    },
  };
}

export async function getTimeSeries(
  orderId: string,
  dateRange: DateRange,
): Promise<NormalizedTimeSeriesPoint[]> {
  const campaigns = await getOrderCampaigns(orderId);
  const allPoints: NormalizedTimeSeriesPoint[] = [];

  for (const campaign of campaigns) {
    const c = trimCampaignFields(campaign);
    const adapter = ADAPTERS[c.platform];
    if (!adapter) continue;

    try {
      const token = await getToken(c.platform);
      const points = await adapter.fetchTimeSeries(
        c.externalCampaignId,
        campaign.adAccountId?.trim() ?? "",
        dateRange,
        token,
      );
      allPoints.push(...points);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(
        `[reporting] getTimeSeries skipped platform=${c.platform} campaign=${c.externalCampaignId}:`,
        msg,
      );
    }
  }

  return allPoints;
}

export async function getDemographics(
  orderId: string,
  dateRange: DateRange,
): Promise<NormalizedDemographic[]> {
  const campaigns = await getOrderCampaigns(orderId);
  const allDemographics: NormalizedDemographic[] = [];

  for (const campaign of campaigns) {
    const c = trimCampaignFields(campaign);
    const adapter = ADAPTERS[c.platform];
    if (!adapter) continue;

    try {
      const token = await getToken(c.platform);
      const demographics = await adapter.fetchDemographics(
        c.externalCampaignId,
        campaign.adAccountId?.trim() ?? "",
        dateRange,
        token,
      );
      allDemographics.push(...demographics);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(
        `[reporting] getDemographics skipped platform=${c.platform} campaign=${c.externalCampaignId}:`,
        msg,
      );
    }
  }

  return allDemographics;
}
