import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";

const databaseUrl = process.env.DATABASE_URL;
const s3Endpoint = process.env.AWS_ENDPOINT_URL_S3;
const s3AccessKey = process.env.AWS_ACCESS_KEY_ID;
const s3SecretKey = process.env.AWS_SECRET_ACCESS_KEY;
const s3Region = process.env.AWS_REGION || "ap-southeast-1";
const BUCKET = process.env.S3_BUCKET || "rewind-traces";

console.log("==================================================================");
console.log("RewindVerse Cloud Milestone 6 & 7 — End-to-End Live Cloud Verification");
console.log("==================================================================");

if (!databaseUrl || !s3Endpoint || !s3AccessKey || !s3SecretKey) {
  console.error("Missing required environment variables!");
  process.exit(1);
}

// 1. Initialize Neon PostgreSQL client
const sql = neon(databaseUrl);

// 2. Initialize Neon Object Storage (S3) client
const s3 = new S3Client({
  endpoint: s3Endpoint,
  region: s3Region,
  credentials: {
    accessKeyId: s3AccessKey,
    secretAccessKey: s3SecretKey,
  },
  forcePathStyle: true,
});

async function runEndToEndTest() {
  try {
    const timestamp = Date.now();
    const token = `live_test_${timestamp}`;
    const traceId = `tr_live_${timestamp}`;
    const s3Key = `traces/${traceId}.rvtrace`;

    // Step A: Create mock/simulated RVTS trace payload
    console.log("\n[1/4] Generating Canonical RVTS Trace Payload...");
    const manifest = {
      type: "manifest",
      version: "0.1.0",
      run_id: `run_${timestamp}`,
      name: "E2E Cloud Verified Optimization Run",
      created_at: new Date().toISOString(),
      producer: { name: "RewindVerse Cloud Tester", version: "1.0.0" },
      model_or_objective: { name: "Quadratic Ravine", type: "continuous_surface" },
      hyperparameters: { optimizer: "adam", lr: 0.05, beta1: 0.9, beta2: 0.999 },
      declared_capabilities: { has_loss: true, has_parameters: true, has_gradients: true },
    };

    const steps = [
      { type: "step", step: 0, metrics: { loss: 4.82 }, parameters: { w1: -2.0, w2: 3.5 } },
      { type: "step", step: 1, metrics: { loss: 3.41 }, parameters: { w1: -1.6, w2: 2.8 } },
      { type: "step", step: 2, metrics: { loss: 2.15 }, parameters: { w1: -1.1, w2: 2.0 } },
      { type: "step", step: 3, metrics: { loss: 1.04 }, parameters: { w1: -0.5, w2: 1.1 } },
      { type: "step", step: 4, metrics: { loss: 0.28 }, parameters: { w1: -0.08, w2: 0.2 } },
    ];

    const rawTraceLines = [JSON.stringify(manifest), ...steps.map(s => JSON.stringify(s))].join("\n");
    console.log(`✓ Trace created: ${steps.length} steps, ${rawTraceLines.length} bytes.`);

    // Step B: Upload Trace Blob to Neon Object Storage
    console.log(`\n[2/4] Uploading Trace Blob to Neon Object Storage (${BUCKET}/${s3Key})...`);
    const putRes = await s3.send(new PutObjectCommand({
      Bucket: BUCKET,
      Key: s3Key,
      Body: Buffer.from(rawTraceLines, "utf-8"),
      ContentType: "application/x-ndjson",
    }));
    console.log(`✓ Uploaded to Neon S3 successfully! ETag: ${putRes.ETag}`);

    // Step C: Insert Record into Neon PostgreSQL
    console.log("\n[3/4] Persisting Trace Metadata & Share Token to Neon PostgreSQL...");
    // Direct raw SQL via neon tagged template
    await sql`
      INSERT INTO traces (id, run_id, name, manifest_json, s3_key, total_steps, final_loss, created_at)
      VALUES (${traceId}, ${manifest.run_id}, ${manifest.name}, ${JSON.stringify(manifest)}, ${s3Key}, ${steps.length}, '0.28', NOW())
    `;
    await sql`
      INSERT INTO share_tokens (token, trace_id, is_public, created_at)
      VALUES (${token}, ${traceId}, TRUE, NOW())
    `;
    console.log(`✓ Neon PostgreSQL rows inserted: Trace ID '${traceId}', Token '${token}'.`);

    // Step D: Retrieve and Verify Trace from Neon Database + S3
    console.log("\n[4/4] Retrieving and Verifying from Neon Cloud...");
    const [tokenRow] = await sql`SELECT * FROM share_tokens WHERE token = ${token}`;
    if (!tokenRow) throw new Error("Share token not found in Neon PostgreSQL!");

    const [traceRow] = await sql`SELECT * FROM traces WHERE id = ${tokenRow.trace_id}`;
    if (!traceRow) throw new Error("Trace row not found in Neon PostgreSQL!");

    console.log(`✓ Postgres lookup successful! Found S3 key: '${traceRow.s3_key}'`);

    const getRes = await s3.send(new GetObjectCommand({
      Bucket: BUCKET,
      Key: traceRow.s3_key,
    }));
    const downloadedText = await getRes.Body.transformToString("utf-8");
    console.log(`✓ S3 blob downloaded: ${downloadedText.length} bytes.`);

    if (downloadedText === rawTraceLines) {
      console.log("\n==================================================================");
      console.log("🎉 ALL MILESTONES VERIFIED!");
      console.log("   • Neon PostgreSQL: Connection, tables, and relationships ACTIVE");
      console.log("   • Neon Object Storage: S3 uploads and downloads ACTIVE");
      console.log("   • Cloud Trace Round-Trip: 100% Bit-Identical Match");
      console.log(`   • Test Share URL: /share/${token}`);
      console.log("==================================================================");
      process.exit(0);
    } else {
      throw new Error("Downloaded trace content does not match original payload!");
    }
  } catch (err) {
    console.error("\n❌ End-to-End Cloud Test Failed:", err);
    process.exit(1);
  }
}

runEndToEndTest();

