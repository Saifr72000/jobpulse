import { body, check } from "express-validator";
import type { RequestHandler } from "express";

// For validating input and sanization
export const registerUserValidator: RequestHandler[] = [
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

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at leasr 6 characters long"),
];

export const updateUserValidator = [
  check("firstName")
    .optional()
    .isString()
    .withMessage("First name must be a string"),
  check("lastName")
    .optional()
    .isString()
    .withMessage("Last name must be a string"),
  check("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must at least be 6 characters long"),
];

export const updateCurrentUserValidator: RequestHandler[] = [
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
];

export const changePasswordValidator: RequestHandler[] = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),

  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("New password must contain at least one uppercase letter, one lowercase letter, and one number"),

  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password is required")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
];