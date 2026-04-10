import { useState, useEffect } from "react";
import { getDashboard } from "../api/dashboard";
import type { DashboardData } from "../api/dashboard";

export interface UseDashboardResult {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
}

export function useDashboard(): UseDashboardResult {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getDashboard("2026-02-25", "2026-03-05");
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled)
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load dashboard data",
          );
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading, error };
}
