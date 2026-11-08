import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const endpoint = process.env.AWS_ENDPOINT_URL_S3 || process.env.S3_ENDPOINT;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID || process.env.S3_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || process.env.S3_SECRET_ACCESS_KEY;
const region = process.env.AWS_REGION || process.env.S3_REGION || "ap-southeast-1";
export const defaultBucket = process.env.S3_BUCKET || "rewind-traces";

export const isS3Configured = Boolean(
  endpoint &&
  endpoint.trim().length > 0 &&
  accessKeyId &&
  accessKeyId.trim().length > 0 &&
  secretAccessKey &&
  secretAccessKey.trim().length > 0
);

/**
 * Returns a configured S3 client.
 * Note: Neon Object Storage requires path-style addressing (`forcePathStyle: true`).
 */
export function getS3Client(): S3Client | null {
  if (!isS3Configured || !endpoint || !accessKeyId || !secretAccessKey) return null;

  return new S3Client({
    endpoint,
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    forcePathStyle: true,
  });
}

/**
 * Checks the status and configuration of Neon S3 Object Storage.
 */
export function getS3ConfigSummary() {
  return {
    configured: isS3Configured,
    bucket: defaultBucket,
    region,
    endpointHost: endpoint ? new URL(endpoint).host : null,
  };
}

/**
 * Uploads a raw trace string or binary buffer to Neon Object Storage.
 */
export async function uploadTraceBlob(
  key: string,
  content: string | Uint8Array,
  bucket: string = defaultBucket
): Promise<{ success: boolean; key: string; error?: string; etag?: string }> {
  const client = getS3Client();
  if (!client) {
    return { success: false, key, error: "S3 Object Storage is not configured." };
  }

  try {
    const body = typeof content === "string" ? Buffer.from(content, "utf-8") : content;
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: "application/x-ndjson",
    });

    const res = await client.send(command);
    return { success: true, key, etag: res.ETag };
  } catch (err: any) {
    console.error("Failed to upload trace blob to S3:", err);
    return { success: false, key, error: err?.message || "Upload failed" };
  }
}

/**
 * Downloads a trace blob string from Neon Object Storage.
 */
export async function downloadTraceBlob(
  key: string,
  bucket: string = defaultBucket
): Promise<{ success: boolean; content?: string; error?: string }> {
  const client = getS3Client();
  if (!client) {
    return { success: false, error: "S3 Object Storage is not configured." };
  }

  try {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    const response = await client.send(command);
    const content = await response.Body?.transformToString("utf-8");
    return { success: true, content };
  } catch (err: any) {
    console.error("Failed to download trace blob from S3:", err);
    return { success: false, error: err?.message || "Download failed" };
  }
}

/**
 * Checks if a specific trace object exists in Neon Object Storage.
 */
export async function checkTraceExists(
  key: string,
  bucket: string = defaultBucket
): Promise<{ exists: boolean; contentLength?: number; error?: string }> {
  const client = getS3Client();
  if (!client) {
    return { exists: false, error: "S3 Object Storage is not configured." };
  }

  try {
    const command = new HeadObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    const res = await client.send(command);
    return { exists: true, contentLength: res.ContentLength };
  } catch (err: any) {
    if (err?.name === "NotFound" || err?.$metadata?.httpStatusCode === 404) {
      return { exists: false };
    }
    return { exists: false, error: err?.message };
  }
}

/**
 * Deletes a trace object from Neon Object Storage.
 */
export async function deleteTraceBlob(
  key: string,
  bucket: string = defaultBucket
): Promise<{ success: boolean; error?: string }> {
  const client = getS3Client();
  if (!client) {
    return { success: false, error: "S3 Object Storage is not configured." };
  }

  try {
    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    await client.send(command);
    return { success: true };
  } catch (err: any) {
    console.error("Failed to delete trace blob from S3:", err);
    return { success: false, error: err?.message || "Delete failed" };
  }
}
