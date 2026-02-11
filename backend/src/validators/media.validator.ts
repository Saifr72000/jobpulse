import { body, param } from "express-validator";
import type { RequestHandler } from "express";

export const uploadMediaValidator: RequestHandler[] = [
  body("orderId")
    .optional()
    .isMongoId()
    .withMessage("Invalid order ID format"),
];

export const mediaIdValidator: RequestHandler[] = [
  param("id")
    .isMongoId()
    .withMessage("Invalid media ID format"),
];

export const companyIdValidator: RequestHandler[] = [
  param("companyId")
    .isMongoId()
    .withMessage("Invalid company ID format"),
];

export const orderIdParamValidator: RequestHandler[] = [
  param("orderId")
    .isMongoId()
    .withMessage("Invalid order ID format"),
];
