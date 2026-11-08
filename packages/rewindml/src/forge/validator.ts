import {
  AlgorithmManifest,
  AllowlistedOperation,
  ValidationDiagnostic,
  ValidationResult,
} from "./types";

const ALLOWED_OPERATIONS: Set<AllowlistedOperation> = new Set([
  "add",
  "sub",
  "mul",
  "div",
  "pow",
  "sqrt",
  "clamp",
  "abs",
  "exp",
  "log",
  "min",
  "max",
  "scale",
  "negate",
  "momentum_update",
  "sgd_update",
  "adam_update",
]);

const FORBIDDEN_TOKENS = [
  "eval",
  "Function",
  "import",
  "window",
  "document",
  "global",
  "process",
  "fetch",
  "require",
  "prototype",
  "constructor",
  "__proto__",
  "setTimeout",
  "setInterval",
];

export function validateAlgorithmManifest(manifest: AlgorithmManifest): ValidationResult {
  const diagnostics: ValidationDiagnostic[] = [];

  // 1. Basic Metadata Validation
  if (!manifest.id || typeof manifest.id !== "string" || !/^[a-z0-9_.-]+$/i.test(manifest.id)) {
    diagnostics.push({
      severity: "error",
      code: "INVALID_MANIFEST_ID",
      message: "Manifest ID must be a non-empty alphanumeric slug with hyphens or underscores.",
    });
  }

  if (!manifest.name || manifest.name.trim().length === 0) {
    diagnostics.push({
      severity: "error",
      code: "EMPTY_NAME",
      message: "Algorithm name must not be blank.",
    });
  }

  // 2. Execution Budget Limits
  const budget = manifest.executionBudget;
  if (!budget) {
    diagnostics.push({
      severity: "error",
      code: "MISSING_BUDGET",
      message: "Execution budget specification is required.",
    });
  } else {
    if (budget.maxSteps < 1 || budget.maxSteps > 10000) {
      diagnostics.push({
        severity: "error",
        code: "BUDGET_EXCEEDED",
        message: `maxSteps must be between 1 and 10,000 (specified: ${budget.maxSteps}).`,
      });
    }
    if (budget.fuelLimit < 100 || budget.fuelLimit > 500000) {
      diagnostics.push({
        severity: "error",
        code: "FUEL_LIMIT_EXCEEDED",
        message: `fuelLimit must be between 100 and 500,000 (specified: ${budget.fuelLimit}).`,
      });
    }
  }

  // 3. Mode-Specific Validations
  let estimatedFuel = (budget?.maxSteps || 100) * 10;

  if (manifest.mode === "customize") {
    // Mode A: Parameter bounds validation
    const params = manifest.parameters || {};
    if (params.learningRate !== undefined) {
      if (!Number.isFinite(params.learningRate) || params.learningRate <= 0 || params.learningRate > 10.0) {
        diagnostics.push({
          severity: "error",
          code: "INVALID_PARAM_LR",
          message: `learningRate must be finite and within (0, 10.0] (received ${params.learningRate}).`,
        });
      }
    }
    if (params.momentum !== undefined) {
      if (!Number.isFinite(params.momentum) || params.momentum < 0 || params.momentum >= 1.0) {
        diagnostics.push({
          severity: "error",
          code: "INVALID_PARAM_MOMENTUM",
          message: `momentum must be in [0.0, 1.0) (received ${params.momentum}).`,
        });
      }
    }
  } else if (manifest.mode === "visual_nodes") {
    // Mode B: Graph AST & Cycle Check
    const nodes = manifest.nodes || [];
    const edges = manifest.edges || [];

    if (nodes.length === 0) {
      diagnostics.push({
        severity: "error",
        code: "EMPTY_GRAPH",
        message: "Visual node graph must contain at least one operation node.",
      });
    }

    const nodeIds = new Set<string>();
    let hasOutput = false;
    let hasParamInput = false;

    for (const node of nodes) {
      if (nodeIds.has(node.id)) {
        diagnostics.push({
          severity: "error",
          code: "DUPLICATE_NODE_ID",
          message: `Duplicate node ID: ${node.id}`,
          nodeId: node.id,
        });
      }
      nodeIds.add(node.id);

      if (node.type === "operation") {
        if (!node.op || !ALLOWED_OPERATIONS.has(node.op)) {
          diagnostics.push({
            severity: "error",
            code: "FORBIDDEN_OPERATION",
            message: `Operation '${node.op}' is not in the allowlist.`,
            nodeId: node.id,
          });
        }
      }

      if (node.type === "input" && node.inputKey === "param") {
        hasParamInput = true;
      }
      if (node.type === "output" && node.outputKey === "next_param") {
        hasOutput = true;
      }
    }

    if (!hasParamInput) {
      diagnostics.push({
        severity: "error",
        code: "MISSING_PARAM_INPUT",
        message: "Graph requires an input node mapped to 'param'.",
      });
    }

    if (!hasOutput) {
      diagnostics.push({
        severity: "error",
        code: "MISSING_NEXT_PARAM_OUTPUT",
        message: "Graph requires an output node mapped to 'next_param'.",
      });
    }

    // Cycle detection using Kahn's algorithm or DFS
    const adjacency: Map<string, string[]> = new Map();
    const inDegree: Map<string, number> = new Map();

    for (const n of nodes) {
      adjacency.set(n.id, []);
      inDegree.set(n.id, 0);
    }

    for (const edge of edges) {
      if (!nodeIds.has(edge.fromNode) || !nodeIds.has(edge.toNode)) {
        diagnostics.push({
          severity: "error",
          code: "DANGLING_EDGE",
          message: `Edge connects non-existent nodes: ${edge.fromNode} -> ${edge.toNode}`,
        });
        continue;
      }
      adjacency.get(edge.fromNode)!.push(edge.toNode);
      inDegree.set(edge.toNode, (inDegree.get(edge.toNode) || 0) + 1);
    }

    const queue: string[] = [];
    inDegree.forEach((deg, id) => {
      if (deg === 0) queue.push(id);
    });

    let visitedCount = 0;
    while (queue.length > 0) {
      const u = queue.shift()!;
      visitedCount++;
      for (const v of adjacency.get(u) || []) {
        inDegree.set(v, inDegree.get(v)! - 1);
        if (inDegree.get(v) === 0) {
          queue.push(v);
        }
      }
    }

    if (visitedCount < nodes.length) {
      diagnostics.push({
        severity: "error",
        code: "CYCLE_DETECTED",
        message: "Graph contains a cyclic dependency. The update pipeline must be a directed acyclic graph (DAG).",
      });
    }

    estimatedFuel = (budget?.maxSteps || 100) * Math.max(10, nodes.length * 3);
  } else if (manifest.mode === "formula") {
    // Mode C: Constrained formula DSL validation
    const formula = manifest.formula || "";
    if (formula.trim().length === 0) {
      diagnostics.push({
        severity: "error",
        code: "EMPTY_FORMULA",
        message: "Update formula string must not be empty.",
      });
    }

    // Check for forbidden JavaScript tokens (eval, Function, prototype, etc.)
    for (const forbidden of FORBIDDEN_TOKENS) {
      if (formula.toLowerCase().includes(forbidden.toLowerCase())) {
        diagnostics.push({
          severity: "error",
          code: "FORBIDDEN_KEYWORD",
          message: `Formula contains prohibited token '${forbidden}'. Arbitrary code execution is strictly prevented.`,
        });
      }
    }

    // Validate characters: only math operators, identifiers, numbers, parens, commas, whitespace
    const allowedCharsRegex = /^[0-9a-zA-Z_\s+\-*/^().,]+$/;
    if (!allowedCharsRegex.test(formula)) {
      diagnostics.push({
        severity: "error",
        code: "ILLEGAL_CHARACTERS",
        message: "Formula contains characters outside the mathematical DSL (allowed: a-z, 0-9, +, -, *, /, ^, parentheses, comma).",
      });
    }

    // Check parentheses balance
    let openCount = 0;
    for (const ch of formula) {
      if (ch === "(") openCount++;
      if (ch === ")") openCount--;
      if (openCount < 0) {
        diagnostics.push({
          severity: "error",
          code: "UNBALANCED_PARENS",
          message: "Unbalanced parentheses in formula (unexpected closing parenthesis).",
        });
        break;
      }
    }
    if (openCount > 0) {
      diagnostics.push({
        severity: "error",
        code: "UNBALANCED_PARENS",
        message: "Unbalanced parentheses in formula (missing closing parenthesis).",
      });
    }

    estimatedFuel = (budget?.maxSteps || 100) * 15;
  }

  const valid = diagnostics.filter((d) => d.severity === "error").length === 0;

  return {
    valid,
    diagnostics,
    estimatedFuel,
  };
}

