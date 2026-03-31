import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");

interface LineItem {
  name: string;
  amount: number; // in NOK (not øre)
}

interface CreateCheckoutSessionParams {
  orderId: string;
  lineItems: LineItem[];
  customerEmail: string;
  successUrl: string;
  cancelUrl: string;
}

export const createCheckoutSession = async (
  params: CreateCheckoutSessionParams,
): Promise<Stripe.Checkout.Session> => {
  return stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: params.customerEmail,
    line_items: params.lineItems.map((item) => ({
      price_data: {
        currency: "nok",
        unit_amount: Math.round(item.amount * 100), // convert to øre
        product_data: { name: item.name },
      },
      quantity: 1,
    })),
    metadata: { orderId: params.orderId },
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
  });
};
