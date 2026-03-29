# JobPulse – Claude Code Configuration

## Documentation

- Full product spec, user roles, ordering flow, modules: **docs/product.md** ← read this for any feature work

## Project Overview

JobPulse is a B2B recruitment operations platform (bachelor thesis, NTNU 2025).
It handles recruitment order management, candidate/lead tracking, and performance analytics.
The platform does NOT handle media buying or campaign publishing.

## Stack

- **Frontend:** React 19 (Vite), TypeScript — minimal, in early development
- **Backend:** Node.js, Express.js 5, TypeScript
- **Database:** MongoDB with Mongoose
- **Auth:** JWT (access + refresh tokens), bcrypt, OTP email verification
- **File Storage:** Multer (memory storage) + AWS S3 (`@aws-sdk/client-s3`, presigned URLs for upload/download)
- **Email:** Not yet implemented (no Nodemailer installed)
- **Validation:** express-validator
- **Testing:** Jest + Supertest + mongodb-memory-server (backend integration tests)
- **API Docs:** Swagger (swagger-jsdoc + swagger-ui-express)

## Monorepo Structure

```
bachelor/
├── CLAUDE.md
├── backend/                   ← Express API (TypeScript)
│   ├── src/
│   │   ├── app.ts
│   │   ├── index.ts
│   │   ├── config/
│   │   ├── controllers/       ← auth, company, order, product, user
│   │   ├── middlewares/       ← auth.middleware.ts, requestValidator.middleware.ts
│   │   ├── models/            ← company, order, product, user
│   │   ├── routes/            ← auth, company, order, product, user
│   │   ├── services/          ← auth, company, order, product, user
│   │   ├── swagger-docs/
│   │   ├── types/
│   │   ├── utils/             ← jwt.util.ts, otp.util.ts
│   │   └── validators/        ← company, order, product, user
│   └── tests/
│       ├── helpers/           ← auth.helper.ts, testData.helper.ts
│       ├── integration/       ← auth, companies, orders, products, users
│       └── setup.ts
└── frontend/                  ← React app (TypeScript, Vite) — early stage
    └── src/
        ├── App.tsx
        └── main.tsx
```

## MongoDB Collections & Key Schemas

### users

```ts
{ _id, firstName, lastName, email, password, otp, otpExpires, isVerified, company: ObjectId, refreshToken, createdAt, updatedAt }
```

### companies

```ts
{ _id, name, orgNumber, ...createdAt, updatedAt }
```

### orders

```ts
{
  _id, company: ObjectId, companyName, orgNumber,
  orderedBy: ObjectId,
  items: [{ product: ObjectId, productName, quantity, priceAtPurchase }],
  totalAmount, status: ['pending'|'in-progress'|'completed'],
  shippingAddress, notes, createdAt, updatedAt
}
```

### products

```ts
{ _id, name, description, price, ...createdAt, updatedAt }
```

## Auth & Role System

- JWT access + refresh token flow
- OTP-based email verification on registration
- JWT middleware (`auth.middleware.ts`) on all protected routes
- All client data is company-scoped — never trust client-provided companyId

## API Routes (currently implemented)

```
/api/auth/          → register, login, logout, refresh, OTP verification
/api/users/         → user management
/api/companies/     → company management
/api/products/      → product management
/api/orders/        → order management
```

## Coding Standards

### Backend

- Use `async/await` with try/catch — no raw Promise chains
- Controllers are thin: validate input → call service → return response
- Services contain all business logic and DB interactions
- Validate all request bodies with `express-validator` before hitting controllers
- Use Mongoose `lean()` for read-only queries
- HTTP status codes: 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Server Error
- Never expose internal error messages to clients in production

### Frontend

- Components are functional only — no class components
- Name components with PascalCase, hooks with `use` prefix
- No hardcoded secrets — use `.env` files

#### SCSS Rules (strictly enforced)

- **Never hardcode values** — no raw hex colors, pixel sizes, font sizes, weights, or line heights
- Use `$variables` tokens only: `$violet`, `$coal`, `$frost`, `$pearl`, `$midnight`, `$mist`, `$ash`, `$red`, `$white`, `$color-bg`, `$color-surface`, `$color-text`, `$color-text-muted`, `$color-text-inverted`, `$color-primary`
- Use `$text-xs/sm/base/lg/xl/2xl/3xl/4xl` for font sizes (from `_typography.scss`)
- Use `$font-normal/medium/semibold/bold` for font weights
- Use `$leading-tight/normal/relaxed` for line heights
- Use `$spacing-xs/sm/md/lg/xl` for all spacing/gaps/padding
- Use `$radius-card`, `$radius-pill`, `$radius-input` for border radii
- Use `$shadow-card` for box shadows
- **Do not redefine global typography** — `h1–h4` and `.h1–.h4`, `.body-1–.body-4`, `.subheading`, `.btn-label-1–.btn-label-2`, `.text-muted`, `.text-small` are already defined globally in `frontend/src/styles/_typography.scss`. Use the correct HTML tag or utility class instead of rewriting font styles locally.
- Always import with `@use "../../../styles/variables" as *;` and `@use "../../../styles/typography" as *;`
- **No Tailwind** — this project uses SCSS only

#### Icons

- Use only SVG files from `frontend/src/assets/icons/` via the `Icon` component (`components/Icon/Icon.tsx`)
- Do not import image assets from Figma URLs or external sources
- Do not create inline SVG logos for third-party platforms — add proper SVG files to the icons folder instead

### Figma to Code

When building UI from a Figma URL:
- Use the Figma MCP tool (`mcp__figma__get_design_context`) to get design context — the file key is in `docs/product.md`
- Implement using React + SCSS (no Tailwind)
- Map Figma design tokens to SCSS `$variables` — never hardcode values
- Adapt to existing project components — don't generate from scratch
- Check `frontend/src/components/` for reusable components before building new ones

### General

- All dates stored as UTC in MongoDB
- Paginate all list endpoints: `?page=1&limit=20`

## Environment Variables (backend/.env)

```
PORT=
MONGODB_URI=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
CLIENT_URL=http://localhost:5173
```

## Current Development Priority (work through in order)

1. Auth (login, JWT, OTP verification, password reset) ← partially done
2. Order flow (create, submit, view orders) ← partially done
3. Frontend foundation (routing, auth flow, API layer)
4. Media bank (upload, browse, approval)
5. Candidates (ingestion, status management)
6. Reporting (KPI display per platform)
7. Admin features (products, customers, order review)
8. Settings (company info, subscription, billing)
