import request from "supertest";
import app from "../../src/app.js";
import { createTestCompany } from "../helpers/testData.helper.js";
import {
  createAuthenticatedUser,
  createAuthenticatedAdmin,
  unauthenticatedRequest,
} from "../helpers/auth.helper.js";

describe("Companies API", () => {
  describe("POST /api/companies", () => {
    it("should reject unauthenticated requests", async () => {
      const companyData = {
        name: "New Tech Corp",
        orgNumber: 987654321,
        email: "contact@newtech.com",
        address: "123 Tech Street",
        phone: "12345678",
        website: "https://newtech.com",
      };

      const response = await request(app).post("/api/companies").send(companyData);

      expect(response.status).toBe(401);
    });

    it("should reject non-admin authenticated users", async () => {
      const { agent } = await createAuthenticatedUser();
      const companyData = {
        name: "Client Try Corp",
        orgNumber: 987654322,
        email: "clienttry@corp.com",
      };

      const response = await agent.post("/api/companies").send(companyData);

      expect(response.status).toBe(403);
    });

    it("should create a new company when admin", async () => {
      const { agent } = await createAuthenticatedAdmin();
      const companyData = {
        name: "New Tech Corp",
        orgNumber: 987654321,
        email: "contact@newtech.com",
        address: "123 Tech Street",
        phone: "12345678",
        website: "https://newtech.com",
      };

      const response = await agent.post("/api/companies").send(companyData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Company created successfully");
      expect(response.body.company.name).toBe(companyData.name);
      expect(response.body.company.orgNumber).toBe(companyData.orgNumber);
      expect(response.body.company._id).toBeDefined();
    });

    it("should create company with only required fields when admin", async () => {
      const { agent } = await createAuthenticatedAdmin();
      const companyData = {
        name: "Minimal Corp",
        orgNumber: 111222333,
        email: "minimal@corp.com",
      };

      const response = await agent.post("/api/companies").send(companyData);

      expect(response.status).toBe(201);
      expect(response.body.company.name).toBe(companyData.name);
    });

    it("should fail when name is missing", async () => {
      const { agent } = await createAuthenticatedAdmin();
      const response = await agent
        .post("/api/companies")
        .send({ orgNumber: 123456789, email: "test@test.com" });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it("should fail when email is invalid", async () => {
      const { agent } = await createAuthenticatedAdmin();
      const response = await agent
        .post("/api/companies")
        .send({ name: "Test Co", orgNumber: 123456789, email: "invalid-email" });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it("should fail when orgNumber is missing", async () => {
      const { agent } = await createAuthenticatedAdmin();
      const response = await agent.post("/api/companies").send({ name: "Test Co", email: "test@test.com" });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe("GET /api/companies", () => {
    it("should reject unauthenticated requests", async () => {
      const response = await unauthenticatedRequest().get("/api/companies");
      expect(response.status).toBe(401);
    });

    it("should reject non-admin users", async () => {
      const { agent } = await createAuthenticatedUser();
      const response = await agent.get("/api/companies");
      expect(response.status).toBe(403);
    });

    it("should return empty array when no companies exist (admin)", async () => {
      const { agent } = await createAuthenticatedAdmin();
      const response = await agent.get("/api/companies");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it("should return all companies for admin", async () => {
      const { agent } = await createAuthenticatedAdmin();
      await createTestCompany({ name: "Company A", email: "a@test.com" });
      await createTestCompany({ name: "Company B", email: "b@test.com", orgNumber: 222222222 });

      const response = await agent.get("/api/companies");

      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("GET /api/companies/:id", () => {
    it("should reject unauthenticated requests", async () => {
      const company = await createTestCompany({ name: "Specific Company" });
      const response = await unauthenticatedRequest().get(`/api/companies/${company._id}`);
      expect(response.status).toBe(401);
    });

    it("should return a company by ID for same-company user", async () => {
      const { agent, company } = await createAuthenticatedUser();
      const response = await agent.get(`/api/companies/${company._id}`);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(company.name);
    });

    it("should return a company for admin even if not their org", async () => {
      const other = await createTestCompany({ name: "Other Org" });
      const { agent } = await createAuthenticatedAdmin();
      const response = await agent.get(`/api/companies/${other._id}`);
      expect(response.status).toBe(200);
      expect(response.body.name).toBe("Other Org");
    });

    it("should return 403 when user accesses another company", async () => {
      const { agent } = await createAuthenticatedUser();
      const other = await createTestCompany({ name: "Forbidden Co" });
      const response = await agent.get(`/api/companies/${other._id}`);
      expect(response.status).toBe(403);
    });

    it("should return 404 for non-existent company", async () => {
      const { agent } = await createAuthenticatedAdmin();
      const fakeId = "507f1f77bcf86cd799439011";

      const response = await agent.get(`/api/companies/${fakeId}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Company not found");
    });
  });

  describe("PUT /api/companies/:id", () => {
    it("should update a company for same-company user", async () => {
      const { agent, company } = await createAuthenticatedUser();

      const response = await agent.put(`/api/companies/${company._id}`).send({
        name: "New Name",
        address: "98765432 Test Street",
      });

      expect(response.status).toBe(200);
      expect(response.body.company.name).toBe("New Name");
      expect(response.body.company.address).toBe("98765432 Test Street");
    });

    it("should return 404 when updating non-existent company", async () => {
      const { agent } = await createAuthenticatedAdmin();
      const fakeId = "507f1f77bcf86cd799439011";

      const response = await agent.put(`/api/companies/${fakeId}`).send({ name: "Updated" });

      expect(response.status).toBe(404);
    });

    it("should fail with invalid email on update", async () => {
      const { agent, company } = await createAuthenticatedUser();

      const response = await agent.put(`/api/companies/${company._id}`).send({ email: "invalid-email" });

      expect(response.status).toBe(400);
    });
  });

  describe("DELETE /api/companies/:id", () => {
    it("should delete a company for same-company user", async () => {
      const { agent, company } = await createAuthenticatedUser();

      const response = await agent.delete(`/api/companies/${company._id}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Company deleted successfully");

      const admin = await createAuthenticatedAdmin();
      const getResponse = await admin.agent.get(`/api/companies/${company._id}`);
      expect(getResponse.status).toBe(404);
    });

    it("should return 404 when deleting non-existent company", async () => {
      const { agent } = await createAuthenticatedAdmin();
      const fakeId = "507f1f77bcf86cd799439011";

      const response = await agent.delete(`/api/companies/${fakeId}`);

      expect(response.status).toBe(404);
    });
  });
});
