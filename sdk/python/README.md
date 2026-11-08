# RewindVerse Python Trace SDK (`rewindverse-trace`)

**Train a model, then replay how it learned.**

`rewindverse-trace` is the official Python SDK and CLI for recording machine learning experiments into the portable **RewindVerse Training Trace (RVTS)** format.

---

## Installation

```bash
pip install rewindverse-trace
```

---

## Quickstart: Record in Custom Training Loop

```python
from rewindverse_trace import RunRecorder

with RunRecorder(
    run_name="resnet_experiment",
    model_name="CustomResNet",
    output_path="traces/run.rvtrace",
    hyperparameters={"lr": 0.01, "batch_size": 32}
) as rec:
    for epoch in range(50):
        # Your training step
        loss = train_step(model, batch)
        
        # Log to RVTS trace incrementally
        rec.log_step(
            step=epoch,
            metrics={"loss": loss},
            lr=0.01
        )
```

---

## CLI Commands

### 1. Validate a Trace File
```bash
rvtrace validate traces/run.rvtrace
```

### 2. Inspect Trace Contents and Capabilities
```bash
rvtrace inspect traces/run.rvtrace
```

### 3. Open in Browser Replay Viewer
```bash
rvtrace view traces/run.rvtrace
```
