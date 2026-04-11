export interface DateRange {
  since: string; // YYYY-MM-DD
  until: string; // YYYY-MM-DD
}

export interface NormalizedSummary {
  platform: string;
  impressions: number;
  clicks: number;
  spend: number;
  reach: number;
  ctr: number;
  cpc: number;
  conversions: number;
  /** `null` = not available for this platform (do not show as 0). */
  frequency?: number | null;
  uniqueClicks?: number | null;
  uniqueCtr?: number | null;
  cpm?: number;
  objective?: string;
}

/* We do not need to send more to the frontend than this as this will be graph data */
export interface NormalizedTimeSeriesPoint {
  platform: string;
  date: string; // YYYY-MM-DD
  impressions: number;
  clicks: number;
  spend: number;
  reach: number;
}

/* We do not need to send more to the frontend than this as this will be graph data */
export interface NormalizedDemographic {
  platform: string;
  age?: string;
  gender?: string;
  impressions: number;
  clicks: number;
  spend: number;
}

export interface IReportingAdapter {
  readonly platform: string;

  fetchSummary(
    campaignId: string,
    adAccountId: string,
    dateRange: DateRange,
    token: string,
  ): Promise<NormalizedSummary>;

  fetchTimeSeries(
    campaignId: string,
    adAccountId: string,
    dateRange: DateRange,
    token: string,
  ): Promise<NormalizedTimeSeriesPoint[]>;

  fetchDemographics(
    campaignId: string,
    adAccountId: string,
    dateRange: DateRange,
    token: string,
  ): Promise<NormalizedDemographic[]>;
}
