"""
Custom Optimization Loop on the Rosenbrock Banana Landscape.
Demonstrates heavy-ball momentum optimization with live RVTS recording.
"""

import numpy as np
from rewindverse_trace.recorder import TraceRecorder

def rosenbrock(x, y):
    return (1.0 - x)**2 + 100.0 * (y - x**2)**2

def rosenbrock_grad(x, y):
    gx = -2.0 * (1.0 - x) - 400.0 * x * (y - x**2)
    gy = 200.0 * (y - x**2)
    return np.array([gx, gy])

def main():
    print("Starting Custom Rosenbrock Loop with Polyak Momentum...")
    recorder = TraceRecorder(
        run_name="rosenbrock_polyak_momentum",
        algorithm="polyak_momentum",
        hyperparameters={"lr": 0.001, "momentum": 0.9},
        metrics=["loss"]
    )

    theta = np.array([-1.2, 1.0])
    lr = 0.001
    beta = 0.9
    v = np.zeros(2)

    for step in range(1, 151):
        loss = float(rosenbrock(theta[0], theta[1]))
        grad = rosenbrock_grad(theta[0], theta[1])

        # Polyak Momentum Update
        v = beta * v + grad
        theta = theta - lr * v

        recorder.record_step(
            step=step,
            loss=loss,
            parameters={"x": float(theta[0]), "y": float(theta[1])},
            gradients={"gx": float(grad[0]), "gy": float(grad[1])},
            metrics={"loss": loss}
        )

    trace_path = "rosenbrock_polyak_momentum.rvtrace"
    recorder.export(trace_path)
    print(f"Rosenbrock trace recorded and exported successfully: {trace_path}")

if __name__ == "__main__":
    main()

