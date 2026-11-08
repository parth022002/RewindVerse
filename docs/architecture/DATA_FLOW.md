# RewindVerse — End-to-End Data Flow Architecture

```mermaid
flowchart TD
    subgraph INTAKE ["1. Intake & Data Preparation"]
        A1[User Data: CSV / TSV / JSON] --> A2[Data Lab Ingestion]
        A2 --> A3[Schema Inference & Profiler]
        A3 --> A4[Transform Pipeline: Impute / Scale / Split]
        A4 --> A5[(Dataset Version + Manifest in IndexedDB)]
    end

    subgraph CONFIG ["2. Problem & Algorithm Specification"]
        A5 --> B1[ProblemSpec: Task Family, Target, Metrics]
        B2[Algorithm Catalog / Forge Manifest] --> B3[Capability Manifest]
        B1 & B3 --> B4[Compatibility & Recommendation Engine]
    end

    subgraph EXECUTION ["3. Safe Simulation & Trace Generation"]
        B4 --> C1[Evaluation Protocol: K-Fold / Chronological]
        C1 --> C2[Sandboxed Web Worker / Python CLI]
        C2 --> C3[AST Safe Interpreter + Fuel Metering]
        C3 --> C4[RVTS Streaming JSONL Recorder]
    end

    subgraph ANALYSIS ["4. Inspection, Intelligence & Replay"]
        C4 --> D1[(.rvtrace Artifact)]
        D1 --> D2[Rewind Replay Engine: O(1) Scrubber]
        D1 --> D3[Diagnostic Insights: NaN, Plateaus, Gradients]
        D1 --> D4[Fit Lab Report & Leaderboards]
        D1 --> D5[2D / 3D Visualizer Parity]
    end

    subgraph PROVENANCE ["5. Reproducibility & Sharing"]
        D4 --> E1[.rvcapsule Reproducibility Capsule]
        D1 --> E2[Optional Cloud Share: Neon Postgres + S3]
        E1 --> E3[Reproduction Studio: Epsilon Diff Check]
    end
```

## Data Transformation Guarantees
1. **Zero Data Leakage:** Preprocessing transformations (scaling, imputation, encoding) are strictly fitted on training splits only and applied downstream to validation/test partitions.
2. **Deterministic Replay:** Every frame index is tied to monotonic iteration numbers, preserving parameter snapshots, loss values, and gradient norms.
3. **Trace Immutability:** Exported `.rvtrace` files are cryptographically fingerprinted to ensure research provenance.

