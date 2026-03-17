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

  check("website")
    .optional()
    .trim()
    .isURL()
    .withMessage("Invalid website URL format"),
];

// For validating adding user to company
export const addUserToCompanyValidator: RequestHandler[] = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/)
    .withMessage("First name can only contain letters, spaces, hyphens, and apostrophes")
    .isLength({ min: 1, max: 50 })
    .withMessage("First name must be between 1 and 50 characters"),

  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name is required")
    .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/)
    .withMessage("Last name can only contain letters, spaces, hyphens, and apostrophes")
    .isLength({ min: 1, max: 50 })
    .withMessage("Last name must be between 1 and 50 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),
];
