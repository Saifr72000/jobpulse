import { SnapchatMockStat } from "../../models/snapchatMockStat.model.js";

function parseQueryDate(isoOrDate: string): string {
  const s = isoOrDate.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return s.slice(0, 10);
  return d.toISOString().slice(0, 10);
}

function parseQueryDateTime(raw: string): Date {
  const t = Date.parse(raw);
  if (!Number.isNaN(t)) return new Date(t);
  return new Date(`${raw}Z`);
}

export interface SnapchatMockStatsQuery {
  fields?: string;
  start_time: string;
  end_time: string;
  granularity: "TOTAL" | "DAY";
  report_dimension?: string;
}

function pickStatsFields(
  stats: Record<string, number>,
  fieldsParam?: string
): Record<string, number> {
  if (!fieldsParam?.trim()) return stats;
  const keys = new Set(
    fieldsParam.split(",").map((k) => k.trim()).filter(Boolean)
  );
  const out: Record<string, number> = {};
  for (const k of keys) {
    if (k in stats && stats[k] !== undefined) out[k] = stats[k] as number;
  }
  return out;
}

function aggregateRows(
  rows: Array<{
    impressions: number;
    swipes: number;
    spendMicro: number;
    uniques: number;
    frequency: number;
  }>
) {
  let impressions = 0;
  let swipes = 0;
  let spendMicro = 0;
  let uniques = 0;
  let freqWeight = 0;
  for (const r of rows) {
    impressions += r.impressions;
    swipes += r.swipes;
    spendMicro += r.spendMicro;
    uniques += r.uniques;
    freqWeight += r.frequency * r.impressions;
  }
  const frequency =
    impressions > 0 ? freqWeight / impressions : rows.length ? (rows[0]?.frequency ?? 0) : 0;
  return { impressions, swipes, spendMicro, uniques, frequency };
}

function hasAgeGenderReportDimension(report_dimension?: string): boolean {
  if (!report_dimension?.trim()) return false;
  const parts = report_dimension.split(",").map((s) => s.trim().toLowerCase());
  return parts.includes("age") && parts.includes("gender");
}

/**
 * Snapchat-shaped stats response from seeded `SnapchatMockStat` rows.
 */
export async function buildSnapchatMockStatsResponse(
  campaignId: string,
  q: SnapchatMockStatsQuery
): Promise<Record<string, unknown>> {
  const since = parseQueryDate(q.start_time);
  const until = parseQueryDate(q.end_time);

  const rows = await SnapchatMockStat.find({
    externalCampaignId: campaignId,
    date: { $gte: since, $lte: until },
  })
    .lean()
    .exec();

  if (q.granularity === "TOTAL") {
    const agg = aggregateRows(rows);
    const statsRaw = {
      impressions: agg.impressions,
      swipes: agg.swipes,
      spend: agg.spendMicro,
      uniques: agg.uniques,
      frequency: Math.round(agg.frequency * 100) / 100,
    };
    const stats = pickStatsFields(
      statsRaw as unknown as Record<string, number>,
      q.fields
    ) as Record<string, number>;

    const startIso = parseQueryDateTime(q.start_time).toISOString();
    const endIso = parseQueryDateTime(q.end_time).toISOString();

    return {
      request_status: "SUCCESS",
      request_id: `mock-${campaignId}-${since}_${until}`,
      total_stats: [
        {
          sub_request_status: "SUCCESS",
          total_stat: {
            id: campaignId,
            type: "CAMPAIGN",
            granularity: "TOTAL",
            start_time: startIso,
            end_time: endIso,
            stats,
          },
        },
      ],
    };
  }

  const hasDemo = hasAgeGenderReportDimension(q.report_dimension);

  if (hasDemo) {
    const series = rows.map((r) => {
      const statsRaw = {
        impressions: r.impressions,
        swipes: r.swipes,
        spend: r.spendMicro,
        uniques: r.uniques,
        frequency: r.frequency,
      };
      const stats = pickStatsFields(
        statsRaw as unknown as Record<string, number>,
        q.fields
      ) as Record<string, number>;
      return {
        start_time: `${r.date}T00:00:00.000+01:00`,
        end_time: `${r.date}T23:59:59.999+01:00`,
        age: r.age,
        gender: r.gender,
        stats,
      };
    });

    return {
      request_status: "SUCCESS",
      request_id: `mock-${campaignId}-day-demo`,
      timeseries_stats: [
        {
          sub_request_status: "SUCCESS",
          timeseries_stat: {
            id: campaignId,
            type: "CAMPAIGN",
            granularity: "DAY",
            start_time: `${since}T00:00:00.000+01:00`,
            end_time: `${until}T23:59:59.999+01:00`,
            finalized_data_end_time: new Date().toISOString(),
            timeseries: series,
          },
        },
      ],
    };
  }

  const byDate = new Map<string, typeof rows>();
  for (const r of rows) {
    const list = byDate.get(r.date) ?? [];
    list.push(r);
    byDate.set(r.date, list);
  }

  const sortedDates = [...byDate.keys()].sort();
  const timeseries: Array<{
    start_time: string;
    end_time: string;
    stats: Record<string, number>;
  }> = [];

  for (const d of sortedDates) {
    const dayRows = byDate.get(d) ?? [];
    const agg = aggregateRows(dayRows);
    const statsRaw = {
      impressions: agg.impressions,
      swipes: agg.swipes,
      spend: agg.spendMicro,
      uniques: agg.uniques,
      frequency: Math.round(agg.frequency * 100) / 100,
    };
    const stats = pickStatsFields(
      statsRaw as unknown as Record<string, number>,
      q.fields
    ) as Record<string, number>;
    timeseries.push({
      start_time: `${d}T00:00:00.000+01:00`,
      end_time: `${d}T23:59:59.999+01:00`,
      stats,
    });
  }

  return {
    request_status: "SUCCESS",
    request_id: `mock-${campaignId}-day`,
    timeseries_stats: [
      {
        sub_request_status: "SUCCESS",
        timeseries_stat: {
          id: campaignId,
          type: "CAMPAIGN",
          granularity: "DAY",
          start_time: `${since}T00:00:00.000+01:00`,
          end_time: `${until}T23:59:59.999+01:00`,
          finalized_data_end_time: new Date().toISOString(),
          timeseries,
        },
      },
    ],
  };
}
