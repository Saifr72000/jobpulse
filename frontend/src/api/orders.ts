import api from "./axios";

export interface IOrderAssets {
  imageOption: string;
  leadAdDescription?: string;
  videoMaterials?: string;
  linkedinJobDescription?: string;
  linkedinScreeningQuestions?: string;
}

export interface IOrder {
  _id: string;
  campaignName: string;
  status: "awaiting-payment" | "pending" | "in-progress" | "completed";
  orderType: "custom" | "package";
  package?: "basic" | "medium" | "deluxe";
  channels: string[];
  addons: string[];
  assets: IOrderAssets;
  targetAudience: string;
  additionalNotes?: string;
  paymentMethod: string;
  totalAmount: number;
  orderedBy: { firstName: string; lastName: string; email: string };
  createdAt: string;
}

export const getOrderById = async (id: string): Promise<IOrder> => {
  const res = await api.get<IOrder>(`/orders/${id}`);
  return res.data;
};
