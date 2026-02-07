import request from "supertest";
import app from "../../src/app.js";
import { createTestProduct, createTestProducts } from "../helpers/testData.helper.js";
import { createAuthenticatedUser, unauthenticatedRequest } from "../helpers/auth.helper.js";

describe("Orders API", () => {
  describe("POST /api/orders", () => {
    it("should create an order when authenticated", async () => {
      // Setup: Create authenticated user (with cookies) and products
      const { agent, company } = await createAuthenticatedUser();
      const products = await createTestProducts(2);

      const orderData = {
        items: [
          { productId: products[0]._id.toString(), quantity: 2 },
          { productId: products[1]._id.toString(), quantity: 1 },
        ],
        shippingAddress: "123 Test Street, Oslo",
        notes: "Please deliver quickly",
      };

      const response = await agent.post("/api/orders").send(orderData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Order created successfully");
      expect(response.body.order.companyName).toBe(company.name);
      expect(response.body.order.orgNumber).toBe(company.orgNumber);
      expect(response.body.order.items).toHaveLength(2);
      expect(response.body.order.status).toBe("pending");
      // Product 1: 10 * 2 = 20, Product 2: 20 * 1 = 20, Total = 40
      expect(response.body.order.totalAmount).toBe(40);
    });

    it("should fail without authentication", async () => {
      const products = await createTestProducts(1);

      const response = await unauthenticatedRequest()
        .post("/api/orders")
        .send({
          items: [{ productId: products[0]._id.toString(), quantity: 1 }],
        });

      expect(response.status).toBe(401);
    });

    it("should fail with empty items array", async () => {
      const { agent } = await createAuthenticatedUser();

      const response = await agent.post("/api/orders").send({ items: [] });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it("should fail with invalid product ID", async () => {
      const { agent } = await createAuthenticatedUser();

      const response = await agent.post("/api/orders").send({
        items: [{ productId: "507f1f77bcf86cd799439011", quantity: 1 }],
      });

      expect(response.status).toBe(404);
      expect(response.body.error).toContain("not found");
    });
  });

  describe("GET /api/orders/my-orders", () => {
    it("should return user's orders", async () => {
      const { agent } = await createAuthenticatedUser();
      const products = await createTestProducts(1);

      // Create an order first
      await agent.post("/api/orders").send({
        items: [{ productId: products[0]._id.toString(), quantity: 1 }],
      });

      const response = await agent.get("/api/orders/my-orders");

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
    });

    it("should fail without authentication", async () => {
      const response = await unauthenticatedRequest().get("/api/orders/my-orders");

      expect(response.status).toBe(401);
    });
  });

  describe("GET /api/orders", () => {
    it("should return all orders", async () => {
      const { agent } = await createAuthenticatedUser();
      const products = await createTestProducts(1);

      // Create an order
      await agent.post("/api/orders").send({
        items: [{ productId: products[0]._id.toString(), quantity: 1 }],
      });

      const response = await request(app).get("/api/orders");

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
    });
  });

  describe("GET /api/orders/company/:companyId", () => {
    it("should return orders by company", async () => {
      const { agent, company } = await createAuthenticatedUser();
      const products = await createTestProducts(1);

      // Create an order
      await agent.post("/api/orders").send({
        items: [{ productId: products[0]._id.toString(), quantity: 1 }],
      });

      const response = await request(app).get(`/api/orders/company/${company._id}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].companyName).toBe(company.name);
    });
  });

  describe("GET /api/orders/:id", () => {
    it("should return order by ID", async () => {
      const { agent, company } = await createAuthenticatedUser();
      const products = await createTestProducts(1);

      // Create an order
      const createResponse = await agent.post("/api/orders").send({
        items: [{ productId: products[0]._id.toString(), quantity: 1 }],
      });

      const orderId = createResponse.body.order._id;

      const response = await request(app).get(`/api/orders/${orderId}`);

      expect(response.status).toBe(200);
      expect(response.body._id).toBe(orderId);
      expect(response.body.companyName).toBe(company.name);
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
      const products = await createTestProducts(1);

      // Create an order
      const createResponse = await agent.post("/api/orders").send({
        items: [{ productId: products[0]._id.toString(), quantity: 1 }],
      });

      const orderId = createResponse.body.order._id;

      const response = await request(app)
        .patch(`/api/orders/${orderId}/status`)
        .send({ status: "processing" });

      expect(response.status).toBe(200);
      expect(response.body.order.status).toBe("processing");
    });

    it("should fail with invalid status", async () => {
      const { agent } = await createAuthenticatedUser();
      const products = await createTestProducts(1);

      const createResponse = await agent.post("/api/orders").send({
        items: [{ productId: products[0]._id.toString(), quantity: 1 }],
      });

      const orderId = createResponse.body.order._id;

      const response = await request(app)
        .patch(`/api/orders/${orderId}/status`)
        .send({ status: "invalid_status" });

      expect(response.status).toBe(400);
    });
  });

  describe("DELETE /api/orders/:id", () => {
    it("should delete an order", async () => {
      const { agent } = await createAuthenticatedUser();
      const products = await createTestProducts(1);

      // Create an order
      const createResponse = await agent.post("/api/orders").send({
        items: [{ productId: products[0]._id.toString(), quantity: 1 }],
      });

      const orderId = createResponse.body.order._id;

      const response = await request(app).delete(`/api/orders/${orderId}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Order deleted successfully");

      // Verify deletion
      const getResponse = await request(app).get(`/api/orders/${orderId}`);
      expect(getResponse.status).toBe(404);
    });
  });
});
