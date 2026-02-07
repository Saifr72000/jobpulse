import { body, check, param } from "express-validator";
import type { RequestHandler } from "express";

// For validating order creation
export const createOrderValidator: RequestHandler[] = [
  body("items")
    .isArray({ min: 1 })
    .withMessage("Order must have at least one item"),

  body("items.*.productId")
    .notEmpty()
    .withMessage("Product ID is required")
    .isMongoId()
    .withMessage("Invalid product ID format"),

  body("items.*.quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),

  body("shippingAddress")
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage("Shipping address must be between 5 and 200 characters")
    .escape(),

  body("notes")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Notes must not exceed 500 characters")
    .escape(),
];

// For validating order status update
export const updateOrderStatusValidator: RequestHandler[] = [
  param("id")
    .isMongoId()
    .withMessage("Invalid order ID format"),

  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["pending", "processing", "shipped", "delivered", "cancelled"])
    .withMessage("Invalid status value"),
];

// For validating order ID parameter
export const orderIdValidator: RequestHandler[] = [
  param("id")
    .isMongoId()
    .withMessage("Invalid order ID format"),
];
