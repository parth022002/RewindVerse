import { RvtsParsedTrace, RvtsStepRecord, RvtsEventRecord } from "@rewindverse/rvts";
import { StepSummary } from "./types";

export class TraceIndexer {
  private steps: RvtsStepRecord[];
  private eventsByStep: Map<number, RvtsEventRecord[]>;
  private stepIndexToRecordIndex: Map<number, number>;
  public readonly summaries: StepSummary[];
  public readonly lossSeries: [number, number][]; // [step, loss]
  public readonly trajectory: [number, number][]; // [x, y]

  constructor(trace: RvtsParsedTrace) {
    this.steps = trace.steps;
    this.eventsByStep = new Map();
    this.stepIndexToRecordIndex = new Map();
    this.summaries = [];
    this.lossSeries = [];
    this.trajectory = [];

    // Index events by step number
    for (const event of trace.events) {
      const existing = this.eventsByStep.get(event.step) || [];
      existing.push(event);
      this.eventsByStep.set(event.step, existing);
    }

    // Index steps
    for (let i = 0; i < this.steps.length; i++) {
      const step = this.steps[i];
      this.stepIndexToRecordIndex.set(step.step, i);

      const hasEvent = this.eventsByStep.has(step.step);
      const loss = step.metrics.loss ?? 0;
      this.lossSeries.push([step.step, loss]);

      if (step.parameters?.theta && Array.isArray(step.parameters.theta)) {
        this.trajectory.push([step.parameters.theta[0], step.parameters.theta[1]]);
      }

      this.summaries.push({
        step: step.step,
        loss,
        gradNorm: step.metrics.gradient_norm,
        lr: step.metrics.lr,
        hasEvent,
      });
    }
  }

  public getStepCount(): number {
    return this.steps.length;
  }

  public getStepByIndex(index: number): RvtsStepRecord | null {
    if (index < 0 || index >= this.steps.length) return null;
    return this.steps[index];
  }

  public getStepByStepNumber(stepNum: number): RvtsStepRecord | null {
    const idx = this.stepIndexToRecordIndex.get(stepNum);
    if (idx === undefined) return null;
    return this.steps[idx];
  }

  public getEventsForStep(stepNum: number): RvtsEventRecord[] {
    return this.eventsByStep.get(stepNum) || [];
  }
}
