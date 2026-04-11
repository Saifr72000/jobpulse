import { LinkedInMockStat } from "../../models/linkedinMockStat.model.js";

export interface LinkedInMockAdAnalyticsQuery {
  q: string;
  pivot: string;
  campaigns: string;
  dateRange: string;
  timeGranularity: "ALL" | "DAILY";
  fields?: string;
}

interface Ymd {
  year: number;
  month: number;
  day: number;
}

function ymdToDateStr(y: number, m: number, d: number): string {
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

/** Parse LinkedIn Rest.li dateRange query segment (calendar dates, no UTC shift). */
export function parseLinkedInDateRangeParam(raw: string): { since: string; until: string } | null {
  const s = raw.trim();
  const startRe = /start:\(year:(\d+),month:(\d+),day:(\d+)\)/;
  const endRe = /end:\(year:(\d+),month:(\d+),day:(\d+)\)/;
  const sm = s.match(startRe);
  const em = s.match(endRe);
  if (!sm || !em) return null;
  const sy = Number(sm[1]);
  const smon = Number(sm[2]);
  const sd = Number(sm[3]);
  const ey = Number(em[1]);
  const emon = Number(em[2]);
  const ed = Number(em[3]);
  return { since: ymdToDateStr(sy, smon, sd), until: ymdToDateStr(ey, emon, ed) };
}

/** Extract numeric id from `List(urn:li:sponsoredCampaign:123)` */
export function extractSponsoredCampaignId(campaignsParam: string): string | null {
  const m = campaignsParam.match(/urn:li:sponsoredCampaign:([^)]+)/);
  const id = m?.[1]?.trim();
  return id || null;
}

function ymdFromDateStr(dateStr: string): Ymd {
  const [y, m, d] = dateStr.split("-").map(Number) as [number, number, number];
  return { year: y, month: m, day: d };
}

function dateRangeBlock(start: Ymd, end: Ymd) {
  return {
    start: { year: start.year, month: start.month, day: start.day },
    end: { year: end.year, month: end.month, day: end.day },
  };
}

type RowLean = {
  impressions: number;
  clicks: number;
  costInLocalCurrency: string;
  landingPageClicks: number;
  likes: number;
  shares: number;
  approximateMemberReach: number;
};

function rowToFlatElement(
  row: RowLean,
  dateRange: { start: Ymd; end: Ymd }
): Record<string, unknown> {
  return {
    shares: row.shares,
    dateRange: {
      start: { month: dateRange.start.month, day: dateRange.start.day, year: dateRange.start.year },
      end: { month: dateRange.end.month, day: dateRange.end.day, year: dateRange.end.year },
    },
    landingPageClicks: row.landingPageClicks,
    clicks: row.clicks,
    costInLocalCurrency: row.costInLocalCurrency,
    approximateMemberReach: row.approximateMemberReach,
    impressions: row.impressions,
    likes: row.likes,
  };
}

function filterFields(
  el: Record<string, unknown>,
  fieldsParam?: string
): Record<string, unknown> {
  if (!fieldsParam?.trim()) return el;
  const keys = new Set(
    fieldsParam.split(",").map((k) => k.trim()).filter(Boolean)
  );
  const out: Record<string, unknown> = {};
  for (const k of keys) {
    if (k === "dateRange" && "dateRange" in el) out.dateRange = el.dateRange;
    else if (k in el) out[k] = el[k as keyof typeof el];
  }
  return out;
}

function sumCost(rows: { costInLocalCurrency: string }[]): string {
  let t = 0;
  for (const r of rows) {
    t += parseFloat(r.costInLocalCurrency) || 0;
  }
  return String(t);
}

/**
 * LinkedIn-shaped adAnalytics response from `LinkedInMockStat` rows.
 * Uses calendar `date` strings for filtering (same as Snapchat mock).
 */
export async function buildLinkedInMockAdAnalyticsResponse(
  q: LinkedInMockAdAnalyticsQuery
): Promise<{ paging: { start: number; count: number; links: unknown[] }; elements: unknown[] }> {
  if (q.q !== "analytics") {
    throw new Error("Only q=analytics is supported for LinkedIn mock.");
  }
  if (q.pivot !== "CAMPAIGN") {
    throw new Error("Only pivot=CAMPAIGN is supported for LinkedIn mock.");
  }

  const campaignId = extractSponsoredCampaignId(q.campaigns);
  if (!campaignId) {
    throw new Error("Could not parse campaigns List(urn:li:sponsoredCampaign:...).");
  }

  const range = parseLinkedInDateRangeParam(q.dateRange);
  if (!range) {
    throw new Error("Could not parse dateRange.");
  }

  const { since, until } = range;

  const rows = await LinkedInMockStat.find({
    externalCampaignId: campaignId,
    date: { $gte: since, $lte: until },
  })
    .sort({ date: 1 })
    .lean()
    .exec();

  if (q.timeGranularity === "DAILY") {
    const elements = rows.map((r) => {
      const ymd = ymdFromDateStr(r.date);
      const dr = dateRangeBlock(ymd, ymd);
      const flat = rowToFlatElement(
        {
          impressions: r.impressions,
          clicks: r.clicks,
          costInLocalCurrency: r.costInLocalCurrency,
          landingPageClicks: r.landingPageClicks,
          likes: r.likes,
          shares: r.shares,
          approximateMemberReach: r.approximateMemberReach,
        },
        dr
      );
      return filterFields(flat as Record<string, unknown>, q.fields);
    });

    return {
      paging: { start: 0, count: elements.length, links: [] },
      elements,
    };
  }

  const agg: RowLean = rows.reduce(
    (acc, r) => ({
      impressions: acc.impressions + r.impressions,
      clicks: acc.clicks + r.clicks,
      costInLocalCurrency: "0",
      landingPageClicks: acc.landingPageClicks + r.landingPageClicks,
      likes: acc.likes + r.likes,
      shares: acc.shares + r.shares,
      approximateMemberReach: acc.approximateMemberReach + r.approximateMemberReach,
    }),
    {
      impressions: 0,
      clicks: 0,
      costInLocalCurrency: "0",
      landingPageClicks: 0,
      likes: 0,
      shares: 0,
      approximateMemberReach: 0,
    }
  );
  agg.costInLocalCurrency = sumCost(rows);

  const startYmd = ymdFromDateStr(since);
  const endYmd = ymdFromDateStr(until);
  const flat = rowToFlatElement(agg, {
    start: startYmd,
    end: endYmd,
  });

  const element = filterFields(flat as Record<string, unknown>, q.fields);
  return {
    paging: { start: 0, count: rows.length ? 1 : 0, links: [] },
    elements: rows.length ? [element] : [],
  };
}
