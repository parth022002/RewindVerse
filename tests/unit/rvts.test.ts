import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import {
  parseRvtsTrace,
  serializeRvtsTrace,
  validateFullTraceRecords,
  RvtsManifestRecord,
  RvtsStepRecord,
} from "@rewindverse/rvts";

describe("RVTS Core Specification & Validator", () => {
  const validManifest: RvtsManifestRecord = {
    type: "manifest",
    version: "0.1.0",
    run_id: "test_run_123",
    name: "Unit Test Experiment",
    created_at: new Date().toISOString(),
    producer: {
      name: "RewindTest",
      version: "1.0.0",
    },
    model_or_objective: {
      name: "Quadratic",
      type: "2d_loss_landscape",
    },
    hyperparameters: { lr: 0.01 },
    declared_capabilities: { has_loss: true, step_unit: "step" },
  };

  const validSteps: RvtsStepRecord[] = [
    { type: "step", step: 0, metrics: { loss: 5.0 } },
    { type: "step", step: 1, metrics: { loss: 4.2 } },
    { type: "step", step: 2, metrics: { loss: 3.5 } },
  ];

  it("validates a well-formed RVTS trace", () => {
    const result = validateFullTraceRecords([validManifest, ...validSteps]);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("catches non-monotonic step indices", () => {
    const badSteps: RvtsStepRecord[] = [
      { type: "step", step: 0, metrics: { loss: 5.0 } },
      { type: "step", step: 2, metrics: { loss: 4.2 } },
      { type: "step", step: 1, metrics: { loss: 3.5 } }, // Out of order!
    ];

    const result = validateFullTraceRecords([validManifest, ...badSteps]);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("strictly increasing"))).toBe(true);
  });

  it("serializes and parses round-trip with capability extraction", () => {
    const jsonl = serializeRvtsTrace({
      manifest: validManifest,
      steps: validSteps,
    });

    const parsed = parseRvtsTrace(jsonl);
    expect(parsed.trace).not.toBeNull();
    expect(parsed.trace?.manifest.run_id).toBe("test_run_123");
    expect(parsed.trace?.steps).toHaveLength(3);
    expect(parsed.trace?.capabilities.has_loss).toBe(true);
    expect(parsed.trace?.capabilities.has_gradients).toBe(false); // Gradients were omitted
  });

  describe("Cross-Language Shared Conformance Fixtures", () => {
    const fixturesDir = path.resolve(__dirname, "../../fixtures/rvts");

    it("accepts valid_minimal.rvtrace", () => {
      const content = fs.readFileSync(path.join(fixturesDir, "valid_minimal.rvtrace"), "utf-8");
      const parsed = parseRvtsTrace(content);
      expect(parsed.errors).toHaveLength(0);
      expect(parsed.trace).not.toBeNull();
      expect(parsed.trace?.steps).toHaveLength(3);
    });

    it("rejects invalid_non_monotonic.rvtrace", () => {
      const content = fs.readFileSync(path.join(fixturesDir, "invalid_non_monotonic.rvtrace"), "utf-8");
      const parsed = parseRvtsTrace(content);
      expect(parsed.errors.length).toBeGreaterThan(0);
      expect(parsed.errors.some((e) => e.includes("increasing"))).toBe(true);
    });

    it("rejects invalid_missing_loss.rvtrace", () => {
      const content = fs.readFileSync(path.join(fixturesDir, "invalid_missing_loss.rvtrace"), "utf-8");
      const parsed = parseRvtsTrace(content);
      expect(parsed.errors.length).toBeGreaterThan(0);
      expect(parsed.errors.some((e) => e.includes("loss"))).toBe(true);
    });

    it("rejects invalid_no_manifest.rvtrace", () => {
      const content = fs.readFileSync(path.join(fixturesDir, "invalid_no_manifest.rvtrace"), "utf-8");
      const parsed = parseRvtsTrace(content);
      expect(parsed.errors.length).toBeGreaterThan(0);
      expect(parsed.errors.some((e) => e.includes("manifest"))).toBe(true);
    });
  });
});

