import type {
  DateRange,
  IReportingAdapter,
  NormalizedDemographic,
  NormalizedSummary,
  NormalizedTimeSeriesPoint,
} from "./adapter.interface.js";

const BASE_URL = "https://business-api.tiktok.com/open_api/v1.3";

interface TikTokMetrics {
  show_cnt?: string | number;
  click_cnt?: string | number;
  cost?: string | number;
  reach?: string | number;
  conversion?: string | number;
  ctr?: string | number;
  cpc?: string | number;
  stat_time_day?: string;
  gender?: string;
  age?: string;
}

interface TikTokRow {
  dimensions?: Record<string, string>;
  metrics?: TikTokMetrics;
}

function safeNum(val: string | number | undefined): number {
  if (typeof val === "number") return val;
  return parseFloat(val ?? "0") || 0;
}

async function postJson<T>(
  url: string,
  body: unknown,
  headers: Record<string, string>
): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`TikTok API error: ${res.status}`);
  return res.json() as Promise<T>;
}

export class TikTokAdapter implements IReportingAdapter {
  readonly platform = "tiktok";

  private async fetchReport(
    advertiserID: string,
    dimensions: string[],
    metrics: string[],
    dateRange: DateRange,
    token: string
  ): Promise<TikTokRow[]> {
    const data = await postJson<{ data?: { list?: TikTokRow[] } }>(
      `${BASE_URL}/report/integrated/get/`,
      {
        advertiser_id: advertiserID,
        report_type: "BASIC",
        data_level: "AUCTION_CAMPAIGN",
        dimensions,
        metrics,
        start_date: dateRange.since,
        end_date: dateRange.until,
        page_size: 1000,
        page: 1,
      },
      { "Access-Token": token }
    );

    return data.data?.list ?? [];
  }

  async fetchSummary(
    campaignId: string,
    adAccountId: string,
    dateRange: DateRange,
    token: string
  ): Promise<NormalizedSummary> {
    const rows = await this.fetchReport(
      adAccountId,
      ["campaign_id"],
      ["show_cnt", "click_cnt", "cost", "reach", "conversion", "ctr", "cpc"],
      dateRange,
      token
    );

    const filtered = rows.filter(
      (r) => r.dimensions?.campaign_id === campaignId
    );

    const totals = filtered.reduce(
      (acc, row) => {
        const m = row.metrics ?? {};
        return {
          impressions: acc.impressions + safeNum(m.show_cnt),
          clicks: acc.clicks + safeNum(m.click_cnt),
          spend: acc.spend + safeNum(m.cost),
          reach: acc.reach + safeNum(m.reach),
          conversions: acc.conversions + safeNum(m.conversion),
        };
      },
      { impressions: 0, clicks: 0, spend: 0, reach: 0, conversions: 0 }
    );

    const ctr =
      totals.impressions > 0 ? (totals.clicks / totals.impressions) * 100 : 0;
    const cpc = totals.clicks > 0 ? totals.spend / totals.clicks : 0;

    return {
      platform: this.platform,
      ...totals,
      ctr,
      cpc,
      frequency: null,
      uniqueClicks: null,
      uniqueCtr: null,
    };
  }

  async fetchTimeSeries(
    campaignId: string,
    adAccountId: string,
    dateRange: DateRange,
    token: string
  ): Promise<NormalizedTimeSeriesPoint[]> {
    const rows = await this.fetchReport(
      adAccountId,
      ["campaign_id", "stat_time_day"],
      ["show_cnt", "click_cnt", "cost", "reach"],
      dateRange,
      token
    );

    return rows
      .filter((r) => r.dimensions?.campaign_id === campaignId)
      .map((row) => {
        const m = row.metrics ?? {};
        return {
          platform: this.platform,
          date: row.dimensions?.stat_time_day?.split(" ")[0] ?? "",
          impressions: safeNum(m.show_cnt),
          clicks: safeNum(m.click_cnt),
          spend: safeNum(m.cost),
          reach: safeNum(m.reach),
        };
      });
  }

  async fetchDemographics(
    campaignId: string,
    adAccountId: string,
    dateRange: DateRange,
    token: string
  ): Promise<NormalizedDemographic[]> {
    const demoDimensions: Array<{ dim: string }> = [
      { dim: "gender" },
      { dim: "age" },
    ];
    const result: NormalizedDemographic[] = [];

    for (const { dim } of demoDimensions) {
      const rows = await this.fetchReport(
        adAccountId,
        ["campaign_id", dim],
        ["show_cnt", "click_cnt", "cost"],
        dateRange,
        token
      );

      for (const row of rows.filter(
        (r) => r.dimensions?.campaign_id === campaignId
      )) {
        const m = row.metrics ?? {};
        const label = row.dimensions?.[dim] ?? "unknown";
        result.push({
          platform: this.platform,
          ...(dim === "age" ? { age: label } : { gender: label }),
          impressions: safeNum(m.show_cnt),
          clicks: safeNum(m.click_cnt),
          spend: safeNum(m.cost),
        });
      }
    }

    return result;
  }
}
