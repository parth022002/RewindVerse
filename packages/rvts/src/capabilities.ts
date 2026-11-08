import { RvtsCapabilities, RvtsStepRecord, RvtsManifestRecord } from "./types";

/**
 * Derives the factual capabilities present in a trace.
 * RewindVerse follows the rule: Never infer or display unrecorded state.
 */
export function extractCapabilities(
  manifest: RvtsManifestRecord,
  steps: RvtsStepRecord[]
): RvtsCapabilities {
  const declared = manifest.declared_capabilities || {};

  let hasLoss = false;
  let hasValLoss = false;
  let hasParameters = false;
  let hasGradients = false;
  let hasLearningRate = false;

  for (const step of steps) {
    if (typeof step.metrics?.loss === "number" && Number.isFinite(step.metrics.loss)) {
      hasLoss = true;
    }
    if (typeof step.metrics?.val_loss === "number" && Number.isFinite(step.metrics.val_loss)) {
      hasValLoss = true;
    }
    if (typeof step.metrics?.lr === "number" && Number.isFinite(step.metrics.lr)) {
      hasLearningRate = true;
    }
    if (step.parameters && Object.keys(step.parameters).length > 0) {
      hasParameters = true;
    }
    if (step.gradients && Object.keys(step.gradients).length > 0) {
      hasGradients = true;
    }

    if (hasLoss && hasValLoss && hasParameters && hasGradients && hasLearningRate) {
      break;
    }
  }

  return {
    has_loss: hasLoss,
    has_validation_loss: hasValLoss,
    has_parameters: hasParameters,
    has_gradients: hasGradients,
    has_events: true,
    has_checkpoints: true,
    has_learning_rate: hasLearningRate,
    step_unit: (declared.step_unit as "step" | "epoch" | "iteration") || "step",
  };
}
