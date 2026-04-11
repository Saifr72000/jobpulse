import type {
  DateRange,
  IReportingAdapter,
  NormalizedDemographic,
  NormalizedSummary,
  NormalizedTimeSeriesPoint,
} from "./adapter.interface.js";

const DEFAULT_SNAPCHAT_BASE = "https://adsapi.snapchat.com/v1";

function snapBase(): string {
  const raw = process.env.SNAPCHAT_API_BASE?.trim();
  return (raw || DEFAULT_SNAPCHAT_BASE).replace(/\/$/, "");
}

function toSnapchatTime(dateStr: string, endOfDay = false): string {
  return endOfDay
    ? `${dateStr}T23:59:59.999Z`
    : `${dateStr}T00:00:00.000Z`;
}

/** Snapchat returns spend in micro-currency; normalize to currency units. */
function microToCurrency(micro: number | undefined): number {
  if (micro === undefined || micro === null) return 0;
  return micro / 1e6;
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

interface SnapchatApiStats {
  impressions?: number;
  swipes?: number;
  spend?: number;
  uniques?: number;
  frequency?: number;
  reach?: number;
}

interface SnapchatTimeSeriesEntry {
  start_time?: string;
  age?: string;
  gender?: string;
  stats?: SnapchatApiStats;
}

interface SnapchatTotalResponse {
  total_stats?: Array<{
    total_stat?: {
      stats?: SnapchatApiStats;
    };
  }>;
}

interface SnapchatTimeSeriesResponse {
  timeseries_stats?: Array<{
    timeseries_stat?: {
      timeseries?: SnapchatTimeSeriesEntry[];
    };
  }>;
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
    const url = buildUrl(`${snapBase()}/campaigns/${campaignId}/stats`, {
      granularity: "TOTAL",
      fields: "impressions,swipes,spend,uniques,frequency",
      start_time: toSnapchatTime(dateRange.since),
      end_time: toSnapchatTime(dateRange.until, true),
    });
    const data = await getJson<SnapchatTotalResponse>(url, token);

    const stats = data.total_stats?.[0]?.total_stat?.stats ?? {};
    const impressions = safeNum(stats.impressions);
    const clicks = safeNum(stats.swipes);
    const spend = microToCurrency(stats.spend);
    const reach = safeNum(stats.uniques);
    const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
    const cpc = clicks > 0 ? spend / clicks : 0;
    /** Snapchat: unique CTR = swipes ÷ uniques (as %, same scale as ctr). */
    const uniqueCtr = reach > 0 ? (clicks / reach) * 100 : 0;

    const summary: NormalizedSummary = {
      platform: this.platform,
      impressions,
      clicks,
      spend,
      reach,
      ctr,
      cpc,
      conversions: 0,
      /** Total swipes; used as "unique clicks" until unique-swipes exists in the API. */
      uniqueClicks: clicks,
      uniqueCtr,
    };
    if (stats.frequency !== undefined) summary.frequency = stats.frequency;
    return summary;
  }

  async fetchTimeSeries(
    campaignId: string,
    _adAccountId: string,
    dateRange: DateRange,
    token: string
  ): Promise<NormalizedTimeSeriesPoint[]> {
    const url = buildUrl(`${snapBase()}/campaigns/${campaignId}/stats`, {
      granularity: "DAY",
      fields: "impressions,swipes,spend,uniques,frequency",
      start_time: toSnapchatTime(dateRange.since),
      end_time: toSnapchatTime(dateRange.until, true),
    });
    const data = await getJson<SnapchatTimeSeriesResponse>(url, token);

    const entries =
      data.timeseries_stats?.[0]?.timeseries_stat?.timeseries ?? [];

    const merged = new Map<string, NormalizedTimeSeriesPoint>();

    for (const entry of entries) {
      const dateStr = entry.start_time?.slice(0, 10) ?? "";
      const s = entry.stats ?? {};
      const impressions = safeNum(s.impressions);
      const clicks = safeNum(s.swipes);
      const spend = microToCurrency(s.spend);
      const reach = safeNum(s.uniques);

      const prev = merged.get(dateStr);
      if (!prev) {
        merged.set(dateStr, {
          platform: this.platform,
          date: dateStr,
          impressions,
          clicks,
          spend,
          reach,
        });
      } else {
        merged.set(dateStr, {
          platform: this.platform,
          date: dateStr,
          impressions: prev.impressions + impressions,
          clicks: prev.clicks + clicks,
          spend: prev.spend + spend,
          reach: prev.reach + reach,
        });
      }
    }

    return [...merged.values()].sort((a, b) => a.date.localeCompare(b.date));
  }

  async fetchDemographics(
    campaignId: string,
    _adAccountId: string,
    dateRange: DateRange,
    token: string
  ): Promise<NormalizedDemographic[]> {
    const url = buildUrl(`${snapBase()}/campaigns/${campaignId}/stats`, {
      granularity: "DAY",
      fields: "impressions,swipes,spend,uniques,frequency",
      report_dimension: "age,gender",
      start_time: toSnapchatTime(dateRange.since),
      end_time: toSnapchatTime(dateRange.until, true),
    });
    const data = await getJson<SnapchatTimeSeriesResponse>(url, token);

    const entries =
      data.timeseries_stats?.[0]?.timeseries_stat?.timeseries ?? [];

    return entries.map((entry) => {
      const s = entry.stats ?? {};
      const row: NormalizedDemographic = {
        platform: this.platform,
        impressions: safeNum(s.impressions),
        clicks: safeNum(s.swipes),
        spend: microToCurrency(s.spend),
      };
      if (entry.age !== undefined) row.age = entry.age;
      if (entry.gender !== undefined) row.gender = entry.gender;
      return row;
    });
  }
}
