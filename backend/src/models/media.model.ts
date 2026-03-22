import mongoose, { Document, Schema } from "mongoose";

export interface IMedia extends Document {
  _id: mongoose.Types.ObjectId;
  companyId: mongoose.Types.ObjectId;
  uploadedBy: mongoose.Types.ObjectId;
  orderId?: mongoose.Types.ObjectId;
  folderId?: mongoose.Types.ObjectId;
  s3Key: string;
  originalFilename: string;
  mimetype: string;
  size: number;
  createdAt: Date;
  updatedAt: Date;
}

const mediaSchema = new Schema<IMedia>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: false,
    },
    folderId: {
      type: Schema.Types.ObjectId,
      ref: "Folder",
      required: false,
      default: null,
    },
    s3Key: {
      type: String,
      required: true,
    },
    originalFilename: {
      type: String,
      required: true,
    },
    mimetype: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

mediaSchema.index({ companyId: 1 });
mediaSchema.index({ uploadedBy: 1 });
mediaSchema.index({ orderId: 1 });
mediaSchema.index({ folderId: 1 });

export const Media = mongoose.model<IMedia>("Media", mediaSchema);
