import { Router } from "express";
import {
  createProduct,
  getProductById,
  getAllProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import {
  createProductValidator,
  updateProductValidator,
} from "../validators/product.validator.js";
import { requestValidator } from "../middlewares/requestValidator.middleware.js";

const router = Router();

// Create product
router.post("/", createProductValidator, requestValidator, createProduct);

// Get all products (in stock)
router.get("/", getAllProducts);

// Get product by ID
router.get("/:id", getProductById);

// Update product
router.put("/:id", updateProductValidator, requestValidator, updateProduct);

// Delete product
router.delete("/:id", deleteProduct);

export default router;
