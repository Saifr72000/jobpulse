import { User } from "../models/user.model.js";
import { Order } from "../models/order.model.js";
import {
  getSummary,
  getTimeSeries,
} from "./reporting/reporting.service.js";
import type { DateRange } from "./reporting/adapters/adapter.interface.js";

export interface DashboardResult {
  activeCampaigns: number;
  totals: {
    impressions: number;
    reach: number;
    clicks: number;
    spend: number;
  };
  clicksByPlatform: { platform: string; clicks: number }[];
  viewsTimeseries: { date: string; impressions: number }[];
}

export async function getDashboardData(
  userId: string,
  dateRange: DateRange,
): Promise<DashboardResult> {
  const user = await User.findById(userId).lean();
  if (!user) throw new Error("User not found");

  const activeOrders = await Order.find({
    company: user.company,
    status: "active",
  })
    .select("_id platformCampaigns")
    .lean();

  const activeCampaigns = activeOrders.length;

  const ordersWithCampaigns = activeOrders.filter(
    (o) => o.platformCampaigns && o.platformCampaigns.length > 0,
  );

  const reportingResults = await Promise.allSettled(
    ordersWithCampaigns.map((order) =>
      Promise.all([
        getSummary(order._id.toString(), dateRange),
        getTimeSeries(order._id.toString(), dateRange),
      ]),
    ),
  );

  const totals = { impressions: 0, reach: 0, clicks: 0, spend: 0 };
  const clicksByPlatformMap: Record<string, number> = {};
  const viewsByDateMap: Record<string, number> = {};

  for (const result of reportingResults) {
    if (result.status !== "fulfilled") continue;
    const [summary, timeseries] = result.value;

    totals.impressions += summary.totals.impressions;
    totals.reach += summary.totals.reach;
    totals.clicks += summary.totals.clicks;
    totals.spend += summary.totals.spend;

    for (const p of summary.platforms) {
      clicksByPlatformMap[p.platform] =
        (clicksByPlatformMap[p.platform] ?? 0) + p.clicks;
    }

    for (const point of timeseries) {
      viewsByDateMap[point.date] =
        (viewsByDateMap[point.date] ?? 0) + point.impressions;
    }
  }

  return {
    activeCampaigns,
    totals,
    clicksByPlatform: Object.entries(clicksByPlatformMap).map(
      ([platform, clicks]) => ({ platform, clicks }),
    ),
    viewsTimeseries: Object.entries(viewsByDateMap)
      .map(([date, impressions]) => ({ date, impressions }))
      .sort((a, b) => a.date.localeCompare(b.date)),
  };
}
