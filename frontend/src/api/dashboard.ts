import api from "./axios";

export interface DashboardData {
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

export async function getDashboard(
  since: string,
  until: string,
): Promise<DashboardData> {
  const { data } = await api.get<DashboardData>("/dashboard", {
    params: { since, until },
  });
  return data;
}
