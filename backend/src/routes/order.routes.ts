import { Router } from "express";
import {
  createOrder,
  getOrderById,
  getOrdersByCompany,
  getMyOrders,
  updateOrderStatus,
  updateOrderCampaigns,
  deleteOrder,
  getAllOrders,
} from "../controllers/order.controller.js";
import { createCheckoutSessionHandler } from "../controllers/checkout.controller.js";
import { downloadInvoice } from "../controllers/invoice.controller.js";
import {
  createOrderValidator,
  updateOrderStatusValidator,
  orderIdValidator,
} from "../validators/order.validator.js";
import { requestValidator } from "../middlewares/requestValidator.middleware.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import {
  requireOrderAccess,
  requireSameCompany,
} from "../middlewares/authorization.middleware.js";
import { requireAdmin } from "../middlewares/requireAdmin.middleware.js";

const router = Router();

// Create campaign order (requires auth)
router.post("/", authenticateUser, createOrderValidator, requestValidator, createOrder);

// Create Stripe Checkout Session for card payment (requires auth)
router.post("/checkout-session", authenticateUser, createCheckoutSessionHandler);

// Get my orders — company-scoped, paginated (requires auth)
router.get("/my-orders", authenticateUser, getMyOrders);

// Get all orders (platform admin only)
router.get("/", authenticateUser, requireAdmin, getAllOrders);

// Get orders by company — same company or admin
router.get(
  "/company/:companyId",
  authenticateUser,
  requireSameCompany,
  getOrdersByCompany,
);

// Download invoice PDF for an order (auth required) — must be before /:id
router.get(
  "/:id/invoice",
  authenticateUser,
  requireOrderAccess("id"),
  orderIdValidator,
  requestValidator,
  downloadInvoice,
);

// Get order by ID
router.get(
  "/:id",
  authenticateUser,
  requireOrderAccess("id"),
  orderIdValidator,
  requestValidator,
  getOrderById,
);

// Update order status
router.patch(
  "/:id/status",
  authenticateUser,
  requireOrderAccess("id"),
  updateOrderStatusValidator,
  requestValidator,
  updateOrderStatus,
);

// Update platform campaigns on an order
router.patch(
  "/:id/campaigns",
  authenticateUser,
  requireOrderAccess("id"),
  updateOrderCampaigns,
);

// Delete order
router.delete(
  "/:id",
  authenticateUser,
  requireOrderAccess("id"),
  orderIdValidator,
  requestValidator,
  deleteOrder,
);

export default router;
