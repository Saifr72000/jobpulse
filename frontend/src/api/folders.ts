import api from "./axios";

export interface Folder {
  _id: string;
  name: string;
  companyId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export const getFoldersByCompany = async (companyId: string): Promise<Folder[]> => {
  const { data } = await api.get(`/folders/company/${companyId}`);
  return data;
};
