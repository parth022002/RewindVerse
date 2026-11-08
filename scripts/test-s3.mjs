import "dotenv/config";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";

const endpoint = process.env.AWS_ENDPOINT_URL_S3;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const region = process.env.AWS_REGION || "ap-southeast-1";
const BUCKET = process.env.S3_BUCKET || "rewind-traces";

console.log("=== Neon S3 Object Storage Live Test ===");
console.log("Endpoint:", endpoint);
console.log("Region:", region);
console.log("Bucket:", BUCKET);

const client = new S3Client({
  endpoint,
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  forcePathStyle: true,
});

async function run() {
  try {
    const testKey = `traces/test-trace-${Date.now()}.rvtrace`;
    const tracePayload = JSON.stringify({
      manifest: {
        run_id: "test_run_neon",
        name: "Neon S3 Live Verification Trace",
        timestamp: new Date().toISOString(),
      },
      steps: [
        { step: 0, loss: 2.45 },
        { step: 1, loss: 1.82 },
        { step: 2, loss: 1.15 },
      ],
    });

    console.log(`\nStep 1: Uploading trace to ${BUCKET}/${testKey}...`);
    const uploadRes = await client.send(new PutObjectCommand({
      Bucket: BUCKET,
      Key: testKey,
      Body: Buffer.from(tracePayload, "utf-8"),
      ContentType: "application/x-ndjson",
    }));
    console.log("✓ Upload successful! ETag:", uploadRes.ETag);

    console.log(`\nStep 2: Downloading trace from ${BUCKET}/${testKey}...`);
    const getRes = await client.send(new GetObjectCommand({
      Bucket: BUCKET,
      Key: testKey,
    }));
    const downloadedText = await getRes.Body.transformToString("utf-8");
    console.log("✓ Download successful! Length:", downloadedText.length, "bytes");

    if (downloadedText === tracePayload) {
      console.log("\n🎉 PERFECT MATCH! Neon S3 upload & download round-trip verified 100%!");
      process.exit(0);
    } else {
      console.error("Mismatch in downloaded data!");
      process.exit(1);
    }
  } catch (err) {
    console.error("❌ Neon S3 test failed:", err);
    process.exit(1);
  }
}

run();
