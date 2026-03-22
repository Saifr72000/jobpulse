import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const region = process.env.AWS_REGION;
const bucketName = process.env.S3_BUCKET_NAME;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

if (!region || !bucketName || !accessKeyId || !secretAccessKey) {
  throw new Error("Missing required AWS S3 environment variables");
}

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

type GenerateUploadUrlParams = {
  key: string;
  contentType: string;
  expiresIn?: number;
};

type GenerateDownloadUrlParams = {
  key: string;
  expiresIn?: number;
};

type DeleteObjectParams = {
  key: string;
};

export const generateUploadUrl = async ({
  key,
  contentType,
  expiresIn = 60 * 5,
}: GenerateUploadUrlParams): Promise<string> => {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: contentType,
  });

  return getSignedUrl(s3Client, command, { expiresIn });
};

export const generateDownloadUrl = async ({
  key,
  expiresIn = 60 * 5,
}: GenerateDownloadUrlParams): Promise<string> => {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  return getSignedUrl(s3Client, command, { expiresIn });
};

export const deleteObject = async ({
  key,
}: DeleteObjectParams): Promise<void> => {
  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  await s3Client.send(command);
};
