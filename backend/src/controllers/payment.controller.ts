import type { NextFunction, Request, Response } from "express";
import Stripe from "stripe";
import * as paymentService from "../services/payment.service.js";

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    companyId?: string;
  };
}

export const getValueCards = (req: Request, res: Response) => {
  res.status(200).json(paymentService.listValueCards());
};

export const createOrderCheckout = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const orderId = String(req.params.orderId);
    const { successUrl, cancelUrl } = req.body;
    const checkout = await paymentService.createOrderCheckoutSession({
      orderId,
      successUrl,
      cancelUrl,
    });
    res.status(201).json(checkout);
  } catch (error) {
    if (error instanceof Error && error.message.includes("not found")) {
      res.status(404).json({ error: error.message });
      return;
    }
    next(error);
  }
};

export const createValueCardCheckout = async (
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

    const { cardId, paymentMethod, successUrl, cancelUrl } = req.body;
    const checkout = await paymentService.createValueCardCheckoutSession({
      userId,
      cardId,
      paymentMethod,
      successUrl,
      cancelUrl,
    });
    res.status(201).json(checkout);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("not found")) {
        res.status(404).json({ error: error.message });
        return;
      }
      if (error.message.includes("Invalid value card")) {
        res.status(400).json({ error: error.message });
        return;
      }
    }
    next(error);
  }
};

export const payOrderWithBalance = async (
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

    const result = await paymentService.payOrderWithValueCardBalance({
      orderId: String(req.params.orderId),
      userId,
    });
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("not found")) {
        res.status(404).json({ error: error.message });
        return;
      }
      if (
        error.message.includes("Insufficient value card balance") ||
        error.message.includes("already paid") ||
        error.message.includes("Forbidden")
      ) {
        res.status(400).json({ error: error.message });
        return;
      }
    }
    next(error);
  }
};

export const stripeWebhook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const signature = req.headers["stripe-signature"];
    if (!signature || Array.isArray(signature)) {
      res.status(400).json({ error: "Missing Stripe signature" });
      return;
    }

    const event = paymentService.constructWebhookEvent(req.body as Buffer, signature);
    if (event.type === "checkout.session.completed") {
      await paymentService.handleCheckoutSessionCompleted(
        event.data.object as Stripe.Checkout.Session
      );
    }
    res.status(200).json({ received: true });
  } catch (error) {
    next(error);
  }
};
