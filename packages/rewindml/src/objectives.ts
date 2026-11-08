import { ObjectiveFunction, ObjectiveType } from "./types";

export const QUADRATIC_OBJECTIVE: ObjectiveFunction = {
  id: "quadratic",
  name: "Anisotropic Quadratic Bowl",
  description: "Convex quadratic bowl f(x, y) = 0.5 * (x^2 + 10 * y^2). Demonstrates ill-conditioned ravines and momentum benefits.",
  domain: { x: [-5, 5], y: [-5, 5] },
  globalMinimum: [0, 0],
  evaluate: (x: number, y: number): number => {
    return 0.5 * (x * x + 10 * y * y);
  },
  gradient: (x: number, y: number): [number, number] => {
    return [x, 10 * y];
  },
};

export const ROSENBROCK_OBJECTIVE: ObjectiveFunction = {
  id: "rosenbrock",
  name: "Rosenbrock Valley (Banana Function)",
  description: "Non-convex curved valley f(x, y) = (1 - x)^2 + 100 * (y - x^2)^2. Testing navigation of narrow valleys.",
  domain: { x: [-2, 2], y: [-1, 3] },
  globalMinimum: [1, 1],
  evaluate: (x: number, y: number): number => {
    const t1 = 1 - x;
    const t2 = y - x * x;
    return t1 * t1 + 100 * t2 * t2;
  },
  gradient: (x: number, y: number): [number, number] => {
    const dx = 2 * (x - 1) - 400 * x * (y - x * x);
    const dy = 200 * (y - x * x);
    return [dx, dy];
  },
};

export const SADDLE_OBJECTIVE: ObjectiveFunction = {
  id: "saddle",
  name: "Saddle Point",
  description: "Classic saddle surface f(x, y) = x^2 - y^2. Illustrates saddle stagnation and escape trajectories.",
  domain: { x: [-3, 3], y: [-3, 3] },
  globalMinimum: [0, 0],
  evaluate: (x: number, y: number): number => {
    return x * x - y * y;
  },
  gradient: (x: number, y: number): [number, number] => {
    return [2 * x, -2 * y];
  },
};

export const OBJECTIVES: Record<ObjectiveType, ObjectiveFunction> = {
  quadratic: QUADRATIC_OBJECTIVE,
  rosenbrock: ROSENBROCK_OBJECTIVE,
  saddle: SADDLE_OBJECTIVE,
};

export function getObjective(type: ObjectiveType): ObjectiveFunction {
  const obj = OBJECTIVES[type];
  if (!obj) {
    throw new Error(`Unknown objective type: ${type}`);
  }
  return obj;
}
