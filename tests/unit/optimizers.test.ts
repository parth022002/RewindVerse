import { describe, it, expect } from "vitest";
import {
  QUADRATIC_OBJECTIVE,
  createOptimizer,
  runOptimizationSimulation,
} from "@rewindverse/rewindml";

describe("Extended Optimizers (AdamW, RMSProp, Adagrad)", () => {
  it("AdamW decays parameter norm when weight decay is applied", () => {
    const simNoDecay = runOptimizationSimulation({
      objective: "quadratic",
      optimizer: {
        type: "adamw",
        learningRate: 0.05,
        beta1: 0.9,
        beta2: 0.999,
        epsilon: 1e-8,
        weightDecay: 0.0,
      },
      initialPoint: [2.0, 2.0],
      maxSteps: 25,
      seed: 42,
    });

    const simWithDecay = runOptimizationSimulation({
      objective: "quadratic",
      optimizer: {
        type: "adamw",
        learningRate: 0.05,
        beta1: 0.9,
        beta2: 0.999,
        epsilon: 1e-8,
        weightDecay: 0.1,
      },
      initialPoint: [2.0, 2.0],
      maxSteps: 25,
      seed: 42,
    });

    const finalDistNoDecay = Math.hypot(simNoDecay.stepResults[25].x, simNoDecay.stepResults[25].y);
    const finalDistWithDecay = Math.hypot(simWithDecay.stepResults[25].x, simWithDecay.stepResults[25].y);

    expect(finalDistWithDecay).toBeLessThan(finalDistNoDecay);
  });

  it("RMSProp stabilizes step sizes on quadratic ravine", () => {
    const sim = runOptimizationSimulation({
      objective: "quadratic",
      optimizer: {
        type: "rmsprop",
        learningRate: 0.08,
        decayRate: 0.95,
        epsilon: 1e-8,
      },
      initialPoint: [3.0, 3.0],
      maxSteps: 30,
      seed: 42,
    });

    expect(sim.diverged).toBe(false);
    expect(sim.stepResults[30].loss).toBeLessThan(sim.stepResults[0].loss);
  });

  it("Adagrad accumulates squared gradients monotonically", () => {
    const opt = createOptimizer({
      type: "adagrad",
      learningRate: 0.1,
      epsilon: 1e-8,
    });

    // Step 1: large gradient [10, 10]
    const p1 = opt.step([1.0, 1.0], [10, 10], 1);
    // Delta should be ~ 0.1 * 10 / sqrt(100) = 0.1
    expect(p1[0]).toBeCloseTo(0.9, 1);

    // Step 2: another large gradient [10, 10] -> accumulated G is 200 -> delta smaller
    const p2 = opt.step(p1, [10, 10], 2);
    const delta1 = 1.0 - p1[0];
    const delta2 = p1[0] - p2[0];
    expect(delta2).toBeLessThan(delta1);
  });
});

