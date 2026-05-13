import { describe, it, expect, beforeAll } from "@jest/globals";
import request from "supertest";
import app from "../../src/app.js";
import { createTestProduct, createTestProducts } from "../helpers/testData.helper.js";
import { createAuthenticatedUser } from "../helpers/auth.helper.js";

describe("Products API", () => {
  let agent: ReturnType<typeof request.agent>;

  beforeAll(async () => {
    const auth = await createAuthenticatedUser();
    agent = auth.agent;
  });

  it("should reject unauthenticated GET /api/products", async () => {
    const response = await request(app).get("/api/products");
    expect(response.status).toBe(401);
  });

  describe("POST /api/products", () => {
    it("should create a new product", async () => {
      const productData = {
        title: "LinkedIn Campaign",
        price: 49.99,
        type: "service",
        description: "Professional network targeting",
        logo: "https://example.com/linkedin-logo.png",
      };

      const response = await agent.post("/api/products").send(productData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Product created successfully");
      expect(response.body.product.title).toBe(productData.title);
      expect(response.body.product.price).toBe(productData.price);
      expect(response.body.product.type).toBe(productData.type);
      expect(response.body.product._id).toBeDefined();
    });

    it("should create a package product", async () => {
      const productData = {
        title: "Basic Package",
        price: 8000,
        type: "package",
        description: "Up to 3 channels with analytics",
      };

      const response = await agent.post("/api/products").send(productData);

      expect(response.status).toBe(201);
      expect(response.body.product.type).toBe("package");
    });

    it("should create an addon product", async () => {
      const productData = {
        title: "Lead Ads",
        price: 2500,
        type: "addon",
        description: "Collect applications directly in the ad",
      };

      const response = await agent.post("/api/products").send(productData);

      expect(response.status).toBe(201);
      expect(response.body.product.type).toBe("addon");
    });

    it("should fail when title is missing", async () => {
      const response = await agent.post("/api/products").send({ price: 29.99, type: "service" });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it("should fail when type is missing", async () => {
      const response = await agent.post("/api/products").send({ title: "Test Product", price: 29.99 });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it("should fail when type is invalid", async () => {
      const response = await agent
        .post("/api/products")
        .send({ title: "Test Product", price: 29.99, type: "invalid" });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it("should fail when price is negative", async () => {
      const response = await agent
        .post("/api/products")
        .send({ title: "Bad Product", price: -10, type: "service" });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe("GET /api/products", () => {
    it("should return empty array when no products exist", async () => {
      const response = await agent.get("/api/products");

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it("should return all active products", async () => {
      // Create test products
      await createTestProducts(3);

      const response = await agent.get("/api/products");

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(3);
      // Products are sorted by createdAt descending (newest first)
      expect(response.body[0].title).toBe("Product 3");
      expect(response.body[1].title).toBe("Product 2");
      expect(response.body[2].title).toBe("Product 1");
    });

    it("should filter products by type", async () => {
      await createTestProduct({ title: "Service 1", type: "service" });
      await createTestProduct({ title: "Package 1", type: "package" });
      await createTestProduct({ title: "Service 2", type: "service" });

      const response = await agent.get("/api/products?type=service");

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].type).toBe("service");
      expect(response.body[1].type).toBe("service");
    });
  });

  describe("GET /api/products/type/:type", () => {
    it("should return only packages", async () => {
      await createTestProduct({ title: "Service 1", type: "service" });
      await createTestProduct({ title: "Package 1", type: "package" });
      await createTestProduct({ title: "Package 2", type: "package" });

      const response = await agent.get("/api/products/type/package");

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].type).toBe("package");
    });

    it("should return only services", async () => {
      await createTestProduct({ title: "Service 1", type: "service" });
      await createTestProduct({ title: "Package 1", type: "package" });

      const response = await agent.get("/api/products/type/service");

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].type).toBe("service");
    });

    it("should return only addons", async () => {
      await createTestProduct({ title: "Service 1", type: "service" });
      await createTestProduct({ title: "Addon 1", type: "addon" as "package" | "service" | "addon" });
      await createTestProduct({ title: "Addon 2", type: "addon" as "package" | "service" | "addon" });

      const response = await agent.get("/api/products/type/addon");

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].type).toBe("addon");
    });

    it("should return 400 for invalid type", async () => {
      const response = await agent.get("/api/products/type/invalid");

      expect(response.status).toBe(400);
      expect(response.body.error).toContain("Invalid product type");
    });
  });

  describe("GET /api/products/:id", () => {
    it("should return a product by ID", async () => {
      const product = await createTestProduct({ title: "Specific Product" });

      const response = await agent.get(`/api/products/${product._id}`);

      expect(response.status).toBe(200);
      expect(response.body.title).toBe("Specific Product");
    });

    it("should return 404 for non-existent product", async () => {
      const fakeId = "507f1f77bcf86cd799439011";

      const response = await agent.get(`/api/products/${fakeId}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Product not found");
    });
  });

  describe("PUT /api/products/:id", () => {
    it("should update a product", async () => {
      const product = await createTestProduct({ title: "Old Name", price: 10 });

      const response = await agent
        .put(`/api/products/${product._id}`)
        .send({ title: "New Name", price: 20 });

      expect(response.status).toBe(200);
      expect(response.body.product.title).toBe("New Name");
      expect(response.body.product.price).toBe(20);
    });

    it("should return 404 when updating non-existent product", async () => {
      const fakeId = "507f1f77bcf86cd799439011";

      const response = await agent
        .put(`/api/products/${fakeId}`)
        .send({ title: "Updated" });

      expect(response.status).toBe(404);
    });
  });

  describe("DELETE /api/products/:id", () => {
    it("should delete a product", async () => {
      const product = await createTestProduct();

      const response = await agent.delete(`/api/products/${product._id}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Product deleted successfully");

      // Verify it's actually deleted
      const getResponse = await agent.get(`/api/products/${product._id}`);
      expect(getResponse.status).toBe(404);
    });

    it("should return 404 when deleting non-existent product", async () => {
      const fakeId = "507f1f77bcf86cd799439011";

      const response = await agent.delete(`/api/products/${fakeId}`);

      expect(response.status).toBe(404);
    });
  });
});
