import api from "./axios";

export type CreativeStatus = "pending" | "approved";

export interface ICreative {
  _id: string;
  order: string;
  company: string;
  status: CreativeStatus;
  headline: string;
  subline?: string;
  url?: string;
  uploadedBy: { firstName: string; lastName: string };
  createdAt: string;
  updatedAt: string;
}

export const getCreativesByOrder = async (orderId: string): Promise<ICreative[]> => {
  const { data } = await api.get<ICreative[]>(`/creatives/order/${orderId}`);
  return data;
};

export const approveCreative = async (creativeId: string): Promise<ICreative> => {
  const { data } = await api.patch<ICreative>(`/creatives/${creativeId}/status`, {
    status: "approved",
  });
  return data;
};
