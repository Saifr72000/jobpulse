import { body } from "express-validator";
import type { RequestHandler } from "express";

/**
 * Validator for set-password endpoint
 * Used when user clicks invitation link and sets their password
 */
export const setPasswordValidator: RequestHandler[] = [
  body("token")
    .trim()
    .notEmpty()
    .withMessage("Token is required"),

  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Password must contain at least one uppercase letter, one lowercase letter, and one number"),

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
