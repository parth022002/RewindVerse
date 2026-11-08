export type ObjectiveType = "quadratic" | "rosenbrock" | "saddle";

export interface ObjectiveFunction {
  id: ObjectiveType;
  name: string;
  description: string;
  domain: { x: [number, number]; y: [number, number] };
  evaluate: (x: number, y: number) => number;
  gradient: (x: number, y: number) => [number, number];
  globalMinimum?: [number, number];
}

export type OptimizerType = "sgd" | "momentum" | "adam" | "adamw" | "rmsprop" | "adagrad";

export interface SgdConfig {
  type: "sgd";
  learningRate: number;
}

export interface MomentumConfig {
  type: "momentum";
  learningRate: number;
  momentum: number;
}

export interface AdamConfig {
  type: "adam";
  learningRate: number;
  beta1: number;
  beta2: number;
  epsilon: number;
}

export interface AdamWConfig {
  type: "adamw";
  learningRate: number;
  beta1: number;
  beta2: number;
  epsilon: number;
  weightDecay: number;
}

export interface RMSPropConfig {
  type: "rmsprop";
  learningRate: number;
  decayRate: number;
  epsilon: number;
}

export interface AdagradConfig {
  type: "adagrad";
  learningRate: number;
  epsilon: number;
}

export type OptimizerConfig =
  | SgdConfig
  | MomentumConfig
  | AdamConfig
  | AdamWConfig
  | RMSPropConfig
  | AdagradConfig;

export interface SimulationConfig {
  objective: ObjectiveType;
  optimizer: OptimizerConfig;
  initialPoint: [number, number];
  maxSteps: number;
  seed?: number;
  noiseLevel?: number;
}

export interface SimulationStepResult {
  step: number;
  x: number;
  y: number;
  loss: number;
  gradX: number;
  gradY: number;
  gradNorm: number;
  lr: number;
}

