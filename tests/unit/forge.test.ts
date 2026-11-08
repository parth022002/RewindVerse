import { describe, it, expect } from "vitest";
import {
  validateAlgorithmManifest,
  runForgeAlgorithm,
  FORGE_TEMPLATES,
  AlgorithmManifest,
} from "@rewindverse/rewindml";

describe("Algorithm Forge Manifest Validator & AST Security", () => {
  it("approves valid pre-built templates", () => {
    for (const template of FORGE_TEMPLATES) {
      const res = validateAlgorithmManifest(template);
      expect(res.valid).toBe(true);
      expect(res.diagnostics.filter((d) => d.severity === "error").length).toBe(0);
    }
  });

  it("rejects invalid manifest id and empty name", () => {
    const invalidManifest: AlgorithmManifest = {
      id: "invalid id with spaces!",
      name: "",
      version: "1.0.0",
      author: "Test",
      description: "Invalid",
      license: "MIT",
      createdAt: new Date().toISOString(),
      mode: "customize",
      parameters: { learningRate: 0.1 },
      executionBudget: { maxSteps: 100, fuelLimit: 5000, maxMemoryMb: 32 },
    };

    const res = validateAlgorithmManifest(invalidManifest);
    expect(res.valid).toBe(false);
    expect(res.diagnostics.some((d) => d.code === "INVALID_MANIFEST_ID")).toBe(true);
    expect(res.diagnostics.some((d) => d.code === "EMPTY_NAME")).toBe(true);
  });

  it("strictly rejects forbidden JS code execution in formula DSL", () => {
    const maliciousManifest: AlgorithmManifest = {
      id: "malicious_attempt",
      name: "Malicious Formula",
      version: "1.0.0",
      author: "Attacker",
      description: "Tries eval",
      license: "MIT",
      createdAt: new Date().toISOString(),
      mode: "formula",
      formula: "eval('p - g') + window.location",
      parameters: { learningRate: 0.1 },
      executionBudget: { maxSteps: 100, fuelLimit: 5000, maxMemoryMb: 32 },
    };

    const res = validateAlgorithmManifest(maliciousManifest);
    expect(res.valid).toBe(false);
    expect(res.diagnostics.some((d) => d.code === "FORBIDDEN_KEYWORD")).toBe(true);
  });

  it("rejects cycles in visual node graphs", () => {
    const cyclicManifest: AlgorithmManifest = {
      id: "cyclic_graph",
      name: "Cyclic Node Graph",
      version: "1.0.0",
      author: "Test",
      description: "Contains cycle",
      license: "MIT",
      createdAt: new Date().toISOString(),
      mode: "visual_nodes",
      parameters: { learningRate: 0.05 },
      nodes: [
        { id: "p_in", type: "input", label: "p", inputKey: "param" },
        { id: "node_a", type: "operation", label: "A", op: "add" },
        { id: "node_b", type: "operation", label: "B", op: "mul" },
        { id: "p_out", type: "output", label: "out", outputKey: "next_param" },
      ],
      edges: [
        { id: "e1", fromNode: "p_in", fromPort: "out", toNode: "node_a", toPort: "in_a" },
        { id: "e2", fromNode: "node_a", fromPort: "out", toNode: "node_b", toPort: "in" },
        { id: "e3", fromNode: "node_b", fromPort: "out", toNode: "node_a", toPort: "in_b" }, // CYCLE!
        { id: "e4", fromNode: "node_b", fromPort: "out", toNode: "p_out", toPort: "in" },
      ],
      executionBudget: { maxSteps: 50, fuelLimit: 5000, maxMemoryMb: 32 },
    };

    const res = validateAlgorithmManifest(cyclicManifest);
    expect(res.valid).toBe(false);
    expect(res.diagnostics.some((d) => d.code === "CYCLE_DETECTED")).toBe(true);
  });
});

describe("Algorithm Forge Sandboxed Execution Engine", () => {
  it("executes Mode A (SGDW) and minimizes quadratic loss", () => {
    const sgdwTemplate = FORGE_TEMPLATES.find((t) => t.id === "forge.sgdw")!;
    const result = runForgeAlgorithm({
      manifest: sgdwTemplate,
      objective: "quadratic",
      initialPoint: [2.5, 2.5],
      maxSteps: 30,
      seed: 42,
    });

    expect(result.diverged).toBe(false);
    expect(result.stepResults.length).toBe(31);
    expect(result.stepResults[30].loss).toBeLessThan(result.stepResults[0].loss);
    expect(result.trace.manifest.name).toContain("Decoupled Weight Decay SGD");
    expect(result.trace.steps.length).toBe(31);
    expect(result.trace.footer?.status).toBe("completed");
  });

  it("executes Mode C (Formula DSL) with Signum optimizer safely", () => {
    const signumTemplate = FORGE_TEMPLATES.find((t) => t.id === "forge.signum")!;
    const result = runForgeAlgorithm({
      manifest: signumTemplate,
      objective: "quadratic",
      initialPoint: [3.0, 3.0],
      maxSteps: 40,
      seed: 42,
    });

    expect(result.diverged).toBe(false);
    expect(result.stepResults[40].loss).toBeLessThan(result.stepResults[0].loss);
    expect(result.fuelConsumed).toBeGreaterThan(0);
  });

  it("detects divergence and outputs divergence event without crashing", () => {
    const divergingManifest: AlgorithmManifest = {
      id: "diverging_algo",
      name: "Wild Diverger",
      version: "1.0.0",
      author: "Test",
      description: "Huge learning rate to trigger divergence",
      license: "MIT",
      createdAt: new Date().toISOString(),
      mode: "customize",
      parameters: {
        learningRate: 5.0, // Extremely unstable on quadratic bowl (dx = 2x, step explodes)
        momentum: 0.95,
      },
      executionBudget: {
        maxSteps: 50,
        fuelLimit: 50000,
        maxMemoryMb: 32,
      },
    };

    const result = runForgeAlgorithm({
      manifest: divergingManifest,
      objective: "quadratic",
      initialPoint: [3.0, 3.0],
      maxSteps: 50,
    });

    expect(result.diverged).toBe(true);
    expect(result.trace.footer?.status).toBe("failed");
    expect(result.trace.events.some((e) => e.event_type === "divergence")).toBe(true);
  });
});
