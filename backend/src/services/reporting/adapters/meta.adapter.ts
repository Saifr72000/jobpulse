import type {
  DateRange,
  IReportingAdapter,
  NormalizedDemographic,
  NormalizedSummary,
  NormalizedTimeSeriesPoint,
} from "./adapter.interface.js";

const BASE_URL = "https://graph.facebook.com/v17.0";

const INSIGHTS_FIELDS =
  "campaign_id,campaign_name,impressions,clicks,spend,reach,ctr,cpc,cpm,frequency,unique_clicks,unique_ctr,objective,actions,cost_per_action_type";

interface MetaInsight {
  campaign_id?: string;
  campaign_name?: string;
  impressions?: string;
  clicks?: string;
  spend?: string;
  reach?: string;
  ctr?: string;
  cpc?: string;
  cpm?: string;
  frequency?: string;
  unique_clicks?: string;
  unique_ctr?: string;
  objective?: string;
  actions?: Array<{ action_type: string; value: string }>;
  date_start?: string;
  date_stop?: string;
  age?: string;
  gender?: string;
}

function buildUrl(base: string, params: Record<string, string | number>): string {
  const qs = new URLSearchParams(
    Object.entries(params).map(([k, v]) => [k, String(v)])
  );
  return `${base}?${qs.toString()}`;
}

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Meta API error: ${res.status}`);
  return res.json() as Promise<T>;
}

function extractConversions(actions?: MetaInsight["actions"]): number {
  if (!actions) return 0;
  const conversionTypes = [
    "offsite_conversion.fb_pixel_purchase",
    "lead",
    "offsite_conversion.fb_pixel_lead",
  ];
  for (const type of conversionTypes) {
    const match = actions.find((a) => a.action_type === type);
    if (match) return parseFloat(match.value) || 0;
  }
  return 0;
}

function safeNum(val: string | undefined): number {
  return parseFloat(val ?? "0") || 0;
}

export class MetaAdapter implements IReportingAdapter {
  readonly platform = "meta";

  async fetchSummary(
    campaignId: string,
    _adAccountId: string,
    dateRange: DateRange,
    token: string
  ): Promise<NormalizedSummary> {
    const url = buildUrl(`${BASE_URL}/${campaignId}/insights`, {
      fields: INSIGHTS_FIELDS,
      time_range: JSON.stringify({ since: dateRange.since, until: dateRange.until }),
      access_token: token,
    });
    const data = await getJson<{ data?: MetaInsight[] }>(url);

    const row = (data.data ?? [])[0];
    if (!row) {
      return {
        platform: this.platform,
        impressions: 0, clicks: 0, spend: 0, reach: 0,
        ctr: 0, cpc: 0, conversions: 0,
        frequency: 0, uniqueClicks: 0, uniqueCtr: 0, cpm: 0,
      };
    }

    const result: NormalizedSummary = {
      platform: this.platform,
      impressions: safeNum(row.impressions),
      clicks: safeNum(row.clicks),
      spend: safeNum(row.spend),
      reach: safeNum(row.reach),
      ctr: safeNum(row.ctr),
      cpc: safeNum(row.cpc),
      frequency: safeNum(row.frequency),
      uniqueClicks: safeNum(row.unique_clicks),
      uniqueCtr: safeNum(row.unique_ctr),
      conversions: extractConversions(row.actions),
    };

    if (row.cpm !== undefined) result.cpm = safeNum(row.cpm);
    if (row.objective !== undefined) result.objective = row.objective;

    return result;
  }

  async fetchTimeSeries(
    campaignId: string,
    _adAccountId: string,
    dateRange: DateRange,
    token: string
  ): Promise<NormalizedTimeSeriesPoint[]> {
    const url = buildUrl(`${BASE_URL}/${campaignId}/insights`, {
      fields: "impressions,clicks,spend,reach",
      time_range: JSON.stringify({ since: dateRange.since, until: dateRange.until }),
      time_increment: 1,
      access_token: token,
    });
    const data = await getJson<{ data?: MetaInsight[] }>(url);

    const insights: MetaInsight[] = data.data ?? [];
    return insights.map((row) => ({
      platform: this.platform,
      date: row.date_start ?? "",
      impressions: safeNum(row.impressions),
      clicks: safeNum(row.clicks),
      spend: safeNum(row.spend),
      reach: safeNum(row.reach),
    }));
  }

  async fetchDemographics(
    campaignId: string,
    _adAccountId: string,
    dateRange: DateRange,
    token: string
  ): Promise<NormalizedDemographic[]> {
    const url = buildUrl(`${BASE_URL}/${campaignId}/insights`, {
      fields: "impressions,clicks,spend",
      time_range: JSON.stringify({ since: dateRange.since, until: dateRange.until }),
      breakdowns: "age,gender",
      access_token: token,
    });
    const data = await getJson<{ data?: MetaInsight[] }>(url);

    const insights: MetaInsight[] = data.data ?? [];

    return insights.map((row) => {
      const entry: NormalizedDemographic = {
        platform: this.platform,
        impressions: safeNum(row.impressions),
        clicks: safeNum(row.clicks),
        spend: safeNum(row.spend),
      };
      if (row.age !== undefined) entry.age = row.age;
      if (row.gender !== undefined) entry.gender = row.gender;
      return entry;
    });
  }
}
