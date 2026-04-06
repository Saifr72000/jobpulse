import api from "./axios";

export interface ReportingSummary {
  platform: string;
  impressions: number;
  clicks: number;
  spend: number;
  reach: number;
  ctr: number;
  cpc: number;
  conversions: number;
  frequency?: number;
  uniqueClicks?: number;
  uniqueCtr?: number;
  cpm?: number;
  objective?: string;
}

export interface ReportingTimeSeriesPoint {
  platform: string;
  date: string; // YYYY-MM-DD
  impressions: number;
  clicks: number;
  spend: number;
  reach: number;
}

export interface ReportingDemographic {
  platform: string;
  age?: string;
  gender?: string;
  impressions: number;
  clicks: number;
  spend: number;
}

interface SummaryResponse {
  platforms: ReportingSummary[];
  totals: Record<string, number>;
}

export const getSummary = async (
  orderId: string,
  since: string,
  until: string,
): Promise<ReportingSummary[]> => {
  const { data } = await api.get<SummaryResponse>(
    `/reporting/${orderId}/summary`,
    { params: { since, until } },
  );
  return data.platforms;
};

export const getTimeSeries = async (
  orderId: string,
  since: string,
  until: string,
): Promise<ReportingTimeSeriesPoint[]> => {
  const { data } = await api.get<ReportingTimeSeriesPoint[]>(
    `/reporting/${orderId}/timeseries`,
    { params: { since, until } },
  );
  return data;
};

export const getDemographics = async (
  orderId: string,
  since: string,
  until: string,
): Promise<ReportingDemographic[]> => {
  const { data } = await api.get<ReportingDemographic[]>(
    `/reporting/${orderId}/demographics`,
    { params: { since, until } },
  );
  return data;
};
