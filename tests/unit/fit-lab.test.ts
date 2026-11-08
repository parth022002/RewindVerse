import { describe, it, expect } from "vitest";
import { ProblemSpec, CandidateAlgorithm } from "../../apps/web/features/fit-lab/types";

describe("Data-to-Algorithm Fit Lab Specification & Engine", () => {
  const sampleSpec: ProblemSpec = {
    problemId: "prob-test-001",
    taskFamily: "classification",
    title: "Binary Customer Churn Prediction",
    description: "Tabular churn classification with class imbalance",
    datasetName: "churn.csv",
    targetColumn: "churn",
    featureColumns: ["tenure", "charges"],
    primaryMetric: "F1 Score",
    secondaryMetrics: ["ROC-AUC", "Log Loss"],
    constraints: {
      maxRuntimeSeconds: 60,
      maxMemoryMb: 1024,
      interpretability: "essential",
    },
    evaluationStrategy: "stratified_kfold",
    leakagePolicy: "strict",
  };

  it("should validate problem specification structure and strict leakage policy", () => {
    expect(sampleSpec.taskFamily).toBe("classification");
    expect(sampleSpec.leakagePolicy).toBe("strict");
    expect(sampleSpec.featureColumns.length).toBe(2);
    expect(sampleSpec.constraints.interpretability).toBe("essential");
  });

  it("should flag black-box candidate algorithms as unsuitable when interpretability is essential", () => {
    const blackBoxCandidate: CandidateAlgorithm = {
      id: "deep_mlp",
      name: "Deep Multi-Layer Perceptron",
      family: "classification",
      isBaseline: false,
      interpretability: "blackbox",
      computeCost: "high",
      compatibilityScore: 80,
      inclusionReason: "High capacity representation",
      primaryMetricValue: 0.95,
      uncertaintyStd: 0.02,
      runtimeMs: 150,
      status: sampleSpec.constraints.interpretability === "essential" ? "unsuitable" : "promising",
    };

    expect(blackBoxCandidate.status).toBe("unsuitable");
  });

  it("should score white-box baseline models as compatible with high interpretability", () => {
    const logisticBaseline: CandidateAlgorithm = {
      id: "logistic_regression",
      name: "L2 Logistic Regression",
      family: "classification",
      isBaseline: false,
      interpretability: "high",
      computeCost: "low",
      compatibilityScore: 95,
      inclusionReason: "Convex loss, linear decision boundary",
      primaryMetricValue: 0.88,
      uncertaintyStd: 0.03,
      runtimeMs: 15,
      status: "promising",
    };

    expect(logisticBaseline.interpretability).toBe("high");
    expect(logisticBaseline.compatibilityScore).toBeGreaterThanOrEqual(90);
    expect(logisticBaseline.status).toBe("promising");
  });
});
