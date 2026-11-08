# @rewindverse/rewindml

**Deterministic In-Browser Machine Learning Computation Engine**

`@rewindverse/rewindml` executes deterministic, zero-hallucination ML training simulations directly inside modern web browsers and Web Workers.

---

## Features

- **Continuous 2D Loss Surfaces**:
  - `quadratic`: Anisotropic ravine ($f(w_1, w_2) = 0.5(w_1^2 + 10w_2^2)$)
  - `rosenbrock`: Non-convex banana valley ($f(w_1, w_2) = (1-w_1)^2 + 100(w_2 - w_1^2)^2$)
  - `saddle`: Saddle point ($f(w_1, w_2) = w_1^2 - w_2^2$)
- **Optimizers**:
  - Standard Stochastic Gradient Descent (SGD)
  - Polyak Momentum SGD
  - Adaptive Moment Estimation (Adam) with bias-corrected 1st and 2nd moments
- **Supervised Learning**:
  - 2D Gaussian Blobs synthetic dataset generator
  - Logistic Regression classifier with Binary Cross Entropy (BCE) loss
  - Step-by-step decision boundary calculation
- **Deterministic Reproducibility**:
  - Seeded Mulberry32 pseudo-random number generator
  - Emits spec-compliant `@rewindverse/rvts` JSONL traces

---

## Usage

```typescript
import { runSimulation } from "@rewindverse/rewindml";

const trace = runSimulation({
  objective: "rosenbrock",
  optimizer: "adam",
  lr: 0.05,
  steps: 200,
  initialWeights: [-1.2, 1.0],
  seed: 42,
});

console.log(`Generated trace with ${trace.steps.length} steps.`);
```

---

## License

Apache-2.0

