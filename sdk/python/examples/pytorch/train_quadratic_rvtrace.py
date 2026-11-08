"""
PyTorch Optimization Training Loop with RewindVerse RVTS Trace Recording.
Demonstrates logging loss, parameters, gradients, and metrics.
"""

import math
import numpy as np
from rewindverse_trace.recorder import TraceRecorder

def main():
    print("Starting PyTorch Simulation with RewindVerse TraceRecorder...")
    recorder = TraceRecorder(
        run_name="pytorch_quadratic_descent",
        algorithm="adamw",
        hyperparameters={"lr": 0.01, "weight_decay": 0.01},
        metrics=["loss", "lr"]
    )

    # 2D Quadratic Loss Objective: f(x, y) = 0.5 * (x^2 + 10 * y^2)
    theta = np.array([2.5, -1.8])
    lr = 0.02
    beta1 = 0.9
    beta2 = 0.999
    eps = 1e-8
    m = np.zeros_like(theta)
    v = np.zeros_like(theta)

    for step in range(1, 101):
        # Forward Loss
        loss = float(0.5 * (theta[0]**2 + 10.0 * theta[1]**2))

        # Backward Gradient
        grad = np.array([theta[0], 10.0 * theta[1]])

        # AdamW Update
        m = beta1 * m + (1.0 - beta1) * grad
        v = beta2 * v + (1.0 - beta2) * (grad**2)
        m_hat = m / (1.0 - beta1**step)
        v_hat = v / (1.0 - beta2**step)
        theta = theta - lr * (m_hat / (np.sqrt(v_hat) + eps) + 0.01 * theta)

        # Record step to RVTS
        recorder.record_step(
            step=step,
            loss=loss,
            parameters={"x": float(theta[0]), "y": float(theta[1])},
            gradients={"gx": float(grad[0]), "gy": float(grad[1])},
            metrics={"loss": loss, "lr": lr}
        )

    trace_path = "pytorch_quadratic_descent.rvtrace"
    recorder.export(trace_path)
    print(f"Trace recorded and exported successfully: {trace_path}")

if __name__ == "__main__":
    main()

