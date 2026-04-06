import { useState, useEffect } from "react";
import { getDemographics, getTimeSeries } from "../api/reporting";
import type {
  ReportingSummary,
  ReportingTimeSeriesPoint,
  ReportingDemographic,
} from "../api/reporting";

export interface UseReportingResult {
  summary: ReportingSummary[];
  timeSeries: ReportingTimeSeriesPoint[];
  demographics: ReportingDemographic[];
  loading: boolean;
  error: string | null;
}

export function useReporting(
  orderId: string,
  since: string,
  until: string,
): UseReportingResult {
  const [summary] = useState<ReportingSummary[]>([]);
  const [timeSeries, setTimeSeries] = useState<ReportingTimeSeriesPoint[]>([]);
  const [demographics, setDemographics] = useState<ReportingDemographic[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!since || !until || since > until) return;

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [timeSeriesData, demographicsData] = await Promise.all([
          getTimeSeries(orderId, since, until),
          getDemographics(orderId, since, until),
        ]);
        if (!cancelled) {
          setTimeSeries(timeSeriesData);
          setDemographics(demographicsData);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load reporting data");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [orderId, since, until]);

  return { summary, timeSeries, demographics, loading, error };
}
