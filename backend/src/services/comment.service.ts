import { Comment, type IComment, type CommentRole } from "../models/comment.model.js";
import { Order } from "../models/order.model.js";

interface CreateCommentInput {
  orderId: string;
  message: string;
  role: CommentRole;
}

export const createComment = async (
  authorUserId: string,
  input: CreateCommentInput
): Promise<IComment> => {
  const order = await Order.findById(input.orderId).lean();
  if (!order) {
    throw new Error("Order not found");
  }

  const comment = new Comment({
    order: order._id,
    author: authorUserId,
    role: input.role,
    message: input.message,
  });

  await comment.save();

  const populated = await comment.populate("author", "firstName lastName");
  return populated;
};

export const getCommentsByOrder = async (
  orderId: string,
  page: number = 1,
  limit: number = 50
): Promise<{ comments: IComment[]; total: number; page: number; limit: number }> => {
  const skip = (page - 1) * limit;

  const [comments, total] = await Promise.all([
    Comment.find({ order: orderId })
      .populate("author", "firstName lastName")
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Comment.countDocuments({ order: orderId }),
  ]);

  return { comments: comments as unknown as IComment[], total, page, limit };
};
