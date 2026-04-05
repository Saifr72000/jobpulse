import mongoose, { Document, Schema } from "mongoose";

export type SnapshotType = "summary" | "timeseries" | "demographics";

export interface IReportSnapshot extends Document {
  _id: mongoose.Types.ObjectId;
  orderId: mongoose.Types.ObjectId;
  platform: string;
  externalCampaignId: string;
  type: SnapshotType;
  dateRange: { since: string; until: string };
  data: unknown;
  fetchedAt: Date;
  expiresAt: Date;
}

const reportSnapshotSchema = new Schema<IReportSnapshot>(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    platform: {
      type: String,
      required: true,
    },
    externalCampaignId: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["summary", "timeseries", "demographics"],
      required: true,
    },
    dateRange: {
      since: { type: String, required: true },
      until: { type: String, required: true },
    },
    data: {
      type: Schema.Types.Mixed,
      required: true,
    },
    fetchedAt: {
      type: Date,
      required: true,
      default: () => new Date(),
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: false }
);

// TTL index — MongoDB auto-deletes documents after expiresAt
reportSnapshotSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Compound index for fast cache lookups
reportSnapshotSchema.index({
  orderId: 1,
  platform: 1,
  externalCampaignId: 1,
  type: 1,
  "dateRange.since": 1,
  "dateRange.until": 1,
});

export const ReportSnapshot = mongoose.model<IReportSnapshot>(
  "ReportSnapshot",
  reportSnapshotSchema
);
