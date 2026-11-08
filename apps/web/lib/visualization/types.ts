/**
 * RewindVerse 2D/3D Visualization & Capability Types
 * Conforms to RewindVerse 2D/3D Visualization, Product & Optimization Standard v1.0
 */

export type ViewMode = "2d" | "3d" | "auto";

export type ProvenanceType = "recorded" | "derived" | "projected" | "sampled" | "illustrative";

export type VisualizationCategory =
  | "training_dynamics"
  | "architecture"
  | "evaluation"
  | "observatory"
  | "diagnostics";

export interface VisualizationPreferences {
  defaultMode: ViewMode;
  modeByVisualization: Record<string, ViewMode>;
  reducedMotion: boolean;
  highContrast: boolean;
  showDataTable: boolean;
  synchronizeReplay: boolean;
}

export interface VisualizationDescriptor {
  id: string;
  title: string;
  category: VisualizationCategory;
  supportedModes: Array<"2d" | "3d">;
  requiredCapabilities: string[];
  optionalCapabilities?: string[];
  dataRequirements: string[];
  recommendedFor: string[];
  caveats?: string[];
  estimatedCost: "low" | "medium" | "high";
  provenance: ProvenanceType;
}

/**
 * Standard registry declaring all supported visualization panels and their 2D/3D capabilities.
 */
export const VISUALIZATION_REGISTRY: Record<string, VisualizationDescriptor> = {
  loss_curve: {
    id: "loss_curve",
    title: "Training Loss Trajectory",
    category: "training_dynamics",
    supportedModes: ["2d"],
    requiredCapabilities: ["has_loss"],
    dataRequirements: ["loss series with step index"],
    recommendedFor: ["loss convergence verification", "learning rate tuning"],
    estimatedCost: "low",
    provenance: "recorded",
  },
  loss_surface: {
    id: "loss_surface",
    title: "Loss Landscape & Optimization Trajectory",
    category: "training_dynamics",
    supportedModes: ["2d", "3d"],
    requiredCapabilities: ["has_loss", "has_parameters"],
    dataRequirements: ["2D parameter coordinates (x, y) or defined 2D parameter slice"],
    recommendedFor: ["studying optimizer dynamics", "anisotropic ravines", "saddle escape"],
    caveats: [
      "Represents a 2D slice or analytical surface; does not imply the full high-dimensional loss surface of large neural networks.",
    ],
    estimatedCost: "medium",
    provenance: "derived",
  },
  binary_classification_boundary: {
    id: "binary_classification_boundary",
    title: "Classification Hyperplane & Decision Surface",
    category: "evaluation",
    supportedModes: ["2d", "3d"],
    requiredCapabilities: ["has_parameters"],
    dataRequirements: ["2D feature coordinates and binary ground truth labels"],
    recommendedFor: ["linear classifier inspection", "separability analysis"],
    estimatedCost: "medium",
    provenance: "derived",
  },
  compare_trajectories: {
    id: "compare_trajectories",
    title: "Experiment Comparison Overlay",
    category: "training_dynamics",
    supportedModes: ["2d", "3d"],
    requiredCapabilities: ["has_loss"],
    dataRequirements: ["two or more recorded runs with common step unit"],
    recommendedFor: ["hyperparameter sweep comparisons", "optimizer shootouts"],
    estimatedCost: "medium",
    provenance: "recorded",
  },
  diagnostics_timeline: {
    id: "diagnostics_timeline",
    title: "Evidence-Backed Convergence Diagnostics",
    category: "diagnostics",
    supportedModes: ["2d"],
    requiredCapabilities: ["has_loss"],
    dataRequirements: ["loss and/or gradient norm sequence"],
    recommendedFor: ["detecting plateaus, divergences, and gradient explosions"],
    estimatedCost: "low",
    provenance: "derived",
  },
};

