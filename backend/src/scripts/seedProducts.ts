import mongoose from "mongoose";
import { Product } from "../models/product.model.js";
import dotenv from "dotenv";

dotenv.config();

const CHANNELS = [
  {
    title: "LinkedIn",
    description: "Professional network targeting",
    price: 12600,
    type: "service" as const,
    logo: "/logos/linkedin.png",
  },
  {
    title: "Facebook",
    description: "Broad audience reach",
    price: 8900,
    type: "service" as const,
    logo: "/logos/facebook.png",
  },
  {
    title: "Google",
    description: "Broad audience reach",
    price: 8900,
    type: "service" as const,
    logo: "/logos/google.png",
  },
  {
    title: "Snapchat",
    description: "Reaching gen Z and young adults",
    price: 8900,
    type: "service" as const,
    logo: "/logos/snapchat.png",
  },
  {
    title: "Instagram",
    description: "Visual storytelling",
    price: 8900,
    type: "service" as const,
    logo: "/logos/instagram.png",
  },
  {
    title: "X",
    description: "Real time engagement",
    price: 8900,
    type: "service" as const,
    logo: "/logos/x.png",
  },
  {
    title: "YouTube",
    description: "Video reach and brand awareness",
    price: 8900,
    type: "service" as const,
    logo: "/logos/youtube.png",
  },
];

const PACKAGES = [
  {
    title: "Basic Package",
    description:
      "Choose up to 3 channels, 14 day campaign period, 50% ad spend included, full performance analytics, ongoing optimization",
    price: 8000,
    type: "package" as const,
    logo: "/logos/package-basic.png",
  },
  {
    title: "Medium Package",
    description:
      "Choose up to 5 channels, 14 day campaign period, 50% ad spend included, full performance analytics, ongoing optimization",
    price: 15000,
    type: "package" as const,
    logo: "/logos/package-medium.png",
  },
  {
    title: "Deluxe Package",
    description:
      "Choose up to 7 channels, 14 day campaign period, 50% ad spend included, full performance analytics, ongoing optimization",
    price: 25000,
    type: "package" as const,
    logo: "/logos/package-deluxe.png",
  },
];

const ADDONS = [
  {
    title: "Lead Ads",
    description:
      "Collect applications directly in the ad. No landing page needed",
    price: 2500,
    type: "addon" as const,
    logo: "/logos/addon-lead-ads.png",
  },
  {
    title: "Video Campaign",
    description:
      "Engage candidates with dynamic video content across platforms",
    price: 3800,
    type: "addon" as const,
    logo: "/logos/addon-video.png",
  },
  {
    title: "LinkedIn Job Posting",
    description:
      "Official job listing on LinkedIn's job board with applicant tracking",
    price: 4200,
    type: "addon" as const,
    logo: "/logos/addon-linkedin-job.png",
  },
];

async function seedProducts() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error("MONGODB_URI not found in environment variables");
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");

    // Clear existing products
    console.log("Clearing existing products...");
    await Product.deleteMany({});
    console.log("Existing products cleared");

    // Insert channels
    console.log("\nInserting channels...");
    for (const channel of CHANNELS) {
      const product = await Product.create(channel);
      console.log(`✓ Created channel: ${product.title} (${product.price} kr)`);
    }

    // Insert packages
    console.log("\nInserting packages...");
    for (const pkg of PACKAGES) {
      const product = await Product.create(pkg);
      console.log(`✓ Created package: ${product.title} (${product.price} kr)`);
    }

    // Insert addons
    console.log("\nInserting addons...");
    for (const addon of ADDONS) {
      const product = await Product.create(addon);
      console.log(`✓ Created addon: ${product.title} (${product.price} kr)`);
    }

    console.log("\n✅ Seeding completed successfully!");
    console.log(`Total products: ${CHANNELS.length + PACKAGES.length + ADDONS.length}`);
    console.log(`- Channels: ${CHANNELS.length}`);
    console.log(`- Packages: ${PACKAGES.length}`);
    console.log(`- Addons: ${ADDONS.length}`);

    await mongoose.disconnect();
    console.log("\nDisconnected from MongoDB");
  } catch (error) {
    console.error("Error seeding products:", error);
    process.exit(1);
  }
}

seedProducts();
