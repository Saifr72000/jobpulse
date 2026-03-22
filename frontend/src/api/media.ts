import api from "./axios";

export interface MediaItem {
  _id: string;
  originalFilename: string;
  mimetype: string;
  size: number;
  url: string;
  s3Key: string;
  folderId?: string;
  orderId?: string;
  companyId: string;
  createdAt: string;
}

export interface PaginatedMedia {
  data: MediaItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const getMediaByFolder = async (
  folderId: string,
  page = 1,
  limit = 20
): Promise<PaginatedMedia> => {
  const { data } = await api.get(`/media/folder/${folderId}`, {
    params: { page, limit },
  });
  return data;
};

export const uploadFiles = async (files: File[], folderId?: string): Promise<void> => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  if (folderId) formData.append("folderId", folderId);
  await api.post("/media", formData);
};

export const deleteMedia = async (mediaId: string): Promise<void> => {
  await api.delete(`/media/${mediaId}`);
};
