import mongoose, { Document, Schema } from "mongoose";

/** One row per campaign × calendar day (DAILY grain for LinkedIn mock stats). */
export interface ILinkedInMockStat extends Document {
  _id: mongoose.Types.ObjectId;
  externalCampaignId: string;
  /** YYYY-MM-DD */
  date: string;
  impressions: number;
  clicks: number;
  costInLocalCurrency: string;
  landingPageClicks: number;
  likes: number;
  shares: number;
  approximateMemberReach: number;
  createdAt: Date;
  updatedAt: Date;
}

const linkedinMockStatSchema = new Schema<ILinkedInMockStat>(
  {
    externalCampaignId: { type: String, required: true, trim: true, index: true },
    date: { type: String, required: true, trim: true },
    impressions: { type: Number, required: true, default: 0 },
    clicks: { type: Number, required: true, default: 0 },
    costInLocalCurrency: { type: String, required: true, default: "0" },
    landingPageClicks: { type: Number, required: true, default: 0 },
    likes: { type: Number, required: true, default: 0 },
    shares: { type: Number, required: true, default: 0 },
    approximateMemberReach: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

linkedinMockStatSchema.index({ externalCampaignId: 1, date: 1 }, { unique: true });

export const LinkedInMockStat = mongoose.model<ILinkedInMockStat>(
  "LinkedInMockStat",
  linkedinMockStatSchema
);
