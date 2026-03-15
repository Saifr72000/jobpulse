import { body, check } from "express-validator";
import type { RequestHandler } from "express";

// For validating product creation
export const createProductValidator: RequestHandler[] = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Product title is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Product title must be between 2 and 100 characters")
    .escape(),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description must not exceed 1000 characters")
    .escape(),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

  body("type")
    .notEmpty()
    .withMessage("Product type is required")
    .isIn(["package", "service", "addon"])
    .withMessage("Product type must be 'package', 'service', or 'addon'"),

  body("logo")
    .optional()
    .trim()
    .isURL()
    .withMessage("Logo must be a valid URL"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
];

// For validating product updates
export const updateProductValidator: RequestHandler[] = [
  check("title")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Product title must be between 2 and 100 characters")
    .escape(),

  check("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description must not exceed 1000 characters")
    .escape(),

  check("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

  check("type")
    .optional()
    .isIn(["package", "service", "addon"])
    .withMessage("Product type must be 'package', 'service', or 'addon'"),

  check("logo")
    .optional()
    .trim()
    .isURL()
    .withMessage("Logo must be a valid URL"),

  check("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
];
