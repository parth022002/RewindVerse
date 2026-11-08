import { describe, it, expect } from "vitest";
import {
  detectDivergence,
  detectPlateau,
  detectLrInstability,
  detectOverfitting,
  analyzeTraceDiagnostics,
} from "@rewindverse/diagnostics";
import { RvtsStepRecord, RvtsParsedTrace } from "@rewindverse/rvts";

describe("Rewind Insights Diagnostic Detectors", () => {
  it("detects numerical divergence when loss is NaN or infinite", () => {
    const steps: RvtsStepRecord[] = [
      { type: "step", step: 0, metrics: { loss: 1.0 } },
      { type: "step", step: 1, metrics: { loss: 2.5 } },
      { type: "step", step: 2, metrics: { loss: NaN } },
    ];

    const finding = detectDivergence(steps);
    expect(finding).not.toBeNull();
    expect(finding?.category).toBe("stability");
    expect(finding?.severity).toBe("critical");
  });

  it("detects plateau when loss relative delta is under threshold over window", () => {
    const steps: RvtsStepRecord[] = [];
    for (let i = 0; i < 20; i++) {
      // Very flat loss near 0.1
      steps.push({
        type: "step",
        step: i,
        metrics: { loss: 0.1 + i * 1e-6 },
      });
    }

    const finding = detectPlateau(steps, 10, 1e-3);
    expect(finding).not.toBeNull();
    expect(finding?.category).toBe("convergence");
  });

  it("detects oscillation in loss direction reversals", () => {
    const steps: RvtsStepRecord[] = [
      { type: "step", step: 0, metrics: { loss: 1.0 } },
      { type: "step", step: 1, metrics: { loss: 4.0 } },
      { type: "step", step: 2, metrics: { loss: 1.2 } },
      { type: "step", step: 3, metrics: { loss: 3.8 } },
      { type: "step", step: 4, metrics: { loss: 1.5 } },
      { type: "step", step: 5, metrics: { loss: 3.5 } },
      { type: "step", step: 6, metrics: { loss: 1.8 } },
      { type: "step", step: 7, metrics: { loss: 3.2 } },
    ];

    const finding = detectLrInstability(steps);
    expect(finding).not.toBeNull();
    expect(finding?.category).toBe("learning_rate");
  });

  it("strictly respects FR-DIAG-004: does not infer overfitting when val_loss is absent", () => {
    const steps: RvtsStepRecord[] = [
      { type: "step", step: 0, metrics: { loss: 1.0 } },
      { type: "step", step: 1, metrics: { loss: 0.8 } },
      { type: "step", step: 2, metrics: { loss: 0.6 } },
      { type: "step", step: 3, metrics: { loss: 0.4 } },
      { type: "step", step: 4, metrics: { loss: 0.2 } },
    ];
    const finding = detectOverfitting(steps);
    expect(finding).toBeNull();
  });

  it("detects overfitting onset when training loss drops while val_loss rises", () => {
    const steps: RvtsStepRecord[] = [
      { type: "step", step: 0, metrics: { loss: 2.0, val_loss: 2.2 } },
      { type: "step", step: 1, metrics: { loss: 1.6, val_loss: 1.8 } },
      { type: "step", step: 2, metrics: { loss: 1.2, val_loss: 1.5 } },
      { type: "step", step: 3, metrics: { loss: 0.9, val_loss: 1.6 } },
      { type: "step", step: 4, metrics: { loss: 0.7, val_loss: 1.8 } },
      { type: "step", step: 5, metrics: { loss: 0.5, val_loss: 2.1 } },
      { type: "step", step: 6, metrics: { loss: 0.4, val_loss: 2.5 } },
      { type: "step", step: 7, metrics: { loss: 0.3, val_loss: 3.0 } },
    ];
    const finding = detectOverfitting(steps, 4);
    expect(finding).not.toBeNull();
    expect(finding?.category).toBe("overfitting");
    expect(finding?.signalsUsed).toContain("metrics.val_loss");
  });
});

