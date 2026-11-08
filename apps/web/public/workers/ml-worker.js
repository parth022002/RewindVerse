/**
 * RewindML Off-Thread Web Worker
 * Executes heavy multi-step optimization and classification routines off the main thread.
 */

self.onmessage = function (e) {
  const { type, payload, taskId } = e.data || {};

  if (type === "RUN_OPTIMIZATION") {
    try {
      const { objective, optimizer, initialPoint, maxSteps, seed, noiseLevel } = payload;
      let [x, y] = initialPoint || [-3, 3];
      const steps = [];

      let mX = 0, mY = 0, vX = 0, vY = 0;
      let velX = 0, velY = 0;
      const lr = optimizer.learningRate || 0.05;
      const beta1 = optimizer.beta1 || 0.9;
      const beta2 = optimizer.beta2 || 0.999;
      const eps = optimizer.epsilon || 1e-8;
      const momentum = optimizer.momentum || 0.9;

      for (let step = 0; step <= maxSteps; step++) {
        let loss = 0;
        let gx = 0;
        let gy = 0;

        if (objective === "quadratic") {
          loss = 0.5 * (x * x + 10 * y * y);
          gx = x;
          gy = 10 * y;
        } else if (objective === "rosenbrock") {
          const a = 1 - x;
          const b = y - x * x;
          loss = a * a + 100 * b * b;
          gx = -2 * a - 400 * x * b;
          gy = 200 * b;
        } else {
          // saddle
          loss = x * x - y * y;
          gx = 2 * x;
          gy = -2 * y;
        }

        const gradNorm = Math.sqrt(gx * gx + gy * gy);

        steps.push({
          step,
          loss,
          x,
          y,
          gx,
          gy,
          gradNorm,
        });

        // Optimization step
        if (optimizer.type === "adam") {
          mX = beta1 * mX + (1 - beta1) * gx;
          mY = beta1 * mY + (1 - beta1) * gy;
          vX = beta2 * vX + (1 - beta2) * (gx * gx);
          vY = beta2 * vY + (1 - beta2) * (gy * gy);

          const t = step + 1;
          const mHatX = mX / (1 - Math.pow(beta1, t));
          const mHatY = mY / (1 - Math.pow(beta1, t));
          const vHatX = vX / (1 - Math.pow(beta2, t));
          const vHatY = vY / (1 - Math.pow(beta2, t));

          x -= (lr * mHatX) / (Math.sqrt(vHatX) + eps);
          y -= (lr * mHatY) / (Math.sqrt(vHatY) + eps);
        } else if (optimizer.type === "momentum") {
          velX = momentum * velX + lr * gx;
          velY = momentum * velY + lr * gy;
          x -= velX;
          y -= velY;
        } else {
          x -= lr * gx;
          y -= lr * gy;
        }
      }

      self.postMessage({
        type: "SIMULATION_COMPLETE",
        taskId,
        steps,
      });
    } catch (err) {
      self.postMessage({
        type: "SIMULATION_ERROR",
        taskId,
        error: err.message,
      });
    }
  }
};

