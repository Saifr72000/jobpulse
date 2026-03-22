# JobPulse — Product Overview

## What is JobPulse

A B2B recruitment operations platform for agencies managing recruitment campaigns on behalf of client organizations. It centralizes order management, candidate tracking, and performance reporting — it does not handle media buying or campaign publishing.

## Users & Roles

**Client** — One role per organization, all users share the same access level.  
**Admin** — Agency-side users with elevated access across all customers and data.

## Core Modules

### Campaign Ordering

Clients create orders using predefined packages, custom orders, or duplicates of previous ones. Orders include platform selection, add-on services, and material uploads. A smart form adapts fields based on selections. Orders go through a review/feedback loop before fulfillment.

### Campaign Specific Statistics

This is where users go to view detailed information about a specific campaign, including performance statistics, metrics, and candidates received from that campaign.

### Media Library

Clients can upload material here including videos, images, fonts, files, and other assets, making it easy to reuse them when ordering campaigns. All files uploaded during campaign ordering in the booking flow are automatically added to the Media Library.

### Settings

Clients manage company info, subscriptions, value cards, frame agreements, and download invoices.

---

## Campaign Ordering Flow (detailed)

This is the most complex client-facing flow. It is split into steps tracked by a progress bar. The form is dynamic — fields and sections adapt based on add-on selections made in Step 2. A sticky order summary sidebar shows a live cost breakdown throughout Step 2.

Figma designs for reference:

- Step 1: https://www.figma.com/design/KfU9yRaXgJRC1zoSBRxwC3/JobPulse?node-id=621-3234
- Step 2: https://www.figma.com/design/KfU9yRaXgJRC1zoSBRxwC3/JobPulse?node-id=621-3450
- Step 3: https://www.figma.com/design/KfU9yRaXgJRC1zoSBRxwC3/JobPulse?node-id=621-3812

---

### Step 1 — Order Type & Plan Selection

**Figma:** https://www.figma.com/design/KfU9yRaXgJRC1zoSBRxwC3/JobPulse?node-id=621-3234
**Page title:** "New campaign" / subtitle: "Choose your campaign setup"
**Progress bar:** Step 1 indicator active

The client chooses between two modes, presented side by side in equal-width cards:

**Left card — Custom made plan**
Subtitle: "Choose your preferred channels for your campaign"
Each channel is a selectable row (checkbox on right) with platform logo, name, and description:

| Channel   | Description                     |
| --------- | ------------------------------- |
| LinkedIn  | Professional network targeting  |
| Facebook  | Broad audience reach            |
| Google    | Broad audience reach            |
| Snapchat  | Reaching gen Z and young adults |
| Instagram | Visual storytelling             |
| X         | Real time engagement            |

Multiple channels can be selected. User clicks "Continue" to proceed with their custom selection.

**Right card — Package plan**
Subtitle: "Reach more candidates with bundled channel packages"
Three radio-select options, each showing a package icon, name, channel limit, and feature list:

| Package | Channel limit | Features                                                                                        | Badge          |
| ------- | ------------- | ----------------------------------------------------------------------------------------------- | -------------- |
| Basic   | Up to 3       | 14 day campaign period, 50% ad spend included, full performance analytics, ongoing optimization |                |
| Medium  | Up to 5       | Same                                                                                            | "Most popular" |
| Deluxe  | Up to 7       | Same                                                                                            |                |

Selecting a package selects its radio button. User clicks "Continue" to proceed.

**Business rules:**

- Exactly one mode must be selected before proceeding (custom OR package, not both)
- Custom: at least one channel must be checked before "Continue" is enabled
- Package: exactly one package must be selected before "Continue" is enabled

---

### Step 2 — Channel & Add-On Selection

**Figma:** https://www.figma.com/design/KfU9yRaXgJRC1zoSBRxwC3/JobPulse?node-id=621-3450
**Page title:** "Customize your package plan" / subtitle: "Choose your desired channels and add ons"
**Progress bar:** Step 2 indicator active

Both paths (custom and package) land here. Behaviour differs by path:

- **Custom path:** Channels selected in Step 1 are pre-checked. User can adjust but there is no channel cap.
- **Package path:** No channels are pre-selected. User must select channels up to the package limit (3 / 5 / 7). Selecting beyond the limit is blocked.

**Select channels section** (2-column grid, checkbox per channel):

- LinkedIn, Facebook, Google, Snapchat, Instagram, X

**Campaign add-ons section** (optional, 3-column card grid):

| Add-On               | Description                                                          | Price    |
| -------------------- | -------------------------------------------------------------------- | -------- |
| Lead Ads             | Collect applications directly in the ad, no landing page needed      | 2 500 kr |
| Video Campaign       | Engage candidates with dynamic video content across platforms        | 3 800 kr |
| LinkedIn Job Posting | Official job listing on LinkedIn's job board with applicant tracking | 4 200 kr |

Each add-on card has a checkbox in the top-right corner. Price is shown bottom-right of the card.

**Order summary sidebar** (sticky, right side — visible throughout Step 2):

- Header: "Order summary"
- Package name or "Custom plan" at top
- Section: "Channels:" — lists each selected channel with its price
- Divider
- Section: "Add-ons:" — lists each selected add-on with its price
- Divider
- Section: "Total:" — running sum
- Channels included in a package show 0 kr (cost absorbed)

**Navigation:**

- "Back" button (left) → returns to Step 1
- "Continue" button (right, dark) → proceeds to Step 3
- At least one channel must be selected to enable "Continue"

---

### Step 3 — Campaign Details (Dynamic)

**Figma:** https://www.figma.com/design/KfU9yRaXgJRC1zoSBRxwC3/JobPulse?node-id=621-3812
**Page title:** "Campaign details"
**Subtitle:** "Help us understand your campaign goals and audience so we can deliver the best possible results"
**Progress bar:** Step 3 indicator active

This step is **fully dynamic** — the sections and questions shown depend on which add-ons were selected in Step 2. Every add-on that was selected generates its own dedicated question block. Add-ons not selected produce no fields.

---

#### Always shown — Campaign name

- Single-line text input
- Label: "Give your campaign a memorable name"
- Placeholder: "E.g., Summer 2026 hiring campaign"
- Required

---

#### Always shown — Assets section

Header: "Assets" / subtitle: "Help us gather the key information and materials needed to launch your campaign"

**Do you want to upload a campaign image?** _(always shown)_
Radio options:

- Upload image
- Select from media library
- Let our team suggest an image

---

#### Conditional — Lead Ads add-on selected

**Do you have a job description for the Lead Ad?**
Radio options:

- Let our team create the job description
- Provide your own job description

---

#### Conditional — Video Campaign add-on selected

**How would you like us to source materials for your video?**
Radio options:

- Upload your own materials
- Let our team select materials from our media library
- Combine both

---

#### Conditional — LinkedIn Job Posting add-on selected

**Do you have a job description for the LinkedIn job posting?**
Radio options:

- Let our team create the job description
- Provide your own job description

**Do you have any screening questions for the LinkedIn job posting?**
Radio options:

- Let our team create screening questions
- Provide your own screening questions

---

#### Always shown — Target audience

- Textarea
- Label: "Describe who you want to reach with this campaign. Be as specific as possible about skills, experience level, location and any other relevant criteria"
- Placeholder: long example text about child welfare professionals

---

#### Always shown — Additional notes

- Textarea
- Label: "Anything else we should know?"
- Placeholder: "E.g., Key selling points, specific messaging you'd like included, deadlines or any other context that would help us create better campaigns..."

---

**Navigation:**

- "Back" button (left) → returns to Step 2
- "Continue" button (right, dark/midnight) → proceeds to Step 4

---

### Step 4 — Payment

**Figma:** https://www.figma.com/design/KfU9yRaXgJRC1zoSBRxwC3/JobPulse?node-id=621-4080
**Page title:** "Payment" / subtitle: "Select your preferred payment method"
**Progress bar:** Step 4 indicator active — progress bar fully filled (100%)

Two-column layout: payment method selection (left, wide) + order summary sidebar (right).

**Payment method section** — three selectable cards, radio selection:

| Method       | Description                                  | Extra detail                                      |
| ------------ | -------------------------------------------- | ------------------------------------------------- |
| Value card   | Pay by using your prepaid value card balance | Shows pill: "Current balance on value card: X kr" |
| Card payment | Pay securely with your debit or credit card  | Selected state has violet border highlight        |
| Invoice      | Receive an invoice with 30 days due date     |                                                   |

Only one payment method can be selected at a time. The selected card has a violet border (`#7151e6`).

**Order summary sidebar** (right, same as Step 2 but now includes VAT):

- Package name with base price
- Section "Channels:" — each channel with platform icon and price (0 kr if included in package)
- Divider
- Section "Add-ons:" — each add-on with icon and price
- Divider
- VAT (25%) as a line item
- Section "Total:" — final amount

**Navigation:**

- "Back to review" button (left) → returns to Step 3
- "Confirm and pay" button (right, midnight/dark) → submits the order

---

### Success — Campaign Submitted (Modal)

**Figma:** https://www.figma.com/design/KfU9yRaXgJRC1zoSBRxwC3/JobPulse?node-id=835-3853

This is **not a new step** — it is a modal overlay that appears on top of the Step 4 payment page after clicking "Confirm and pay". The background page dims with a dark overlay (`rgba(0,0,0,0.8)`).

**Modal content:**

- Large violet checkmark icon at top
- Heading: "Campaign submitted"
- Body text (centered, 3 lines):
  - "Your campaign order has been successfully placed."
  - "Our team will receive your details and get started right away."
  - "You'll receive a confirmation email shortly."
- CTA button (midnight, full-width pill): "View campaign" → navigates to the campaign detail / orders page
- Close (×) button in top-right corner of the modal

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

## Campaign Stats Flow (detailed)

This covers everything from the campaigns listing page through the full campaign detail view, including all three sub-tabs and their states.

---

### Campaigns Listing

**Figma:** https://www.figma.com/design/KfU9yRaXgJRC1zoSBRxwC3/JobPulse?node-id=478-11
**Route:** `/campaigns`
**Page title:** "Campaigns"

A table listing all campaigns belonging to the client's company.

**Table columns:**

| Column        | Notes                                              |
| ------------- | -------------------------------------------------- |
| Campaign name | Clickable — navigates to the campaign detail page  |
| Status        | Pill badge: Active (green), Completed (grey)       |
| Date          | Campaign start date                                |
| Channels      | Platform icons shown inline (LinkedIn, Meta, etc.) |
| Total         | Order total in NOK                                 |

**Top-right actions:** `+ New campaign` button (midnight, pill) → navigates to Campaign Ordering Step 1.

**Pagination:** "Next page" button at bottom. Results are paginated (`?page=1&limit=20`).

**Data scope:** Always filtered to the authenticated user's company — never shows other companies' campaigns.

---

### Campaign Detail Page

**Route:** `/campaigns/:id`
**Breadcrumb:** `← Back to campaigns`

**Page header:**

- Campaign name as heading
- Status badge (e.g. "Pending approval" — mist/lavender background, dark text; "Active" — green; "Completed" — grey)
- Three tabs below the header: **Campaign details** | **Review & approve** | **Performance & candidates**

---

#### Tab 1 — Campaign Details

**Figma:** https://www.figma.com/design/KfU9yRaXgJRC1zoSBRxwC3/JobPulse?node-id=485-5

Two-column layout: main content (left, wide) + order summary sidebar (right).

**Campaign overview section:**

- Campaign name
- Channels: displayed as icon pills (one per selected platform)
- Add-ons: displayed as text pills (e.g. "Lead Ads", "Video Campaign", "LinkedIn Job Posting")

**Assets section:**

Header: "Assets" / subtitle: "Key information and materials for your campaign"

Displays read-only answers from Step 3 of the ordering flow:

| Field                               | Condition                              |
| ----------------------------------- | -------------------------------------- |
| Campaign image                      | Always shown                           |
| Lead Ad job description choice      | Only if Lead Ads add-on selected       |
| Video materials source choice       | Only if Video Campaign add-on selected |
| LinkedIn job description choice     | Only if LinkedIn Job Posting selected  |
| LinkedIn screening questions choice | Only if LinkedIn Job Posting selected  |

**Target audience section:**

- Read-only textarea content from Step 3

**Additional notes section:**

- Read-only textarea content from Step 3

**Order summary sidebar:**

- Package name or "Custom plan"
- Channels list with prices (0 kr if included in package)
- Add-ons list with prices
- VAT (25%)
- Total
- "Download invoice" button at bottom (outlined, full-width)

---

#### Tab 2 — Review & Approve

This tab has multiple states depending on campaign progress.

---

##### State: Waiting for review (V1)

**Figma:** https://www.figma.com/design/KfU9yRaXgJRC1zoSBRxwC3/JobPulse?node-id=548-905

Two-column layout: ad creative preview (left, wide) + feedback panel (right).

**Ad creative preview (left):**

- Full-width image/creative display
- Image carousel with dot indicators for multiple creatives
- Version selector buttons top-right: `V1` | `V2` | `V3` (active version highlighted)

**Feedback panel (right):**

- Status pill: "Waiting for your review" (orange background)
- Feedback textarea: placeholder "Write your feedback here..."
- "Send feedback" button (outlined)
- "Approve campaign" CTA button (midnight, full-width)

---

##### State: Review in progress (V3 with comment thread)

**Figma:** https://www.figma.com/design/KfU9yRaXgJRC1zoSBRxwC3/JobPulse?node-id=595-757

Same layout as V1 state, but the feedback panel shows a full comment thread:

**Comment thread:**

- Each message shows: avatar initials, sender name (e.g. "Maria Jensen" for client, "Erik Andersen" for agency), timestamp, and message body
- Client and agency messages alternate — full conversation history visible
- Thread is scrollable

**Bottom actions (two buttons):**

- "Request changes" (outlined, left)
- "Approve campaign" (midnight filled, right)

---

##### State: Campaign ended (Review history)

**Figma:** https://www.figma.com/design/KfU9yRaXgJRC1zoSBRxwC3/JobPulse?node-id=595-843

**Tab label changes to:** "Review history"

- Status pill: "This campaign has ended." (green background)
- Green "Campaign period ended" badge visible in header area
- Comment thread shows full history (read-only)
- No action buttons (no approve/request changes)

---

#### Tab 3 — Performance & Candidates

This tab has two states: live data and not-yet-published.

---

##### State: Not published yet

**Figma:** https://www.figma.com/design/KfU9yRaXgJRC1zoSBRxwC3/JobPulse?node-id=621-4544

- All KPI stat cards show `0`
- Empty state card in the middle: heading "Campaign is not published yet", body "Performance data will appear here once your campaign is live."
- Candidates section shows: "No candidates yet."

---

##### State: Live / Published

**Figma:** https://www.figma.com/design/KfU9yRaXgJRC1zoSBRxwC3/JobPulse?node-id=721-2199

**Channel filter dropdown** (top-right of stats section):

- Options: All channels, LinkedIn, Facebook, Google, Snapchat, Instagram — each with platform icon
- Selected channel is highlighted
- Filtering updates all KPI cards and charts to show data for the selected channel only
- Figma for dropdown open state: https://www.figma.com/design/KfU9yRaXgJRC1zoSBRxwC3/JobPulse?node-id=593-406

**KPI stat cards (8 cards in a row):**

| Metric        | Notes               |
| ------------- | ------------------- |
| Total views   |                     |
| Reach         |                     |
| Clicks        |                     |
| Frequency     |                     |
| Unique clicks |                     |
| Unique CTR    | Shown as percentage |
| Applications  |                     |
| Spend         | Shown in NOK        |

Cards are equal-width, arranged in a single horizontal row.

**Demographics chart:**

- Grouped bar chart (age groups on X-axis × gender split)
- Two bar colors: violet (`$violet`) for one gender, mist (`$mist`) for the other
- Age group buckets on X-axis (e.g. 18–24, 25–34, 35–44, 45–54, 55+)
- Y-axis: count or percentage

**Clicks over time chart:**

- Line chart
- X-axis: dates across the campaign period
- Y-axis: click count
- Line color: violet

**Candidates section:**

Appears below the charts on the same tab.

**Candidate stat cards (4 cards):**

| Metric         |
| -------------- |
| Total received |
| Contacted      |
| Pending        |
| Rejected       |

**Candidate table:**

| Column        | Notes                                                     |
| ------------- | --------------------------------------------------------- |
| Name          |                                                           |
| Status        | Pill: Contacted (green), Pending (yellow), Rejected (red) |
| Date received | ISO date                                                  |
| Email         |                                                           |
| Phone         |                                                           |

Table is paginated. Rows are clickable (future: candidate detail view).

---

## Settings Flow (detailed)

**Figma:** https://www.figma.com/design/KfU9yRaXgJRC1zoSBRxwC3/JobPulse?node-id=257-574
**Route:** `/settings`
**Page title:** "Settings" / subtitle: "Manage your account settings and preferences"

The Settings page is split into **4 sub-navigation tabs**, displayed as a horizontal pill bar below the page title:

| Tab             | Icon | Active border |
| --------------- | ---- | ------------- |
| Settings        | gear | black pill    |
| Payment methods | card |               |
| Users           | user |               |
| Billing         | doc  |               |

The active tab has a black outlined pill around it. Clicking a tab renders its content below without a page reload.

---

### Tab 1 — Settings (Profile & Company)

**Figma:** https://www.figma.com/design/KfU9yRaXgJRC1zoSBRxwC3/JobPulse?node-id=257-574

This tab contains three stacked white cards: Profile information, Company details, and Delete account.

---

#### Section: Profile information

- Section heading: "Profile information"
- Subtitle: "Update your personal details and profile picture"

**Avatar:**

- Circle with user's initials (e.g. "JD"), mist/lavender background
- Small edit-pencil button overlaid at bottom-right of the circle → triggers image upload

**Fields (2-column grid):**

| Label         | Type        | Example value    |
| ------------- | ----------- | ---------------- |
| First name    | Text input  | John             |
| Last name     | Text input  | Doe              |
| Email address | Email input | John@company.com |
| Phone number  | Tel input   | +47 909 09 090   |

**Password subsection** (within the same card):

- Subsection label: "Password"
- Subtitle: "Update your password regularly to keep your account safe"

| Label                | Type           | Width      |
| -------------------- | -------------- | ---------- |
| Current password     | Password input | Full width |
| New password         | Password input | Half width |
| Confirm new password | Password input | Half width |

**Save button:** "Save changes" (violet `$violet`, pill, bottom-right of card)

---

#### Section: Company details

- Section heading: "Company details"
- Subtitle: "Information about your organization"

**Fields (2-column grid, then full-width):**

| Label               | Type       | Example value                              |
| ------------------- | ---------- | ------------------------------------------ |
| Company name        | Text input | John company                               |
| Organization number | Text input | 927 343 282                                |
| Phone number        | Tel input  | +47 220 00 000                             |
| Website             | URL input  | https://Johncompany.com                    |
| Address             | Text input | Karl Johans gate 1, 0154 Oslo (full width) |

**Save button:** "Save changes" (violet, pill, bottom-right of card)

---

#### Section: Delete account

- Card has a red border (`$red` / `#ef4444`)
- Red warning triangle icon + heading: "Delete account" (red text)
- Body: "Permanently delete your account and all associated data. This action cannot be undone."
- Button: "Delete account" (red outlined pill, red text, trash icon left) — bottom-right

---

### Tab 2 — Users

**Figma:** https://www.figma.com/design/KfU9yRaXgJRC1zoSBRxwC3/JobPulse?node-id=624-853

- Section heading: "Users access"
- Subtitle: "Manage who has access to your company account"
- **"+ Add user"** button (violet, pill) — top-right of section

**User list:**

Each user is shown as a row card (frost background):

- Avatar circle with initials (mist/lavender background)
- **Name** (bold, large)
- **Email** below name
- **"Remove user"** button (red outlined pill, red text, trash icon) — right side

Multiple users displayed as stacked rows. No pagination shown in design — list is assumed short.

**Business rules:**

- Only company-scoped users are shown
- The logged-in user cannot remove themselves
- "+ Add user" flow: not yet specced (modal or inline form TBD)

---

### Tab 3 — Payment methods

**Figma:** https://www.figma.com/design/KfU9yRaXgJRC1zoSBRxwC3/JobPulse?node-id=624-1108

Contains two sections: Value card and Framework agreement.

---

#### Section: Value card

- Section heading: "Value card"
- Subtitle: "Purchase a value card to get more balance than what you pay"

**Purchase cards (4 cards in a horizontal row):**

| Card name     | Price      | Balance you receive |
| ------------- | ---------- | ------------------- |
| Value 100 000 | 90 000 kr  | 100 000 kr          |
| Value 250 000 | 222 500 kr | 250 000 kr          |
| Value 400 000 | 352 000 kr | 400 000 kr          |
| Value 650 000 | 565 500 kr | 650 000 kr          |

Each card shows: card name (heading), Price row, Balance row, "Buy value card" button (violet, full-width pill).

**Active value card panel** (shown below the purchase cards if a card is active):

- Heading: "Your active value card"
- Card name: e.g. "Value 250 000"
- Purchase date: e.g. "Purchased on 15.01.26"
- **Remaining balance** (right side, large violet text): e.g. "187 400 kr" with label "Remaining balance" above

---

#### Buy value card — Modal

**Figma:** https://www.figma.com/design/KfU9yRaXgJRC1zoSBRxwC3/JobPulse?node-id=816-2320

Triggered by clicking "Buy value card" on any purchase card. Appears as a modal overlay (`rgba(0,0,0,0.8)` background).

**Modal content:**

- Title: "Purchase Value [X]"
- Subtitle: "Choose your preferred payment method to complete the purchase"
- Close (×) button top-right

**Order summary section** (frost background card):

| Row                 | Value           |
| ------------------- | --------------- |
| Card name           | e.g. 90 000 kr  |
| Balance you receive | e.g. 100 000 kr |
| Divider             |                 |
| Total               | e.g. 90 000 kr  |

**Payment method (radio cards, 2 options):**

- **Card payment** — "Pay securely with your debit or credit card" — radio selected state shown
- **Invoice** — "Receive an invoice with 30 days due date"

**Card details form** (only visible when "Card payment" is selected):

| Field           | Type | Placeholder         |
| --------------- | ---- | ------------------- |
| Card number     | Text | 1234 5678 9101 3456 |
| Expire date     | Text | MM / YY             |
| CVC             | Text | 123                 |
| Cardholder name | Text | Full name on card   |

**CTA:** "Complete purchase" (midnight `$midnight`, pill, full-width)

---

#### Section: Framework agreement

- Section heading: "Framework agreement"
- Subtitle: "A framework agreement gives your company a fixed discount on all services in exchange for a 2-year commitment to JobPulse as your supplier. Note: a value card and a framework agreement cannot be active at the same time."

**Current framework agreement panel** (white card):

- Subheading: "Current framework agreement"

| Field          | Example value       |
| -------------- | ------------------- |
| Status         | Active              |
| Discount       | 20% on all services |
| Commit period  | 2 years             |
| Start-End date | 01.02.25–01.02.26   |

**Business rules:**

- A value card and a framework agreement cannot be active simultaneously
- If a value card is active, the framework agreement section should indicate it is unavailable (and vice versa)

---

### Tab 4 — Billing

No Figma design provided yet. Placeholder tab — not yet specced.

---
