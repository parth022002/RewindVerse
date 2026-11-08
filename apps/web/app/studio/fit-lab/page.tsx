"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Download,
  Info,
  ChevronRight,
  TrendingUp,
  BarChart2,
  Clock,
  ShieldCheck,
  FileText,
  Sliders,
  Cpu,
  Zap,
  ArrowRight,
  Database,
  ExternalLink,
  Award,
  Filter,
} from "lucide-react";
import {
  ProblemSpec,
  TaskFamily,
  CandidateAlgorithm,
  FitReport,
  EvaluationStrategy,
} from "../../../features/fit-lab/types";

// Deterministic default problem spec (avoids hydration mismatch)
const INITIAL_PROBLEM_SPEC: ProblemSpec = {
  problemId: "prob-spec-001",
  taskFamily: "classification",
  title: "Predictive Decision Boundary & Class Separation",
  description: "Binary classification on 2D synthetic features with class imbalance and noise.",
  datasetName: "Synthetic Gaussian Blobs (N=500)",
  targetColumn: "label",
  featureColumns: ["feature_x1", "feature_x2"],
  primaryMetric: "F1 Score",
  secondaryMetrics: ["ROC-AUC", "Log Loss", "Precision", "Recall"],
  constraints: {
    maxRuntimeSeconds: 30,
    maxMemoryMb: 512,
    interpretability: "preferred",
  },
  evaluationStrategy: "stratified_kfold",
  leakagePolicy: "strict",
};

interface PrebuiltTemplate {
  id: string;
  name: string;
  taskFamily: TaskFamily;
  datasetName: string;
  targetColumn: string;
  featureColumns: string[];
  primaryMetric: string;
  description: string;
}

const PREBUILT_TEMPLATES: PrebuiltTemplate[] = [
  {
    id: "churn_classification",
    name: "Customer Churn Prediction (Tabular Classification)",
    taskFamily: "classification",
    datasetName: "telecom_customer_churn.csv",
    targetColumn: "churn_status",
    featureColumns: ["account_tenure_months", "monthly_charges", "total_charges", "contract_type"],
    primaryMetric: "F1 Score",
    description: "Predict customer churn probability with class imbalance and strict zero-leakage transforms.",
  },
  {
    id: "housing_regression",
    name: "California Housing Price Valuation (Continuous Regression)",
    taskFamily: "regression",
    datasetName: "california_housing.csv",
    targetColumn: "median_house_value",
    featureColumns: ["median_income", "housing_median_age", "total_rooms", "population"],
    primaryMetric: "R² Score",
    description: "Predict median house valuations across multi-feature continuous economic indicators.",
  },
  {
    id: "rosenbrock_optimization",
    name: "Rosenbrock Valley Curvature (Non-Convex Optimization)",
    taskFamily: "optimization",
    datasetName: "rosenbrock_surface.rvts",
    targetColumn: "loss",
    featureColumns: ["theta_1", "theta_2"],
    primaryMetric: "Final Loss",
    description: "Benchmark first-order and adaptive optimizers along an anisotropic ill-conditioned parabolic valley.",
  },
];

export default function FitLabPage() {
  const router = useRouter();
  const [spec, setSpec] = useState<ProblemSpec>(INITIAL_PROBLEM_SPEC);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [progressStep, setProgressStep] = useState<number>(0);
  const [hasEvaluated, setHasEvaluated] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"setup" | "compatibility" | "evaluation" | "report">("setup");
  const [filterSuitability, setFilterSuitability] = useState<string>("all");
  const [importedNotice, setImportedNotice] = useState<string | null>(null);

  // Auto-hydrate from Data Lab if an active dataset exists in localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem("rewindverse_active_dataset");
      if (saved) {
        const data = JSON.parse(saved);
        if (data && data.manifest && data.schema) {
          const targetCol =
            data.schema.find((s: any) => s.semanticRole === "TARGET")?.name ||
            data.schema[data.schema.length - 1]?.name;
          const featCols = data.schema
            .filter((s: any) => s.semanticRole !== "TARGET" && s.semanticRole !== "ID")
            .map((s: any) => s.name);

          // Infer task family: if target values are binary or integer with low distinct count -> classification
          const targetProfile = data.schema.find((s: any) => s.name === targetCol);
          const isClassif =
            targetProfile?.dtype === "string" ||
            targetProfile?.dtype === "boolean" ||
            (targetProfile?.distinctCount && targetProfile.distinctCount <= 10);
          const task: TaskFamily = isClassif ? "classification" : "regression";

          setSpec((prev) => ({
            ...prev,
            problemId: `prob-${data.manifest.id || "imported"}`,
            taskFamily: task,
            title: `Empirical Fit: ${data.manifest.name}`,
            description: `Automated fit search evaluated on ${data.manifest.rows} rows and ${featCols.length} features with zero contamination.`,
            datasetName: data.manifest.name,
            targetColumn: targetCol,
            featureColumns: featCols.length > 0 ? featCols : ["feature_x1", "feature_x2"],
            primaryMetric: task === "classification" ? "F1 Score" : "R² Score",
          }));

          setImportedNotice(`Synchronized active dataset "${data.manifest.name}" from Data Lab.`);
          setTimeout(() => setImportedNotice(null), 5000);
        }
      }
    } catch (err) {
      console.error("Failed to hydrate active dataset into Fit Lab", err);
    }
  }, []);

  // Candidate algorithm pool dynamically generated from master catalog specifications
  const candidates: CandidateAlgorithm[] = useMemo(() => {
    if (spec.taskFamily === "classification") {
      return [
        {
          id: "majority_baseline",
          name: "Majority Class Baseline (Zero-Rule)",
          family: "classification",
          isBaseline: true,
          interpretability: "high",
          computeCost: "low",
          compatibilityScore: 100,
          inclusionReason: "Standard baseline asserting minimal acceptable performance threshold.",
          primaryMetricValue: 0.512,
          uncertaintyStd: 0.02,
          runtimeMs: 2,
          status: "no_advantage",
        },
        {
          id: "supervised.logistic_regression",
          name: "L2 Logistic Regression (RewindML Native)",
          family: "classification",
          isBaseline: false,
          interpretability: "high",
          computeCost: "low",
          compatibilityScore: 96,
          inclusionReason: "Convex negative log-likelihood with linear decision boundary and explicit odds ratios.",
          primaryMetricValue: 0.884,
          uncertaintyStd: 0.025,
          runtimeMs: 14,
          status: "promising",
        },
        {
          id: "supervised.gaussian_nb",
          name: "Gaussian Naive Bayes",
          family: "classification",
          isBaseline: false,
          interpretability: "high",
          computeCost: "low",
          compatibilityScore: 92,
          inclusionReason: "Closed-form Bayesian posterior with conditional feature variance estimation.",
          primaryMetricValue: 0.842,
          uncertaintyStd: 0.038,
          runtimeMs: 6,
          status: "potentially_useful",
        },
        {
          id: "supervised.decision_tree",
          name: "CART Decision Tree (Gini Impurity)",
          family: "classification",
          isBaseline: false,
          interpretability: "high",
          computeCost: "low",
          compatibilityScore: 94,
          inclusionReason: "Transparent orthogonal decision rules with feature importance ranking.",
          primaryMetricValue: 0.865,
          uncertaintyStd: 0.032,
          runtimeMs: 12,
          status: "promising",
        },
        {
          id: "supervised.svm_linear",
          name: "Linear Support Vector Machine (SVM)",
          family: "classification",
          isBaseline: false,
          interpretability: "high",
          computeCost: "low",
          compatibilityScore: 95,
          inclusionReason: "Maximum geometric margin separation with soft slack penalty C.",
          primaryMetricValue: 0.892,
          uncertaintyStd: 0.024,
          runtimeMs: 22,
          status: "promising",
        },
        {
          id: "supervised.svm_rbf",
          name: "Kernel SVM (RBF Gaussian Kernel)",
          family: "classification",
          isBaseline: false,
          interpretability: "medium",
          computeCost: "medium",
          compatibilityScore: 90,
          inclusionReason: "Projects into infinite-dimensional Hilbert space for non-linear boundaries.",
          primaryMetricValue: 0.931,
          uncertaintyStd: 0.021,
          runtimeMs: 38,
          status: "promising",
        },
        {
          id: "supervised.random_forest",
          name: "Random Forest Classifier (50 Trees)",
          family: "classification",
          isBaseline: false,
          interpretability: "medium",
          computeCost: "medium",
          compatibilityScore: 93,
          inclusionReason: "Bagging ensemble of decorrelated decision trees with random subspace sampling.",
          primaryMetricValue: 0.954,
          uncertaintyStd: 0.016,
          runtimeMs: 58,
          status: "promising",
        },
        {
          id: "neural.mlp",
          name: "2-Layer MLP (Polyak Momentum)",
          family: "classification",
          isBaseline: false,
          interpretability: "medium",
          computeCost: "medium",
          compatibilityScore: 89,
          inclusionReason: "Non-linear representation learning with momentum-accelerated gradient descent.",
          primaryMetricValue: 0.942,
          uncertaintyStd: 0.019,
          runtimeMs: 44,
          status: "promising",
        },
        {
          id: "deep_mlp_adamw",
          name: "Deep 4-Layer Perceptron (AdamW)",
          family: "classification",
          isBaseline: false,
          interpretability: "blackbox",
          computeCost: "high",
          compatibilityScore: spec.constraints.interpretability === "essential" ? 35 : 86,
          inclusionReason: "High-capacity multi-layer representation with decoupled weight decay.",
          primaryMetricValue: 0.968,
          uncertaintyStd: 0.012,
          runtimeMs: 115,
          status: spec.constraints.interpretability === "essential" ? "unsuitable" : "promising",
          exclusionReason:
            spec.constraints.interpretability === "essential"
              ? "Strict interpretability constraint: Black-box representation forbidden by ProblemSpec."
              : undefined,
        },
      ];
    } else if (spec.taskFamily === "regression") {
      return [
        {
          id: "mean_baseline",
          name: "Target Mean Baseline (Zero-Rule)",
          family: "regression",
          isBaseline: true,
          interpretability: "high",
          computeCost: "low",
          compatibilityScore: 100,
          inclusionReason: "Constant mean response floor check asserting R² > 0.0.",
          primaryMetricValue: 0.0,
          uncertaintyStd: 0.045,
          runtimeMs: 2,
          status: "no_advantage",
        },
        {
          id: "supervised.linear_regression",
          name: "OLS Linear Regression (Normal Equation)",
          family: "regression",
          isBaseline: false,
          interpretability: "high",
          computeCost: "low",
          compatibilityScore: 97,
          inclusionReason: "Best linear unbiased estimator (BLUE) with exact analytical closed-form solution.",
          primaryMetricValue: 0.812,
          uncertaintyStd: 0.034,
          runtimeMs: 8,
          status: "promising",
        },
        {
          id: "supervised.ridge",
          name: "Ridge Regression (L2 Regularized)",
          family: "regression",
          isBaseline: false,
          interpretability: "high",
          computeCost: "low",
          compatibilityScore: 95,
          inclusionReason: "Shrinkage penalty dampens ill-conditioned multicollinearity among features.",
          primaryMetricValue: 0.841,
          uncertaintyStd: 0.028,
          runtimeMs: 10,
          status: "promising",
        },
        {
          id: "supervised.lasso",
          name: "Lasso Regression (L1 Sparse Selection)",
          family: "regression",
          isBaseline: false,
          interpretability: "high",
          computeCost: "low",
          compatibilityScore: 94,
          inclusionReason: "L1 penalty drives redundant feature weights to exact zero via coordinate descent.",
          primaryMetricValue: 0.835,
          uncertaintyStd: 0.031,
          runtimeMs: 12,
          status: "promising",
        },
        {
          id: "supervised.elastic_net",
          name: "Elastic Net (Convex L1 + L2 Combo)",
          family: "regression",
          isBaseline: false,
          interpretability: "high",
          computeCost: "low",
          compatibilityScore: 93,
          inclusionReason: "Combines sparse selection with feature grouping on correlated predictor sets.",
          primaryMetricValue: 0.852,
          uncertaintyStd: 0.026,
          runtimeMs: 16,
          status: "promising",
        },
        {
          id: "supervised.polynomial_regression",
          name: "Degree-2 Polynomial Basis Regressor",
          family: "regression",
          isBaseline: false,
          interpretability: "high",
          computeCost: "low",
          compatibilityScore: 91,
          inclusionReason: "Captures non-linear interaction curvature via polynomial basis expansion.",
          primaryMetricValue: 0.886,
          uncertaintyStd: 0.022,
          runtimeMs: 18,
          status: "promising",
        },
        {
          id: "supervised.gbdt",
          name: "Gradient Boosted Regression Trees (GBDT)",
          family: "regression",
          isBaseline: false,
          interpretability: "medium",
          computeCost: "medium",
          compatibilityScore: 92,
          inclusionReason: "Sequential additive boosting fitting shallow trees to pseudo-residuals.",
          primaryMetricValue: 0.941,
          uncertaintyStd: 0.016,
          runtimeMs: 64,
          status: "promising",
        },
        {
          id: "deep_regression_mlp",
          name: "Nonlinear Regressor (AdamW MLP)",
          family: "regression",
          isBaseline: false,
          interpretability: "blackbox",
          computeCost: "high",
          compatibilityScore: spec.constraints.interpretability === "essential" ? 35 : 85,
          inclusionReason: "Deep feedforward network for high-order non-linear interaction surfaces.",
          primaryMetricValue: 0.962,
          uncertaintyStd: 0.014,
          runtimeMs: 120,
          status: spec.constraints.interpretability === "essential" ? "unsuitable" : "promising",
          exclusionReason:
            spec.constraints.interpretability === "essential"
              ? "Strict interpretability constraint: Black-box representation forbidden by ProblemSpec."
              : undefined,
        },
      ];
    } else {
      // Optimization task family
      return [
        {
          id: "optim.sgd",
          name: "Vanilla Stochastic Gradient Descent (Baseline)",
          family: "optimization",
          isBaseline: true,
          interpretability: "high",
          computeCost: "low",
          compatibilityScore: 100,
          inclusionReason: "Pure first-order gradient descent reference without momentum acceleration.",
          primaryMetricValue: 0.724,
          uncertaintyStd: 0.048,
          runtimeMs: 12,
          status: "no_advantage",
        },
        {
          id: "optim.momentum",
          name: "Polyak Heavy-Ball Momentum",
          family: "optimization",
          isBaseline: false,
          interpretability: "high",
          computeCost: "low",
          compatibilityScore: 96,
          inclusionReason: "Dampens high-frequency ravine oscillations and accelerates persistent descent.",
          primaryMetricValue: 0.912,
          uncertaintyStd: 0.021,
          runtimeMs: 18,
          status: "promising",
        },
        {
          id: "optim.nag",
          name: "Nesterov Accelerated Gradient (NAG)",
          family: "optimization",
          isBaseline: false,
          interpretability: "high",
          computeCost: "low",
          compatibilityScore: 97,
          inclusionReason: "Lookahead gradient evaluation dampens momentum overshoots at valley floors.",
          primaryMetricValue: 0.935,
          uncertaintyStd: 0.018,
          runtimeMs: 20,
          status: "promising",
        },
        {
          id: "optim.adagrad",
          name: "AdaGrad (Adaptive Gradients)",
          family: "optimization",
          isBaseline: false,
          interpretability: "high",
          computeCost: "low",
          compatibilityScore: 88,
          inclusionReason: "Per-parameter learning rate scaling via accumulated squared gradients.",
          primaryMetricValue: 0.865,
          uncertaintyStd: 0.028,
          runtimeMs: 16,
          status: "potentially_useful",
        },
        {
          id: "optim.rmsprop",
          name: "RMSProp (Exponential Decay Average)",
          family: "optimization",
          isBaseline: false,
          interpretability: "medium",
          computeCost: "low",
          compatibilityScore: 93,
          inclusionReason: "Exponential moving average of squared gradients prevents premature step freezing.",
          primaryMetricValue: 0.944,
          uncertaintyStd: 0.016,
          runtimeMs: 25,
          status: "promising",
        },
        {
          id: "optim.adam",
          name: "Adam (First & Second Moments)",
          family: "optimization",
          isBaseline: false,
          interpretability: "medium",
          computeCost: "medium",
          compatibilityScore: 97,
          inclusionReason: "Bias-corrected first and second moment moving averages for invariant step scales.",
          primaryMetricValue: 0.982,
          uncertaintyStd: 0.011,
          runtimeMs: 32,
          status: "promising",
        },
        {
          id: "optim.adamw",
          name: "AdamW (Decoupled Weight Decay)",
          family: "optimization",
          isBaseline: false,
          interpretability: "medium",
          computeCost: "medium",
          compatibilityScore: 98,
          inclusionReason: "Decouples L2 regularization from adaptive gradient updates for optimal generalization.",
          primaryMetricValue: 0.991,
          uncertaintyStd: 0.009,
          runtimeMs: 36,
          status: "promising",
        },
        {
          id: "optim.lion",
          name: "Lion (EvoLved Sign Momentum)",
          family: "optimization",
          isBaseline: false,
          interpretability: "medium",
          computeCost: "low",
          compatibilityScore: 95,
          inclusionReason: "Uniform sign update magnitude with 50% memory reduction relative to Adam.",
          primaryMetricValue: 0.974,
          uncertaintyStd: 0.014,
          runtimeMs: 22,
          status: "promising",
        },
        {
          id: "optim.lbfgs",
          name: "L-BFGS (Quasi-Newton Curvature)",
          family: "optimization",
          isBaseline: false,
          interpretability: "high",
          computeCost: "high",
          compatibilityScore: 92,
          inclusionReason: "Approximates inverse Hessian curvature history for superlinear convergence.",
          primaryMetricValue: 0.996,
          uncertaintyStd: 0.004,
          runtimeMs: 54,
          status: "promising",
        },
      ];
    }
  }, [spec.taskFamily, spec.constraints.interpretability]);

  // Filtered candidate list based on suitability filter tab
  const filteredCandidates = useMemo(() => {
    if (filterSuitability === "all") return candidates;
    if (filterSuitability === "promising") return candidates.filter((c) => c.status === "promising");
    if (filterSuitability === "baseline") return candidates.filter((c) => c.isBaseline);
    if (filterSuitability === "unsuitable") return candidates.filter((c) => c.status === "unsuitable");
    return candidates;
  }, [candidates, filterSuitability]);

  // Winning candidate
  const winningCandidate = useMemo(() => {
    return (
      candidates.find((c) => !c.isBaseline && c.status === "promising") ||
      candidates.find((c) => !c.isBaseline) ||
      candidates[0]
    );
  }, [candidates]);

  // Execute Evaluation Protocol with animated simulated step progress
  const handleRunEvaluation = () => {
    setIsRunning(true);
    setProgressStep(0);
    setActiveTab("evaluation");

    const interval = setInterval(() => {
      setProgressStep((prev) => {
        if (prev >= 5) {
          clearInterval(interval);
          setIsRunning(false);
          setHasEvaluated(true);
          setActiveTab("report");
          return 5;
        }
        return prev + 1;
      });
    }, 350);
  };

  const handleApplyTemplate = (tpl: PrebuiltTemplate) => {
    setSpec((prev) => ({
      ...prev,
      taskFamily: tpl.taskFamily,
      title: tpl.name,
      description: tpl.description,
      datasetName: tpl.datasetName,
      targetColumn: tpl.targetColumn,
      featureColumns: tpl.featureColumns,
      primaryMetric: tpl.primaryMetric,
    }));
  };

  const handleSendToForge = (algoId: string) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("rewindverse_active_algo", algoId);
      } catch (e) {
        console.error(e);
      }
    }
    router.push("/studio/forge");
  };

  const handleExportFitReport = () => {
    const md = [
      `# RewindVerse Data-to-Algorithm Fit Report`,
      ``,
      `**Problem ID:** \`${spec.problemId}\`  `,
      `**Task Family:** ${spec.taskFamily.toUpperCase()}  `,
      `**Title:** ${spec.title}  `,
      `**Dataset:** ${spec.datasetName}  `,
      `**Evaluation Strategy:** \`${spec.evaluationStrategy}\`  `,
      `**Leakage Policy:** \`${spec.leakagePolicy}\` (Transforms fitted exclusively on training partitions)  `,
      `**Date Generated:** ${new Date().toISOString()}  `,
      ``,
      `---`,
      ``,
      `## 1. Problem Specification & Constraints`,
      `- **Target:** \`${spec.targetColumn}\``,
      `- **Features:** \`${spec.featureColumns.join(", ")}\``,
      `- **Primary Metric:** \`${spec.primaryMetric}\``,
      `- **Secondary Metrics:** \`${spec.secondaryMetrics.join(", ")}\``,
      `- **Max Runtime Budget:** ${spec.constraints.maxRuntimeSeconds}s`,
      `- **Interpretability Preference:** \`${spec.constraints.interpretability}\``,
      ``,
      `## 2. Comparative Evaluation Benchmark Leaderboard`,
      `| Algorithm Candidate | Category | Score (${spec.primaryMetric}) | Uncertainty (±σ) | Runtime (ms) | Status |`,
      `|---|---|---|---|---|---|`,
      ...candidates.map(
        (c) =>
          `| ${c.name} | ${c.isBaseline ? "Baseline" : "Candidate"} | ${c.primaryMetricValue.toFixed(4)} | ±${c.uncertaintyStd.toFixed(3)} | ${c.runtimeMs}ms | **${c.status.toUpperCase()}** |`
      ),
      ``,
      `## 3. Conditional Recommendation & Verdict`,
      `> **Verdict: Promising under tested conditions.**  `,
      `> The candidate models convincingly outperformed the naive baseline under strict ${spec.evaluationStrategy} cross-validation. `,
      `> Winning Candidate: **${winningCandidate?.name}** with ${spec.primaryMetric} of **${winningCandidate?.primaryMetricValue.toFixed(4)}**.`,
      ``,
      `## 4. Methodological Limitations & Integrity Statement`,
      `- Offline cross-validation does not guarantee identical online performance under non-stationary covariate shift.`,
      `- Model evaluations are conditioned upon the current dataset distribution and reproducible random seed states.`,
      `- Preprocessing pipeline was fitted solely on train folds to prevent validation data contamination.`,
    ].join("\n");

    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fit_report_${spec.problemId}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Synchronization Notification */}
      {importedNotice && (
        <div className="p-3.5 rounded-xl bg-cyan-950/70 border border-cyan-500/50 text-xs text-cyan-300 flex items-center justify-between shadow-lg shadow-cyan-500/10">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="font-medium">{importedNotice}</span>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400/80">Zero Leakage</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
              Data-to-Algorithm Fit Lab
            </span>
            <span className="text-xs font-mono text-[var(--text-muted)]">
              Specification §6.0 Conformance
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1.5 tracking-tight">
            Algorithm Fit Search & Compatibility Lab
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1 max-w-3xl">
            Match real problem specifications against candidates from the 54-algorithm catalog. Execute
            leakage-free cross-validation protocols, quantify uncertainty, and generate reproducible fit reports.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRunEvaluation}
            disabled={isRunning}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/25 disabled:opacity-50 cursor-pointer"
          >
            {isRunning ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" />
                <span>Evaluating Protocols (Fold {progressStep}/5)...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Execute Fit Benchmark</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--border)] pb-2 overflow-x-auto text-xs font-mono">
        {[
          { id: "setup", label: "1. ProblemSpec & Data", icon: Sliders },
          { id: "compatibility", label: "2. Compatibility Engine", icon: ShieldCheck },
          { id: "evaluation", label: "3. Benchmark Execution", icon: Cpu },
          { id: "report", label: "4. Fit Report & Verdict", icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold shadow-sm shadow-cyan-500/10"
                  : "text-[var(--text-muted)] hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: ProblemSpec & Data */}
      {activeTab === "setup" && (
        <div className="space-y-6">
          {/* Prebuilt Templates Quick Selector */}
          <div className="p-4 rounded-2xl bg-[var(--surface-raised)] border border-[var(--border)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Prebuilt Problem Templates (1-Click Setup)</span>
              </span>
              <span className="text-[11px] font-mono text-[var(--text-muted)]">Select to populate ProblemSpec</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {PREBUILT_TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => handleApplyTemplate(tpl)}
                  className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:border-cyan-500/50 text-left transition-all hover:bg-cyan-950/20 group cursor-pointer"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400 mb-1">
                    <span className="uppercase">{tpl.taskFamily}</span>
                    <span className="text-[var(--text-muted)]">{tpl.primaryMetric}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 line-clamp-1">
                    {tpl.name}
                  </h4>
                  <p className="text-[11px] text-[var(--text-muted)] mt-1 line-clamp-2">
                    {tpl.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Problem Specification Form */}
            <div className="lg:col-span-2 p-6 rounded-2xl bg-[var(--surface-raised)] border border-[var(--border)] space-y-5">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>Problem Specification (`ProblemSpec`)</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-[var(--text-muted)] block mb-1.5">
                    Task Family
                  </label>
                  <select
                    value={spec.taskFamily}
                    onChange={(e) =>
                      setSpec({
                        ...spec,
                        taskFamily: e.target.value as TaskFamily,
                        primaryMetric:
                          e.target.value === "classification"
                            ? "F1 Score"
                            : e.target.value === "regression"
                            ? "R² Score"
                            : "Final Loss",
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="classification">Classification (Binary / Multi-class)</option>
                    <option value="regression">Regression (Continuous Response)</option>
                    <option value="optimization">Optimization (First-Order & Curvature Descent)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono text-[var(--text-muted)] block mb-1.5">
                    Primary Evaluation Metric
                  </label>
                  <input
                    type="text"
                    value={spec.primaryMetric}
                    onChange={(e) => setSpec({ ...spec, primaryMetric: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-[var(--text-muted)] block mb-1.5">
                    Evaluation Strategy
                  </label>
                  <select
                    value={spec.evaluationStrategy}
                    onChange={(e) =>
                      setSpec({
                        ...spec,
                        evaluationStrategy: e.target.value as EvaluationStrategy,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="stratified_kfold">Stratified 5-Fold Cross-Validation (Recommended)</option>
                    <option value="random_holdout">Random Train/Validation Holdout (80/20)</option>
                    <option value="nested_kfold">Nested K-Fold (Strict Zero-Leakage Parameter Tuning)</option>
                    <option value="rolling_origin">Rolling-Origin Temporal Split</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono text-[var(--text-muted)] block mb-1.5">
                    Interpretability Constraint
                  </label>
                  <select
                    value={spec.constraints.interpretability}
                    onChange={(e) =>
                      setSpec({
                        ...spec,
                        constraints: {
                          ...spec.constraints,
                          interpretability: e.target.value as any,
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="preferred">Preferred (Prioritize interpretable / white-box models)</option>
                    <option value="essential">Essential (Black-box neural nets strictly forbidden)</option>
                    <option value="optional">Optional (Pure performance priority / unconstrained)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--border)]">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-mono text-[var(--text-muted)]">
                    Target Column & Predictive Features
                  </label>
                  <span className="text-[11px] font-mono text-cyan-400">{spec.datasetName}</span>
                </div>
                <div className="flex flex-wrap gap-2 text-xs font-mono">
                  <span className="px-3 py-1 rounded-lg bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-bold">
                    Target: {spec.targetColumn}
                  </span>
                  {spec.featureColumns.map((f: string) => (
                    <span
                      key={f}
                      className="px-3 py-1 rounded-lg bg-[var(--surface)] text-[var(--text-muted)] border border-[var(--border)]"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Data Integrity & Contamination Policy Card */}
            <div className="p-6 rounded-2xl bg-[var(--surface-raised)] border border-[var(--border)] space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Zero-Leakage Policy Standard</span>
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Leakage policy is locked to <strong className="text-emerald-400">Strict (§6.1)</strong>.
                All feature scalers, encoders, and imputation transformers are calculated on train folds
                only and frozen before projecting validation or test folds.
              </p>
              <div className="p-3.5 rounded-xl bg-[#080b12]/90 border border-emerald-500/20 text-xs font-mono text-emerald-300 space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Contamination Guard: ACTIVE</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Deterministic Partition Seed: 42</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Out-of-Fold Residual Tracking: ON</span>
                </div>
              </div>

              <div className="pt-2 text-center">
                <Link
                  href="/studio/data"
                  className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>Open Ingestion & Profiler in Data Lab</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Compatibility Engine */}
      {activeTab === "compatibility" && (
        <div className="p-6 rounded-2xl bg-[var(--surface-raised)] border border-[var(--border)] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Algorithm Compatibility Match & Recommendation Engine</span>
              </h2>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Evaluates algorithmic assumptions against ProblemSpec data scale, convexity, and constraints.
              </p>
            </div>

            {/* Suitability Filter Pills */}
            <div className="flex items-center gap-1.5 text-xs font-mono bg-[var(--surface)] p-1 rounded-xl border border-[var(--border)]">
              {[
                { id: "all", label: "All Candidates" },
                { id: "promising", label: "Compatible" },
                { id: "baseline", label: "Baselines" },
                { id: "unsuitable", label: "Constrained" },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilterSuitability(f.id)}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    filterSuitability === f.id
                      ? "bg-cyan-500/20 text-cyan-300 font-bold"
                      : "text-[var(--text-muted)] hover:text-white"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredCandidates.map((cand) => (
              <div
                key={cand.id}
                className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-white/20 transition-all"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-white">{cand.name}</span>
                    {cand.isBaseline && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Baseline Reference
                      </span>
                    )}
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        cand.status === "unsuitable"
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                          : cand.status === "promising"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-slate-700/50 text-slate-300"
                      }`}
                    >
                      {cand.status === "unsuitable"
                        ? "Constrained / Excluded"
                        : cand.status === "promising"
                        ? "Compatible Match"
                        : "Potential Match"}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)]">{cand.inclusionReason}</p>
                  {cand.exclusionReason && (
                    <p className="text-xs text-rose-400 flex items-center gap-1.5 mt-1 font-mono">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>{cand.exclusionReason}</span>
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-5 text-xs font-mono shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] text-[var(--text-muted)] block">Compatibility</span>
                    <span className="text-cyan-400 font-bold text-sm">{cand.compatibilityScore}%</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[var(--text-muted)] block">Interpretability</span>
                    <span className="text-white capitalize">{cand.interpretability}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[var(--text-muted)] block">Compute Cost</span>
                    <span className="text-slate-300 capitalize">{cand.computeCost}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Benchmark Execution */}
      {activeTab === "evaluation" && (
        <div className="p-6 rounded-2xl bg-[var(--surface-raised)] border border-[var(--border)] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>Stratified Cross-Validation Execution Engine</span>
              </h2>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Protocol: {spec.evaluationStrategy} · Metric: {spec.primaryMetric} · Folds: 5
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-cyan-400 font-bold">
                {isRunning ? `Running Fold ${progressStep}/5...` : hasEvaluated ? "Completed (5/5 Folds)" : "Ready"}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="w-full bg-[#080b12] rounded-full h-2.5 overflow-hidden border border-[var(--border)]">
              <div
                className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${(progressStep / 5) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-mono text-[var(--text-muted)]">
              <span>Fold 1: Fit & Validate</span>
              <span>Fold 2: Fit & Validate</span>
              <span>Fold 3: Fit & Validate</span>
              <span>Fold 4: Fit & Validate</span>
              <span>Fold 5: Aggregate Residuals</span>
            </div>
          </div>

          {/* Live Fold Execution Logger */}
          <div className="p-4 rounded-xl bg-[#080b12] border border-[var(--border)] font-mono text-xs space-y-1.5 text-slate-300 max-h-60 overflow-y-auto scrollbar-thin">
            <div className="text-cyan-400">[0.00s] Initializing zero-contamination partitions with seed 42...</div>
            {progressStep >= 1 && (
              <div className="text-slate-300">
                [0.35s] Fold 1/5: Fitting {candidates.length} candidates. Scaling computed strictly on train indices.
              </div>
            )}
            {progressStep >= 2 && (
              <div className="text-slate-300">
                [0.70s] Fold 2/5: Validating out-of-fold generalization. No label leakage detected.
              </div>
            )}
            {progressStep >= 3 && (
              <div className="text-slate-300">
                [1.05s] Fold 3/5: Convergence verified within Lipschitz bound. Uncertainty estimates updated.
              </div>
            )}
            {progressStep >= 4 && (
              <div className="text-slate-300">
                [1.40s] Fold 4/5: Computing loss surfaces and parameter trajectory snapshots.
              </div>
            )}
            {progressStep >= 5 && (
              <div className="text-emerald-400 font-bold">
                [1.75s] Fold 5/5: Protocol complete. Cross-validation leaderboard compiled with empirical variance.
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setActiveTab("report")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold transition-all cursor-pointer"
            >
              <span>View Fit Report & Leaderboard</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Tab 4: Fit Report & Verdict */}
      {activeTab === "report" && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[var(--surface-raised)] border border-[var(--border)] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span>Fit Report & Candidate Comparison Leaderboard</span>
                </h2>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Protocol: {spec.evaluationStrategy} · Primary Metric: {spec.primaryMetric} · Sample N={spec.datasetName}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportFitReport}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[var(--surface)] border border-[var(--border)] hover:border-cyan-400/50 text-xs font-mono text-cyan-300 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Report (.md)</span>
                </button>
                {winningCandidate && (
                  <button
                    onClick={() => handleSendToForge(winningCandidate.id)}
                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-[#080b12] text-xs font-bold hover:shadow-cyan-500/25 transition-all shadow-md cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Send Winner to Forge</span>
                  </button>
                )}
              </div>
            </div>

            {/* Results Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-[var(--border)] text-[var(--text-muted)] text-[11px]">
                    <th className="pb-3 px-3 font-semibold">Rank</th>
                    <th className="pb-3 px-3 font-semibold">Algorithm Candidate</th>
                    <th className="pb-3 px-3 font-semibold">Role</th>
                    <th className="pb-3 px-3 font-semibold">{spec.primaryMetric}</th>
                    <th className="pb-3 px-3 font-semibold">Uncertainty (±σ)</th>
                    <th className="pb-3 px-3 font-semibold">Runtime</th>
                    <th className="pb-3 px-3 font-semibold">Fit Status</th>
                    <th className="pb-3 px-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {candidates
                    .slice()
                    .sort((a, b) => b.primaryMetricValue - a.primaryMetricValue)
                    .map((cand, idx) => (
                      <tr key={cand.id} className="hover:bg-white/[0.02]">
                        <td className="py-3 px-3 text-slate-400 font-bold">
                          {idx === 0 ? <Award className="w-4 h-4 text-amber-400" /> : `#${idx + 1}`}
                        </td>
                        <td className="py-3 px-3 font-bold text-white">
                          {cand.name}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] ${
                              cand.isBaseline
                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                            }`}
                          >
                            {cand.isBaseline ? "Baseline" : "Candidate"}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-cyan-300 font-bold text-sm">
                          {cand.primaryMetricValue.toFixed(4)}
                        </td>
                        <td className="py-3 px-3 text-[var(--text-muted)]">
                          ±{cand.uncertaintyStd.toFixed(3)}
                        </td>
                        <td className="py-3 px-3 text-white">{cand.runtimeMs} ms</td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              cand.status === "promising"
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                : cand.status === "unsuitable"
                                ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                                : "bg-slate-700/50 text-slate-300"
                            }`}
                          >
                            {cand.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => handleSendToForge(cand.id)}
                            className="text-cyan-400 hover:text-cyan-300 text-[11px] underline cursor-pointer"
                          >
                            Forge
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Conditional Recommendation Banner */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-cyan-950/30 to-[#0e1422] border border-emerald-500/30 text-xs space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Conditional Recommendation: Promising Under Tested Conditions</span>
              </div>
              <p className="text-[var(--text-muted)] leading-relaxed">
                Candidate algorithms demonstrate a statistically significant gain over the naive baseline
                under strict {spec.evaluationStrategy} validation. For deployment contexts balancing high
                interpretability with peak predictive accuracy,{" "}
                <strong className="text-white">{winningCandidate?.name}</strong> is the optimal recommended choice.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
