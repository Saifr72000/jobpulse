import request from "supertest";
import app from "../../src/app.js";
import { createTestCompany } from "../helpers/testData.helper.js";

describe("Companies API", () => {
  describe("POST /api/companies", () => {
    it("should create a new company", async () => {
      const companyData = {
        name: "New Tech Corp",
        orgNumber: 987654321,
        email: "contact@newtech.com",
        address: "123 Tech Street",
        phone: "12345678",
        website: "https://newtech.com",
      };

      const response = await request(app)
        .post("/api/companies")
        .send(companyData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Company created successfully");
      expect(response.body.company.name).toBe(companyData.name);
      expect(response.body.company.orgNumber).toBe(companyData.orgNumber);
      expect(response.body.company._id).toBeDefined();
    });

    it("should create company with only required fields", async () => {
      const companyData = {
        name: "Minimal Corp",
        orgNumber: 111222333,
        email: "minimal@corp.com",
      };

      const response = await request(app)
        .post("/api/companies")
        .send(companyData);

      expect(response.status).toBe(201);
      expect(response.body.company.name).toBe(companyData.name);
    });

    it("should fail when name is missing", async () => {
      const response = await request(app)
        .post("/api/companies")
        .send({ orgNumber: 123456789, email: "test@test.com" });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it("should fail when email is invalid", async () => {
      const response = await request(app)
        .post("/api/companies")
        .send({ name: "Test Co", orgNumber: 123456789, email: "invalid-email" });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it("should fail when orgNumber is missing", async () => {
      const response = await request(app)
        .post("/api/companies")
        .send({ name: "Test Co", email: "test@test.com" });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe("GET /api/companies", () => {
    it("should return empty array when no companies exist", async () => {
      const response = await request(app).get("/api/companies");

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it("should return all companies", async () => {
      // Create test companies
      await createTestCompany({ name: "Company A", email: "a@test.com" });
      await createTestCompany({ name: "Company B", email: "b@test.com", orgNumber: 222222222 });

      const response = await request(app).get("/api/companies");

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
    });
  });

  describe("GET /api/companies/:id", () => {
    it("should return a company by ID", async () => {
      const company = await createTestCompany({ name: "Specific Company" });

      const response = await request(app).get(`/api/companies/${company._id}`);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe("Specific Company");
    });

    it("should return 404 for non-existent company", async () => {
      const fakeId = "507f1f77bcf86cd799439011";

      const response = await request(app).get(`/api/companies/${fakeId}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Company not found");
    });
  });

  describe("PUT /api/companies/:id", () => {
    it("should update a company", async () => {
      const company = await createTestCompany({ name: "Old Name" });

      const response = await request(app)
        .put(`/api/companies/${company._id}`)
        .send({ name: "New Name", phone: "98765432" });

      expect(response.status).toBe(200);
      expect(response.body.company.name).toBe("New Name");
      expect(response.body.company.phone).toBe("98765432");
    });

    it("should return 404 when updating non-existent company", async () => {
      const fakeId = "507f1f77bcf86cd799439011";

      const response = await request(app)
        .put(`/api/companies/${fakeId}`)
        .send({ name: "Updated" });

      expect(response.status).toBe(404);
    });

    it("should fail with invalid email on update", async () => {
      const company = await createTestCompany();

      const response = await request(app)
        .put(`/api/companies/${company._id}`)
        .send({ email: "invalid-email" });

      expect(response.status).toBe(400);
    });
  });

  describe("DELETE /api/companies/:id", () => {
    it("should delete a company", async () => {
      const company = await createTestCompany();

      const response = await request(app).delete(`/api/companies/${company._id}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Company deleted successfully");

      // Verify it's actually deleted
      const getResponse = await request(app).get(`/api/companies/${company._id}`);
      expect(getResponse.status).toBe(404);
    });

    it("should return 404 when deleting non-existent company", async () => {
      const fakeId = "507f1f77bcf86cd799439011";

      const response = await request(app).delete(`/api/companies/${fakeId}`);

      expect(response.status).toBe(404);
    });
  });
});
