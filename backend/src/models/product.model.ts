import mongoose, { Document, Schema } from "mongoose";

export type ProductType = "package" | "service" | "addon";

export interface IProduct extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  price: number;
  type: ProductType;
  channelLimit?: number;
  features?: string[];
  logo?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    type: {
      type: String,
      required: true,
      enum: ["package", "service", "addon"],
    },
    channelLimit: {
      type: Number,
      min: 1,
    },
    features: {
      type: [String],
      default: [],
    },
    logo: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

// Index for filtering by type
productSchema.index({ type: 1, isActive: 1 });

export const Product = mongoose.model<IProduct>("Product", productSchema);
