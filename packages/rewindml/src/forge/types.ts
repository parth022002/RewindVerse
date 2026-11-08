import { ObjectiveType, SimulationStepResult } from "../types";
import { RvtsParsedTrace } from "@rewindverse/rvts";

export type ForgeCreationMode = "customize" | "visual_nodes" | "formula";

export type AllowlistedOperation =
  | "add"
  | "sub"
  | "mul"
  | "div"
  | "pow"
  | "sqrt"
  | "clamp"
  | "abs"
  | "exp"
  | "log"
  | "min"
  | "max"
  | "scale"
  | "negate"
  | "momentum_update"
  | "sgd_update"
  | "adam_update";

export type ForgeNodeType = "input" | "constant" | "operation" | "output";

export interface ForgeNode {
  id: string;
  type: ForgeNodeType;
  label: string;
  op?: AllowlistedOperation;
  value?: number;
  inputKey?: "param" | "grad" | "velocity" | "step" | "lr";
  outputKey?: "next_param" | "next_velocity";
  x?: number;
  y?: number;
}

export interface ForgeEdge {
  id: string;
  fromNode: string;
  fromPort: string;
  toNode: string;
  toPort: string;
}

export interface ExecutionBudget {
  maxSteps: number;
  fuelLimit: number;
  maxMemoryMb: number;
}

export interface AlgorithmManifest {
  id: string;
  name: string;
  version: string;
  author: string;
  description: string;
  license: string;
  createdAt: string;
  parentAlgorithmId?: string;
  parentVersion?: string;
  mode: ForgeCreationMode;
  parameters: Record<string, number>;
  formula?: string; // Mode C: mathematical string DSL
  nodes?: ForgeNode[]; // Mode B: visual node pipeline
  edges?: ForgeEdge[];
  executionBudget: ExecutionBudget;
}

export interface ValidationDiagnostic {
  severity: "error" | "warning";
  code: string;
  message: string;
  nodeId?: string;
}

export interface ValidationResult {
  valid: boolean;
  diagnostics: ValidationDiagnostic[];
  estimatedFuel: number;
}

export interface ForgeRunConfig {
  manifest: AlgorithmManifest;
  objective: ObjectiveType;
  initialPoint: [number, number];
  maxSteps: number;
  seed?: number;
}

export interface ForgeRunResult {
  trace: RvtsParsedTrace;
  jsonl: string;
  stepResults: SimulationStepResult[];
  diverged: boolean;
  fuelConsumed: number;
  warnings: string[];
}
