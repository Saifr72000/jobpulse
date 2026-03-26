import { Router } from "express";
import { requestValidator } from "../middlewares/requestValidator.middleware.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import {
  createOrderCheckout,
  createValueCardCheckout,
  getValueCards,
  payOrderWithBalance,
  stripeWebhook,
} from "../controllers/payment.controller.js";
import {
  createOrderCheckoutValidator,
  createValueCardCheckoutValidator,
  payOrderWithBalanceValidator,
} from "../validators/payment.validator.js";

const router = Router();

router.get("/value-cards", authenticateUser, getValueCards);
router.post(
  "/orders/:orderId/checkout",
  authenticateUser,
  createOrderCheckoutValidator,
  requestValidator,
  createOrderCheckout
);
router.post(
  "/value-cards/checkout",
  authenticateUser,
  createValueCardCheckoutValidator,
  requestValidator,
  createValueCardCheckout
);
router.post(
  "/orders/:orderId/pay-with-balance",
  authenticateUser,
  payOrderWithBalanceValidator,
  requestValidator,
  payOrderWithBalance
);

// Stripe webhook must use express.raw and no auth middleware.
router.post("/webhook", stripeWebhook);

export default router;
