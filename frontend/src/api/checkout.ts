import api from "./axios";

export const createCheckoutSession = async (
  body: object,
): Promise<{ url: string }> => {
  const { data } = await api.post("/orders/checkout-session", body);
  return data;
};
