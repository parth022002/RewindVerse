import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, isDatabaseConfigured } from "../../../../lib/db";
import { traces, shareTokens } from "../../../../lib/db/schema";
import { isS3Configured, uploadTraceBlob, downloadTraceBlob } from "../../../../lib/storage-s3";
import { RvtsParsedTrace, serializeRvtsTrace, parseRvtsTrace } from "@rewindverse/rvts";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const trace = body.trace as RvtsParsedTrace;

    if (!trace || !trace.manifest || !trace.steps) {
      return NextResponse.json(
        { error: "Invalid trace structure. Manifest and steps are required." },
        { status: 400 }
      );
    }

    // Generate random 16-character share token
    const token = Array.from({ length: 16 }, () =>
      Math.floor(Math.random() * 36).toString(36)
    ).join("");

    if (isDatabaseConfigured && db) {
      const traceId = `tr_${Date.now()}_${token.slice(0, 6)}`;
      const lastStep = trace.steps[trace.steps.length - 1];
      let s3Key: string | null = null;

      if (isS3Configured) {
        try {
          const serialized = serializeRvtsTrace(trace);
          const uploadResult = await uploadTraceBlob(`traces/${traceId}.rvtrace`, serialized);
          if (uploadResult.success) {
            s3Key = uploadResult.key;
          }
        } catch (s3Err) {
          console.warn("S3 trace upload skipped:", s3Err);
        }
      }

      await db.insert(traces).values({
        id: traceId,
        runId: trace.manifest.run_id,
        name: trace.manifest.name,
        manifestJson: trace.manifest as any,
        s3Key,
        totalSteps: trace.steps.length,
        finalLoss: String(lastStep?.metrics?.loss ?? "0"),
      });

      await db.insert(shareTokens).values({
        token,
        traceId,
        isPublic: true,
      });

      return NextResponse.json({
        success: true,
        token,
        shareUrl: `/share/${token}`,
        mode: "cloud",
        s3Key,
      });
    }

    // Local-first preview fallback when Neon PostgreSQL is not yet connected
    return NextResponse.json({
      success: true,
      token,
      shareUrl: `/share/${token}`,
      mode: "local_preview",
      notice:
        "Neon PostgreSQL not configured. A local preview token was generated. To enable permanent multi-user cloud sharing, set DATABASE_URL in .env.",
    });
  } catch (err: any) {
    console.error("Share trace error:", err);
    return NextResponse.json(
      { error: "Failed to generate share link", details: err?.message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    if (!isDatabaseConfigured || !db) {
      return NextResponse.json(
        { error: "Cloud database not configured" },
        { status: 503 }
      );
    }

    const tokenRecords = await db
      .select()
      .from(shareTokens)
      .where(eq(shareTokens.token, token))
      .limit(1);

    if (tokenRecords.length === 0) {
      return NextResponse.json({ error: "Share token not found" }, { status: 404 });
    }

    const share = tokenRecords[0];
    const traceRecords = await db
      .select()
      .from(traces)
      .where(eq(traces.id, share.traceId))
      .limit(1);

    if (traceRecords.length === 0) {
      return NextResponse.json({ error: "Trace not found" }, { status: 404 });
    }

    const traceRow = traceRecords[0];

    // If trace has an S3 key, retrieve full trace blob from Neon Object Storage
    if (traceRow.s3Key && isS3Configured) {
      const s3Res = await downloadTraceBlob(traceRow.s3Key);
      if (s3Res.success && s3Res.content) {
        const parsed = parseRvtsTrace(s3Res.content);
        if (parsed.trace) {
          return NextResponse.json({
            success: true,
            source: "neon_s3",
            trace: parsed.trace,
            manifest: parsed.trace.manifest,
            totalSteps: traceRow.totalSteps,
          });
        }
      }
    }

    // Fallback if S3 blob not present
    return NextResponse.json({
      success: true,
      source: "neon_db_manifest",
      manifest: traceRow.manifestJson,
      totalSteps: traceRow.totalSteps,
      finalLoss: traceRow.finalLoss,
    });
  } catch (err: any) {
    console.error("Fetch shared trace error:", err);
    return NextResponse.json(
      { error: "Failed to retrieve trace", details: err?.message },
      { status: 500 }
    );
  }
}

