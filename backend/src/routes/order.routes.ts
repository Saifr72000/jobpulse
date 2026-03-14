import { Router } from "express";
import {
  createOrder,
  getOrderById,
  getOrdersByCompany,
  getMyOrders,
  updateOrderStatus,
  deleteOrder,
  getAllOrders,
} from "../controllers/order.controller.js";
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

// Get my orders — company-scoped, paginated (requires auth)
router.get("/my-orders", authenticateUser, getMyOrders);

// Get all orders (admin)
router.get("/", getAllOrders);

// Get orders by company
router.get("/company/:companyId", getOrdersByCompany);

// Get order by ID
router.get("/:id", orderIdValidator, requestValidator, getOrderById);

// Update order status
router.patch("/:id/status", updateOrderStatusValidator, requestValidator, updateOrderStatus);

// Delete order
router.delete("/:id", orderIdValidator, requestValidator, deleteOrder);

export default router;
