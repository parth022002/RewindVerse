import { RvtsStepRecord } from "@rewindverse/rvts";
import { DiagnosticFinding } from "./types";

/**
 * Detects numerical divergence or non-finite values in training loss.
 */
export function detectDivergence(steps: RvtsStepRecord[]): DiagnosticFinding | null {
  for (let i = 0; i < steps.length; i++) {
    const loss = steps[i].metrics?.loss;
    if (typeof loss === "number" && (!Number.isFinite(loss) || loss > 1e7)) {
      const prevLoss = i > 0 ? steps[i - 1].metrics?.loss : "N/A";
      return {
        id: "diag_divergence_001",
        detectorName: "DivergenceDetector",
        detectorVersion: "1.0.0",
        category: "stability",
        title: "Numerical Loss Divergence Detected",
        severity: "critical",
        stepRange: [Math.max(0, i - 3), i],
        summary: `Loss became non-finite or exceeded numerical limits at step ${steps[i].step}.`,
        evidenceExplanation: `At step ${steps[i].step}, recorded loss was ${loss}. The preceding step recorded ${prevLoss}.`,
        signalsUsed: ["metrics.loss"],
        recommendations: [
          "Lower the learning rate (e.g. reduce by 5x to 10x).",
          "Add gradient clipping or check for ill-conditioned loss curvatures.",
          "Inspect initialization point to avoid steep slopes or asymptotes.",
        ],
      };
    }
  }
  return null;
}

/**
 * Detects prolonged loss plateau where improvement drops below a minimum threshold.
 */
export function detectPlateau(
  steps: RvtsStepRecord[],
  windowSize: number = 15,
  minRelChange: number = 1e-4
): DiagnosticFinding | null {
  if (steps.length < windowSize) return null;

  for (let i = windowSize; i < steps.length; i++) {
    const windowStartLoss = steps[i - windowSize].metrics?.loss;
    const currentLoss = steps[i].metrics?.loss;

    if (
      typeof windowStartLoss === "number" &&
      typeof currentLoss === "number" &&
      Number.isFinite(windowStartLoss) &&
      Number.isFinite(currentLoss) &&
      windowStartLoss > 0
    ) {
      const relChange = Math.abs(windowStartLoss - currentLoss) / windowStartLoss;
      if (relChange < minRelChange) {
        return {
          id: "diag_plateau_001",
          detectorName: "PlateauDetector",
          detectorVersion: "1.0.0",
          category: "convergence",
          title: "Training Stagnation / Loss Plateau",
          severity: "info",
          stepRange: [steps[i - windowSize].step, steps[i].step],
          summary: `Loss exhibited minimal relative progress (< ${(minRelChange * 100).toFixed(3)}%) over steps ${steps[i - windowSize].step}–${steps[i].step}.`,
          evidenceExplanation: `Recorded loss shifted from ${windowStartLoss.toFixed(5)} to ${currentLoss.toFixed(5)} across ${windowSize} consecutive steps.`,
          signalsUsed: ["metrics.loss"],
          recommendations: [
            "If near the optimal minimum, consider early stopping or terminating the run.",
            "If far from the target objective, consider increasing the learning rate or testing Momentum/Adam.",
          ],
        };
      }
    }
  }
  return null;
}

/**
 * Detects vanishing or exploding gradients if gradient norms are present in the trace.
 */
export function detectGradientIssues(steps: RvtsStepRecord[]): DiagnosticFinding[] {
  const findings: DiagnosticFinding[] = [];

  for (let i = 0; i < steps.length; i++) {
    const gNorm = steps[i].metrics?.gradient_norm;
    if (typeof gNorm === "number" && Number.isFinite(gNorm)) {
      if (gNorm > 1e4) {
        findings.push({
          id: `diag_grad_explode_${i}`,
          detectorName: "GradientNormDetector",
          detectorVersion: "1.0.0",
          category: "gradient",
          title: "Extreme Gradient Magnitude (Explosion Risk)",
          severity: "warning",
          stepRange: [Math.max(0, i - 2), i],
          summary: `Gradient norm surged to ${gNorm.toExponential(2)} at step ${steps[i].step}.`,
          evidenceExplanation: `Recorded gradient norm at step ${steps[i].step} is ${gNorm.toFixed(2)}, which exceeds the typical stable threshold of 1,000.`,
          signalsUsed: ["metrics.gradient_norm"],
          recommendations: [
            "Enable gradient norm clipping.",
            "Inspect objective landscape for sharp ravines or ill-conditioned scaling.",
          ],
        });
        break;
      }
    }
  }

  return findings;
}

/**
 * Detects oscillatory bounce in loss values characteristic of learning rates set too high.
 */
export function detectLrInstability(steps: RvtsStepRecord[]): DiagnosticFinding | null {
  if (steps.length < 8) return null;

  let signFlips = 0;
  for (let i = 2; i < Math.min(steps.length, 30); i++) {
    const lPrev2 = steps[i - 2].metrics?.loss;
    const lPrev1 = steps[i - 1].metrics?.loss;
    const lCurr = steps[i].metrics?.loss;

    if (
      typeof lPrev2 === "number" &&
      typeof lPrev1 === "number" &&
      typeof lCurr === "number"
    ) {
      const d1 = lPrev1 - lPrev2;
      const d2 = lCurr - lPrev1;
      if (d1 * d2 < 0) {
        signFlips++;
      }
    }
  }

  if (signFlips >= 5) {
    return {
      id: "diag_instability_001",
      detectorName: "OscillationDetector",
      detectorVersion: "1.0.0",
      category: "learning_rate",
      title: "Loss Oscillation / Learning Rate Instability",
      severity: "warning",
      stepRange: [steps[0].step, steps[Math.min(steps.length - 1, 30)].step],
      summary: "High frequency of directional loss reversals observed in the early steps.",
      evidenceExplanation: `Detected ${signFlips} loss direction sign flips across the initial training window, suggesting the optimizer is overshooting valley walls.`,
      signalsUsed: ["metrics.loss", "metrics.lr"],
      recommendations: [
        "Reduce learning rate by 2x to 5x to allow smooth gradient descent into the ravine.",
        "Add momentum or switch to an adaptive optimizer like Adam.",
      ],
    };
  }

  return null;
}

/**
 * Detects overfitting onset where training loss continues decreasing while validation loss increases.
 * Adheres strictly to FR-DIAG-004:
 * "Requires train and validation signals; no inference when validation signal absent."
 */
export function detectOverfitting(
  steps: RvtsStepRecord[],
  patience: number = 4
): DiagnosticFinding | null {
  const hasValLoss = steps.some(
    (s) =>
      typeof (
        s.metrics?.val_loss ??
        (s.metrics as Record<string, unknown> | undefined)?.validation_loss
      ) === "number"
  );

  // Strict non-inference: if validation metrics are absent, return null immediately
  if (!hasValLoss || steps.length < patience * 2) {
    return null;
  }

  let overfitStreak = 0;
  let onsetStep = -1;

  for (let i = 1; i < steps.length; i++) {
    const prevTrain = steps[i - 1].metrics?.loss;
    const currTrain = steps[i].metrics?.loss;
    const prevVal =
      steps[i - 1].metrics?.val_loss ??
      (steps[i - 1].metrics as Record<string, unknown> | undefined)?.validation_loss;
    const currVal =
      steps[i].metrics?.val_loss ??
      (steps[i].metrics as Record<string, unknown> | undefined)?.validation_loss;

    if (
      typeof prevTrain === "number" &&
      typeof currTrain === "number" &&
      typeof prevVal === "number" &&
      typeof currVal === "number"
    ) {
      if (currTrain <= prevTrain && currVal > prevVal) {
        if (overfitStreak === 0) onsetStep = steps[i - 1].step;
        overfitStreak++;
        if (overfitStreak >= patience) {
          return {
            id: `diag_overfit_${onsetStep}`,
            detectorName: "OverfitDetector",
            detectorVersion: "1.0.0",
            category: "overfitting",
            title: "Potential Generalization Divergence / Overfitting Onset",
            severity: "warning",
            stepRange: [onsetStep, steps[i].step],
            summary: `Training loss decreased while validation loss increased across ${overfitStreak} consecutive evaluation steps.`,
            evidenceExplanation: `Between steps ${onsetStep} and ${steps[i].step}, training loss decreased (${prevTrain.toFixed(4)} → ${currTrain.toFixed(4)}) while validation loss worsened to ${currVal.toFixed(4)}.`,
            signalsUsed: ["metrics.loss", "metrics.val_loss"],
            recommendations: [
              `Consider checkpointing or early stopping near step ${onsetStep}.`,
              "Introduce or increase regularization (L2 weight decay, dropout).",
              "Expand training dataset or apply data augmentation.",
            ],
          };
        }
      } else {
        overfitStreak = 0;
      }
    }
  }

  return null;
}

