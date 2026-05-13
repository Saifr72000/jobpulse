import { Router } from "express";
import {
  createProduct,
  getProductById,
  getAllProducts,
  getProductsByType,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import {
  createProductValidator,
  updateProductValidator,
} from "../validators/product.validator.js";
import { requestValidator } from "../middlewares/requestValidator.middleware.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = Router();

// Create product
router.post(
  "/",
  authenticateUser,
  createProductValidator,
  requestValidator,
  createProduct
);

// Get all products (active only, optionally filter by type via query param ?type=package or ?type=service)
router.get("/", authenticateUser, getAllProducts);

// Get products by type (packages or services/channels)
router.get("/type/:type", authenticateUser, getProductsByType);

// Get product by ID
router.get("/:id", authenticateUser, getProductById);

// Update product
router.put(
  "/:id",
  authenticateUser,
  updateProductValidator,
  requestValidator,
  updateProduct
);

// Delete product
router.delete("/:id", authenticateUser, deleteProduct);

export default router;
