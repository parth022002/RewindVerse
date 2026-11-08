import {
  RvtsManifestRecord,
  RvtsStepRecord,
  RvtsFooterRecord,
  RvtsParsedTrace,
} from "./types";
import { extractCapabilities } from "./capabilities";
import { serializeRvtsTrace } from "./parser";

export interface CsvColumnMapping {
  stepColumn?: string;
  lossColumn?: string;
  lrColumn?: string;
  valLossColumn?: string;
  accuracyColumn?: string;
  runName?: string;
}

export interface CsvPreviewResult {
  headers: string[];
  rows: Record<string, string>[];
  detectedMapping: CsvColumnMapping;
  totalLines: number;
}

/**
 * Safely parse a single CSV line accounting for quoted fields with commas.
 */
export function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

/**
 * Strips dangerous spreadsheet formula injection prefixes (=, +, -, @, \t, \r)
 * per Security Architecture Section 6.2.
 */
export function sanitizeCell(value: string): string {
  const trimmed = value.trim();
  if (/^[=+\-@\t\r]/.test(trimmed)) {
    return trimmed.substring(1).trim();
  }
  return trimmed;
}

/**
 * Inspects CSV headers and provides automated column mapping suggestions.
 */
export function detectCsvMapping(headers: string[]): CsvColumnMapping {
  const mapping: CsvColumnMapping = {};

  for (const h of headers) {
    const norm = h.toLowerCase().trim().replace(/['"]+/g, "");

    if (!mapping.stepColumn && /^(step|iteration|epoch|iter|i)$/i.test(norm)) {
      mapping.stepColumn = h;
    } else if (
      !mapping.lossColumn &&
      /^(loss|train_loss|training_loss|cost|bce|mse|loss_train)$/i.test(norm)
    ) {
      mapping.lossColumn = h;
    } else if (
      !mapping.lrColumn &&
      /^(lr|learning_rate|step_size|eta)$/i.test(norm)
    ) {
      mapping.lrColumn = h;
    } else if (
      !mapping.valLossColumn &&
      /^(val_loss|validation_loss|test_loss|eval_loss)$/i.test(norm)
    ) {
      mapping.valLossColumn = h;
    } else if (
      !mapping.accuracyColumn &&
      /^(acc|accuracy|val_acc|validation_acc|top1_acc)$/i.test(norm)
    ) {
      mapping.accuracyColumn = h;
    }
  }

  return mapping;
}

/**
 * Returns header names and the first few rows for interactive user preview.
 */
export function parseCsvHeadersAndPreview(
  csvText: string,
  previewRowCount = 5
): CsvPreviewResult {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) {
    return {
      headers: [],
      rows: [],
      detectedMapping: {},
      totalLines: 0,
    };
  }

  const rawHeaders = parseCsvLine(lines[0]);
  const headers = rawHeaders.map((h) => sanitizeCell(h));
  const detectedMapping = detectCsvMapping(headers);

  const rows: Record<string, string>[] = [];
  const limit = Math.min(lines.length, previewRowCount + 1);

  for (let i = 1; i < limit; i++) {
    const cells = parseCsvLine(lines[i]);
    const rowObj: Record<string, string> = {};
    headers.forEach((h, colIdx) => {
      rowObj[h] = cells[colIdx] ? sanitizeCell(cells[colIdx]) : "";
    });
    rows.push(rowObj);
  }

  return {
    headers,
    rows,
    detectedMapping,
    totalLines: lines.length - 1,
  };
}

/**
 * Converts CSV contents into a fully compliant RVTS Trace.
 */
export function convertCsvToRvts(
  csvText: string,
  userMapping?: CsvColumnMapping
): {
  trace: RvtsParsedTrace;
  jsonl: string;
  errors: string[];
} {
  const errors: string[] = [];
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);

  if (lines.length < 2) {
    return {
      trace: null as any,
      jsonl: "",
      errors: ["CSV must contain a header row and at least one data row."],
    };
  }

  const headers = parseCsvLine(lines[0]).map((h) => sanitizeCell(h));
  const mapping = {
    ...detectCsvMapping(headers),
    ...(userMapping || {}),
  };

  const lossCol = mapping.lossColumn;
  if (!lossCol) {
    errors.push("No loss column was specified or automatically detected in CSV.");
  }

  const stepCol = mapping.stepColumn;
  const lrCol = mapping.lrColumn;
  const valLossCol = mapping.valLossColumn;
  const accCol = mapping.accuracyColumn;

  const runId = `csv_run_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const runName = mapping.runName || "Imported CSV Run";

  const manifest: RvtsManifestRecord = {
    type: "manifest",
    version: "0.1.0",
    run_id: runId,
    name: runName,
    created_at: new Date().toISOString(),
    producer: {
      name: "RewindVerse CSV Ingestor",
      version: "1.0.0",
      framework: "CSV Import",
    },
    model_or_objective: {
      name: "Tabular Metrics Model",
      type: "custom",
    },
    hyperparameters: {},
    declared_capabilities: {
      has_loss: Boolean(lossCol),
      has_parameters: false,
      has_gradients: false,
      step_unit: stepCol?.toLowerCase().includes("epoch") ? "epoch" : "step",
    },
  };

  const steps: RvtsStepRecord[] = [];

  for (let i = 1; i < lines.length; i++) {
    const rawCells = parseCsvLine(lines[i]);
    if (rawCells.length === 0 || (rawCells.length === 1 && !rawCells[0])) {
      continue;
    }

    const rowMap: Record<string, string> = {};
    headers.forEach((h, idx) => {
      rowMap[h] = rawCells[idx] ? sanitizeCell(rawCells[idx]) : "";
    });

    // Step resolution
    let stepNum = i - 1;
    if (stepCol && rowMap[stepCol] !== undefined) {
      const parsedStep = parseInt(rowMap[stepCol], 10);
      if (!isNaN(parsedStep)) {
        stepNum = parsedStep;
      }
    }

    // Loss resolution
    let lossVal = 0;
    if (lossCol && rowMap[lossCol] !== undefined) {
      const parsedLoss = parseFloat(rowMap[lossCol]);
      if (isFinite(parsedLoss)) {
        lossVal = parsedLoss;
      } else {
        continue; // skip non-finite row or malformed
      }
    }

    const metrics: { loss: number; [key: string]: number | undefined } = {
      loss: lossVal,
    };

    if (lrCol && rowMap[lrCol] !== undefined) {
      const lr = parseFloat(rowMap[lrCol]);
      if (isFinite(lr)) metrics.lr = lr;
    }

    if (valLossCol && rowMap[valLossCol] !== undefined) {
      const vl = parseFloat(rowMap[valLossCol]);
      if (isFinite(vl)) metrics.val_loss = vl;
    }

    if (accCol && rowMap[accCol] !== undefined) {
      const acc = parseFloat(rowMap[accCol]);
      if (isFinite(acc)) metrics.accuracy = acc;
    }

    steps.push({
      type: "step",
      step: stepNum,
      metrics,
    });
  }

  // Ensure steps are monotonically sorted
  steps.sort((a, b) => a.step - b.step);

  const footer: RvtsFooterRecord = {
    type: "footer",
    total_steps: steps.length,
    status: "completed",
  };

  const capabilities = extractCapabilities(manifest, steps);
  const trace: RvtsParsedTrace = {
    manifest,
    steps,
    events: [],
    checkpoints: [],
    footer,
    capabilities,
  };

  const jsonl = serializeRvtsTrace(trace);

  return {
    trace,
    jsonl,
    errors,
  };
}
