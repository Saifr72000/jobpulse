# JobPulse — Product Overview

## What is JobPulse

A B2B recruitment operations platform for agencies managing recruitment campaigns on behalf of client organizations. It centralizes order management, candidate tracking, and performance reporting — it does not handle media buying or campaign publishing.

## Users & Roles

**Client** — One role per organization, all users share the same access level.  
**Admin** — Agency-side users with elevated access across all customers and data.

## Core Modules

### Campaign Ordering

Clients create orders using predefined packages, custom orders, or duplicates of previous ones. Orders include platform selection, add-on services, and material uploads. A smart form adapts fields based on selections. Orders go through a review/feedback loop before fulfillment.

### Candidate & Lead Management

Leads are ingested from Meta Lead Ads and linked to a specific order, campaign, and source platform. Candidates move through four statuses: Pending → Contacted → Hired / Rejected.

### Performance & Reporting

KPIs (impressions, clicks, CTR, spend, CPC, conversions) pulled per platform. Clients see their own campaigns; admins can access any client dashboard.

### Media Bank

Shared asset library per client. Material can be uploaded, browsed by type, and reused across orders. Admins approve or reject content.

### User Management

Clients invite users by email. Admins manage both client and internal users across all accounts.

### Settings & Billing

Clients manage company info, subscriptions, value cards, frame agreements, and download invoices.

---

## Ordering Flow (detailed)

This is the most complex client-facing flow. It is split into 5 steps with a progress bar. The form is dynamic — fields and options adapt based on previous selections. A sticky order summary sidebar shows a live cost breakdown throughout.

---

### Step 1 — Order Type & Plan Selection

The client chooses between two modes, presented side by side:

**Custom made plan** — Client selects individual channels for their campaign. Available channels:

- LinkedIn (Professional network targeting)
- Facebook (Broad audience reach)
- Google (Broad audience reach)
- Snapchat (Reaching gen Z and young adults)
- Instagram (Visual storytelling)
- X / Twitter (Real time engagement)
- TikTok
- Schibsted (manual, not API-based)
- Company website / job listing (lower priority)

Multiple channels can be combined. Selecting any channel reveals a CTA to continue with the custom plan.

**Package plan** — Predefined bundles differentiated by channel count:

| Package | Channels included | Notes                                                                                           |
| ------- | ----------------- | ----------------------------------------------------------------------------------------------- |
| Basic   | Up to 3 channels  | 14 day campaign period, 50% ad spend included, full performance analytics, ongoing optimization |
| Medium  | Up to 5 channels  | Same inclusions — marked "Most popular"                                                         |
| Deluxe  | Up to 7 channels  | Same inclusions                                                                                 |

Selecting a package highlights it with a green border and reveals a "Continue with [package] package" CTA.

---

### Step 2 — Channel & Add-On Selection

For package orders, the client customizes their channel selection within the package's channel limit. For custom orders, this step confirms channels selected in Step 1.

**Select channels** (grid layout, checkbox per channel):

- LinkedIn, Facebook, Google, Snapchat, Instagram, X

**Campaign add-ons** (optional, priced individually):

| Add-On                     | Description                                                          | Price    |
| -------------------------- | -------------------------------------------------------------------- | -------- |
| Lead Ads                   | Collect applications directly in the ad, no landing page needed      | 2 500 kr |
| Video Campaign             | Engage candidates with dynamic video content across platforms        | 3 800 kr |
| LinkedIn Job Posting       | Official job listing on LinkedIn's job board with applicant tracking | 4 200 kr |
| Image ad production        | Professionally designed static ad visuals                            | 3 800 kr |
| Upload your own image      | Use own image — choose direct publish or professional review         | 3 800 kr |
| Upload your own video      | Use own video — choose direct publish or professional review         | 3 800 kr |
| Creative review & approval | Ensures uploaded content meets platform and quality standards        | 500 kr   |
| Extended distribution      | Expand campaign reach via additional distribution channels           | 3 800 kr |
| Website publishing         | Publish campaign content directly to company website                 | 4 200 kr |

The sticky **Order summary** sidebar updates in real time showing:

- Package name
- Each selected channel with its cost (channels included in package show 0 kr)
- Each selected add-on with its cost
- Running total

---

### Step 3 — Campaign Details

A structured form to give the agency the information needed to produce and run the campaign.

**Campaign name**

- Free text field
- Placeholder: "E.g., Summer 2026 hiring campaign"

**Brand assets**

- Company logo: "Already uploaded in media library" or "Upload logo now"
- Brand guidelines: "Already uploaded in media library", "Upload brand guide now", or "We don't have brand guidelines"

**Target audience**

- Textarea — describe who you want to reach: skills, experience level, location, and any other relevant criteria

**Additional notes**

- Textarea — key selling points, specific messaging, deadlines, or any other context that would help create better campaigns

---

### Step 4 — Review Order

Full summary of everything selected before payment. Each section has an **Edit** button to jump back and make changes.

Sections shown:

- **Campaign overview** — campaign name, selected channels (as tags), add-ons (as tags)
- **Brand assets** — logo status, brand guidelines status
- **Target audience** — free text as entered
- **Additional notes** — free text as entered

CTA: "Continue to payment"

---

### Step 5 — Payment

**Payment methods:**

- **Value card** — prepaid balance, current balance shown
- **Card payment** — debit or credit card
- **Invoice** — 30-day due date

**Order summary** (final, right sidebar):

- Package base price
- Channels (0 kr each if included in package)
- Add-ons with individual prices
- VAT (25%) as a line item
- Total

CTA: "Place order"

On success: confirmation modal — "Order confirmed. Your campaign order has been successfully placed. Our team will receive your details and get started right away. You'll receive a confirmation email shortly." — with a "View your order" button.

---

### Post-Submission — Feedback Loop

After submission the order enters admin review. The client can:

- View feedback and comments from the admin team
- Comment on produced material
- Request revisions
- Approve final versions

All activity is logged in the order's comment thread.

---

## Order Statuses

`Pending` → `In Progress` → `Completed`

---

## Admin Order Flow

Review order → evaluate uploaded material → leave feedback or request changes → upload revised material if needed → update order status → mark fulfilled

---

## Candidate Ingestion Flow

Lead submitted on Meta → ingested via API → mapped to order, campaign, and source platform → appears in candidate pipeline with status `Pending`

Captured fields: name, email, phone, CV, source platform, timestamp, misc API fields

Candidate statuses: `Pending` → `Contacted` → `Hired` / `Rejected`

---

## Out of Scope

- Media buying
- Campaign publishing / ad execution
- Schibsted API integration (manual process only)
