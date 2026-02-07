import { body, check } from "express-validator";
import type { RequestHandler } from "express";

// For validating company creation
export const createCompanyValidator: RequestHandler[] = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Company name is required")
    .isLength({ min: 2 })
    .withMessage("Company name must be at least 2 characters")
    .escape(),

  body("orgNumber")
    .notEmpty()
    .withMessage("Organization number is required")
    .isNumeric()
    .withMessage("Organization number must be a number"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),

  body("address")
    .optional()
    .trim()
    .isLength({ min: 5 })
    .withMessage("Address must be at least 5 characters")
    .escape(),

  body("phone")
    .optional()
    .trim()
    .matches(/^[0-9]{8,15}$/)
    .withMessage("Phone number must be 8-15 digits"),

  body("website")
    .optional()
    .trim()
    .isURL()
    .withMessage("Invalid website URL format"),
];

// For validating company updates
export const updateCompanyValidator: RequestHandler[] = [
  check("name")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Company name must be at least 2 characters")
    .escape(),

  check("orgNumber")
    .optional()
    .isNumeric()
    .withMessage("Organization number must be a number"),

  check("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),

  check("address")
    .optional()
    .trim()
    .isLength({ min: 5 })
    .withMessage("Address must be at least 5 characters")
    .escape(),

  check("phone")
    .optional()
    .trim()
    .matches(/^[0-9]{8,15}$/)
    .withMessage("Phone number must be 8-15 digits"),

  check("website")
    .optional()
    .trim()
    .isURL()
    .withMessage("Invalid website URL format"),
];
