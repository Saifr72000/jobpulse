import request from "supertest";
import app from "../../src/app.js";
import { createTestCompany, createTestUser } from "../helpers/testData.helper.js";
import { createAuthenticatedUser } from "../helpers/auth.helper.js";

describe("Users API", () => {
  describe("POST /api/users/register", () => {
    it("should register a new user", async () => {
      const company = await createTestCompany();

      const userData = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "securePassword123",
        companyId: company._id.toString(),
      };

      const response = await request(app)
        .post("/api/users/register")
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body.message).toContain("User registered successfully");
      expect(response.body.user.firstName).toBe(userData.firstName);
      expect(response.body.user.email).toBe(userData.email);
      // Password should not be returned
      expect(response.body.user.password).toBeUndefined();
    });

    it("should fail when email is missing", async () => {
      const company = await createTestCompany();

      const response = await request(app)
        .post("/api/users/register")
        .send({
          firstName: "John",
          lastName: "Doe",
          password: "password123",
          companyId: company._id.toString(),
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it("should fail when password is too short", async () => {
      const company = await createTestCompany();

      const response = await request(app)
        .post("/api/users/register")
        .send({
          firstName: "John",
          lastName: "Doe",
          email: "john@test.com",
          password: "123", // Too short
          companyId: company._id.toString(),
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it("should fail when firstName is missing", async () => {
      const company = await createTestCompany();

      const response = await request(app)
        .post("/api/users/register")
        .send({
          lastName: "Doe",
          email: "john@test.com",
          password: "password123",
          companyId: company._id.toString(),
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it("should fail with invalid email format", async () => {
      const company = await createTestCompany();

      const response = await request(app)
        .post("/api/users/register")
        .send({
          firstName: "John",
          lastName: "Doe",
          email: "invalid-email",
          password: "password123",
          companyId: company._id.toString(),
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe("GET /api/users", () => {
    it("should return empty array when no users exist", async () => {
      const response = await request(app).get("/api/users");

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it("should return all users", async () => {
      const company = await createTestCompany();
      await createTestUser(company._id, { email: "user1@test.com" });
      await createTestUser(company._id, { email: "user2@test.com" });

      const response = await request(app).get("/api/users");

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
    });
  });

  describe("GET /api/users/:id", () => {
    it("should return a user by ID when authenticated", async () => {
      const { agent, user } = await createAuthenticatedUser({
        firstName: "Jane",
        lastName: "Smith",
      });

      const response = await agent.get(`/api/users/${user._id}`);

      expect(response.status).toBe(200);
      expect(response.body.firstName).toBe("Jane");
      expect(response.body.lastName).toBe("Smith");
    });

    it("should fail without authentication", async () => {
      const company = await createTestCompany();
      const user = await createTestUser(company._id);

      const response = await request(app).get(`/api/users/${user._id}`);

      expect(response.status).toBe(401);
    });

    it("should return 404 for non-existent user", async () => {
      const { agent } = await createAuthenticatedUser();
      const fakeId = "507f1f77bcf86cd799439011";

      const response = await agent.get(`/api/users/${fakeId}`);

      expect(response.status).toBe(404);
    });
  });

  describe("PUT /api/users/:id", () => {
    it("should update a user", async () => {
      const company = await createTestCompany();
      const user = await createTestUser(company._id, { firstName: "Old" });

      const response = await request(app)
        .put(`/api/users/${user._id}`)
        .send({ firstName: "New", lastName: "Name" });

      expect(response.status).toBe(200);
      expect(response.body.user.firstName).toBe("New");
      expect(response.body.user.lastName).toBe("Name");
    });

    it("should return 404 when updating non-existent user", async () => {
      const fakeId = "507f1f77bcf86cd799439011";

      const response = await request(app)
        .put(`/api/users/${fakeId}`)
        .send({ firstName: "Updated" });

      expect(response.status).toBe(404);
    });
  });
});
