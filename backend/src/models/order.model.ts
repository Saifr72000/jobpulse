import mongoose, { Document, Schema } from "mongoose";

export type OrderStatus = "pending" | "in-progress" | "completed";
export type OrderType = "custom" | "package";
export type PackagePlan = "basic" | "medium" | "deluxe";
export type Channel = "linkedin" | "facebook" | "google" | "snapchat" | "instagram" | "x";
export type Addon = "lead-ads" | "video-campaign" | "linkedin-job-posting";
export type ImageOption = "upload" | "media-library" | "team-suggest";
export type LeadAdDescription = "team-create" | "own";
export type VideoMaterials = "upload" | "media-library" | "combine";
export type LinkedinJobDescription = "team-create" | "own";
export type LinkedinScreeningQuestions = "team-create" | "own";
export type PaymentMethod = "value-card" | "card-payment" | "invoice";
export type PaymentStatus = "pending" | "paid" | "failed";

export interface IOrderAssets {
  imageOption: ImageOption;
  leadAdDescription?: LeadAdDescription;
  videoMaterials?: VideoMaterials;
  linkedinJobDescription?: LinkedinJobDescription;
  linkedinScreeningQuestions?: LinkedinScreeningQuestions;
}

export interface IOrder extends Document {
  _id: mongoose.Types.ObjectId;
  // Company reference + denormalized fields
  company: mongoose.Types.ObjectId;
  companyName: string;
  orgNumber: number;
  // User who placed the order
  orderedBy: mongoose.Types.ObjectId;
  // Campaign fields
  orderType: OrderType;
  package?: PackagePlan;
  channels: Channel[];
  addons: Addon[];
  campaignName: string;
  assets: IOrderAssets;
  targetAudience: string;
  additionalNotes?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  stripeCheckoutSessionId?: string;
  paidAt?: Date;
  totalAmount: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

const orderAssetsSchema = new Schema<IOrderAssets>(
  {
    imageOption: {
      type: String,
      enum: ["upload", "media-library", "team-suggest"],
      required: true,
    },
    leadAdDescription: {
      type: String,
      enum: ["team-create", "own"],
    },
    videoMaterials: {
      type: String,
      enum: ["upload", "media-library", "combine"],
    },
    linkedinJobDescription: {
      type: String,
      enum: ["team-create", "own"],
    },
    linkedinScreeningQuestions: {
      type: String,
      enum: ["team-create", "own"],
    },
  },
  { _id: false }
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
    // Campaign fields
    orderType: {
      type: String,
      enum: ["custom", "package"],
      required: true,
    },
    package: {
      type: String,
      enum: ["basic", "medium", "deluxe"],
    },
    channels: {
      type: [String],
      enum: ["linkedin", "facebook", "google", "snapchat", "instagram", "x"],
      required: true,
      validate: {
        validator: (channels: string[]) => channels.length > 0,
        message: "Order must have at least one channel",
      },
    },
    addons: {
      type: [String],
      enum: ["lead-ads", "video-campaign", "linkedin-job-posting"],
      default: [],
    },
    campaignName: {
      type: String,
      required: true,
    },
    assets: {
      type: orderAssetsSchema,
      required: true,
    },
    targetAudience: {
      type: String,
      required: true,
    },
    additionalNotes: {
      type: String,
    },
    paymentMethod: {
      type: String,
      enum: ["value-card", "card-payment", "invoice"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    stripeCheckoutSessionId: {
      type: String,
    },
    paidAt: {
      type: Date,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Index for faster company queries
orderSchema.index({ company: 1 });
orderSchema.index({ orderedBy: 1 });

export const Order = mongoose.model<IOrder>("Order", orderSchema);
