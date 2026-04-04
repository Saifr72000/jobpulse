import { body, param } from "express-validator";
import type { RequestHandler } from "express";

export const createCreativeValidator: RequestHandler[] = [
  body("orderId")
    .notEmpty()
    .withMessage("orderId is required")
    .isMongoId()
    .withMessage("orderId must be a valid MongoDB ID"),

  body("headline")
    .notEmpty()
    .withMessage("headline is required")
    .isString()
    .withMessage("headline must be a string")
    .trim(),

  body("subline")
    .optional()
    .isString()
    .withMessage("subline must be a string")
    .trim(),

  body("url")
    .optional()
    .isURL()
    .withMessage("url must be a valid URL"),
];

export const updateCreativeStatusValidator: RequestHandler[] = [
  param("id")
    .isMongoId()
    .withMessage("Invalid creative ID format"),

  body("status")
    .notEmpty()
    .withMessage("status is required")
    .isIn(["pending", "approved"])
    .withMessage("status must be 'pending' or 'approved'"),
];

export const creativeIdValidator: RequestHandler[] = [
  param("id").isMongoId().withMessage("Invalid creative ID format"),
];

export const orderIdParamValidator: RequestHandler[] = [
  param("orderId").isMongoId().withMessage("Invalid order ID format"),
];
