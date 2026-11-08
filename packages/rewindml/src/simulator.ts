import {
  RvtsManifestRecord,
  RvtsStepRecord,
  RvtsEventRecord,
  RvtsFooterRecord,
  RvtsParsedTrace,
  extractCapabilities,
  serializeRvtsTrace,
} from "@rewindverse/rvts";
import { SimulationConfig, SimulationStepResult } from "./types";
import { getObjective } from "./objectives";
import { createOptimizer } from "./optimizers";
import { createGaussianGenerator } from "./prng";

export interface SimulationRunResult {
  trace: RvtsParsedTrace;
  jsonl: string;
  stepResults: SimulationStepResult[];
  diverged: boolean;
}

export function runOptimizationSimulation(config: SimulationConfig): SimulationRunResult {
  const objective = getObjective(config.objective);
  const optimizer = createOptimizer(config.optimizer);
  const gaussian = config.noiseLevel && config.noiseLevel > 0
    ? createGaussianGenerator(config.seed ?? 42)
    : null;

  const runId = `run_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const createdAt = new Date().toISOString();

  const manifest: RvtsManifestRecord = {
    type: "manifest",
    version: "0.1.0",
    run_id: runId,
    name: `${objective.name} with ${config.optimizer.type.toUpperCase()}`,
    created_at: createdAt,
    producer: {
      name: "RewindML Browser Engine",
      version: "1.0.0",
      framework: "TypeScript Web Worker",
    },
    model_or_objective: {
      name: objective.name,
      type: "2d_loss_landscape",
      dimension: 2,
      description: objective.description,
    },
    hyperparameters: {
      optimizer: config.optimizer.type,
      learning_rate: config.optimizer.learningRate,
      max_steps: config.maxSteps,
      initial_x: config.initialPoint[0],
      initial_y: config.initialPoint[1],
      seed: config.seed ?? 42,
    },
    declared_capabilities: {
      has_loss: true,
      has_parameters: true,
      has_gradients: true,
      has_learning_rate: true,
      step_unit: "step",
    },
  };

  let currentPoint: [number, number] = [config.initialPoint[0], config.initialPoint[1]];
  const stepRecords: RvtsStepRecord[] = [];
  const eventRecords: RvtsEventRecord[] = [];
  const stepResults: SimulationStepResult[] = [];
  let diverged = false;

  for (let t = 0; t <= config.maxSteps; t++) {
    const [x, y] = currentPoint;
    const loss = objective.evaluate(x, y);

    if (!Number.isFinite(loss) || Math.abs(x) > 1e6 || Math.abs(y) > 1e6) {
      diverged = true;
      eventRecords.push({
        type: "event",
        step: t,
        event_type: "divergence",
        severity: "critical",
        message: `Loss or parameters diverged at step ${t}. Loss: ${loss}, Location: (${x.toExponential(2)}, ${y.toExponential(2)})`,
        evidence: { step: t, loss, x, y },
      });
      break;
    }

    const [rawGx, rawGy] = objective.gradient(x, y);
    const noiseX = gaussian ? gaussian() * (config.noiseLevel || 0) : 0;
    const noiseY = gaussian ? gaussian() * (config.noiseLevel || 0) : 0;
    const gx = rawGx + noiseX;
    const gy = rawGy + noiseY;
    const gradNorm = Math.sqrt(gx * gx + gy * gy);

    stepResults.push({
      step: t,
      x,
      y,
      loss,
      gradX: gx,
      gradY: gy,
      gradNorm,
      lr: optimizer.getLearningRate(),
    });

    stepRecords.push({
      type: "step",
      step: t,
      metrics: {
        loss,
        gradient_norm: gradNorm,
        lr: optimizer.getLearningRate(),
      },
      parameters: {
        theta: [x, y],
      },
      gradients: {
        grad: [gx, gy],
      },
    });

    // Check for plateau event (e.g. gradient norm very small near minimum)
    if (gradNorm < 1e-4 && t > 5 && !eventRecords.some(e => e.event_type === "plateau")) {
      eventRecords.push({
        type: "event",
        step: t,
        event_type: "plateau",
        severity: "info",
        message: `Gradient norm dropped below 1e-4 at step ${t}. Model reached near-stationary region.`,
        evidence: { step: t, grad_norm: gradNorm },
      });
    }

    if (t < config.maxSteps) {
      currentPoint = optimizer.step(currentPoint, [gx, gy], t + 1);
    }
  }

  const footer: RvtsFooterRecord = {
    type: "footer",
    total_steps: stepRecords.length,
    status: diverged ? "failed" : "completed",
  };

  const capabilities = extractCapabilities(manifest, stepRecords);

  const trace: RvtsParsedTrace = {
    manifest,
    steps: stepRecords,
    events: eventRecords,
    checkpoints: [],
    footer,
    capabilities,
  };

  const jsonl = serializeRvtsTrace(trace);

  return {
    trace,
    jsonl,
    stepResults,
    diverged,
  };
}
