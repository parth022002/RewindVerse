import { OptimizerConfig } from "./types";

export interface OptimizerState {
  config: OptimizerConfig;
  step: (params: [number, number], grads: [number, number], t: number) => [number, number];
  getLearningRate: () => number;
}

export function createOptimizer(config: OptimizerConfig): OptimizerState {
  switch (config.type) {
    case "sgd": {
      return {
        config,
        getLearningRate: () => config.learningRate,
        step: (params, grads) => {
          const lr = config.learningRate;
          return [params[0] - lr * grads[0], params[1] - lr * grads[1]];
        },
      };
    }

    case "momentum": {
      let vx = 0;
      let vy = 0;
      return {
        config,
        getLearningRate: () => config.learningRate,
        step: (params, grads) => {
          const lr = config.learningRate;
          const mu = config.momentum;
          vx = mu * vx + lr * grads[0];
          vy = mu * vy + lr * grads[1];
          return [params[0] - vx, params[1] - vy];
        },
      };
    }

    case "adam": {
      let m1 = 0;
      let m2 = 0;
      let v1 = 0;
      let v2 = 0;
      return {
        config,
        getLearningRate: () => config.learningRate,
        step: (params, grads, t) => {
          const lr = config.learningRate;
          const b1 = config.beta1;
          const b2 = config.beta2;
          const eps = config.epsilon;

          // Update biased 1st and 2nd moment estimates
          m1 = b1 * m1 + (1 - b1) * grads[0];
          m2 = b1 * m2 + (1 - b1) * grads[1];
          v1 = b2 * v1 + (1 - b2) * (grads[0] * grads[0]);
          v2 = b2 * v2 + (1 - b2) * (grads[1] * grads[1]);

          // Compute bias-corrected moments
          const stepNum = Math.max(1, t);
          const correction1 = 1 - Math.pow(b1, stepNum);
          const correction2 = 1 - Math.pow(b2, stepNum);

          const m1Hat = m1 / (correction1 || 1e-12);
          const m2Hat = m2 / (correction1 || 1e-12);
          const v1Hat = v1 / (correction2 || 1e-12);
          const v2Hat = v2 / (correction2 || 1e-12);

          const newX = params[0] - (lr * m1Hat) / (Math.sqrt(v1Hat) + eps);
          const newY = params[1] - (lr * m2Hat) / (Math.sqrt(v2Hat) + eps);

          return [newX, newY];
        },
      };
    }
  }
}
