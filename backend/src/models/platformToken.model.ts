import mongoose, { Document, Schema } from "mongoose";

export type PlatformName = "meta" | "linkedin" | "tiktok" | "snapchat";

export interface IPlatformToken extends Document {
  _id: mongoose.Types.ObjectId;
  platform: PlatformName;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
  scope?: string;
  createdAt: Date;
  updatedAt: Date;
}

const platformTokenSchema = new Schema<IPlatformToken>(
  {
    platform: {
      type: String,
      enum: ["meta", "linkedin", "tiktok", "snapchat"],
      required: true,
      unique: true,
    },
    accessToken: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
    },
    expiresAt: {
      type: Date,
    },
    scope: {
      type: String,
    },
  },
  { timestamps: true }
);

export const PlatformToken = mongoose.model<IPlatformToken>(
  "PlatformToken",
  platformTokenSchema
);
