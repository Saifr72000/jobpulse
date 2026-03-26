import type { Request, Response, NextFunction } from "express";
import * as orderService from "../services/order.service.js";
import type { OrderStatus } from "../models/order.model.js";

// Extended request type for authenticated requests
interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    companyId?: string;
  };
}

export const createOrder = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    const {
      orderType,
      package: packagePlan,
      channels,
      addons,
      campaignName,
      assets,
      targetAudience,
      additionalNotes,
      paymentMethod,
      totalAmount,
    } = req.body;

    const order = await orderService.createOrder(userId, {
      orderType,
      package: packagePlan,
      channels,
      addons,
      campaignName,
      assets,
      targetAudience,
      additionalNotes,
      paymentMethod,
      totalAmount,
    });

    res.status(201).json({
      _id: order._id,
      campaignName: order.campaignName,
      orderType: order.orderType,
      package: order.package,
      channels: order.channels,
      addons: order.addons,
      assets: order.assets,
      targetAudience: order.targetAudience,
      additionalNotes: order.additionalNotes,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      totalAmount: order.totalAmount,
      status: order.status,
      companyName: order.companyName,
      orgNumber: order.orgNumber,
      createdAt: order.createdAt,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("not found")) {
        res.status(404).json({ error: error.message });
        return;
      }
      if (error.message.includes("maximum of")) {
        res.status(400).json({ error: error.message });
        return;
      }
    }
    next(error);
  }
};

export const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = String(req.params.id);
    const order = await orderService.getOrderById(id);

    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 20;

    const result = await orderService.getMyOrders(userId, page, limit);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getOrdersByCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const companyId = String(req.params.companyId);
    const orders = await orderService.getOrdersByCompany(companyId);
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = String(req.params.id);
    const { status } = req.body as { status: OrderStatus };

    const order = await orderService.updateOrderStatus(id, status);

    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    res.status(200).json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = String(req.params.id);
    const order = await orderService.deleteOrder(id);

    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orders = await orderService.getAllOrders();
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};
