import { body, param } from "express-validator";
import type { RequestHandler } from "express";

export const createOrderCheckoutValidator: RequestHandler[] = [
  param("orderId").isMongoId().withMessage("Invalid orderId format"),
  body("successUrl").isURL().withMessage("successUrl must be a valid URL"),
  body("cancelUrl").isURL().withMessage("cancelUrl must be a valid URL"),
];

export const createValueCardCheckoutValidator: RequestHandler[] = [
  body("cardId")
    .isIn(["vc-100", "vc-250", "vc-400", "vc-650"])
    .withMessage("Invalid cardId"),
  body("paymentMethod")
    .isIn(["card-payment", "invoice"])
    .withMessage("paymentMethod must be 'card-payment' or 'invoice'"),
  body("successUrl").isURL().withMessage("successUrl must be a valid URL"),
  body("cancelUrl").isURL().withMessage("cancelUrl must be a valid URL"),
];

export const payOrderWithBalanceValidator: RequestHandler[] = [
  param("orderId").isMongoId().withMessage("Invalid orderId format"),
];
