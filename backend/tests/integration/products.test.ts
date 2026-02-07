import request from "supertest";
import app from "../../src/app.js";
import { createTestProduct, createTestProducts } from "../helpers/testData.helper.js";

describe("Products API", () => {
  describe("POST /api/products", () => {
    it("should create a new product", async () => {
      const productData = {
        name: "New Widget",
        price: 49.99,
        description: "A brand new widget",
        category: "Electronics",
        sku: "WDG-NEW-001",
      };

      const response = await request(app)
        .post("/api/products")
        .send(productData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Product created successfully");
      expect(response.body.product.name).toBe(productData.name);
      expect(response.body.product.price).toBe(productData.price);
      expect(response.body.product._id).toBeDefined();
    });

    it("should fail when name is missing", async () => {
      const response = await request(app)
        .post("/api/products")
        .send({ price: 29.99 });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it("should fail when price is negative", async () => {
      const response = await request(app)
        .post("/api/products")
        .send({ name: "Bad Product", price: -10 });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe("GET /api/products", () => {
    it("should return empty array when no products exist", async () => {
      const response = await request(app).get("/api/products");

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it("should return all in-stock products", async () => {
      // Create test products
      await createTestProducts(3);

      const response = await request(app).get("/api/products");

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(3);
      expect(response.body[0].name).toBe("Product 1");
    });
  });

  describe("GET /api/products/:id", () => {
    it("should return a product by ID", async () => {
      const product = await createTestProduct({ name: "Specific Product" });

      const response = await request(app).get(`/api/products/${product._id}`);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe("Specific Product");
    });

    it("should return 404 for non-existent product", async () => {
      const fakeId = "507f1f77bcf86cd799439011";

      const response = await request(app).get(`/api/products/${fakeId}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Product not found");
    });
  });

  describe("PUT /api/products/:id", () => {
    it("should update a product", async () => {
      const product = await createTestProduct({ name: "Old Name", price: 10 });

      const response = await request(app)
        .put(`/api/products/${product._id}`)
        .send({ name: "New Name", price: 20 });

      expect(response.status).toBe(200);
      expect(response.body.product.name).toBe("New Name");
      expect(response.body.product.price).toBe(20);
    });

    it("should return 404 when updating non-existent product", async () => {
      const fakeId = "507f1f77bcf86cd799439011";

      const response = await request(app)
        .put(`/api/products/${fakeId}`)
        .send({ name: "Updated" });

      expect(response.status).toBe(404);
    });
  });

  describe("DELETE /api/products/:id", () => {
    it("should delete a product", async () => {
      const product = await createTestProduct();

      const response = await request(app).delete(`/api/products/${product._id}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Product deleted successfully");

      // Verify it's actually deleted
      const getResponse = await request(app).get(`/api/products/${product._id}`);
      expect(getResponse.status).toBe(404);
    });

    it("should return 404 when deleting non-existent product", async () => {
      const fakeId = "507f1f77bcf86cd799439011";

      const response = await request(app).delete(`/api/products/${fakeId}`);

      expect(response.status).toBe(404);
    });
  });
});
