import { RvtsStepRecord, RvtsEventRecord, RvtsCapabilities } from "@rewindverse/rvts";

export type PlaybackStatus = "idle" | "playing" | "paused" | "ended";

export type PlaybackSpeed = 0.5 | 1 | 2 | 5 | 10;

export interface ReplayState {
  currentStepIndex: number;
  totalSteps: number;
  currentStep: RvtsStepRecord | null;
  status: PlaybackStatus;
  speed: PlaybackSpeed;
  activeEvents: RvtsEventRecord[];
  capabilities: RvtsCapabilities;
}

export interface StepSummary {
  step: number;
  loss: number;
  gradNorm?: number;
  lr?: number;
  hasEvent: boolean;
}

