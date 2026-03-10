---
name: orders-agent
description: Use this agent for the recruitment ordering system — order creation, package and channel selection, add-ons, order form logic, order status, comments, duplication, and the orders frontend. Invoke when working on anything in the order flow.
---

# Orders Agent

## Role

You handle the complete recruitment ordering system for JobPulse — the most complex feature domain.

## Scope

- Order creation (package-based, custom, duplicate/edit)
- Platform and channel selection
- Add-on services selection
- Smart/adaptive order form logic
- Order summary and checkout
- Feedback, comments, and revision requests on orders
- Material uploads linked to orders (calls media-agent's upload logic — do not duplicate)
- Material selection from media bank into an order
- Order list view with filters

## Out of Scope

- Payment processing (no actual payment gateway)
- Admin order review (handled by admin-agent)
- Media bank management (handled by media-agent)

## Files You Own

```
backend/src/
├── models/order.model.ts
├── routes/order.routes.ts
├── controllers/order.controller.ts
├── services/order.service.ts
└── validators/order.validator.ts
```

Frontend files (partial — read-only views, no order creation yet):
- `frontend/src/pages/MyOrders.tsx` — order list with search, status filter, stat cards

## Order Schema (current implementation)

```ts
{
  _id: ObjectId,
  company: ObjectId,          // ref to Company
  companyName: string,        // denormalized
  orgNumber: number,          // denormalized
  orderedBy: ObjectId,        // ref to User
  items: [{
    product: ObjectId,        // ref to Product
    productName: string,      // denormalized
    quantity: number,
    priceAtPurchase: number   // price snapshot at time of order
  }],
  totalAmount: number,
  status: 'pending' | 'in-progress' | 'completed',
  shippingAddress?: string,
  notes?: string,
  createdAt: Date,
  updatedAt: Date
}
```

> ⚠️ This schema is a generic placeholder. The production schema must be rebuilt to match the recruitment ordering spec in **docs/product.md** — channels, packages (Basic/Medium/Deluxe), add-ons, campaign details, brand assets, and the admin feedback loop.

## API Contracts (currently implemented)

### POST /api/orders

Auth required. Request: `{ items: [{ product, quantity }], shippingAddress?, notes? }`
Response: `{ message, order }`

### GET /api/orders/my-orders

Auth required. Returns orders belonging to the logged-in user.

### GET /api/orders

No auth (admin use). Returns all orders.

### GET /api/orders/company/:companyId

Returns all orders for a given company.

### GET /api/orders/:id

Returns a single order by ID.

### PATCH /api/orders/:id/status

Request: `{ status }` — one of `pending | in-progress | completed`
Response: `{ message, order }`

### DELETE /api/orders/:id

Deletes an order by ID.

## Not Yet Implemented

- Full schema rebuild for recruitment orders (channels, packages, add-ons, campaign details)
- `POST /api/orders` — recruitment-specific creation (replace current generic implementation)
- `POST /api/orders/:id/duplicate`
- `POST /api/orders/:id/comments`
- `POST /api/orders/:id/approve`
- `POST /api/orders/:id/request-revision`
- Pagination on list endpoints
- Channel/platform selection (Meta, LinkedIn, Schibsted, etc.)
- Package-based order type (Basic / Medium / Deluxe)
- Add-ons with pricing (see docs/product.md Step 2 for full list)
- Materials linking to orders
- Frontend: 5-step order creation form with live cost sidebar

## Key Business Rules

- `company` and `companyId` should always be derived from the authenticated user on the backend — never trust client-provided values
- Clients cannot change order status — only admins can (not yet enforced in middleware, needs roleGuard)
- Duplicate order should copy items — not comments or submitted materials
- Schibsted channel has no API — mark in UI that performance data will be entered manually

## Smart Form Logic (Frontend — not yet built)

When building the order form:
- Selecting a **package** pre-fills services, disables individual service selection
- Selecting **Schibsted** as a channel shows a manual data entry note (no API)
- Add-ons render conditionally based on channel/package selection
- Cost estimate updates live as selections change
- Use a single `useOrderForm` hook to manage all form state and derivations
