# @rewindverse/replay-engine

**Deterministic Playback, Frame Indexing, and Synchronization Engine**

`@rewindverse/replay-engine` provides sub-millisecond timeline synchronization and playback controls for ML training replays.

---

## Features

- **$O(1)$ Step Indexing**: Pre-indexes step records and checkpoint pointers for instant scrubbing across 10,000+ training steps.
- **Playback State Machine**:
  - `play()`, `pause()`, `toggle()`
  - Single-step scrubbing: `stepForward()`, `stepBackward()`
  - Direct seek: `seekIndex(index)` or `seekStep(stepNumber)`
  - Multi-speed playback: `0.25x`, `0.5x`, `1x`, `2x`, `5x`
  - Loop boundary control
- **Multi-View Synchronization**:
  - Emits synchronized position events consumed simultaneously by Loss Curves, 2D Trajectories, 3D Loss Surfaces, and Step Inspectors.
- **Capability Gating**:
  - Gracefully handles absent gradients, learning rates, or checkpoint snapshots according to the trace manifest.

---

## Usage

```typescript
import { createReplaySession } from "@rewindverse/replay-engine";

const session = createReplaySession(trace);

session.subscribe((state) => {
  console.log(`Current step: ${state.currentStep.step}, Loss: ${state.currentStep.metrics.loss}`);
});

session.play();
```

---

## License

Apache-2.0

