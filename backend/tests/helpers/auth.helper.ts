import request from "supertest";
import app from "../../src/app.js";
import { createTestCompany, createTestUser, type TestUser, type TestCompany } from "./testData.helper.js";

// Type for supertest agent
type Agent = ReturnType<typeof request.agent>;

export interface AuthenticatedUser {
  user: TestUser;
  company: TestCompany;
  agent: Agent; // Agent that maintains cookies
}

/**
 * Create a user and login to get an authenticated agent with cookies
 */
export const createAuthenticatedUser = async (
  userOverrides: Partial<Omit<TestUser, "company">> = {}
): Promise<AuthenticatedUser> => {
  // Create company
  const company = await createTestCompany();

  // Create user
  const user = await createTestUser(company._id, userOverrides);

  // Create an agent that persists cookies across requests
  const agent = request.agent(app);

  // Login - this sets cookies on the agent
  const loginResponse = await agent
    .post("/api/auth/login")
    .send({
      email: user.email,
      password: user.password,
    });

  if (loginResponse.status !== 200) {
    throw new Error(`Login failed: ${JSON.stringify(loginResponse.body)}`);
  }

  return {
    user,
    company,
    agent, // Use this agent for authenticated requests
  };
};

/**
 * Create an unauthenticated request helper (for testing 401 responses)
 */
export const unauthenticatedRequest = () => request(app);
