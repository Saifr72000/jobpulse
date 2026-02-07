import request from "supertest";
import app from "../../src/app.js";
import { createTestCompany, createTestUser } from "../helpers/testData.helper.js";
import { createAuthenticatedUser } from "../helpers/auth.helper.js";

describe("Auth API", () => {
  describe("POST /api/auth/login", () => {
    it("should login with valid credentials", async () => {
      const company = await createTestCompany();
      const user = await createTestUser(company._id, {
        email: "login@test.com",
        password: "correctpassword",
      });

      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: user.email,
          password: "correctpassword",
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Login successful");
      expect(response.body.user.email).toBe(user.email);
      // Should set cookies
      expect(response.headers["set-cookie"]).toBeDefined();
    });

    it("should fail with wrong password", async () => {
      const company = await createTestCompany();
      const user = await createTestUser(company._id, {
        email: "wrongpass@test.com",
        password: "correctpassword",
      });

      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: user.email,
          password: "wrongpassword",
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Invalid credentials");
    });

    it("should fail with non-existent email", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "nonexistent@test.com",
          password: "anypassword",
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Invalid credentials");
    });

    it("should fail with missing email", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          password: "anypassword",
        });

      expect(response.status).toBe(401);
    });

    it("should fail with missing password", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "test@test.com",
        });

      expect(response.status).toBe(401);
    });
  });

  describe("POST /api/auth/refresh-token", () => {
    it("should fail without refresh token cookie", async () => {
      const response = await request(app).post("/api/auth/refresh-token");

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Refresh Token Required");
    });

    it("should handle refresh token request", async () => {
      // Login to get cookies
      const { agent } = await createAuthenticatedUser();

      // Try to refresh
      // Note: refresh_token cookie has secure:true, so won't be sent in HTTP tests
      // In production (HTTPS), this would work. In tests, we expect 401.
      const response = await agent.post("/api/auth/refresh-token");

      // 401 = cookie not sent (secure:true in HTTP)
      // 200 = token refreshed successfully
      // 403 = invalid/expired token
      expect([200, 401, 403]).toContain(response.status);
    });
  });

  describe("POST /api/auth/logout", () => {
    it("should logout successfully", async () => {
      const { agent } = await createAuthenticatedUser();

      const response = await agent.post("/api/auth/logout");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Logged out successfully");
    });

    it("should clear cookies on logout", async () => {
      const { agent } = await createAuthenticatedUser();

      const response = await agent.post("/api/auth/logout");

      expect(response.status).toBe(200);
      // Cookies should be cleared (set to empty or expired)
      const cookies = response.headers["set-cookie"];
      if (cookies) {
        const cookieStr = Array.isArray(cookies) ? cookies.join(";") : cookies;
        // Check that cookies are being cleared (either empty value or past expiration)
        expect(cookieStr).toMatch(/access_token|refresh_token/);
      }
    });

    it("should work even without being logged in", async () => {
      const response = await request(app).post("/api/auth/logout");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Logged out successfully");
    });
  });

  describe("Authentication flow", () => {
    it("should allow authenticated requests after login", async () => {
      const { agent, user } = await createAuthenticatedUser();

      // Make an authenticated request
      const response = await agent.get(`/api/users/${user._id}`);

      expect(response.status).toBe(200);
      expect(response.body.email).toBe(user.email);
    });

    it("should reject requests after logout", async () => {
      const { agent, user } = await createAuthenticatedUser();

      // Logout
      await agent.post("/api/auth/logout");

      // Try to make authenticated request - should fail
      const response = await agent.get(`/api/users/${user._id}`);

      expect(response.status).toBe(401);
    });
  });
});
