import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Media, type IMedia } from "../models/media.model.js";
import { User } from "../models/user.model.js";

const s3Client = new S3Client({
  region: process.env.AWS_REGION ?? "eu-north-1",
});

const BUCKET = process.env.S3_BUCKET_NAME;
if (!BUCKET) {
  console.warn("S3_BUCKET_NAME is not set; media uploads will fail.");
}

export interface UploadMediaInput {
  buffer: Buffer;
  originalFilename: string;
  mimetype: string;
  size: number;
  userId: string;
  orderId?: string;
}

/**
 * Uploads file buffer to S3 and stores metadata in MongoDB.
 * Resolves companyId from the authenticated user.
 */
export const uploadMedia = async (input: UploadMediaInput): Promise<IMedia> => {
  if (!BUCKET) {
    throw new Error("S3 bucket is not configured");
  }

  const user = await User.findById(input.userId);
  if (!user) {
    throw new Error("User not found");
  }

  const companyId = user.company;
  if (!companyId) {
    throw new Error("User has no company");
  }

  const ext = input.originalFilename.includes(".")
    ? input.originalFilename.split(".").pop()
    : "";
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${ext ? `.${ext}` : ""}`;
  const s3Key = `media/${companyId}/${input.userId}/${safeName}`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: s3Key,
      Body: input.buffer,
      ContentType: input.mimetype,
    })
  );

  const media = new Media({
    companyId,
    uploadedBy: input.userId,
    orderId: input.orderId,
    s3Key,
    originalFilename: input.originalFilename,
    mimetype: input.mimetype,
    size: input.size,
  });

  await media.save();
  return media;
};

export const getMediaById = async (mediaId: string): Promise<IMedia | null> => {
  return await Media.findById(mediaId)
    .populate("uploadedBy", "firstName lastName email")
    .populate("companyId", "name");
};

export const getMediaByCompany = async (
  companyId: string
): Promise<IMedia[]> => {
  return await Media.find({ companyId }).sort({ createdAt: -1 });
};

export const getMediaByOrder = async (orderId: string): Promise<IMedia[]> => {
  return await Media.find({ orderId }).sort({ createdAt: -1 });
};
