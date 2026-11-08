import {
  RvtsManifestRecord,
  RvtsStepRecord,
  RvtsValidationResult,
  RvtsRecord,
} from "./types";

/**
 * Validates RVTS records for structural and semantic correctness.
 */
export function validateRvtsManifest(record: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!record || typeof record !== "object") {
    return { valid: false, errors: ["Manifest record must be an object."] };
  }

  const m = record as Partial<RvtsManifestRecord>;
  if (m.type !== "manifest") {
    errors.push("First record must have type 'manifest'.");
  }
  if (!m.version || m.version !== "0.1.0") {
    errors.push("Unsupported RVTS version. Expected '0.1.0'.");
  }
  if (!m.run_id || typeof m.run_id !== "string") {
    errors.push("Manifest requires a non-empty string 'run_id'.");
  }
  if (!m.producer || typeof m.producer !== "object" || !m.producer.name) {
    errors.push("Manifest requires 'producer' with a name.");
  }
  if (!m.model_or_objective || typeof m.model_or_objective !== "object") {
    errors.push("Manifest requires 'model_or_objective' specification.");
  }

  return { valid: errors.length === 0, errors };
}

export function validateRvtsStep(
  record: unknown,
  previousStep: number | null
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!record || typeof record !== "object") {
    return { valid: false, errors: ["Step record must be an object."] };
  }

  const s = record as Partial<RvtsStepRecord>;
  if (s.type !== "step") {
    errors.push("Expected record type 'step'.");
  }
  if (typeof s.step !== "number" || !Number.isInteger(s.step) || s.step < 0) {
    errors.push(`Step index must be a non-negative integer. Got: ${s.step}`);
  } else if (previousStep !== null && s.step <= previousStep) {
    errors.push(`Step sequence must be strictly increasing: step ${s.step} follows ${previousStep}.`);
  }

  if (!s.metrics || typeof s.metrics !== "object") {
    errors.push("Step record requires a 'metrics' object.");
  } else {
    if (typeof s.metrics.loss !== "number") {
      errors.push("Step record must contain a numerical 'loss' in metrics.");
    }
    for (const [key, val] of Object.entries(s.metrics)) {
      if (typeof val !== "number") {
        errors.push(`Metric '${key}' must be a numerical value.`);
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

export function validateFullTraceRecords(records: RvtsRecord[]): RvtsValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (records.length === 0) {
    return { valid: false, errors: ["Trace file is empty."], warnings };
  }

  // 1. First record must be manifest
  const manifestResult = validateRvtsManifest(records[0]);
  if (!manifestResult.valid) {
    errors.push(...manifestResult.errors);
  }

  let lastStep: number | null = null;
  let stepCount = 0;

  for (let i = 1; i < records.length; i++) {
    const rec = records[i];
    if (rec.type === "step") {
      const stepResult = validateRvtsStep(rec, lastStep);
      if (!stepResult.valid) {
        errors.push(`Line ${i + 1}: ${stepResult.errors.join("; ")}`);
      }
      lastStep = rec.step;
      stepCount++;
    } else if (rec.type === "event") {
      if (typeof rec.step !== "number") {
        errors.push(`Line ${i + 1}: Event record requires a numeric 'step'.`);
      }
      if (!rec.message) {
        warnings.push(`Line ${i + 1}: Event record has empty message.`);
      }
    } else if (rec.type === "footer") {
      if (i !== records.length - 1) {
        warnings.push(`Line ${i + 1}: Footer record found before the end of the trace.`);
      }
    }
  }

  if (stepCount === 0) {
    warnings.push("Trace contains no step records.");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
