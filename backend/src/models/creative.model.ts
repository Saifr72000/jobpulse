import mongoose, { Document, Schema } from "mongoose";

export type CreativeStatus = "pending" | "approved";

export interface ICreative extends Document {
  _id: mongoose.Types.ObjectId;
  order: mongoose.Types.ObjectId;
  company: mongoose.Types.ObjectId;
  status: CreativeStatus;
  headline: string;
  subline?: string;
  url?: string;
  uploadedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const creativeSchema = new Schema<ICreative>(
  {
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved"],
      default: "pending",
    },
    headline: {
      type: String,
      required: true,
      trim: true,
    },
    subline: {
      type: String,
      trim: true,
    },
    url: {
      type: String,
      trim: true,
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

creativeSchema.index({ order: 1 });
creativeSchema.index({ company: 1 });

export const Creative = mongoose.model<ICreative>("Creative", creativeSchema);
