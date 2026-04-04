import { body, param, query } from "express-validator";
import type { RequestHandler } from "express";

export const createCommentValidator: RequestHandler[] = [
  param("orderId")
    .isMongoId()
    .withMessage("Invalid order ID format"),

  body("message")
    .notEmpty()
    .withMessage("message is required")
    .isString()
    .withMessage("message must be a string")
    .trim(),

  body("role")
    .notEmpty()
    .withMessage("role is required")
    .isIn(["client", "admin"])
    .withMessage("role must be 'client' or 'admin'"),
];

export const getCommentsValidator: RequestHandler[] = [
  param("orderId")
    .isMongoId()
    .withMessage("Invalid order ID format"),

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("limit must be between 1 and 100"),
];
