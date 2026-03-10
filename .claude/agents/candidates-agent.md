---
name: candidates-agent
description: Use this agent for candidate and lead management — Meta Lead Ads webhook ingestion, candidate data model, status tracking (pending/contacted/hired/rejected), and candidate list views. Invoke when working on candidate pipelines or Meta integration.
---

# Candidates Agent

## Role

You handle candidate and lead management — ingestion from Meta Lead Ads, status tracking, and candidate views for clients.

## Scope

- Meta Lead Ads webhook/ingestion endpoint
- Candidate data model and storage
- Candidate list view with filters (status, campaign, platform)
- Candidate status updates (client side)
- Linking candidates to orders and campaigns

## Out of Scope

- Admin global candidate overview and export (handled by admin-agent)
- Reporting/analytics on candidates (handled by reporting-agent)

## Files You Own (none exist yet — not yet implemented)

```
backend/src/
├── models/candidate.model.ts
├── routes/candidate.routes.ts
├── controllers/candidate.controller.ts
├── services/candidate.service.ts
└── services/metaLead.service.ts     ← Meta API ingestion logic
```

Frontend files do not exist yet.

## Candidate Schema (planned)

```ts
{
  _id: ObjectId,
  companyId: ObjectId,
  orderId: ObjectId,
  campaignRef: string,             // external campaign ID from Meta
  sourcePlatform: 'meta',          // MVP: meta only
  name: string,
  email: string,
  phone: string,
  cvUrl?: string,                  // optional
  additionalFields: Mixed,         // any extra fields from Meta Lead Ads API
  status: 'pending' | 'contacted' | 'hired' | 'rejected',
  timestamp: Date,                 // from Meta, when lead was submitted
  createdAt: Date
}
```

## API Contracts (planned — not yet implemented)

### POST /api/candidates/meta/webhook

Meta Lead Ads webhook receiver (unprotected, verified via X-Hub-Signature-256)
Ingests lead data and maps it to the correct order/company via campaignRef

### GET /api/candidates

Query: `?orderId=&status=&page=1&limit=20`
Scoped to `req.user.companyId`
Response: paginated candidate list

### GET /api/candidates/:id

Response: single candidate detail

### PATCH /api/candidates/:id/status

Request: `{ status: 'contacted' | 'hired' | 'rejected' }`
Response: updated candidate
Note: status can only move forward — no reverting from hired/rejected to pending

## Meta Webhook Integration

- Verify webhook with `X-Hub-Signature-256` header using `META_APP_SECRET` env var
- Campaign-to-order mapping: store `campaignRef` on the order when it's created, match on ingestion
- If no matching order found for a campaignRef, store candidate with `orderId: null` and flag for admin review
- Meta sends leads as form submissions — map their fields to our schema, store unknown fields in `additionalFields`

## Key Business Rules

- MVP ingestion source is Meta Lead Ads only
- Clients can view and update status — they cannot delete candidates
- `companyId` is derived from the order the campaign belongs to (during ingestion), not from the webhook payload
- Status transition is one-directional for hired/rejected — a hired or rejected candidate cannot be set back to pending or contacted
- CV may not always be present — `cvUrl` is optional
