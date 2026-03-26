import api from "./axios";

export interface CheckoutResponse {
  url: string | null;
  sessionId: string;
}

export const createValueCardCheckout = async (input: {
  cardId: string;
  paymentMethod: "card-payment" | "invoice";
  successUrl: string;
  cancelUrl: string;
}): Promise<CheckoutResponse> => {
  const response = await api.post("/payments/value-cards/checkout", input);
  return response.data;
};

export const createOrderCheckout = async (input: {
  orderId: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<CheckoutResponse> => {
  const response = await api.post(`/payments/orders/${input.orderId}/checkout`, {
    successUrl: input.successUrl,
    cancelUrl: input.cancelUrl,
  });
  return response.data;
};

export const payOrderWithBalance = async (orderId: string) => {
  const response = await api.post(`/payments/orders/${orderId}/pay-with-balance`);
  return response.data;
};
