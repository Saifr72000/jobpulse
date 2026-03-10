import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Media, type IMedia } from "../models/media.model.js";
import { User } from "../models/user.model.js";
import { Order } from "../models/order.model.js";

let s3Client: S3Client | null = null;

const getS3Client = (): S3Client => {
  if (!s3Client) {
    s3Client = new S3Client({
      region: process.env.AWS_REGION ?? "eu-north-1",
    });
  }
  return s3Client;
};

const BUCKET = process.env.S3_BUCKET_NAME;

export interface UploadMediaInput {
  buffer: Buffer;
  originalFilename: string;
  mimetype: string;
  size: number;
  userId: string;
  orderId: string; // required – media must be linked to an order owned by the user
}

/**
 * Ensures the order exists and belongs to the given user. Throws if not.
 */
export const assertOrderBelongsToUser = async (
  orderId: string,
  userId: string
): Promise<void> => {
  const order = await Order.findById(orderId).select("orderedBy").lean();
  if (!order) {
    throw new Error("Order not found");
  }
  if (order.orderedBy.toString() !== userId) {
    throw new Error("Order does not belong to this user");
  }
};

/**
 * Uploads file buffer to S3 and stores metadata in MongoDB.
 * Resolves companyId from the authenticated user. Requires orderId and validates order ownership.
 */
export const uploadMedia = async (input: UploadMediaInput): Promise<IMedia> => {
  if (!BUCKET) {
    throw new Error("S3 bucket is not configured");
  }

  await assertOrderBelongsToUser(input.orderId, input.userId);

  const user = await User.findById(input.userId);
  if (!user) {
    throw new Error("User not found");
  }

  const companyId = user.company;
  if (!companyId) {
    throw new Error("User has no company");
  }

  const ext = input.originalFilename.includes(".") // if the original filename includes a period, then get the extension by splitting the filename by the period and getting the last part
    ? input.originalFilename.split(".").pop()
    : "";
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${ext ? `.${ext}` : ""}`; // create a safe name for the file by adding a timestamp and a random string
  const s3Key = `media/${companyId}/${input.userId}/${safeName}`; // create a s3 key for the file by adding the company id, the user id, and the safe name

  await getS3Client().send(
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
