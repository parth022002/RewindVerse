import { describe, it, expect } from "vitest";
import {
  QUADRATIC_OBJECTIVE,
  ROSENBROCK_OBJECTIVE,
  runOptimizationSimulation,
  trainLogisticRegression,
  generateBlobsDataset,
  createPrng,
  ALGORITHM_CATALOG,
  getAlgorithmById,
  getAlgorithmsByCategory,
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

  it("validates that master algorithm catalogue meets specification coverage", () => {
    expect(ALGORITHM_CATALOG.length).toBeGreaterThanOrEqual(50);

    const requiredCategories = [
      "Optimization",
      "Supervised ML",
      "Unsupervised ML",
      "Deep Learning",
      "Generative AI",
      "Reinforcement Learning",
      "Metrics & Diagnostics",
    ];

    for (const cat of requiredCategories) {
      const items = getAlgorithmsByCategory(cat as any);
      expect(items.length).toBeGreaterThan(0);
    }

    // Check specific essential algorithms
    expect(getAlgorithmById("optim.sgd")).toBeDefined();
    expect(getAlgorithmById("optim.adam")).toBeDefined();
    expect(getAlgorithmById("optim.lbfgs")).toBeDefined();
    expect(getAlgorithmById("supervised.svm_rbf")).toBeDefined();
    expect(getAlgorithmById("supervised.random_forest")).toBeDefined();
    expect(getAlgorithmById("unsupervised.dbscan")).toBeDefined();
    expect(getAlgorithmById("neural.multihead_attention")).toBeDefined();
    expect(getAlgorithmById("genai.vae")).toBeDefined();
    expect(getAlgorithmById("rl.ppo")).toBeDefined();
    expect(getAlgorithmById("xai.shap")).toBeDefined();

    // Verify all entries have complete mathematical and trace metadata
    for (const algo of ALGORITHM_CATALOG) {
      expect(algo.id).toBeTruthy();
      expect(algo.name).toBeTruthy();
      expect(algo.mathEquation.length).toBeGreaterThan(0);
      expect(algo.learningObjectives.length).toBeGreaterThan(0);
      expect(algo.assumptions.length).toBeGreaterThan(0);
      expect(algo.hyperparameters.length).toBeGreaterThanOrEqual(0);
    }
  });
});

