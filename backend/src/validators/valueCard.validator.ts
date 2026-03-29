import { body } from "express-validator";

const TIER_IDS = ["vc-100", "vc-250", "vc-400", "vc-650"];

export const purchaseValueCardValidator = [
  body("tierId")
    .isString()
    .trim()
    .isIn(TIER_IDS)
    .withMessage("tierId must be a valid value card tier"),
];
