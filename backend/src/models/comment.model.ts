import mongoose, { Document, Schema } from "mongoose";

export type CommentRole = "client" | "admin";

export interface IComment extends Document {
  _id: mongoose.Types.ObjectId;
  order: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  role: CommentRole;
  message: string;
  isRead: boolean;
  notificationSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["client", "admin"],
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    notificationSent: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

commentSchema.index({ order: 1, createdAt: 1 });

export const Comment = mongoose.model<IComment>("Comment", commentSchema);
