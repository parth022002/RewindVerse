"""
Scikit-Learn / Classical ML Binary Classification with RewindVerse RVTS Trace Recording.
Demonstrates iterative logistic regression logging decision boundaries and loss.
"""

import numpy as np
from rewindverse_trace.recorder import TraceRecorder

def sigmoid(z):
    return 1.0 / (1.0 + np.exp(-np.clip(z, -250, 250)))

def main():
    print("Starting Logistic Regression Simulation with RewindVerse TraceRecorder...")
    recorder = TraceRecorder(
        run_name="logistic_regression_blobs",
        algorithm="logistic_regression",
        hyperparameters={"lr": 0.05, "l2": 0.001},
        metrics=["loss", "accuracy"]
    )

    # Synthetic binary classification data (N=200)
    np.random.seed(42)
    X0 = np.random.randn(100, 2) + np.array([-1.5, -1.0])
    X1 = np.random.randn(100, 2) + np.array([1.5, 1.0])
    X = np.vstack([X0, X1])
    y = np.array([0]*100 + [1]*100)

    # Parameters: w = [w0, w1], b = bias
    w = np.zeros(2)
    b = 0.0
    lr = 0.05
    N = len(y)

    for epoch in range(1, 101):
        # Forward pass
        logits = np.dot(X, w) + b
        preds = sigmoid(logits)

        # Cross-Entropy Loss
        eps = 1e-12
        loss = -float(np.mean(y * np.log(preds + eps) + (1.0 - y) * np.log(1.0 - preds + eps)))
        accuracy = float(np.mean((preds >= 0.5) == y))

        # Backward gradients
        error = preds - y
        grad_w = np.dot(X.T, error) / N + 0.001 * w
        grad_b = float(np.mean(error))

        # Optimizer update
        w = w - lr * grad_w
        b = b - lr * grad_b

        # Record step
        recorder.record_step(
            step=epoch,
            loss=loss,
            parameters={"w0": float(w[0]), "w1": float(w[1]), "bias": float(b)},
            gradients={"gw0": float(grad_w[0]), "gw1": float(grad_w[1]), "gbias": float(grad_b)},
            metrics={"loss": loss, "accuracy": accuracy}
        )

    trace_path = "logistic_regression_blobs.rvtrace"
    recorder.export(trace_path)
    print(f"Classifier trace recorded and exported successfully: {trace_path}")

if __name__ == "__main__":
    main()

