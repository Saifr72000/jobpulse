import type {
  DateRange,
  IReportingAdapter,
  NormalizedDemographic,
  NormalizedSummary,
  NormalizedTimeSeriesPoint,
} from "./adapter.interface.js";

const BASE_URL = "https://api.linkedin.com/rest";
const API_VERSION = "202405";

interface LinkedInMetric {
  impressions?: number;
  clicks?: number;
  costInLocalCurrency?: string;
  reach?: number;
  leads?: number;
  approximateUniqueImpressions?: number;
}

interface LinkedInRow {
  dateRange?: {
    start?: { year: number; month: number; day: number };
    end?: { year: number; month: number; day: number };
  };
  pivotValues?: string[];
  metrics?: LinkedInMetric;
  // v202405 flat structure
  impressions?: number;
  clicks?: number;
  costInLocalCurrency?: string;
  reach?: number;
  leads?: number;
}

function safeNum(val: number | string | undefined): number {
  if (typeof val === "number") return val;
  return parseFloat(val ?? "0") || 0;
}

function toDateStr(d: { year: number; month: number; day: number }): string {
  return `${d.year}-${String(d.month).padStart(2, "0")}-${String(d.day).padStart(2, "0")}`;
}

function buildLinkedInDateParam(dateRange: DateRange): Record<string, string | number> {
  const [sy, sm, sd] = dateRange.since.split("-").map(Number) as [number, number, number];
  const [ey, em, ed] = dateRange.until.split("-").map(Number) as [number, number, number];
  return {
    "dateRange.start.year": sy,
    "dateRange.start.month": sm,
    "dateRange.start.day": sd,
    "dateRange.end.year": ey,
    "dateRange.end.month": em,
    "dateRange.end.day": ed,
  };
}

function buildUrl(base: string, params: Record<string, string | number>): string {
  const qs = new URLSearchParams(
    Object.entries(params).map(([k, v]) => [k, String(v)])
  );
  return `${base}?${qs.toString()}`;
}

async function getJson<T>(url: string, headers: Record<string, string>): Promise<T> {
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`LinkedIn API error: ${res.status}`);
  return res.json() as Promise<T>;
}

export class LinkedInAdapter implements IReportingAdapter {
  readonly platform = "linkedin";

  private authHeaders(token: string): Record<string, string> {
    return {
      Authorization: `Bearer ${token}`,
      "LinkedIn-Version": API_VERSION,
      "X-Restli-Protocol-Version": "2.0.0",
    };
  }

  async fetchSummary(
    campaignId: string,
    _adAccountId: string,
    dateRange: DateRange,
    token: string
  ): Promise<NormalizedSummary> {
    const url = buildUrl(`${BASE_URL}/adAnalytics`, {
      q: "analytics",
      pivot: "CAMPAIGN",
      campaigns: `List(urn:li:sponsoredCampaign:${campaignId})`,
      fields: "impressions,clicks,costInLocalCurrency,reach,leads",
      timeGranularity: "ALL",
      ...buildLinkedInDateParam(dateRange),
    });
    const data = await getJson<{ elements?: LinkedInRow[] }>(url, this.authHeaders(token));

    const rows: LinkedInRow[] = data.elements ?? [];

    type Acc = { impressions: number; clicks: number; spend: number; reach: number; conversions: number };
    const totals = rows.reduce<Acc>(
      (acc, row) => {
        const m: LinkedInMetric = (row.metrics ?? row) as LinkedInMetric;
        return {
          impressions: acc.impressions + safeNum(m.impressions),
          clicks: acc.clicks + safeNum(m.clicks),
          spend: acc.spend + safeNum(m.costInLocalCurrency),
          reach: acc.reach + safeNum(m.reach ?? m.approximateUniqueImpressions),
          conversions: acc.conversions + safeNum(m.leads),
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
    const url = buildUrl(`${BASE_URL}/adAnalytics`, {
      q: "analytics",
      pivot: "CAMPAIGN",
      campaigns: `List(urn:li:sponsoredCampaign:${campaignId})`,
      fields: "impressions,clicks,costInLocalCurrency,reach",
      timeGranularity: "DAILY",
      ...buildLinkedInDateParam(dateRange),
    });
    const data = await getJson<{ elements?: LinkedInRow[] }>(url, this.authHeaders(token));

    const rows: LinkedInRow[] = data.elements ?? [];
    return rows.map((row) => {
      const m: LinkedInMetric = (row.metrics ?? row) as LinkedInMetric;
      const dateStr = row.dateRange?.start ? toDateStr(row.dateRange.start) : "";
      return {
        platform: this.platform,
        date: dateStr,
        impressions: safeNum(m.impressions),
        clicks: safeNum(m.clicks),
        spend: safeNum(m.costInLocalCurrency),
        reach: safeNum(m.reach ?? m.approximateUniqueImpressions),
      };
    });
  }

  async fetchDemographics(
    campaignId: string,
    _adAccountId: string,
    dateRange: DateRange,
    token: string
  ): Promise<NormalizedDemographic[]> {
    const pivots = ["MEMBER_AGE", "MEMBER_GENDER"] as const;
    const results: NormalizedDemographic[] = [];

    for (const pivot of pivots) {
      const dimension = pivot === "MEMBER_AGE" ? "age" : "gender";
      const url = buildUrl(`${BASE_URL}/adAnalytics`, {
        q: "analytics",
        pivot,
        campaigns: `List(urn:li:sponsoredCampaign:${campaignId})`,
        fields: "impressions,clicks,costInLocalCurrency",
        timeGranularity: "ALL",
        ...buildLinkedInDateParam(dateRange),
      });
      const data = await getJson<{ elements?: LinkedInRow[] }>(url, this.authHeaders(token));

      const rows: LinkedInRow[] = data.elements ?? [];
      for (const row of rows) {
        const m: LinkedInMetric = (row.metrics ?? row) as LinkedInMetric;
        const label =
          row.pivotValues?.[0]?.replace(/^urn:li:[a-zA-Z]+:/, "") ?? "unknown";
        results.push({
          platform: this.platform,
          dimension,
          label,
          impressions: safeNum(m.impressions),
          clicks: safeNum(m.clicks),
          spend: safeNum(m.costInLocalCurrency),
        });
      }
    }

    return results;
  }
}
