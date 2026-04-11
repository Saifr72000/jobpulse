import mongoose, { Document, Schema } from "mongoose";

/** One row per campaign × calendar day × age × gender (finest grain for mock stats). */
export interface ISnapchatMockStat extends Document {
  _id: mongoose.Types.ObjectId;
  externalCampaignId: string;
  /** YYYY-MM-DD (bucket for start_time in source data). */
  date: string;
  age?: string;
  gender?: string;
  impressions: number;
  swipes: number;
  /** Snapchat micro-currency units (API-shaped). */
  spendMicro: number;
  uniques: number;
  frequency: number;
  createdAt: Date;
  updatedAt: Date;
}

const snapchatMockStatSchema = new Schema<ISnapchatMockStat>(
  {
    externalCampaignId: { type: String, required: true, trim: true, index: true },
    date: { type: String, required: true, trim: true },
    age: { type: String, trim: true },
    gender: { type: String, trim: true },
    impressions: { type: Number, required: true, default: 0 },
    swipes: { type: Number, required: true, default: 0 },
    spendMicro: { type: Number, required: true, default: 0 },
    uniques: { type: Number, required: true, default: 0 },
    frequency: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

snapchatMockStatSchema.index(
  { externalCampaignId: 1, date: 1, age: 1, gender: 1 },
  { unique: true }
);

export const SnapchatMockStat = mongoose.model<ISnapchatMockStat>(
  "SnapchatMockStat",
  snapchatMockStatSchema
);
