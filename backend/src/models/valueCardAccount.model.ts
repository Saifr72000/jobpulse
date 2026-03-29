import mongoose, { Document, Schema } from "mongoose";

export interface IValueCardAccount extends Document {
  _id: mongoose.Types.ObjectId;
  company: mongoose.Types.ObjectId;
  remainingBalance: number;
  cardName: string;
  purchasedAt: Date;
  purchasedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const valueCardAccountSchema = new Schema<IValueCardAccount>(
  {
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      unique: true,
    },
    remainingBalance: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    cardName: {
      type: String,
      required: true,
    },
    purchasedAt: {
      type: Date,
      required: true,
    },
    purchasedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

valueCardAccountSchema.index({ company: 1 });

export const ValueCardAccount = mongoose.model<IValueCardAccount>(
  "ValueCardAccount",
  valueCardAccountSchema
);
