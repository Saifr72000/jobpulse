import mongoose, { Document, Schema } from "mongoose";

export type ValueCardPurchaseStatus = "pending" | "paid" | "failed";

export interface IValueCardPurchase extends Document {
  _id: mongoose.Types.ObjectId;
  company: mongoose.Types.ObjectId;
  orderedBy: mongoose.Types.ObjectId;
  cardId: string;
  cardName: string;
  price: number;
  balanceCredit: number;
  paymentMethod: "card-payment" | "invoice";
  paymentStatus: ValueCardPurchaseStatus;
  stripeCheckoutSessionId?: string;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const valueCardPurchaseSchema = new Schema<IValueCardPurchase>(
  {
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    orderedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cardId: {
      type: String,
      required: true,
    },
    cardName: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    balanceCredit: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      enum: ["card-payment", "invoice"],
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
  },
  { timestamps: true }
);

valueCardPurchaseSchema.index({ company: 1, createdAt: -1 });
valueCardPurchaseSchema.index({ stripeCheckoutSessionId: 1 });

export const ValueCardPurchase = mongoose.model<IValueCardPurchase>(
  "ValueCardPurchase",
  valueCardPurchaseSchema
);
