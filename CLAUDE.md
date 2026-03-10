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
- **File Storage:** Multer (local dev) — S3 not yet implemented
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

### Figma to Code

When building UI from a Figma URL:
- Use the Figma MCP tool to get design context
- Implement using React + Tailwind CSS
- Map design tokens to Tailwind classes
- Adapt to existing project components — don't generate from scratch

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
