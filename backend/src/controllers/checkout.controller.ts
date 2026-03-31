import type { Request, Response, NextFunction } from "express";
import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";
import { Company } from "../models/company.model.js";
import * as orderService from "../services/order.service.js";
import { createCheckoutSession } from "../services/stripe.service.js";

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    companyId?: string;
  };
}

export const createCheckoutSessionHandler = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
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
      totalAmount,
    } = req.body;

    // Fetch user + company for email and denormalization
    const user = await User.findById(userId).lean();
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    const company = await Company.findById(user.company).lean();
    if (!company) {
      res.status(404).json({ error: "Company not found" });
      return;
    }

    // Create order with awaiting-payment status — will be activated by webhook
    const order = await orderService.createOrder(userId, {
      orderType,
      package: packagePlan,
      channels,
      addons: addons ?? [],
      campaignName,
      assets,
      targetAudience,
      additionalNotes,
      paymentMethod: "card-payment",
      totalAmount,
      status: "awaiting-payment",
    });

    const vat = Math.round(totalAmount * 0.25);
    const lineItems = [
      { name: `JobPulse Campaign — ${campaignName}`, amount: totalAmount },
      { name: "VAT (25%)", amount: vat },
    ];

    const clientUrl = process.env.CLIENT_URL ?? "http://localhost:5173";

    const session = await createCheckoutSession({
      orderId: order._id.toString(),
      lineItems,
      customerEmail: user.email,
      successUrl: `${clientUrl}/campaigns?payment=success`,
      cancelUrl: `${clientUrl}/new-campaign?step=4`,
    });

    // Store the Stripe session ID on the order
    await Order.findByIdAndUpdate(order._id, { stripeSessionId: session.id });

    res.status(200).json({ url: session.url });
  } catch (error) {
    next(error);
  }
};
