# @rewindverse/rvts

**RewindVerse Training Trace (RVTS) Specification, JSON Schema, and Parsers**

`@rewindverse/rvts` is the foundational interchange package of RewindVerse. It defines the formal TypeScript contracts, JSON Schema Draft 2020-12 specification, streaming parsers, and cross-platform validators for `.rvtrace` files.

---

## Capabilities

1. **Deterministic Validation**:
   - `validateRvtsManifest(manifest)`: Validates metadata, schema version, run ID, and declared capabilities.
   - `validateRvtsStep(step, prevStep)`: Enforces monotonic step indices, positive finite time deltas, and valid numeric loss values.
   - `validateFullTraceRecords(records)`: Performs end-to-end multi-record validation.
2. **Streaming Parser & Serializer**:
   - `parseRvtsTrace(jsonlString)`: Parses JSONL traces with configurable byte, line, and security limits.
   - `serializeRvtsTrace(trace)`: Formats and serializes in-memory traces back into `.rvtrace` JSON Lines.
3. **Capability Extraction**:
   - `extractCapabilities(steps)`: Analyzes trace contents to detect `has_loss`, `has_gradients`, `has_parameters`, `has_learning_rates`, `has_events`, and `has_checkpoints`. Enables honest UI panel gating.
4. **CSV Importer & Sanitizer**:
   - `convertCsvToRvts(csvContent, options)`: Converts generic tabular logs (Keras, PyTorch Lightning, WandB CSV exports) into valid RVTS traces.
   - `sanitizeCell(cell)`: Strips spreadsheet formula injection vectors (`=`, `+`, `-`, `@`, `\t`, `\r`).

---

## Installation

```bash
pnpm add @rewindverse/rvts
```

---

## Usage

```typescript
import { parseRvtsTrace, serializeRvtsTrace, validateFullTraceRecords } from "@rewindverse/rvts";

// Parse a .rvtrace file
const { trace, errors, capabilities } = parseRvtsTrace(fileContent);

if (errors.length > 0) {
  console.error("Validation failed:", errors);
} else {
  console.log(`Parsed run: ${trace.manifest.run_id} with ${trace.steps.length} steps`);
}
```

---

## License

Apache-2.0

