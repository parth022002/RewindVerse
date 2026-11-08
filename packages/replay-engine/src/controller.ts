import { RvtsParsedTrace } from "@rewindverse/rvts";
import { TraceIndexer } from "./indexer";
import { PlaybackSpeed, PlaybackStatus, ReplayState } from "./types";

export type ReplayListener = (state: ReplayState) => void;

export class ReplayController {
  private trace: RvtsParsedTrace;
  private indexer: TraceIndexer;
  private currentIndex: number = 0;
  private status: PlaybackStatus = "idle";
  private speed: PlaybackSpeed = 1;
  private timerId: ReturnType<typeof setInterval> | null = null;
  private listeners: Set<ReplayListener> = new Set();

  constructor(trace: RvtsParsedTrace) {
    this.trace = trace;
    this.indexer = new TraceIndexer(trace);
    this.currentIndex = 0;
  }

  public subscribe(listener: ReplayListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    const state = this.getState();
    for (const listener of this.listeners) {
      listener(state);
    }
  }

  public getState(): ReplayState {
    const currentStep = this.indexer.getStepByIndex(this.currentIndex);
    const activeEvents = currentStep
      ? this.indexer.getEventsForStep(currentStep.step)
      : [];

    return {
      currentStepIndex: this.currentIndex,
      totalSteps: this.indexer.getStepCount(),
      currentStep,
      status: this.status,
      speed: this.speed,
      activeEvents,
      capabilities: this.trace.capabilities,
    };
  }

  public getIndexer(): TraceIndexer {
    return this.indexer;
  }

  public play(): void {
    if (this.status === "playing") return;
    if (this.currentIndex >= this.indexer.getStepCount() - 1) {
      this.currentIndex = 0;
    }
    this.status = "playing";
    this.startTimer();
    this.notify();
  }

  public pause(): void {
    if (this.status !== "playing") return;
    this.status = "paused";
    this.clearTimer();
    this.notify();
  }

  public togglePlay(): void {
    if (this.status === "playing") {
      this.pause();
    } else {
      this.play();
    }
  }

  public seekIndex(index: number): void {
    const bounded = Math.max(0, Math.min(this.indexer.getStepCount() - 1, Math.floor(index)));
    this.currentIndex = bounded;
    if (this.currentIndex >= this.indexer.getStepCount() - 1 && this.status === "playing") {
      this.status = "ended";
      this.clearTimer();
    }
    this.notify();
  }

  public nextStep(): void {
    if (this.currentIndex < this.indexer.getStepCount() - 1) {
      this.seekIndex(this.currentIndex + 1);
    }
  }

  public prevStep(): void {
    if (this.currentIndex > 0) {
      this.seekIndex(this.currentIndex - 1);
    }
  }

  public setSpeed(speed: PlaybackSpeed): void {
    this.speed = speed;
    if (this.status === "playing") {
      this.clearTimer();
      this.startTimer();
    }
    this.notify();
  }

  private startTimer(): void {
    this.clearTimer();
    const intervalMs = Math.max(16, Math.floor(100 / this.speed));
    this.timerId = setInterval(() => {
      if (this.currentIndex >= this.indexer.getStepCount() - 1) {
        this.status = "ended";
        this.clearTimer();
        this.notify();
      } else {
        this.currentIndex++;
        this.notify();
      }
    }, intervalMs);
  }

  private clearTimer(): void {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  public destroy(): void {
    this.clearTimer();
    this.listeners.clear();
  }
}
