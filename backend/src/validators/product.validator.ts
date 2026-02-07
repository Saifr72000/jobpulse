import { body, check } from "express-validator";
import type { RequestHandler } from "express";

// For validating product creation
export const createProductValidator: RequestHandler[] = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Product name must be between 2 and 100 characters")
    .escape(),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description must not exceed 500 characters")
    .escape(),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

  body("category")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Category must be between 2 and 50 characters")
    .escape(),

  body("sku")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("SKU must be between 2 and 50 characters"),

  body("inStock")
    .optional()
    .isBoolean()
    .withMessage("inStock must be a boolean"),
];

// For validating product updates
export const updateProductValidator: RequestHandler[] = [
  check("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Product name must be between 2 and 100 characters")
    .escape(),

  check("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description must not exceed 500 characters")
    .escape(),

  check("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

  check("category")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Category must be between 2 and 50 characters")
    .escape(),

  check("sku")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("SKU must be between 2 and 50 characters"),

  check("inStock")
    .optional()
    .isBoolean()
    .withMessage("inStock must be a boolean"),
];
