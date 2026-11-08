import {
  RvtsParsedTrace,
  RvtsRecord,
  RvtsManifestRecord,
  RvtsStepRecord,
  RvtsEventRecord,
  RvtsCheckpointRecord,
  RvtsFooterRecord,
} from "./types";
import { validateFullTraceRecords } from "./validator";
import { extractCapabilities } from "./capabilities";

export interface ParseTraceOptions {
  maxLines?: number;
  maxLineLength?: number;
}

const DEFAULT_MAX_LINES = 100_000;
const DEFAULT_MAX_LINE_LENGTH = 1_000_000; // 1MB per line

/**
 * Safely parses a JSON Lines RVTS trace string into strongly-typed in-memory structures.
 */
export function parseRvtsTrace(
  rawContent: string,
  options?: ParseTraceOptions
): { trace: RvtsParsedTrace | null; errors: string[]; warnings: string[] } {
  const maxLines = options?.maxLines ?? DEFAULT_MAX_LINES;
  const maxLineLength = options?.maxLineLength ?? DEFAULT_MAX_LINE_LENGTH;

  const lines = rawContent.split(/\r?\n/);
  if (lines.length > maxLines) {
    return {
      trace: null,
      errors: [`File exceeds maximum allowed line count of ${maxLines.toLocaleString()}.`],
      warnings: [],
    };
  }

  const records: RvtsRecord[] = [];
  const parseErrors: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    if (line.length > maxLineLength) {
      parseErrors.push(`Line ${i + 1} exceeds maximum character limit (${maxLineLength}).`);
      break;
    }

    try {
      const parsed = JSON.parse(line);
      records.push(parsed as RvtsRecord);
    } catch {
      parseErrors.push(`Line ${i + 1}: Invalid JSON syntax.`);
    }
  }

  if (parseErrors.length > 0) {
    return { trace: null, errors: parseErrors, warnings: [] };
  }

  const validation = validateFullTraceRecords(records);
  if (!validation.valid) {
    return { trace: null, errors: validation.errors, warnings: validation.warnings };
  }

  const manifest = records[0] as RvtsManifestRecord;
  const steps: RvtsStepRecord[] = [];
  const events: RvtsEventRecord[] = [];
  const checkpoints: RvtsCheckpointRecord[] = [];
  let footer: RvtsFooterRecord | undefined = undefined;

  for (let i = 1; i < records.length; i++) {
    const rec = records[i];
    switch (rec.type) {
      case "step":
        steps.push(rec);
        break;
      case "event":
        events.push(rec);
        break;
      case "checkpoint":
        checkpoints.push(rec);
        break;
      case "footer":
        footer = rec;
        break;
    }
  }

  const capabilities = extractCapabilities(manifest, steps);

  return {
    trace: {
      manifest,
      steps,
      events,
      checkpoints,
      footer,
      capabilities,
    },
    errors: [],
    warnings: validation.warnings,
  };
}

/**
 * Serializes trace records to RVTS JSON Lines string.
 */
export function serializeRvtsTrace(trace: {
  manifest: RvtsManifestRecord;
  steps: RvtsStepRecord[];
  events?: RvtsEventRecord[];
  checkpoints?: RvtsCheckpointRecord[];
  footer?: RvtsFooterRecord;
}): string {
  const lines: string[] = [];
  lines.push(JSON.stringify(trace.manifest));

  for (const step of trace.steps) {
    lines.push(JSON.stringify(step));
  }

  if (trace.events) {
    for (const event of trace.events) {
      lines.push(JSON.stringify(event));
    }
  }

  if (trace.checkpoints) {
    for (const checkpoint of trace.checkpoints) {
      lines.push(JSON.stringify(checkpoint));
    }
  }

  if (trace.footer) {
    lines.push(JSON.stringify(trace.footer));
  }

  return lines.join("\n");
}
