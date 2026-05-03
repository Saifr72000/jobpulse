import mongoose from "mongoose";
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { LinkedInMockStat } from "../models/linkedinMockStat.model.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

interface LinkedInJsonElement {
  shares?: number;
  dateRange?: {
    start?: { month: number; day: number; year: number };
    end?: { month: number; day: number; year: number };
  };
  landingPageClicks?: number;
  clicks?: number;
  costInLocalCurrency?: string;
  approximateMemberReach?: number;
  impressions?: number;
  likes?: number;
}

interface LinkedInDump {
  elements?: LinkedInJsonElement[];
}

function ymdToDateStr(y: number, m: number, d: number): string {
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is not set.");
    process.exit(1);
  }

  const campaignId =
    process.argv[2]?.trim() ||
    process.env.LINKEDIN_MOCK_CAMPAIGN_ID?.trim() ||
    "310113766";

  const jsonPath = path.join(__dirname, "../mockdata/linkedin.json");
  const raw = readFileSync(jsonPath, "utf-8");
  const data = JSON.parse(raw) as LinkedInDump;

  const elements = data.elements ?? [];
  if (elements.length === 0) {
    console.error("No elements in linkedin.json");
    process.exit(1);
  }

  await mongoose.connect(uri);

  const ops = elements.map((el) => {
    const start = el.dateRange?.start;
    if (!start) {
      throw new Error("Each element must have dateRange.start");
    }
    const date = ymdToDateStr(start.year, start.month, start.day);
    return {
      updateOne: {
        filter: { externalCampaignId: campaignId, date },
        update: {
          $set: {
            externalCampaignId: campaignId,
            date,
            impressions: el.impressions ?? 0,
            clicks: el.clicks ?? 0,
            costInLocalCurrency: String(el.costInLocalCurrency ?? "0"),
            landingPageClicks: el.landingPageClicks ?? 0,
            likes: el.likes ?? 0,
            shares: el.shares ?? 0,
            approximateMemberReach: el.approximateMemberReach ?? 0,
          },
        },
        upsert: true,
      },
    };
  });

  const result = await LinkedInMockStat.bulkWrite(ops);
  console.log("LinkedIn mock seed:", result);
  console.log(`externalCampaignId=${campaignId} (${elements.length} day rows)`);

  await mongoose.disconnect();
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
