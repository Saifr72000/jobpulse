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

const router = Router();

// Create campaign order (requires auth)
router.post("/", authenticateUser, createOrderValidator, requestValidator, createOrder);

// Create Stripe Checkout Session for card payment (requires auth)
router.post("/checkout-session", authenticateUser, createCheckoutSessionHandler);

// Get my orders — company-scoped, paginated (requires auth)
router.get("/my-orders", authenticateUser, getMyOrders);

// Get all orders (admin)
router.get("/", getAllOrders);

// Get orders by company
router.get("/company/:companyId", getOrdersByCompany);

// Download invoice PDF for an order (auth required) — must be before /:id
router.get("/:id/invoice", authenticateUser, orderIdValidator, requestValidator, downloadInvoice);

// Get order by ID
router.get("/:id", orderIdValidator, requestValidator, getOrderById);

// Update order status
router.patch("/:id/status", updateOrderStatusValidator, requestValidator, updateOrderStatus);

// Update platform campaigns on an order
router.patch("/:id/campaigns", authenticateUser, updateOrderCampaigns);

// Delete order
router.delete("/:id", orderIdValidator, requestValidator, deleteOrder);

export default router;
