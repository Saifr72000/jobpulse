export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type AddonId =
  | "lead-ad"
  | "video-production"
  | "linkedin-job-posting";

export const statusConfig: Record<OrderStatus, { label: string; cls: string }> =
  {
    pending: { label: "Pending", cls: "status-pending" },
    processing: { label: "Processing", cls: "status-processing" },
    shipped: { label: "Shipped", cls: "status-shipped" },
    delivered: { label: "Delivered", cls: "status-delivered" },
    cancelled: { label: "Cancelled", cls: "status-cancelled" },
  };

export const addonLabels: Record<AddonId, string> = {
  "lead-ad": "Lead Ad",
  "video-production": "Video Production",
  "linkedin-job-posting": "LinkedIn Job Posting",
};

export const paymentLabels: Record<string, string> = {
  "value-card": "Value Card",
  card: "Card Payment",
  invoice: "Invoice (30 days)",
};

export interface UploadedFile {
  name: string;
  size: string;
  ext: "pdf" | "jpg" | "png" | "mp4" | "docx";
}

export interface ChannelPrice {
  name: string;
  price: number;
  included: boolean; // true = 0 kr, shown as "Included"
}

export interface Order {
  id: string;
  client: string;
  orderedBy: string;
  date: string;
  status: OrderStatus;

  // Plan
  planType: "custom" | "package";
  packageName?: "Basic" | "Medium" | "Deluxe";
  channels: string[];
  addons: AddonId[];

  // Campaign
  campaignName: string;

  // Assets — always present
  campaignImageChoice: "upload" | "media-library" | "team-suggests";
  campaignImageFile?: UploadedFile;

  applicationUrl?: string;

  // Lead Ad add-on
  leadAdJDChoice?: "team-creates" | "provided";
  leadAdJDContent?: string;
  leadAdJDFile?: UploadedFile;

  // Video Production add-on
  videoMaterialsChoice?: "upload" | "team-selects" | "combine";
  videoFiles?: UploadedFile[];

  // LinkedIn Job Posting add-on
  linkedinJDChoice?: "team-creates" | "provided";
  linkedinJDContent?: string;
  screeningChoice?: "team-creates" | "provided";
  screeningQuestions?: string[];

  targetAudience: string;
  additionalNotes?: string;

  // Pricing
  basePrice: number;
  channelPrices: ChannelPrice[];
  addonPrices: { name: string; price: number }[];
  subtotal: number;
  vat: number;
  rawAmount: number;
  paymentMethod: "value-card" | "card" | "invoice";
}

export function formatNOK(n: number): string {
  return n.toLocaleString("nb-NO") + " NOK";
}

export const allOrders: Order[] = [
  {
    id: "ORD-001",
    client: "Telenor AS",
    orderedBy: "Kari Nordmann",
    date: "14 Jan 2026",
    status: "delivered",
    planType: "package",
    packageName: "Medium",
    channels: ["LinkedIn", "Meta"],
    addons: ["lead-ad", "linkedin-job-posting"],
    campaignName: "Senior Tech Hiring Q1 2026",
    campaignImageChoice: "upload",
    campaignImageFile: { name: "telenor-banner.jpg", size: "2.4 MB", ext: "jpg" },
    applicationUrl: "https://telenor.no/careers/apply",
    leadAdJDChoice: "provided",
    leadAdJDContent:
      "We are looking for a Senior Software Developer to join our platform team in Fornebu. You will architect and build scalable backend systems serving millions of customers across Norway. Requirements: 5+ years of experience in distributed systems, strong proficiency in Java or Kotlin, and a passion for clean, maintainable code.",
    linkedinJDChoice: "provided",
    linkedinJDContent:
      "Telenor is seeking a Senior Developer to drive innovation in our core infrastructure. The ideal candidate has deep experience in cloud-native technologies (AWS/GCP), microservices, and DevOps practices. You will collaborate with cross-functional teams and mentor junior engineers.",
    screeningChoice: "provided",
    screeningQuestions: [
      "How many years of experience do you have with distributed systems?",
      "Describe a complex technical challenge you solved and what your approach was.",
      "Are you open to relocation to Fornebu, or do you currently reside in the Oslo region?",
    ],
    targetAudience:
      "Tech professionals with 5+ years of experience in software development, located in Oslo or Fornebu. Preferably with telecom or fintech background. Strong interest in large-scale systems and platform engineering.",
    additionalNotes:
      "Focus messaging on our new campus in Fornebu. Use brand colors and emphasize work-life balance and career growth opportunities. Avoid salary specifics in ad copy.",
    basePrice: 25000,
    channelPrices: [
      { name: "LinkedIn", price: 0, included: true },
      { name: "Meta", price: 0, included: true },
    ],
    addonPrices: [
      { name: "Lead Ad", price: 8500 },
      { name: "LinkedIn Job Posting", price: 5500 },
    ],
    subtotal: 39000,
    vat: 9750,
    rawAmount: 48750,
    paymentMethod: "invoice",
  },
  {
    id: "ORD-002",
    client: "DNB Bank ASA",
    orderedBy: "Lars Hansen",
    date: "10 Jan 2026",
    status: "processing",
    planType: "custom",
    channels: ["LinkedIn"],
    addons: [],
    campaignName: "DNB Financial Analyst Graduate Programme",
    campaignImageChoice: "team-suggests",
    applicationUrl: "https://dnb.no/om-oss/jobb/graduate",
    targetAudience:
      "Finance graduates from Norwegian universities — NHH, BI, and UiO. Interest in capital markets, investment banking, and financial analysis. Graduating class of 2025 or 2026.",
    additionalNotes:
      "Professional and trustworthy tone. Use our established brand voice. Emphasise the structured graduate programme with mentoring and rotation across departments.",
    basePrice: 0,
    channelPrices: [{ name: "LinkedIn", price: 12000, included: false }],
    addonPrices: [],
    subtotal: 12000,
    vat: 3000,
    rawAmount: 15000,
    paymentMethod: "value-card",
  },
  {
    id: "ORD-003",
    client: "Equinor ASA",
    orderedBy: "Nina Bakke",
    date: "08 Jan 2026",
    status: "pending",
    planType: "package",
    packageName: "Deluxe",
    channels: ["LinkedIn", "Meta", "Snapchat", "Google", "TikTok"],
    addons: ["lead-ad", "video-production", "linkedin-job-posting"],
    campaignName: "Equinor Engineering Graduate 2026",
    campaignImageChoice: "upload",
    campaignImageFile: { name: "equinor-brand-visual.jpg", size: "3.1 MB", ext: "jpg" },
    applicationUrl: "https://equinor.com/en/careers/job-listings",
    leadAdJDChoice: "team-creates",
    videoMaterialsChoice: "combine",
    videoFiles: [
      { name: "equinor-offshore-footage.mp4", size: "148 MB", ext: "mp4" },
      { name: "brand-guidelines-2026.pdf", size: "4.7 MB", ext: "pdf" },
    ],
    linkedinJDChoice: "provided",
    linkedinJDContent:
      "Join Equinor's global engineering graduate programme and work at the intersection of energy, technology, and sustainability. You will rotate across business areas including renewables, oil and gas, and digital, building a broad foundation for a long-term career in energy.",
    screeningChoice: "provided",
    screeningQuestions: [
      "Which engineering discipline did you study, and from which university?",
      "What motivates you to work in the energy sector specifically?",
      "Do you have experience or strong interest in sustainability and the energy transition?",
      "Are you willing to work in offshore or international locations as part of your rotation?",
    ],
    targetAudience:
      "Engineering graduates from NTNU, UiO, and other technical universities. Focus on sustainable energy, offshore technology, and digital systems. Expected graduation: 2025 or 2026. International applicants welcome.",
    additionalNotes:
      "Emphasise commitment to renewable energy and innovation culture. Showcase the Hywind and Empire Wind projects if possible. Campaign tone: bold and forward-looking.",
    basePrice: 40000,
    channelPrices: [
      { name: "LinkedIn", price: 0, included: true },
      { name: "Meta", price: 0, included: true },
      { name: "Snapchat", price: 0, included: true },
      { name: "Google", price: 0, included: true },
      { name: "TikTok", price: 0, included: true },
    ],
    addonPrices: [
      { name: "Lead Ad", price: 8500 },
      { name: "Video Production", price: 15000 },
      { name: "LinkedIn Job Posting", price: 5500 },
    ],
    subtotal: 69000,
    vat: 17250,
    rawAmount: 86250,
    paymentMethod: "invoice",
  },
  {
    id: "ORD-004",
    client: "Kongsberg Group",
    orderedBy: "Erik Solberg",
    date: "03 Jan 2026",
    status: "shipped",
    planType: "custom",
    channels: ["LinkedIn"],
    addons: ["linkedin-job-posting"],
    campaignName: "Software Architect – Defence & Aerospace",
    campaignImageChoice: "media-library",
    applicationUrl: "https://kongsberg.com/careers",
    linkedinJDChoice: "provided",
    linkedinJDContent:
      "Kongsberg Group is seeking an experienced Software Architect to design and own the technical architecture for our next-generation defence systems. You will work closely with systems engineers and programme managers, setting standards and guiding a team of 10+ engineers.",
    screeningChoice: "team-creates",
    targetAudience:
      "Senior software engineers and architects with 8+ years of experience. Background in embedded systems, defence technology, or safety-critical software preferred. Norwegian security clearance eligible.",
    additionalNotes:
      "Confidentiality is important — do not mention specific projects or clients in ad copy. Emphasise the technical challenge and impact of the role.",
    basePrice: 0,
    channelPrices: [{ name: "LinkedIn", price: 12000, included: false }],
    addonPrices: [{ name: "LinkedIn Job Posting", price: 5500 }],
    subtotal: 17500,
    vat: 4375,
    rawAmount: 21875,
    paymentMethod: "card",
  },
  {
    id: "ORD-005",
    client: "Aker BP ASA",
    orderedBy: "Anja Olsen",
    date: "28 Dec 2025",
    status: "delivered",
    planType: "package",
    packageName: "Basic",
    channels: ["TikTok", "X"],
    addons: ["video-production"],
    campaignName: "Aker BP Graduate Engineer – Gen Z Outreach",
    campaignImageChoice: "upload",
    campaignImageFile: { name: "akerbp-hero-image.png", size: "1.8 MB", ext: "png" },
    applicationUrl: "https://akerbp.com/careers/graduates",
    videoMaterialsChoice: "upload",
    videoFiles: [
      { name: "rig-b-day-in-the-life.mp4", size: "230 MB", ext: "mp4" },
      { name: "employee-testimonials.mp4", size: "95 MB", ext: "mp4" },
    ],
    targetAudience:
      "Gen Z engineering students and recent graduates (ages 22–27) from Norwegian technical universities. Interest in petroleum engineering, mechanical engineering, or digital oilfield technology. Seeking first or second job.",
    additionalNotes:
      "Keep the tone authentic and energetic — this is aimed at Gen Z so avoid corporate language. Short-form video is key. Showcase real employees and real rigs.",
    basePrice: 15000,
    channelPrices: [
      { name: "TikTok", price: 0, included: true },
      { name: "X", price: 0, included: true },
    ],
    addonPrices: [{ name: "Video Production", price: 15000 }],
    subtotal: 30000,
    vat: 7500,
    rawAmount: 37500,
    paymentMethod: "value-card",
  },
  {
    id: "ORD-006",
    client: "Schibsted Media Group",
    orderedBy: "Magnus Dahl",
    date: "22 Dec 2025",
    status: "cancelled",
    planType: "custom",
    channels: ["Meta"],
    addons: ["lead-ad"],
    campaignName: "UX Designer – Finn.no Product Team",
    campaignImageChoice: "upload",
    campaignImageFile: { name: "schibsted-ux-banner.jpg", size: "1.2 MB", ext: "jpg" },
    applicationUrl: "https://finn.no/jobb/apply",
    leadAdJDChoice: "provided",
    leadAdJDContent:
      "Finn.no is hiring a senior UX Designer to lead the design of our core marketplace experience. You'll own end-to-end design of key user journeys, collaborate closely with product managers and engineers, and help define the design system strategy.",
    targetAudience:
      "Experienced UX/product designers with 4+ years of experience. Portfolio demonstrating work on complex digital products. Based in Oslo or willing to relocate. Familiarity with Figma and design systems.",
    additionalNotes:
      "Client requested cancellation due to budget freeze for Q1. Campaign was ready to go live.",
    basePrice: 0,
    channelPrices: [{ name: "Meta", price: 10000, included: false }],
    addonPrices: [{ name: "Lead Ad", price: 8500 }],
    subtotal: 18500,
    vat: 4625,
    rawAmount: 23125,
    paymentMethod: "invoice",
  },
  {
    id: "ORD-007",
    client: "Norsk Hydro",
    orderedBy: "Sofie Berg",
    date: "15 Dec 2025",
    status: "delivered",
    planType: "package",
    packageName: "Medium",
    channels: ["LinkedIn", "Meta"],
    addons: ["video-production"],
    campaignName: "Norsk Hydro – Data & AI Talent Campaign",
    campaignImageChoice: "team-suggests",
    applicationUrl: "https://hydro.com/en/careers",
    videoMaterialsChoice: "team-selects",
    targetAudience:
      "Data scientists, ML engineers, and AI researchers with 3–8 years of experience. Background in industrial data, time-series analysis, or computer vision a plus. Both Norwegian and international candidates welcome.",
    additionalNotes:
      "Highlight the intersection of industrial operations and cutting-edge AI. Mention our partnership with NTNU. The tone should be intellectual but accessible.",
    basePrice: 25000,
    channelPrices: [
      { name: "LinkedIn", price: 0, included: true },
      { name: "Meta", price: 0, included: true },
    ],
    addonPrices: [{ name: "Video Production", price: 15000 }],
    subtotal: 40000,
    vat: 10000,
    rawAmount: 50000,
    paymentMethod: "card",
  },
];
