import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";

const REQUIRED_ENV = ["S3_ENDPOINT", "S3_ACCESS_KEY", "S3_SECRET_KEY", "S3_BUCKET"] as const;

for (const key of REQUIRED_ENV) {
  if (!process.env[key]) {
    // Fail fast in server contexts that actually need storage; do not throw at import time
    // to keep pages that don't touch storage working without full env configuration.
  }
}

const client = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION ?? "us-east-1",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY ?? "",
    secretAccessKey: process.env.S3_SECRET_KEY ?? "",
  },
  forcePathStyle: true,
});

const BUCKET = process.env.S3_BUCKET ?? "";
const PREFIX = process.env.S3_PREFIX ? `${process.env.S3_PREFIX}/` : "";

export interface UploadedObject {
  key: string;
  url: string;
  type: string;
  size: number;
  originalName: string;
}

function buildKey(folder: string, originalName: string): string {
  const ext = originalName.includes(".") ? originalName.split(".").pop() : undefined;
  const safeExt = ext ? `.${ext.toLowerCase().replace(/[^a-z0-9]/g, "")}` : "";
  return `${PREFIX}${folder}/${randomUUID()}${safeExt}`;
}

function publicUrlFor(key: string): string {
  const endpoint = (process.env.S3_ENDPOINT ?? "").replace(/\/$/, "");
  return `${endpoint}/${BUCKET}/${key}`;
}

/**
 * Storage service decoupled from the rest of the app: callers only deal with
 * (key, url, type, size, originalName) — never with the S3 SDK directly.
 */
export const storageService = {
  async upload(
    folder: string,
    file: Buffer,
    originalName: string,
    contentType: string,
  ): Promise<UploadedObject> {
    const key = buildKey(folder, originalName);
    await client.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: file,
        ContentType: contentType,
        ACL: "public-read",
      }),
    );
    return {
      key,
      url: publicUrlFor(key),
      type: contentType,
      size: file.byteLength,
      originalName,
    };
  },

  async delete(key: string): Promise<void> {
    await client.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
  },

  async update(
    key: string,
    file: Buffer,
    contentType: string,
  ): Promise<{ key: string; url: string; size: number }> {
    await client.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: file,
        ContentType: contentType,
        ACL: "public-read",
      }),
    );
    return { key, url: publicUrlFor(key), size: file.byteLength };
  },

  getPublicUrl(key: string): string {
    return publicUrlFor(key);
  },

  async getSignedUrl(key: string, expiresInSeconds = 3600): Promise<string> {
    return getSignedUrl(client, new GetObjectCommand({ Bucket: BUCKET, Key: key }), {
      expiresIn: expiresInSeconds,
    });
  },
};
