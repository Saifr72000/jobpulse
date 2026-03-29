export type Step = 1 | 2 | 3 | 4;
export type PlanType = "custom" | "package" | null;
export type PackageId = "basic" | "medium" | "deluxe" | null;
export type PaymentMethod = "value-card" | "card-payment" | "invoice";

export type ImageOption = "upload" | "media-library" | "team-suggest" | "";
export type LeadAdDesc = "team-create" | "own" | "";
export type VideoMaterials = "upload" | "media-library" | "combine" | "";
export type LinkedinJobDesc = "team-create" | "own" | "";
export type LinkedinScreening = "team-create" | "own" | "";

export interface FormState {
  planType: PlanType;
  selectedPackage: PackageId;
  selectedChannels: string[];
  selectedAddons: string[];
  campaignName: string;
  imageOption: ImageOption;
  imageUploadFiles: File[];
  selectedImageMediaId: string;
  leadAdDesc: LeadAdDesc;
  leadAdDescText: string;
  videoMaterials: VideoMaterials;
  videoUploadFiles: File[];
  selectedVideoMediaIds: string[];
  linkedinJobDesc: LinkedinJobDesc;
  linkedinJobDescText: string;
  linkedinScreening: LinkedinScreening;
  linkedinScreeningText: string;
  targetAudience: string;
  additionalNotes: string;
  paymentMethod: PaymentMethod;
}

export interface Product {
  _id: string;
  title: string;
  description?: string;
  features?: string[];
  price: number;
  type: "package" | "service" | "addon";
  logo?: string;
  channelLimit?: number;
  isActive: boolean;
}
