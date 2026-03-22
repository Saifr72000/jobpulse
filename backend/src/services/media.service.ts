import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Media, type IMedia } from "../models/media.model.js";
import { User } from "../models/user.model.js";
import { Order } from "../models/order.model.js";
import { deleteObject } from "./s3.service.js";

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
  orderId?: string;
  folderId?: string;
}

export interface PaginatedMedia {
  data: IMedia[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
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
 */
export const uploadMedia = async (input: UploadMediaInput): Promise<IMedia> => {
  if (!BUCKET) {
    throw new Error("S3 bucket is not configured");
  }

  if (input.orderId) {
    await assertOrderBelongsToUser(input.orderId, input.userId);
  }

  const user = await User.findById(input.userId);
  if (!user) {
    throw new Error("User not found");
  }

  const companyId = user.company;
  if (!companyId) {
    throw new Error("User has no company");
  }

  const rawExt = input.originalFilename.includes(".")
    ? `.${input.originalFilename.split(".").pop()}`
    : "";
  const safeExt = rawExt.replace(/[^.a-zA-Z0-9]/g, "");
  const randomId = Math.random().toString(36).slice(2, 10);
  const s3Key = `companies/${companyId}/${Date.now()}-${randomId}${safeExt}`;

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
    ...(input.orderId ? { orderId: input.orderId } : {}),
    ...(input.folderId ? { folderId: input.folderId } : {}),
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
    .populate("companyId", "name")
    .populate("folderId", "name");
};

export const getMediaByCompany = async (
  companyId: string,
  page: number,
  limit: number
): Promise<PaginatedMedia> => {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    Media.find({ companyId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("folderId", "name"),
    Media.countDocuments({ companyId }),
  ]);

  return { data, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } };
};

export const getMediaByFolder = async (
  folderId: string,
  page: number,
  limit: number
): Promise<PaginatedMedia> => {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    Media.find({ folderId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Media.countDocuments({ folderId }),
  ]);

  return { data, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } };
};

export const getMediaByOrder = async (
  orderId: string,
  page: number,
  limit: number
): Promise<PaginatedMedia> => {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    Media.find({ orderId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("folderId", "name"),
    Media.countDocuments({ orderId }),
  ]);

  return { data, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } };
};

/**
 * Assigns or removes a folder for a media item.
 * Pass folderId = null to move the file to root (no folder).
 */
export const assignMediaFolder = async (
  mediaId: string,
  folderId: string | null
): Promise<IMedia | null> => {
  if (folderId === null) {
    return await Media.findByIdAndUpdate(
      mediaId,
      { $unset: { folderId: "" } },
      { new: true }
    );
  }
  return await Media.findByIdAndUpdate(mediaId, { folderId }, { new: true });
};

/**
 * Deletes a media item from both S3 and MongoDB.
 */
export const deleteMedia = async (mediaId: string): Promise<void> => {
  const media = await Media.findById(mediaId);
  if (!media) {
    throw new Error("Media not found");
  }

  await deleteObject({ key: media.s3Key });
  await Media.findByIdAndDelete(mediaId);
};
