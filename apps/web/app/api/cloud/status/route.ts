import { NextResponse } from "next/server";
import { db, isDatabaseConfigured } from "../../../../lib/db";
import { traces } from "../../../../lib/db/schema";
import {
  isS3Configured,
  getS3ConfigSummary,
  uploadTraceBlob,
  downloadTraceBlob,
  deleteTraceBlob,
} from "../../../../lib/storage-s3";

export async function GET() {
  const startTime = Date.now();
  const result: {
    timestamp: string;
    overall: "healthy" | "degraded" | "offline";
    database: {
      configured: boolean;
      connected: boolean;
      traceCount?: number;
      error?: string;
    };
    objectStorage: {
      configured: boolean;
      bucket: string;
      region: string;
      endpointHost: string | null;
      readWriteVerified: boolean;
      latencyMs?: number;
      error?: string;
    };
  } = {
    timestamp: new Date().toISOString(),
    overall: "offline",
    database: {
      configured: isDatabaseConfigured,
      connected: false,
    },
    objectStorage: {
      ...getS3ConfigSummary(),
      readWriteVerified: false,
    },
  };

  // 1. Check Neon PostgreSQL
  if (isDatabaseConfigured && db) {
    try {
      const traceRows = await db.select({ id: traces.id }).from(traces);
      result.database.connected = true;
      result.database.traceCount = traceRows.length;
    } catch (dbErr: any) {
      result.database.error = dbErr?.message || "DB connection failed";
    }
  }

  // 2. Check Neon S3 Object Storage (Real upload/download/cleanup roundtrip test)
  if (isS3Configured) {
    const s3Start = Date.now();
    const testKey = `_health_test_${Date.now()}.txt`;
    const testContent = `RewindVerse health probe at ${result.timestamp}`;

    try {
      const upload = await uploadTraceBlob(testKey, testContent);
      if (upload.success) {
        const download = await downloadTraceBlob(testKey);
        if (download.success && download.content === testContent) {
          result.objectStorage.readWriteVerified = true;
          result.objectStorage.latencyMs = Date.now() - s3Start;
          // Clean up test file
          await deleteTraceBlob(testKey);
        } else {
          result.objectStorage.error = download.error || "Read verification failed";
        }
      } else {
        result.objectStorage.error = upload.error || "Upload test failed";
      }
    } catch (s3Err: any) {
      result.objectStorage.error = s3Err?.message || "S3 operation failed";
    }
  }

  // Overall status evaluation
  if (result.database.connected && result.objectStorage.readWriteVerified) {
    result.overall = "healthy";
  } else if (result.database.connected || result.objectStorage.readWriteVerified) {
    result.overall = "degraded";
  } else {
    result.overall = "offline";
  }

  return NextResponse.json(result, {
    status: result.overall === "healthy" ? 200 : 207,
  });
}
