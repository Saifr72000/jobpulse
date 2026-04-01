import api from "./axios";

export interface IOrderAssets {
  imageOption: string;
  leadAdDescription?: string;
  videoMaterials?: string;
  linkedinJobDescription?: string;
  linkedinScreeningQuestions?: string;
}

export interface ILineItem {
  type: "package" | "channel" | "addon";
  name: string;
  price: number;
}

export interface IOrder {
  _id: string;
  campaignName: string;
  status: "awaiting-payment" | "pending" | "in-progress" | "completed";
  orderType: "custom" | "package";
  package?: "basic" | "medium" | "deluxe";
  channels: string[];
  addons: string[];
  lineItems: ILineItem[];
  assets: IOrderAssets;
  targetAudience: string;
  additionalNotes?: string;
  paymentMethod: string;
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  totalAmount: number;
  orderedBy: { firstName: string; lastName: string; email: string };
  createdAt: string;
}

export const getOrderById = async (id: string): Promise<IOrder> => {
  const res = await api.get<IOrder>(`/orders/${id}`);
  return res.data;
};
