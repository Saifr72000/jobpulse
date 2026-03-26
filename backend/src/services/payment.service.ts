import Stripe from "stripe";
import { Order } from "../models/order.model.js";
import { Company } from "../models/company.model.js";
import { User } from "../models/user.model.js";
import { ValueCardPurchase } from "../models/valueCardPurchase.model.js";

const STRIPE_API_VERSION: Stripe.LatestApiVersion = "2026-03-25.dahlia";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!stripeSecretKey) {
  console.warn("STRIPE_SECRET_KEY is not set. Stripe endpoints will fail until configured.");
}

const stripe = new Stripe(stripeSecretKey || "sk_test_placeholder", {
  apiVersion: STRIPE_API_VERSION,
});

const VALUE_CARDS = [
  { id: "vc-100", name: "Value 100 000", price: 90000, balance: 100000 },
  { id: "vc-250", name: "Value 250 000", price: 222500, balance: 250000 },
  { id: "vc-400", name: "Value 400 000", price: 352000, balance: 400000 },
  { id: "vc-650", name: "Value 650 000", price: 565500, balance: 650000 },
] as const;

type ValueCardId = (typeof VALUE_CARDS)[number]["id"];
type CheckoutKind = "order" | "value-card";

const toMinorUnits = (amountNok: number) => Math.round(amountNok * 100);

export const listValueCards = () => VALUE_CARDS;

export const createOrderCheckoutSession = async (input: {
  orderId: string;
  successUrl: string;
  cancelUrl: string;
}) => {
  const order = await Order.findById(input.orderId);
  if (!order) {
    throw new Error("Order not found");
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: input.successUrl,
    cancel_url: input.cancelUrl,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "nok",
          unit_amount: toMinorUnits(order.totalAmount),
          product_data: {
            name: `Order ${order.campaignName}`,
            description: `Campaign order ${order._id.toString()}`,
          },
        },
      },
    ],
    metadata: {
      kind: "order",
      orderId: order._id.toString(),
      companyId: order.company.toString(),
    },
  });

  order.paymentMethod = "card-payment";
  order.stripeCheckoutSessionId = session.id;
  order.paymentStatus = "pending";
  await order.save();

  return { url: session.url, sessionId: session.id };
};

export const createValueCardCheckoutSession = async (input: {
  userId: string;
  cardId: string;
  paymentMethod: "card-payment" | "invoice";
  successUrl: string;
  cancelUrl: string;
}) => {
  const user = await User.findById(input.userId).lean();
  if (!user) {
    throw new Error("User not found");
  }

  const selectedCard = VALUE_CARDS.find((card) => card.id === (input.cardId as ValueCardId));
  if (!selectedCard) {
    throw new Error("Invalid value card");
  }

  const purchase = await ValueCardPurchase.create({
    company: user.company,
    orderedBy: user._id,
    cardId: selectedCard.id,
    cardName: selectedCard.name,
    price: selectedCard.price,
    balanceCredit: selectedCard.balance,
    paymentMethod: input.paymentMethod,
    paymentStatus: "pending",
  });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: input.successUrl,
    cancel_url: input.cancelUrl,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "nok",
          unit_amount: toMinorUnits(selectedCard.price),
          product_data: {
            name: selectedCard.name,
            description: `Gives ${selectedCard.balance.toLocaleString("nb-NO")} kr in platform balance`,
          },
        },
      },
    ],
    metadata: {
      kind: "value-card",
      valueCardPurchaseId: purchase._id.toString(),
      companyId: user.company.toString(),
      paymentMethod: input.paymentMethod,
    },
  });

  purchase.stripeCheckoutSessionId = session.id;
  await purchase.save();

  return { url: session.url, sessionId: session.id, purchaseId: purchase._id.toString() };
};

export const payOrderWithValueCardBalance = async (input: { orderId: string; userId: string }) => {
  const user = await User.findById(input.userId).lean();
  if (!user) {
    throw new Error("User not found");
  }

  const order = await Order.findById(input.orderId);
  if (!order) {
    throw new Error("Order not found");
  }
  if (order.company.toString() !== user.company.toString()) {
    throw new Error("Forbidden");
  }
  if (order.paymentStatus === "paid") {
    throw new Error("Order is already paid");
  }

  const company = await Company.findById(user.company);
  if (!company) {
    throw new Error("Company not found");
  }
  if ((company.valueCardBalance ?? 0) < order.totalAmount) {
    throw new Error("Insufficient value card balance");
  }

  company.valueCardBalance = (company.valueCardBalance ?? 0) - order.totalAmount;
  order.paymentMethod = "value-card";
  order.paymentStatus = "paid";
  order.paidAt = new Date();

  await Promise.all([company.save(), order.save()]);

  return {
    orderId: order._id.toString(),
    paymentStatus: order.paymentStatus,
    companyBalance: company.valueCardBalance,
  };
};

export const constructWebhookEvent = (payload: Buffer, signature: string) => {
  if (!stripeWebhookSecret) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not configured");
  }
  return stripe.webhooks.constructEvent(payload, signature, stripeWebhookSecret);
};

const markValueCardPurchasePaid = async (purchaseId: string) => {
  const purchase = await ValueCardPurchase.findById(purchaseId);
  if (!purchase || purchase.paymentStatus === "paid") {
    return;
  }

  const company = await Company.findById(purchase.company);
  if (!company) {
    throw new Error("Company not found");
  }

  purchase.paymentStatus = "paid";
  purchase.paidAt = new Date();
  company.valueCardBalance = (company.valueCardBalance ?? 0) + purchase.balanceCredit;

  await Promise.all([purchase.save(), company.save()]);
};

const markOrderPaid = async (orderId: string) => {
  const order = await Order.findById(orderId);
  if (!order || order.paymentStatus === "paid") {
    return;
  }

  order.paymentStatus = "paid";
  order.paidAt = new Date();
  order.paymentMethod = "card-payment";
  await order.save();
};

export const handleCheckoutSessionCompleted = async (
  session: Stripe.Checkout.Session
) => {
  const kind = session.metadata?.kind as CheckoutKind | undefined;
  if (kind === "value-card" && session.metadata?.valueCardPurchaseId) {
    await markValueCardPurchasePaid(session.metadata.valueCardPurchaseId);
    return;
  }
  if (kind === "order" && session.metadata?.orderId) {
    await markOrderPaid(session.metadata.orderId);
  }
};
