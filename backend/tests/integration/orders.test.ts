import request from "supertest";
import app from "../../src/app.js";
import { createAuthenticatedUser, unauthenticatedRequest } from "../helpers/auth.helper.js";

// Minimal valid campaign order payload (matches createOrderValidator + API body)
const validCampaignOrder = {
  orderType: "custom",
  channels: ["linkedin", "facebook"],
  addons: [],
  campaignName: "Summer 2026 Hiring",
  assets: {
    imageOption: "upload",
  },
  targetAudience: "Software engineers with 3+ years experience in Oslo",
  additionalNotes: "Focus on backend roles",
  paymentMethod: "invoice",
  subtotal: 4000,
  vatRate: 0.25,
  vatAmount: 1000,
  totalAmount: 5000,
  lineItems: [
    { type: "channel", name: "LinkedIn", price: 2500 },
    { type: "channel", name: "Facebook", price: 1500 },
  ],
};

// Valid package order payload
const validPackageOrder = {
  orderType: "package",
  package: "basic",
  channels: ["linkedin", "facebook", "google"],
  addons: [],
  campaignName: "Q3 Recruitment Drive",
  assets: {
    imageOption: "media-library",
  },
  targetAudience: "Marketing professionals in Bergen",
  paymentMethod: "card-payment",
  subtotal: 9600,
  vatRate: 0.25,
  vatAmount: 2400,
  totalAmount: 12000,
  lineItems: [
    { type: "package", name: "Basic package", price: 7000 },
    { type: "channel", name: "LinkedIn", price: 1000 },
    { type: "channel", name: "Facebook", price: 1000 },
    { type: "channel", name: "Google", price: 600 },
  ],
};

describe("Orders API", () => {
  describe("POST /api/orders", () => {
    it("should create a custom order when authenticated", async () => {
      const { agent, company } = await createAuthenticatedUser();

      const response = await agent.post("/api/orders").send(validCampaignOrder);

      expect(response.status).toBe(201);
      expect(response.body.campaignName).toBe("Summer 2026 Hiring");
      expect(response.body.orderType).toBe("custom");
      expect(response.body.channels).toEqual(["linkedin", "facebook"]);
      expect(response.body.status).toBe("pending");
      expect(response.body.companyName).toBe(company.name);
      expect(response.body.orgNumber).toBe(company.orgNumber);
      expect(response.body.totalAmount).toBe(5000);
    });

    it("should create a package order when authenticated", async () => {
      const { agent } = await createAuthenticatedUser();

      const response = await agent.post("/api/orders").send(validPackageOrder);

      expect(response.status).toBe(201);
      expect(response.body.orderType).toBe("package");
      expect(response.body.package).toBe("basic");
      expect(response.body.channels).toHaveLength(3);
      expect(response.body.status).toBe("pending");
    });

    it("should fail when package channel limit is exceeded", async () => {
      const { agent } = await createAuthenticatedUser();

      const response = await agent.post("/api/orders").send({
        ...validPackageOrder,
        package: "basic", // limit 3
        channels: ["linkedin", "facebook", "google", "snapchat"], // 4 channels — exceeds limit
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain("maximum of");
    });

    it("should fail without authentication", async () => {
      const response = await unauthenticatedRequest()
        .post("/api/orders")
        .send(validCampaignOrder);

      expect(response.status).toBe(401);
    });

    it("should fail when campaignName is missing", async () => {
      const { agent } = await createAuthenticatedUser();

      const { campaignName, ...withoutName } = validCampaignOrder;

      const response = await agent.post("/api/orders").send(withoutName);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it("should fail when channels is empty", async () => {
      const { agent } = await createAuthenticatedUser();

      const response = await agent.post("/api/orders").send({
        ...validCampaignOrder,
        channels: [],
      });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it("should fail when channels is missing", async () => {
      const { agent } = await createAuthenticatedUser();

      const { channels, ...withoutChannels } = validCampaignOrder;

      const response = await agent.post("/api/orders").send(withoutChannels);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it("should fail when orderType is missing", async () => {
      const { agent } = await createAuthenticatedUser();

      const { orderType, ...withoutOrderType } = validCampaignOrder;

      const response = await agent.post("/api/orders").send(withoutOrderType);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it("should fail when package orderType is used without specifying package", async () => {
      const { agent } = await createAuthenticatedUser();

      const response = await agent.post("/api/orders").send({
        ...validPackageOrder,
        package: undefined,
      });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it("should require leadAdDescription when lead-ads addon is selected", async () => {
      const { agent } = await createAuthenticatedUser();

      const response = await agent.post("/api/orders").send({
        ...validCampaignOrder,
        addons: ["lead-ads"],
        assets: {
          imageOption: "upload",
          // leadAdDescription intentionally missing
        },
      });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it("should succeed when lead-ads addon is selected with valid leadAdDescription", async () => {
      const { agent } = await createAuthenticatedUser();

      const response = await agent.post("/api/orders").send({
        ...validCampaignOrder,
        addons: ["lead-ads"],
        assets: {
          imageOption: "upload",
          leadAdDescription: "team-create",
        },
      });

      expect(response.status).toBe(201);
      expect(response.body.addons).toContain("lead-ads");
    });

    it("should require videoMaterials when video-campaign addon is selected", async () => {
      const { agent } = await createAuthenticatedUser();

      const response = await agent.post("/api/orders").send({
        ...validCampaignOrder,
        addons: ["video-campaign"],
        assets: {
          imageOption: "upload",
          // videoMaterials intentionally missing
        },
      });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it("should require linkedinJobDescription and linkedinScreeningQuestions when linkedin-job-posting addon is selected", async () => {
      const { agent } = await createAuthenticatedUser();

      const response = await agent.post("/api/orders").send({
        ...validCampaignOrder,
        addons: ["linkedin-job-posting"],
        assets: {
          imageOption: "upload",
          // linkedinJobDescription and linkedinScreeningQuestions intentionally missing
        },
      });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe("GET /api/orders/my-orders", () => {
    it("should return paginated orders for authenticated user", async () => {
      const { agent } = await createAuthenticatedUser();

      // Create two orders
      await agent.post("/api/orders").send(validCampaignOrder);
      await agent.post("/api/orders").send({
        ...validCampaignOrder,
        campaignName: "Second Campaign",
      });

      const response = await agent.get("/api/orders/my-orders");

      expect(response.status).toBe(200);
      expect(response.body.orders).toHaveLength(2);
      expect(response.body.total).toBe(2);
      expect(response.body.page).toBe(1);
      expect(response.body.limit).toBe(20);
    });

    it("should return only that company's orders, not other companies'", async () => {
      const { agent: agent1 } = await createAuthenticatedUser();
      const { agent: agent2 } = await createAuthenticatedUser({
        email: "otheruser@test.com",
      });

      // agent1 creates an order
      await agent1.post("/api/orders").send(validCampaignOrder);

      // agent2 should see 0 orders
      const response = await agent2.get("/api/orders/my-orders");

      expect(response.status).toBe(200);
      expect(response.body.orders).toHaveLength(0);
      expect(response.body.total).toBe(0);
    });

    it("should respect page and limit query params", async () => {
      const { agent } = await createAuthenticatedUser();

      // Create 3 orders
      for (let i = 1; i <= 3; i++) {
        await agent.post("/api/orders").send({
          ...validCampaignOrder,
          campaignName: `Campaign ${i}`,
        });
      }

      const response = await agent.get("/api/orders/my-orders?page=1&limit=2");

      expect(response.status).toBe(200);
      expect(response.body.orders).toHaveLength(2);
      expect(response.body.total).toBe(3);
      expect(response.body.page).toBe(1);
      expect(response.body.limit).toBe(2);
    });

    it("should fail without authentication", async () => {
      const response = await unauthenticatedRequest().get("/api/orders/my-orders");

      expect(response.status).toBe(401);
    });
  });

  describe("GET /api/orders/:id", () => {
    it("should return order by ID", async () => {
      const { agent, company } = await createAuthenticatedUser();

      const createResponse = await agent.post("/api/orders").send(validCampaignOrder);
      const orderId = createResponse.body._id;

      const response = await request(app).get(`/api/orders/${orderId}`);

      expect(response.status).toBe(200);
      expect(response.body._id).toBe(orderId);
      expect(response.body.companyName).toBe(company.name);
      expect(response.body.campaignName).toBe("Summer 2026 Hiring");
    });

    it("should return 404 for non-existent order", async () => {
      const fakeId = "507f1f77bcf86cd799439011";

      const response = await request(app).get(`/api/orders/${fakeId}`);

      expect(response.status).toBe(404);
    });
  });

  describe("PATCH /api/orders/:id/status", () => {
    it("should update order status", async () => {
      const { agent } = await createAuthenticatedUser();

      const createResponse = await agent.post("/api/orders").send(validCampaignOrder);
      const orderId = createResponse.body._id;

      const response = await request(app)
        .patch(`/api/orders/${orderId}/status`)
        .send({ status: "in-progress" });

      expect(response.status).toBe(200);
      expect(response.body.order.status).toBe("in-progress");
    });

    it("should fail with invalid status", async () => {
      const { agent } = await createAuthenticatedUser();

      const createResponse = await agent.post("/api/orders").send(validCampaignOrder);
      const orderId = createResponse.body._id;

      const response = await request(app)
        .patch(`/api/orders/${orderId}/status`)
        .send({ status: "invalid_status" });

      expect(response.status).toBe(400);
    });
  });

  describe("DELETE /api/orders/:id", () => {
    it("should delete an order", async () => {
      const { agent } = await createAuthenticatedUser();

      const createResponse = await agent.post("/api/orders").send(validCampaignOrder);
      const orderId = createResponse.body._id;

      const response = await request(app).delete(`/api/orders/${orderId}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Order deleted successfully");

      // Verify deletion
      const getResponse = await request(app).get(`/api/orders/${orderId}`);
      expect(getResponse.status).toBe(404);
    });
  });

  describe("GET /api/orders", () => {
    it("should return all orders", async () => {
      const { agent } = await createAuthenticatedUser();

      await agent.post("/api/orders").send(validCampaignOrder);

      const response = await request(app).get("/api/orders");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(1);
    });
  });
});
