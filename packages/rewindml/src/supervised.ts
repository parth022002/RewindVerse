import { createPrng } from "./prng";
import {
  RvtsManifestRecord,
  RvtsStepRecord,
  RvtsFooterRecord,
  RvtsParsedTrace,
  extractCapabilities,
  serializeRvtsTrace,
} from "@rewindverse/rvts";

export interface DataPoint2D {
  x: number;
  y: number;
  label: 0 | 1;
}

export interface ClassificationDataset {
  name: string;
  points: DataPoint2D[];
}

/**
 * Generates synthetic 2D linearly separable clusters with deterministic seed.
 */
export function generateBlobsDataset(
  numPoints: number = 80,
  seed: number = 42
): ClassificationDataset {
  const prng = createPrng(seed);
  const points: DataPoint2D[] = [];

  const half = Math.floor(numPoints / 2);

  // Class 0: centered around (-1.5, -1.0)
  for (let i = 0; i < half; i++) {
    const x = -1.5 + (prng() - 0.5) * 2.2;
    const y = -1.0 + (prng() - 0.5) * 2.2;
    points.push({ x, y, label: 0 });
  }

  // Class 1: centered around (1.5, 1.2)
  for (let i = 0; i < half; i++) {
    const x = 1.5 + (prng() - 0.5) * 2.2;
    const y = 1.2 + (prng() - 0.5) * 2.2;
    points.push({ x, y, label: 1 });
  }

  return {
    name: "2D Binary Gaussian Blobs",
    points,
  };
}

function sigmoid(z: number): number {
  if (z > 30) return 1.0;
  if (z < -30) return 0.0;
  return 1.0 / (1.0 + Math.exp(-z));
}

export interface LogisticRegressionConfig {
  learningRate: number;
  maxEpochs: number;
  dataset: ClassificationDataset;
  seed?: number;
}

export interface LogisticRegressionStepResult {
  step: number;
  loss: number;
  accuracy: number;
  weights: [number, number]; // [w1, w2]
  bias: number;
  gradNorm: number;
}

export function trainLogisticRegression(
  config: LogisticRegressionConfig
): {
  trace: RvtsParsedTrace;
  jsonl: string;
  history: LogisticRegressionStepResult[];
} {
  const { dataset, learningRate, maxEpochs } = config;
  const N = dataset.points.length;

  let w1 = 0.1;
  let w2 = -0.1;
  let b = 0.0;

  const history: LogisticRegressionStepResult[] = [];
  const stepRecords: RvtsStepRecord[] = [];

  const runId = `logreg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const manifest: RvtsManifestRecord = {
    type: "manifest",
    version: "0.1.0",
    run_id: runId,
    name: `Logistic Regression on ${dataset.name}`,
    created_at: new Date().toISOString(),
    producer: {
      name: "RewindML Supervised Engine",
      version: "1.0.0",
      framework: "TypeScript",
    },
    model_or_objective: {
      name: "Logistic Regression (Binary Cross-Entropy)",
      type: "logistic_regression",
      dimension: 2,
    },
    hyperparameters: {
      learning_rate: learningRate,
      epochs: maxEpochs,
      num_samples: N,
    },
    declared_capabilities: {
      has_loss: true,
      has_parameters: true,
      has_gradients: true,
      step_unit: "epoch",
    },
  };

  for (let epoch = 0; epoch <= maxEpochs; epoch++) {
    let totalLoss = 0;
    let correct = 0;
    let gradW1 = 0;
    let gradW2 = 0;
    let gradB = 0;

    for (const pt of dataset.points) {
      const z = w1 * pt.x + w2 * pt.y + b;
      const yHat = sigmoid(z);

      // Clip for numerical stability in BCE
      const eps = 1e-12;
      const clippedYHat = Math.max(eps, Math.min(1 - eps, yHat));
      const ptLoss =
        pt.label === 1
          ? -Math.log(clippedYHat)
          : -Math.log(1 - clippedYHat);

      totalLoss += ptLoss;

      const predLabel = yHat >= 0.5 ? 1 : 0;
      if (predLabel === pt.label) {
        correct++;
      }

      // Derivative of BCE w.r.t z is (yHat - y)
      const error = yHat - pt.label;
      gradW1 += error * pt.x;
      gradW2 += error * pt.y;
      gradB += error;
    }

    const avgLoss = totalLoss / N;
    const accuracy = correct / N;
    const dW1 = gradW1 / N;
    const dW2 = gradW2 / N;
    const dB = gradB / N;
    const gradNorm = Math.sqrt(dW1 * dW1 + dW2 * dW2 + dB * dB);

    history.push({
      step: epoch,
      loss: avgLoss,
      accuracy,
      weights: [w1, w2],
      bias: b,
      gradNorm,
    });

    stepRecords.push({
      type: "step",
      step: epoch,
      metrics: {
        loss: avgLoss,
        accuracy,
        gradient_norm: gradNorm,
        lr: learningRate,
      },
      parameters: {
        weights: [w1, w2],
        bias: b,
      },
      gradients: {
        grad_weights: [dW1, dW2],
        grad_bias: dB,
      },
    });

    if (epoch < maxEpochs) {
      w1 -= learningRate * dW1;
      w2 -= learningRate * dW2;
      b -= learningRate * dB;
    }
  }

  const footer: RvtsFooterRecord = {
    type: "footer",
    total_steps: stepRecords.length,
    status: "completed",
  };

  const capabilities = extractCapabilities(manifest, stepRecords);
  const trace: RvtsParsedTrace = {
    manifest,
    steps: stepRecords,
    events: [],
    checkpoints: [],
    footer,
    capabilities,
  };

  const jsonl = serializeRvtsTrace(trace);

  return {
    trace,
    jsonl,
    history,
  };
}

/**
 * Calculates start and end coordinates of the decision boundary line (w1*x + w2*y + b = 0)
 * clipped to the 2D bounding box [xMin, xMax] x [yMin, yMax].
 */
export function computeDecisionBoundaryPoints(
  weights: [number, number],
  bias: number,
  xMin: number = -3.5,
  xMax: number = 3.5,
  yMin: number = -3.5,
  yMax: number = 3.5
): { p1: [number, number]; p2: [number, number] } {
  const [w1, w2] = weights;

  // If w2 is near zero, boundary is vertical line x = -b / w1
  if (Math.abs(w2) < 1e-6) {
    const x = Math.max(xMin, Math.min(xMax, -bias / (w1 || 1e-6)));
    return {
      p1: [x, yMin],
      p2: [x, yMax],
    };
  }

  // Calculate y for xMin and xMax
  const yAtXMin = -(w1 * xMin + bias) / w2;
  const yAtXMax = -(w1 * xMax + bias) / w2;

  return {
    p1: [xMin, yAtXMin],
    p2: [xMax, yAtXMax],
  };
}

