import { describe, it, expect } from "vitest";
import {
  detectDivergence,
  detectPlateau,
  detectLrInstability,
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
});

