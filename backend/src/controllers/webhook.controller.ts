import type { Request, Response } from "express";
import { stripe } from "../services/stripe.service.js";
import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";
import { Company } from "../models/company.model.js";
import { sendInvoiceEmail } from "../services/email.service.js";

export const stripeWebhookHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? "";

  if (!sig) {
    res.status(400).json({ error: "Missing Stripe signature" });
    return;
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    console.error("Stripe webhook signature verification failed:", message);
    res.status(400).json({ error: `Webhook error: ${message}` });
    return;
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;

    if (!orderId) {
      console.error("Stripe webhook: missing orderId in session metadata");
      res.status(400).json({ error: "Missing orderId in metadata" });
      return;
    }

    try {
      // Activate the order
      const order = await Order.findByIdAndUpdate(
        orderId,
        { status: "pending" },
        { new: true },
      ).populate<{ orderedBy: { _id: string; firstName: string; lastName: string; email: string } }>(
        "orderedBy",
        "firstName lastName email",
      );

      if (!order) {
        console.error(`Stripe webhook: order ${orderId} not found`);
        res.status(404).json({ error: "Order not found" });
        return;
      }

      const company = await Company.findById(order.company).lean();

      // Send branded invoice email via Resend
      const subtotal = order.totalAmount;
      const vat = Math.round(subtotal * 0.25);
      const total = subtotal + vat;

      const orderLines = [
        ...(order.package ? [{ name: `Package: ${order.package}`, price: subtotal }] : []),
        ...order.channels.map((c) => ({ name: c, price: 0 })),
        ...order.addons.map((a) => ({ name: a, price: 0 })),
      ];

      await sendInvoiceEmail({
        email: order.orderedBy.email,
        customerName: `${order.orderedBy.firstName} ${order.orderedBy.lastName}`,
        companyName: company?.name ?? order.companyName,
        orderId: order._id.toString(),
        orderDate: order.createdAt,
        campaignName: order.campaignName,
        orderLines,
        subtotal,
        vat,
        total,
      });

      console.log(`Order ${orderId} activated and invoice sent`);
    } catch (err) {
      console.error("Stripe webhook: failed to process checkout.session.completed:", err);
      // Return 200 to prevent Stripe from retrying for non-retriable errors
      res.status(200).json({ received: true });
      return;
    }
  }

  res.status(200).json({ received: true });
};
