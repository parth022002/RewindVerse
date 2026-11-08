# @rewindverse/diagnostics

**Evidence-Backed Diagnostic Detectors & Training Insights Engine**

`@rewindverse/diagnostics` analyzes RVTS traces to identify training pathology, quantify convergence health, and generate human-readable, step-cited recommendations.

---

## Diagnostic Detectors

1. **Divergence & Non-Finite Detector**:
   - Catches `NaN`, `Infinity`, and explosive loss jumps.
2. **Plateau Detector**:
   - Identifies prolonged stagnation periods where loss improvement falls below threshold over a rolling patience window.
3. **Gradient Vanishing & Explosion Detector**:
   - Analyzes gradient norms ($\|\nabla L\|_2$) against configurable stability thresholds.
4. **Learning Rate Instability Detector**:
   - Detects oscillatory zig-zag patterns indicative of excessive step sizes or un-damped momentum.

---

## Evidence Narrative Generator

Every detected finding produces an evidence-grounded report containing:
- Exact step range citations (e.g. `Steps 42 – 88`)
- Severity tier (`info`, `warning`, `critical`)
- Confidence score and metric delta
- Actionable remediation advice (e.g., "Reduce learning rate by 2x or enable gradient clipping")

---

## Usage

```typescript
import { analyzeTrace } from "@rewindverse/diagnostics";

const findings = analyzeTrace(trace);

for (const finding of findings) {
  console.log(`[${finding.severity.toUpperCase()}] ${finding.title}: ${finding.narrative}`);
  console.log(`Affected steps: ${finding.stepRange.start} – ${finding.stepRange.end}`);
}
```

---

## License

Apache-2.0

