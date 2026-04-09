import mongoose, { Document, Schema } from "mongoose";

export type OrderStatus = "awaiting-payment" | "pending" | "in-progress" | "active" | "completed";
export type OrderType = "custom" | "package";
export type PackagePlan = "basic" | "medium" | "deluxe";
export type Channel = string;
export type Addon = string;
export type ImageOption = "upload" | "media-library" | "team-suggest";
export type LeadAdDescription = "team-create" | "own";
export type VideoMaterials = "upload" | "media-library" | "combine";
export type LinkedinJobDescription = "team-create" | "own";
export type LinkedinScreeningQuestions = "team-create" | "own";
export type PaymentMethod = "value-card" | "card-payment" | "invoice";
export type LineItemType = "package" | "channel" | "addon";

export interface ILineItem {
  type: LineItemType;
  name: string;
  price: number;
}

export interface IOrderAssets {
  imageOption: ImageOption;
  imageMediaIds?: mongoose.Types.ObjectId[];
  leadAdDescription?: LeadAdDescription;
  leadAdDescriptionText?: string;
  videoMaterials?: VideoMaterials;
  videoMediaIds?: mongoose.Types.ObjectId[];
  linkedinJobDescription?: LinkedinJobDescription;
  linkedinJobDescriptionText?: string;
  linkedinScreeningQuestions?: LinkedinScreeningQuestions;
  linkedinScreeningQuestionsText?: string;
}

export interface IPlatformCampaign {
  platform: string;
  externalCampaignId: string;
  adAccountId?: string;
  startDate?: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
  campaignStatus?: "active" | "paused" | "completed" | "draft";
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
  lineItems: ILineItem[];
  campaignName: string;
  assets: IOrderAssets;
  targetAudience: string;
  additionalNotes?: string;
  paymentMethod: PaymentMethod;
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  totalAmount: number;
  status: OrderStatus;
  stripeSessionId?: string;
  // Platform campaign links (manually assigned by admin)
  platformCampaigns: IPlatformCampaign[];
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
    imageMediaIds: [{ type: Schema.Types.ObjectId, ref: "Media" }],
    leadAdDescription: {
      type: String,
      enum: ["team-create", "own"],
    },
    leadAdDescriptionText: { type: String },
    videoMaterials: {
      type: String,
      enum: ["upload", "media-library", "combine"],
    },
    videoMediaIds: [{ type: Schema.Types.ObjectId, ref: "Media" }],
    linkedinJobDescription: {
      type: String,
      enum: ["team-create", "own"],
    },
    linkedinJobDescriptionText: { type: String },
    linkedinScreeningQuestions: {
      type: String,
      enum: ["team-create", "own"],
    },
    linkedinScreeningQuestionsText: { type: String },
  },
  { _id: false }
);

const lineItemSchema = new Schema<ILineItem>(
  {
    type: {
      type: String,
      enum: ["package", "channel", "addon"],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
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
      required: true,
      validate: {
        validator: (channels: string[]) => channels.length > 0,
        message: "Order must have at least one channel",
      },
    },
    addons: {
      type: [String],
      default: [],
    },
    lineItems: {
      type: [lineItemSchema],
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
      default: "",
    },
    additionalNotes: {
      type: String,
    },
    paymentMethod: {
      type: String,
      enum: ["value-card", "card-payment", "invoice"],
      required: true,
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    vatRate: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
      default: 0.25,
    },
    vatAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["awaiting-payment", "pending", "in-progress", "active", "completed"],
      default: "pending",
    },
    stripeSessionId: {
      type: String,
    },
    platformCampaigns: {
      type: [
        new Schema<IPlatformCampaign>(
          {
            platform: { type: String, required: true },
            externalCampaignId: { type: String, required: true },
            adAccountId: { type: String },
            startDate: { type: String },
            endDate: { type: String },
            campaignStatus: {
              type: String,
              enum: ["active", "paused", "completed", "draft"],
            },
          },
          { _id: false }
        ),
      ],
      default: [],
    },
  },
  { timestamps: true }
);

// Index for faster company queries
orderSchema.index({ company: 1 });
orderSchema.index({ orderedBy: 1 });

export const Order = mongoose.model<IOrder>("Order", orderSchema);
