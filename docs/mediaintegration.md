# JobPulse – Media Platform Integration

## Overview

JobPulse integrates with multiple advertising platforms to fetch campaign performance data and display it to clients in the reporting dashboard. The platform acts as a **managed service** — JobPulse (admin) holds authenticated connections to all ad accounts across all platforms, and manually links platform campaigns to client orders.

There is **no client-side OAuth** — clients do not connect their own ad accounts. All platform access is managed by the JobPulse admin.

---

## Authentication Model

- **Protocol:** OAuth 2.0
- **Who authenticates:** One JobPulse admin account per platform
- **Scope:** Access to all ad accounts under each platform's business manager / admin account
- **Token storage:** Access tokens (and refresh tokens where applicable) stored securely on the backend, scoped to the platform, not to individual clients

---

## Platform Coverage

| Platform   | Status | Notes |
|------------|--------|-------|
| Meta (Facebook/Instagram) | Planned | Marketing API |
| LinkedIn   | Planned | Marketing API |
| Google     | Planned | Google Ads API |
| Snapchat   | Planned | Marketing API |
| TikTok     | Planned | Marketing API |
| Schibsted  | Planned | Manual input (no public API) |

---

## Data Flow

```
Platform Ad Account (admin-owned)
    ↓ (OAuth 2.0 — admin authenticated)
JobPulse Backend (fetches & stores campaign stats)
    ↓ (linked by admin to client order)
Client Dashboard (reads reporting data per campaign)
```

1. Admin authenticates JobPulse with each platform via OAuth 2.0
2. Admin fetches available ad accounts / campaigns from each platform
3. Admin links a platform campaign ID to a JobPulse order (manual assignment)
4. Backend periodically fetches or caches campaign statistics
5. Client views performance data on the "Performance & candidates" tab of their campaign

---

## Campaign Linking

Each JobPulse `Order` will have a `platformCampaigns` field that maps platform names to their external campaign IDs:

```ts
platformCampaigns: [
  { platform: "meta",     externalCampaignId: "123456789" },
  { platform: "linkedin", externalCampaignId: "987654321" },
  { platform: "google",   externalCampaignId: "456789123" },
]
```

This linking is done by the admin in the admin panel after the campaign goes live.

---

## KPIs to Display

The following metrics should be fetched and displayed per platform:

| Metric       | Description |
|--------------|-------------|
| Impressions  | Total number of times the ad was shown |
| Clicks       | Total number of clicks on the ad |
| CTR          | Click-through rate (clicks / impressions × 100) |
| Spend        | Total amount spent on the campaign |
| CPC          | Cost per click (spend / clicks) |
| Conversions  | Applications, leads, or other defined conversion events |
| Reach        | Unique users who saw the ad (where available) |

---

## Reporting UI

- Located on the **"Performance & candidates"** tab of each campaign detail page
- Shows a **summary row** of totals across all platforms
- Shows a **per-platform breakdown** with individual metrics
- Includes a **line/bar chart** (using Recharts) for impressions and clicks over time
- Date range filter (last 7 days, last 30 days, custom)

---

## Platform-Specific Notes

### Meta (Facebook / Instagram)
- API: Meta Marketing API
- Auth: OAuth 2.0 → long-lived page/system user token
- Key endpoints: `/act_{ad_account_id}/campaigns`, `/act_{ad_account_id}/insights`
- Insights fields: `impressions`, `clicks`, `ctr`, `spend`, `cpc`, `reach`, `actions`

### LinkedIn
- API: LinkedIn Marketing API
- Auth: OAuth 2.0 → organization-level access
- Key endpoints: `/adCampaignGroupsV2`, `/adStatisticsV2`
- Metrics: `impressions`, `clicks`, `costInLocalCurrency`, `leads`

### Google Ads
- API: Google Ads API (v14+)
- Auth: OAuth 2.0 → manager account (MCC) access
- Key endpoints: GAQL queries via `/customers/{customer_id}/googleAds:search`
- Metrics: `metrics.impressions`, `metrics.clicks`, `metrics.cost_micros`, `metrics.ctr`

### Snapchat
- API: Snapchat Marketing API
- Auth: OAuth 2.0
- Key endpoints: `/campaigns`, `/stats`
- Metrics: `impressions`, `swipes`, `spend`, `swipe_up_rate`

### TikTok
- API: TikTok for Business Marketing API
- Auth: OAuth 2.0
- Key endpoints: `/campaign/get/`, `/report/integrated/get/`
- Metrics: `show_cnt` (impressions), `click_cnt`, `cost`, `ctr`

### Schibsted
- No public API available
- Data entered **manually** by admin
- Stored directly in JobPulse database as a `ManualReport` record

---

## Backend Architecture (Planned)

```
backend/src/
├── services/
│   ├── reporting/
│   │   ├── meta.service.ts
│   │   ├── linkedin.service.ts
│   │   ├── google.service.ts
│   │   ├── snapchat.service.ts
│   │   ├── tiktok.service.ts
│   │   └── schibsted.service.ts   ← manual entry
├── models/
│   ├── platformToken.model.ts     ← stores OAuth tokens per platform
│   ├── campaignLink.model.ts      ← links order → platform campaign ID
│   └── reportSnapshot.model.ts   ← cached stats per campaign per day
├── routes/
│   └── reporting.routes.ts
└── controllers/
    └── reporting.controller.ts
```

---

## Token Management

- Each platform token is stored in a `PlatformToken` document:
  ```ts
  { platform, accessToken, refreshToken, expiresAt, scope }
  ```
- Refresh logic runs before each API call if token is expired
- Tokens are **never exposed to the client**

---

## Open Questions

- [ ] What is the refresh cadence for stats? (on-demand vs. scheduled cron)
- [ ] Should stats be cached in the DB or always fetched live?
- [ ] Which conversion event types does each platform report on?
- [ ] Postman collection to be reviewed for exact endpoint structure per platform

