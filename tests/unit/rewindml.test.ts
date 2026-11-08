import { describe, it, expect } from "vitest";
import {
  QUADRATIC_OBJECTIVE,
  ROSENBROCK_OBJECTIVE,
  runOptimizationSimulation,
  trainLogisticRegression,
  generateBlobsDataset,
  createPrng,
} from "@rewindverse/rewindml";

describe("RewindML Mathematical Engine", () => {
  it("computes exact analytical values and gradients for Quadratic Bowl", () => {
    // f(x, y) = 0.5 * (x^2 + 10 * y^2)
    const val = QUADRATIC_OBJECTIVE.evaluate(2, 1);
    expect(val).toBe(0.5 * (4 + 10 * 1)); // 7.0

    const grad = QUADRATIC_OBJECTIVE.gradient(2, 1);
    expect(grad[0]).toBe(2); // dx = x = 2
    expect(grad[1]).toBe(10); // dy = 10 * y = 10
  });

  it("computes Rosenbrock global minimum at (1, 1)", () => {
    const val = ROSENBROCK_OBJECTIVE.evaluate(1, 1);
    expect(val).toBe(0);

    const grad = ROSENBROCK_OBJECTIVE.gradient(1, 1);
    expect(grad[0]).toBe(0);
    expect(grad[1]).toBe(0);
  });

  it("runs deterministic simulation with seed", () => {
    const sim1 = runOptimizationSimulation({
      objective: "quadratic",
      optimizer: { type: "adam", learningRate: 0.1, beta1: 0.9, beta2: 0.999, epsilon: 1e-8 },
      initialPoint: [-3, 3],
      maxSteps: 20,
      seed: 42,
    });

    const sim2 = runOptimizationSimulation({
      objective: "quadratic",
      optimizer: { type: "adam", learningRate: 0.1, beta1: 0.9, beta2: 0.999, epsilon: 1e-8 },
      initialPoint: [-3, 3],
      maxSteps: 20,
      seed: 42,
    });

    expect(sim1.stepResults[20].loss).toBeCloseTo(sim2.stepResults[20].loss, 8);
    expect(sim1.stepResults[20].x).toBeCloseTo(sim2.stepResults[20].x, 8);
  });

  it("trains logistic regression and reduces BCE loss", () => {
    const dataset = generateBlobsDataset(40, 123);
    const result = trainLogisticRegression({
      dataset,
      learningRate: 0.2,
      maxEpochs: 25,
    });

    const initialLoss = result.history[0].loss;
    const finalLoss = result.history[25].loss;
    expect(finalLoss).toBeLessThan(initialLoss);
    expect(result.history[25].accuracy).toBeGreaterThanOrEqual(0.85);
  });
});

