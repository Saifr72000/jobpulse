import mongoose, { Document, Schema } from "mongoose";

// Order status types
export type OrderStatus = "pending" | "in-progress" | "completed";

// Order item interface
export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  productName: string; // Denormalized for easy viewing
  quantity: number;
  priceAtPurchase: number; // Price snapshot at time of order
}

export interface IOrder extends Document {
  _id: mongoose.Types.ObjectId;
  // Company reference + denormalized fields for easy viewing
  company: mongoose.Types.ObjectId;
  companyName: string;
  orgNumber: number;
  // User who placed the order
  orderedBy: mongoose.Types.ObjectId;
  // Order details
  items: IOrderItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingAddress?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    priceAtPurchase: {
      type: Number,
      required: true,
    },
  },
  { _id: false } // Don't create _id for subdocuments
);

const orderSchema = new Schema<IOrder>(
  {
    // Company reference + denormalized fields
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    orgNumber: {
      type: Number,
      required: true,
    },
    // User who placed the order
    orderedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Order details
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (items: IOrderItem[]) => items.length > 0,
        message: "Order must have at least one item",
      },
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    shippingAddress: {
      type: String,
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

// Index for faster company queries
orderSchema.index({ company: 1 });
orderSchema.index({ orderedBy: 1 });

export const Order = mongoose.model<IOrder>("Order", orderSchema);
