import api from "./axios";

export type CommentRole = "client" | "admin";

export interface IComment {
  _id: string;
  order: string;
  author: { firstName: string; lastName: string };
  role: CommentRole;
  message: string;
  isRead: boolean;
  notificationSent: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedComments {
  comments: IComment[];
  total: number;
  page: number;
  limit: number;
}

export const getCommentsByOrder = async (
  orderId: string,
  page = 1,
  limit = 50
): Promise<PaginatedComments> => {
  const { data } = await api.get<PaginatedComments>(`/comments/order/${orderId}`, {
    params: { page, limit },
  });
  return data;
};

export const postComment = async (
  orderId: string,
  message: string,
  role: CommentRole = "client"
): Promise<IComment> => {
  const { data } = await api.post<IComment>(`/comments/order/${orderId}`, {
    message,
    role,
  });
  return data;
};
