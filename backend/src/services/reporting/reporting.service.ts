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

async function getToken(platform: string): Promise<string> {
  const doc = await PlatformToken.findOne({ platform }).lean();
  if (!doc) throw new Error(`No token found for platform: ${platform}`);
  return doc.accessToken;
}

// ─── Cache helpers — disabled for now, always fetches live data ─────────────
//
// async function getCachedSnapshot<T>(
//   orderId: string,
//   platform: string,
//   campaignId: string,
//   type: "summary" | "timeseries" | "demographics",
//   dateRange: DateRange
// ): Promise<T | null> {
//   const snap = await ReportSnapshot.findOne({
//     orderId: new mongoose.Types.ObjectId(orderId),
//     platform,
//     externalCampaignId: campaignId,
//     type,
//     "dateRange.since": dateRange.since,
//     "dateRange.until": dateRange.until,
//   }).lean();
//   return snap ? (snap.data as T) : null;
// }
//
// async function saveSnapshot(
//   orderId: string,
//   platform: string,
//   campaignId: string,
//   type: "summary" | "timeseries" | "demographics",
//   dateRange: DateRange,
//   data: unknown
// ): Promise<void> {
//   const now = new Date();
//   const expiresAt = new Date(now.getTime() + CACHE_TTL_MS);
//   await ReportSnapshot.findOneAndUpdate(
//     {
//       orderId: new mongoose.Types.ObjectId(orderId),
//       platform,
//       externalCampaignId: campaignId,
//       type,
//       "dateRange.since": dateRange.since,
//       "dateRange.until": dateRange.until,
//     },
//     { data, fetchedAt: now, expiresAt },
//     { upsert: true }
//   );
// }

// ─── Public API ─────────────────────────────────────────────────────────────

export async function getSummary(
  orderId: string,
  dateRange: DateRange
): Promise<SummaryResult> {
  const campaigns = await getOrderCampaigns(orderId);
  const results: NormalizedSummary[] = [];

  for (const campaign of campaigns) {
    const adapter = ADAPTERS[campaign.platform];
    if (!adapter) continue;

    // const cached = await getCachedSnapshot<NormalizedSummary>(orderId, campaign.platform, campaign.externalCampaignId, "summary", dateRange);
    // if (cached) { results.push(cached); continue; }

    const token = await getToken(campaign.platform);
    const summary = await adapter.fetchSummary(
      campaign.externalCampaignId,
      campaign.adAccountId ?? "",
      dateRange,
      token
    );

    // await saveSnapshot(orderId, campaign.platform, campaign.externalCampaignId, "summary", dateRange, summary);

    results.push(summary);
  }

  const totals = results.reduce(
    (acc, s) => ({
      impressions: acc.impressions + s.impressions,
      clicks: acc.clicks + s.clicks,
      spend: acc.spend + s.spend,
      reach: acc.reach + s.reach,
      conversions: acc.conversions + s.conversions,
    }),
    { impressions: 0, clicks: 0, spend: 0, reach: 0, conversions: 0 }
  );

  return {
    platforms: results,
    totals: {
      ...totals,
      ctr:
        totals.impressions > 0
          ? (totals.clicks / totals.impressions) * 100
          : 0,
      cpc: totals.clicks > 0 ? totals.spend / totals.clicks : 0,
    },
  };
}

export async function getTimeSeries(
  orderId: string,
  dateRange: DateRange
): Promise<NormalizedTimeSeriesPoint[]> {
  const campaigns = await getOrderCampaigns(orderId);
  const allPoints: NormalizedTimeSeriesPoint[] = [];

  for (const campaign of campaigns) {
    const adapter = ADAPTERS[campaign.platform];
    if (!adapter) continue;

    // const cached = await getCachedSnapshot<NormalizedTimeSeriesPoint[]>(orderId, campaign.platform, campaign.externalCampaignId, "timeseries", dateRange);
    // if (cached) { allPoints.push(...cached); continue; }

    const token = await getToken(campaign.platform);
    const points = await adapter.fetchTimeSeries(
      campaign.externalCampaignId,
      campaign.adAccountId ?? "",
      dateRange,
      token
    );

    // await saveSnapshot(orderId, campaign.platform, campaign.externalCampaignId, "timeseries", dateRange, points);

    allPoints.push(...points);
  }

  return allPoints;
}

export async function getDemographics(
  orderId: string,
  dateRange: DateRange
): Promise<NormalizedDemographic[]> {
  const campaigns = await getOrderCampaigns(orderId);
  const allDemographics: NormalizedDemographic[] = [];

  for (const campaign of campaigns) {
    const adapter = ADAPTERS[campaign.platform];
    if (!adapter) continue;

    // const cached = await getCachedSnapshot<NormalizedDemographic[]>(orderId, campaign.platform, campaign.externalCampaignId, "demographics", dateRange);
    // if (cached) { allDemographics.push(...cached); continue; }

    const token = await getToken(campaign.platform);
    const demographics = await adapter.fetchDemographics(
      campaign.externalCampaignId,
      campaign.adAccountId ?? "",
      dateRange,
      token
    );

    // await saveSnapshot(orderId, campaign.platform, campaign.externalCampaignId, "demographics", dateRange, demographics);

    allDemographics.push(...demographics);
  }

  return allDemographics;
}
