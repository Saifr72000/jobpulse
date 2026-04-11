import mongoose from "mongoose";
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { SnapchatMockStat } from "../models/snapchatMockStat.model.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

interface SnapchatJsonRow {
  start_time?: string;
  end_time?: string;
  age?: string;
  gender?: string;
  stats?: {
    impressions?: number;
    swipes?: number;
    spend?: number;
    uniques?: number;
    frequency?: number;
  };
}

interface SnapchatDump {
  timeseries_stats?: Array<{
    timeseries_stat?: {
      id?: string;
      timeseries?: SnapchatJsonRow[];
    };
  }>;
}

function dayFromStartTime(iso: string | undefined): string {
  if (!iso) return "";
  return iso.slice(0, 10);
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is not set.");
    process.exit(1);
  }

  const jsonPath = path.join(__dirname, "../../mockData/snapchat.json");
  const raw = readFileSync(jsonPath, "utf-8");
  const data = JSON.parse(raw) as SnapchatDump;

  const stat = data.timeseries_stats?.[0]?.timeseries_stat;
  const campaignId = stat?.id;
  const series = stat?.timeseries ?? [];

  if (!campaignId) {
    console.error("Could not find timeseries_stat.id in snapchat.json");
    process.exit(1);
  }

  await mongoose.connect(uri);

  const ops = series.map((row) => {
    const date = dayFromStartTime(row.start_time);
    const spendMicro = row.stats?.spend ?? 0;
    const age = row.age ?? "unknown";
    const gender = row.gender ?? "unknown";
    return {
      updateOne: {
        filter: {
          externalCampaignId: campaignId,
          date,
          age,
          gender,
        },
        update: {
          $set: {
            externalCampaignId: campaignId,
            date,
            age,
            gender,
            impressions: row.stats?.impressions ?? 0,
            swipes: row.stats?.swipes ?? 0,
            spendMicro,
            uniques: row.stats?.uniques ?? 0,
            frequency: row.stats?.frequency ?? 0,
          },
        },
        upsert: true,
      },
    };
  });

  if (ops.length === 0) {
    console.warn("No timeseries rows to seed.");
  } else {
    const result = await SnapchatMockStat.bulkWrite(ops);
    console.log("Snapchat mock seed:", result);
  }

  await mongoose.disconnect();
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
