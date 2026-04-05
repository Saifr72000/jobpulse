import type {
  DateRange,
  IReportingAdapter,
  NormalizedDemographic,
  NormalizedSummary,
  NormalizedTimeSeriesPoint,
} from "./adapter.interface.js";

const BASE_URL = "https://adsapi.snapchat.com/v1";

function toSnapchatTime(dateStr: string, endOfDay = false): string {
  return endOfDay
    ? `${dateStr}T23:59:59.000Z`
    : `${dateStr}T00:00:00.000Z`;
}

function buildUrl(base: string, params: Record<string, string | number>): string {
  const qs = new URLSearchParams(
    Object.entries(params).map(([k, v]) => [k, String(v)])
  );
  return `${base}?${qs.toString()}`;
}

async function getJson<T>(url: string, token: string): Promise<T> {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Snapchat API error: ${res.status}`);
  return res.json() as Promise<T>;
}

interface SnapchatStats {
  impressions?: number;
  swipes?: number;
  spend?: number;
  reach?: number;
  swipe_up_rate?: number;
  conversion_sign_ups?: number;
}

interface SnapchatLifetimeStat {
  lifetime_stat?: {
    stats?: SnapchatStats;
  };
}

interface SnapchatTimeSeriesEntry {
  start_time?: string;
  stats?: SnapchatStats;
}

interface SnapchatTimeSeriesStat {
  timeseries_stat?: {
    timeseries?: SnapchatTimeSeriesEntry[];
  };
}

function safeNum(val: number | undefined): number {
  return val ?? 0;
}

export class SnapchatAdapter implements IReportingAdapter {
  readonly platform = "snapchat";

  async fetchSummary(
    campaignId: string,
    _adAccountId: string,
    dateRange: DateRange,
    token: string
  ): Promise<NormalizedSummary> {
    const url = buildUrl(`${BASE_URL}/campaigns/${campaignId}/stats`, {
      granularity: "LIFETIME",
      fields: "impressions,swipes,spend,reach,swipe_up_rate,conversion_sign_ups",
      start_time: toSnapchatTime(dateRange.since),
      end_time: toSnapchatTime(dateRange.until, true),
    });
    const data = await getJson<{ lifetime_stats?: SnapchatLifetimeStat[] }>(url, token);

    const rows: SnapchatLifetimeStat[] = data.lifetime_stats ?? [];
    const totals = rows.reduce(
      (acc, row) => {
        const s = row.lifetime_stat?.stats ?? {};
        return {
          impressions: acc.impressions + safeNum(s.impressions),
          clicks: acc.clicks + safeNum(s.swipes),
          spend: acc.spend + safeNum(s.spend),
          reach: acc.reach + safeNum(s.reach),
          conversions: acc.conversions + safeNum(s.conversion_sign_ups),
        };
      },
      { impressions: 0, clicks: 0, spend: 0, reach: 0, conversions: 0 }
    );

    const ctr =
      totals.impressions > 0 ? (totals.clicks / totals.impressions) * 100 : 0;
    const cpc = totals.clicks > 0 ? totals.spend / totals.clicks : 0;

    return { platform: this.platform, ...totals, ctr, cpc };
  }

  async fetchTimeSeries(
    campaignId: string,
    _adAccountId: string,
    dateRange: DateRange,
    token: string
  ): Promise<NormalizedTimeSeriesPoint[]> {
    const url = buildUrl(`${BASE_URL}/campaigns/${campaignId}/stats`, {
      granularity: "DAY",
      fields: "impressions,swipes,spend,reach",
      start_time: toSnapchatTime(dateRange.since),
      end_time: toSnapchatTime(dateRange.until, true),
    });
    const data = await getJson<{ timeseries_stats?: SnapchatTimeSeriesStat[] }>(url, token);

    const rows: SnapchatTimeSeriesStat[] = data.timeseries_stats ?? [];
    const points: NormalizedTimeSeriesPoint[] = [];

    for (const row of rows) {
      const entries = row.timeseries_stat?.timeseries ?? [];
      for (const entry of entries) {
        const s = entry.stats ?? {};
        points.push({
          platform: this.platform,
          date: entry.start_time?.substring(0, 10) ?? "",
          impressions: safeNum(s.impressions),
          clicks: safeNum(s.swipes),
          spend: safeNum(s.spend),
          reach: safeNum(s.reach),
        });
      }
    }

    return points;
  }

  async fetchDemographics(
    campaignId: string,
    _adAccountId: string,
    dateRange: DateRange,
    token: string
  ): Promise<NormalizedDemographic[]> {
    const breakdowns: Array<{ breakdown: string; dimension: string }> = [
      { breakdown: "gender", dimension: "gender" },
      { breakdown: "age_group", dimension: "age" },
    ];
    const result: NormalizedDemographic[] = [];

    for (const { breakdown, dimension } of breakdowns) {
      const url = buildUrl(`${BASE_URL}/campaigns/${campaignId}/stats`, {
        granularity: "LIFETIME",
        fields: "impressions,swipes,spend",
        breakdown,
        start_time: toSnapchatTime(dateRange.since),
        end_time: toSnapchatTime(dateRange.until, true),
      });
      const data = await getJson<{
        lifetime_stats?: Array<{
          breakdown_stats?: Array<{
            breakdowns?: Record<string, string>;
            stats?: SnapchatStats;
          }>;
        }>;
      }>(url, token);

      const rows = data.lifetime_stats ?? [];
      for (const row of rows) {
        for (const segment of row.breakdown_stats ?? []) {
          const s = segment.stats ?? {};
          const label = segment.breakdowns?.[breakdown] ?? "unknown";
          result.push({
            platform: this.platform,
            dimension,
            label,
            impressions: safeNum(s.impressions),
            clicks: safeNum(s.swipes),
            spend: safeNum(s.spend),
          });
        }
      }
    }

    return result;
  }
}
