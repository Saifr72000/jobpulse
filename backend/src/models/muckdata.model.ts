import mongoose, { Document, Schema } from "mongoose";

export type MockPlatform = "linkedin" | "tiktok" | "snapchat";
export type MockReportType = "summary" | "timeseries" | "demographics";
export type MockGranularity = "ALL" | "DAILY";

export interface IMockData extends Document {
  _id: mongoose.Types.ObjectId;
  platform: MockPlatform;
  externalCampaignId: string;
  type: MockReportType;
  granularity: MockGranularity;
  date?: string; // YYYY-MM-DD, mainly used for DAILY records
  dateRange?: {
    since: string; // YYYY-MM-DD
    until: string; // YYYY-MM-DD
  };
  rawPayload: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const mockDataSchema = new Schema<IMockData>(
  {
    platform: {
      type: String,
      enum: ["linkedin", "tiktok", "snapchat"],
      required: true,
    },
    externalCampaignId: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["summary", "timeseries", "demographics"],
      required: true,
    },
    granularity: {
      type: String,
      enum: ["ALL", "DAILY"],
      required: true,
      default: "DAILY",
    },
    date: {
      type: String,
      trim: true,
    },
    dateRange: {
      since: { type: String, trim: true },
      until: { type: String, trim: true },
    },
    rawPayload: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  { timestamps: true },
);

// Fast lookup for platform campaign records in a date window.
mockDataSchema.index({ platform: 1, externalCampaignId: 1, date: 1 });

// Fast lookup for summary/demographic style payload retrieval.
mockDataSchema.index({
  platform: 1,
  externalCampaignId: 1,
  type: 1,
  granularity: 1,
});

export const MockData = mongoose.model<IMockData>("MockData", mockDataSchema);
