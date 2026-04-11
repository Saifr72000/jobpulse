import {
  parseLinkedInDateRangeParam,
  extractSponsoredCampaignId,
  buildLinkedInMockAdAnalyticsResponse,
} from "../../src/services/mock/linkedinMockAdAnalytics.service.js";
import { LinkedInMockStat } from "../../src/models/linkedinMockStat.model.js";
import { LinkedInAdapter } from "../../src/services/reporting/adapters/linkedin.adapter.js";

describe("linkedinMockAdAnalytics parsers", () => {
  it("parseLinkedInDateRangeParam extracts calendar since/until", () => {
    const r = parseLinkedInDateRangeParam(
      "(start:(year:2026,month:2,day:25),end:(year:2026,month:3,day:5))"
    );
    expect(r).toEqual({ since: "2026-02-25", until: "2026-03-05" });
  });

  it("extractSponsoredCampaignId reads id from List(...)", () => {
    expect(
      extractSponsoredCampaignId("List(urn:li:sponsoredCampaign:310113766)")
    ).toBe("310113766");
  });
});

describe("buildLinkedInMockAdAnalyticsResponse", () => {
  const baseQ = {
    q: "analytics",
    pivot: "CAMPAIGN",
    campaigns: "List(urn:li:sponsoredCampaign:camp-1)",
    dateRange:
      "(start:(year:2026,month:2,day:25),end:(year:2026,month:2,day:26))",
  };

  beforeEach(async () => {
    await LinkedInMockStat.create([
      {
        externalCampaignId: "camp-1",
        date: "2026-02-25",
        impressions: 100,
        clicks: 2,
        costInLocalCurrency: "10.5",
        landingPageClicks: 1,
        likes: 0,
        shares: 0,
        approximateMemberReach: 50,
      },
      {
        externalCampaignId: "camp-1",
        date: "2026-02-26",
        impressions: 200,
        clicks: 4,
        costInLocalCurrency: "20",
        landingPageClicks: 0,
        likes: 1,
        shares: 0,
        approximateMemberReach: 80,
      },
    ]);
  });

  it("returns DAILY elements per row", async () => {
    const res = await buildLinkedInMockAdAnalyticsResponse({
      ...baseQ,
      timeGranularity: "DAILY",
    });
    expect(res.elements).toHaveLength(2);
    expect(res.paging.count).toBe(2);
    const el0 = res.elements[0] as Record<string, unknown>;
    expect(el0.impressions).toBe(100);
  });

  it("returns ALL as one aggregated element", async () => {
    const res = await buildLinkedInMockAdAnalyticsResponse({
      ...baseQ,
      timeGranularity: "ALL",
    });
    expect(res.elements).toHaveLength(1);
    const el = res.elements[0] as Record<string, unknown>;
    expect(el.impressions).toBe(300);
    expect(el.clicks).toBe(6);
  });

  it("respects optional fields (comma-separated) like LinkedIn API", async () => {
    const res = await buildLinkedInMockAdAnalyticsResponse({
      ...baseQ,
      timeGranularity: "DAILY",
      fields: "impressions,clicks,costInLocalCurrency",
    });
    const el0 = res.elements[0] as Record<string, unknown>;
    expect(Object.keys(el0).sort()).toEqual([
      "clicks",
      "costInLocalCurrency",
      "impressions",
    ]);
  });

  it("includes dateRange in DAILY rows when fields lists it", async () => {
    const res = await buildLinkedInMockAdAnalyticsResponse({
      ...baseQ,
      timeGranularity: "DAILY",
      fields: "impressions,dateRange",
    });
    const el0 = res.elements[0] as Record<string, unknown>;
    expect(Object.keys(el0).sort()).toEqual(["dateRange", "impressions"]);
  });
});

describe("LinkedInAdapter mock demographics", () => {
  it("fetchDemographics returns [] when LINKEDIN_USE_MOCK is true", async () => {
    const prev = process.env.LINKEDIN_USE_MOCK;
    process.env.LINKEDIN_USE_MOCK = "true";
    const adapter = new LinkedInAdapter();
    const out = await adapter.fetchDemographics(
      "310113766",
      "",
      { since: "2026-02-01", until: "2026-02-28" },
      "token"
    );
    expect(out).toEqual([]);
    process.env.LINKEDIN_USE_MOCK = prev;
  });
});
