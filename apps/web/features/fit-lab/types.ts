export type TaskFamily =
  | "classification"
  | "regression"
  | "forecasting"
  | "clustering"
  | "optimization";

export type EvaluationStrategy =
  | "random_holdout"
  | "stratified_kfold"
  | "rolling_origin"
  | "nested_kfold";

export type LeakagePolicy = "strict" | "standard";

export interface ProblemSpec {
  problemId: string;
  taskFamily: TaskFamily;
  title: string;
  description: string;
  datasetName: string;
  targetColumn: string;
  featureColumns: string[];
  primaryMetric: string;
  secondaryMetrics: string[];
  constraints: {
    maxRuntimeSeconds: number;
    maxMemoryMb: number;
    interpretability: "essential" | "preferred" | "optional";
  };
  evaluationStrategy: EvaluationStrategy;
  leakagePolicy: LeakagePolicy;
}

export interface CandidateAlgorithm {
  id: string;
  name: string;
  family: TaskFamily;
  isBaseline: boolean;
  interpretability: "high" | "medium" | "blackbox";
  computeCost: "low" | "medium" | "high";
  compatibilityScore: number; // 0-100
  inclusionReason: string;
  exclusionReason?: string;
  primaryMetricValue: number;
  uncertaintyStd: number;
  runtimeMs: number;
  status: "promising" | "potentially_useful" | "no_advantage" | "unsuitable";
}

export interface FitReport {
  problemSummary: ProblemSpec;
  sampleSize: number;
  candidates: CandidateAlgorithm[];
  baselineId: string;
  topPerformerId: string;
  conditionalRecommendation: string;
  limitations: string[];
  generatedAt: string;
}
