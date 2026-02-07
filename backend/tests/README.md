# Tests

This folder contains all integration and unit tests for the backend.

## Test Commands

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests |
| `npm run test:integration` | Run only integration tests |
| `npm run test:unit` | Run only unit tests |
| `npm run test:watch` | Watch mode (re-runs on file changes) |
| `npm run test:coverage` | Generate coverage report |

## View Coverage Report

After running `npm run test:coverage`, open the HTML report:

```bash
open coverage/lcov-report/index.html
```

## Folder Structure

```
tests/
├── setup.ts                  # Global test setup (in-memory MongoDB)
├── helpers/
│   ├── testData.helper.ts    # Create test companies, users, products
│   └── auth.helper.ts        # Login and authenticated request helpers
├── integration/              # API endpoint tests
│   ├── auth.test.ts
│   ├── companies.test.ts
│   ├── orders.test.ts
│   ├── products.test.ts
│   └── users.test.ts
└── unit/                     # Pure function tests (add as needed)
```

## How Tests Work

- **In-memory MongoDB**: Tests use `mongodb-memory-server` — no real database is affected
- **Isolation**: Database is cleared after each test
- **Cookies**: Authentication uses `supertest.agent()` to maintain session cookies

## Writing New Tests

1. Create a new file in `integration/` or `unit/`
2. Use helpers from `helpers/` for test data
3. Run `npm test` to verify

Example:

```typescript
import request from "supertest";
import app from "../../src/app.js";
import { createTestCompany } from "../helpers/testData.helper.js";

describe("My Feature", () => {
  it("should do something", async () => {
    const company = await createTestCompany();
    const response = await request(app).get(`/api/companies/${company._id}`);
    expect(response.status).toBe(200);
  });
});
```
