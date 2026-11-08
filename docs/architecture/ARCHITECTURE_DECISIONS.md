# RewindVerse — Architecture Decision Records (ADR)

## ADR-001: RVTS as the Canonical Trace Specification
- **Context:** Earlier drafts referred to a generic Machine Learning Training Trace (MVTS).
- **Decision:** Adopt **RVTS (RewindVerse Training Trace Specification v0.1.0)** as the official, versioned JSONL schema.
- **Consequences:** All encoders, validators, and Python SDKs output strictly conformant `.rvtrace` files. Legacy files with `format: "mvts"` are automatically mapped into RVTS format during import with zero data loss.

## ADR-002: Zero Dynamic Code Execution in Browser
- **Context:** User customization of equations, loss functions, and optimization update rules requires flexible expression evaluation.
- **Decision:** Strictly forbid `eval()`, `new Function()`, and dynamic script injection. Implement an allowlisted recursive-descent AST parser and interpreter with a 500,000-step fuel budget.
- **Consequences:** Eliminates DOM access, prototype pollution, and arbitrary code execution vulnerabilities in browser environments.

## ADR-003: Local-First Storage with Explicit Cloud Sharing
- **Context:** Machine learning experiment data, datasets, and traces often contain sensitive or proprietary information.
- **Decision:** Store all datasets, runs, and algorithm manifests locally in IndexedDB by default. Transmit to remote Neon PostgreSQL / S3 only upon explicit user action ("Share to Cloud").
- **Consequences:** 100% offline functionality, zero unauthorized data exfiltration, and full compliance with user data privacy.

## ADR-004: Central Finite-Difference Jacobian & Gradient Verification
- **Context:** Custom algebraic update rules and loss functions in Algorithm Forge may produce incorrect analytical gradients.
- **Decision:** Embed a numerical central finite-difference gradient verifier ($g_i \approx \frac{f(\theta+\epsilon e_i) - f(\theta-\epsilon e_i)}{2\epsilon}$) directly in Equation Studio.
- **Consequences:** Algorithm scientists receive immediate feedback with numerical error badges before running full simulations.

## ADR-005: 2D & 3D Visual Parity
- **Context:** Some users prefer lightweight 2D top-down contour maps; others require immersive 3D spatial perspective.
- **Decision:** Implement both 2D and 3D rendering modes with persistent user preferences, synchronized scrubbers, and WebGL context loss recovery.
- **Consequences:** Seamless transitions between analytical 2D views and spatial 3D surfaces without loss of current step state.
