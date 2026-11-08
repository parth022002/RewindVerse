/**
 * RewindVerse Training Trace Specification (RVTS) - Core Types
 * Version: 0.1.0
 */

export type RvtsRecordType = "manifest" | "step" | "event" | "checkpoint" | "footer";

export interface RvtsProducerInfo {
  name: string;
  version: string;
  framework?: string;
  environment?: string;
}

export interface RvtsCapabilities {
  has_loss: boolean;
  has_validation_loss: boolean;
  has_parameters: boolean;
  has_gradients: boolean;
  has_events: boolean;
  has_checkpoints: boolean;
  has_learning_rate: boolean;
  step_unit: "step" | "epoch" | "iteration";
}

export interface RvtsManifestRecord {
  type: "manifest";
  version: "0.1.0";
  run_id: string;
  name: string;
  created_at: string;
  producer: RvtsProducerInfo;
  model_or_objective: {
    name: string;
    type: "2d_loss_landscape" | "logistic_regression" | "mlp" | "custom";
    dimension?: number;
    description?: string;
  };
  hyperparameters: Record<string, string | number | boolean>;
  declared_capabilities: Partial<RvtsCapabilities>;
}

export interface RvtsStepRecord {
  type: "step";
  step: number;
  timestamp_ms?: number;
  metrics: {
    loss: number;
    val_loss?: number;
    lr?: number;
    gradient_norm?: number;
    [key: string]: number | undefined;
  };
  parameters?: Record<string, number | number[]>;
  gradients?: Record<string, number | number[]>;
}

export interface RvtsEventRecord {
  type: "event";
  step: number;
  event_type: "plateau" | "divergence" | "lr_oscillation" | "gradient_spike" | "checkpoint_saved" | "custom";
  severity: "info" | "warning" | "critical";
  message: string;
  evidence?: Record<string, number | string | boolean>;
}

export interface RvtsCheckpointRecord {
  type: "checkpoint";
  step: number;
  name?: string;
  parameters: Record<string, number | number[]>;
  metrics: Record<string, number>;
}

export interface RvtsFooterRecord {
  type: "footer";
  total_steps: number;
  status: "completed" | "interrupted" | "failed";
  duration_ms?: number;
  checksum?: string;
}

export type RvtsRecord =
  | RvtsManifestRecord
  | RvtsStepRecord
  | RvtsEventRecord
  | RvtsCheckpointRecord
  | RvtsFooterRecord;

export interface RvtsParsedTrace {
  manifest: RvtsManifestRecord;
  steps: RvtsStepRecord[];
  events: RvtsEventRecord[];
  checkpoints: RvtsCheckpointRecord[];
  footer?: RvtsFooterRecord;
  capabilities: RvtsCapabilities;
}

export interface RvtsValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

