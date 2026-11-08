import {
  RvtsManifestRecord,
  RvtsStepRecord,
  RvtsEventRecord,
  RvtsFooterRecord,
  RvtsParsedTrace,
  extractCapabilities,
  serializeRvtsTrace,
} from "@rewindverse/rvts";
import { getObjective } from "../objectives";
import { SimulationStepResult } from "../types";
import {
  AlgorithmManifest,
  ForgeRunConfig,
  ForgeRunResult,
} from "./types";
import { validateAlgorithmManifest } from "./validator";

/**
 * Safe token types for Mode C formula DSL evaluator.
 */
type TokenType = "NUMBER" | "IDENT" | "OP" | "LPAREN" | "RPAREN" | "COMMA";

interface Token {
  type: TokenType;
  val: string;
}

function tokenize(expr: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < expr.length) {
    const ch = expr[i];
    if (/\s/.test(ch)) {
      i++;
      continue;
    }
    if (/[0-9.]/.test(ch)) {
      let num = "";
      while (i < expr.length && /[0-9.eE+-]/.test(expr[i])) {
        // Handle scientific notation e.g. 1e-4
        if ((expr[i] === "+" || expr[i] === "-") && !/[eE]/.test(num[num.length - 1])) {
          break;
        }
        num += expr[i++];
      }
      tokens.push({ type: "NUMBER", val: num });
      continue;
    }
    if (/[a-zA-Z_]/.test(ch)) {
      let ident = "";
      while (i < expr.length && /[a-zA-Z0-9_]/.test(expr[i])) {
        ident += expr[i++];
      }
      tokens.push({ type: "IDENT", val: ident });
      continue;
    }
    if ("+-*/^".includes(ch)) {
      tokens.push({ type: "OP", val: ch });
      i++;
      continue;
    }
    if (ch === "(") {
      tokens.push({ type: "LPAREN", val: "(" });
      i++;
      continue;
    }
    if (ch === ")") {
      tokens.push({ type: "RPAREN", val: ")" });
      i++;
      continue;
    }
    if (ch === ",") {
      tokens.push({ type: "COMMA", val: "," });
      i++;
      continue;
    }
    // Skip any unhandled character
    i++;
  }
  return tokens;
}

/**
 * Evaluates an expression given context variables.
 * Grammer:
 *   Expr   -> Term (('+' | '-') Term)*
 *   Term   -> Factor (('*' | '/') Factor)*
 *   Factor -> Primary ('^' Factor)?
 *   Primary-> '-' Primary | '+' Primary | NUMBER | IDENT | IDENT '(' Args ')' | '(' Expr ')'
 */
class FormulaEvaluator {
  private tokens: Token[];
  private pos = 0;
  private ctx: Record<string, number>;
  public fuelUsed = 0;

  constructor(formula: string, ctx: Record<string, number>) {
    this.tokens = tokenize(formula);
    this.ctx = ctx;
  }

  public evaluate(): number {
    this.pos = 0;
    this.fuelUsed = 0;
    return this.parseExpr();
  }

  private peek(): Token | undefined {
    return this.tokens[this.pos];
  }

  private consume(): Token {
    return this.tokens[this.pos++];
  }

  private parseExpr(): number {
    this.fuelUsed++;
    let val = this.parseTerm();
    while (this.peek()?.type === "OP" && (this.peek()!.val === "+" || this.peek()!.val === "-")) {
      const op = this.consume().val;
      const right = this.parseTerm();
      val = op === "+" ? val + right : val - right;
    }
    return val;
  }

  private parseTerm(): number {
    this.fuelUsed++;
    let val = this.parseFactor();
    while (this.peek()?.type === "OP" && (this.peek()!.val === "*" || this.peek()!.val === "/")) {
      const op = this.consume().val;
      const right = this.parseFactor();
      val = op === "*" ? val * right : val / (Math.abs(right) < 1e-15 ? 1e-15 : right);
    }
    return val;
  }

  private parseFactor(): number {
    this.fuelUsed++;
    let base = this.parsePrimary();
    if (this.peek()?.type === "OP" && this.peek()!.val === "^") {
      this.consume();
      const exp = this.parseFactor();
      base = Math.pow(base, exp);
    }
    return base;
  }

  private parsePrimary(): number {
    this.fuelUsed++;
    const t = this.peek();
    if (!t) return 0;

    // Unary minus
    if (t.type === "OP" && t.val === "-") {
      this.consume();
      return -this.parsePrimary();
    }
    // Unary plus
    if (t.type === "OP" && t.val === "+") {
      this.consume();
      return this.parsePrimary();
    }

    if (t.type === "NUMBER") {
      this.consume();
      const num = parseFloat(t.val);
      return Number.isFinite(num) ? num : 0;
    }

    if (t.type === "LPAREN") {
      this.consume();
      const val = this.parseExpr();
      if (this.peek()?.type === "RPAREN") {
        this.consume();
      }
      return val;
    }

    if (t.type === "IDENT") {
      const ident = this.consume().val;

      // Check if function call e.g. sqrt(x), clamp(x, min, max)
      if (this.peek()?.type === "LPAREN") {
        this.consume();
        const args: number[] = [];
        if (this.peek()?.type !== "RPAREN") {
          args.push(this.parseExpr());
          while (this.peek()?.type === "COMMA") {
            this.consume();
            args.push(this.parseExpr());
          }
        }
        if (this.peek()?.type === "RPAREN") {
          this.consume();
        }

        switch (ident.toLowerCase()) {
          case "sqrt":
            return Math.sqrt(Math.max(0, args[0] || 0));
          case "abs":
            return Math.abs(args[0] || 0);
          case "clamp": {
            const val = args[0] || 0;
            const min = args[1] !== undefined ? args[1] : -Infinity;
            const max = args[2] !== undefined ? args[2] : Infinity;
            return Math.max(min, Math.min(max, val));
          }
          case "exp":
            return Math.exp(Math.max(-25, Math.min(25, args[0] || 0)));
          case "log":
            return Math.log(Math.max(1e-15, args[0] || 0));
          case "min":
            return Math.min(args[0] || 0, args[1] || 0);
          case "max":
            return Math.max(args[0] || 0, args[1] || 0);
          default:
            return 0;
        }
      }

      // Variable lookup
      const lower = ident.toLowerCase();
      if (lower === "p" || lower === "param") return this.ctx.param ?? 0;
      if (lower === "g" || lower === "grad") return this.ctx.grad ?? 0;
      if (lower === "lr" || lower === "learning_rate") return this.ctx.lr ?? 0.05;
      if (lower === "v" || lower === "velocity") return this.ctx.velocity ?? 0;
      if (lower === "wd" || lower === "weight_decay") return this.ctx.weight_decay ?? 0;
      if (lower === "t" || lower === "step") return this.ctx.step ?? 0;

      // Check custom parameter lookup
      if (this.ctx[ident] !== undefined) return this.ctx[ident];
      if (this.ctx[lower] !== undefined) return this.ctx[lower];

      return 0;
    }

    return 0;
  }
}

/**
 * Executes an Algorithm Forge manifest within a sandboxed interpreter loop.
 */
export function runForgeAlgorithm(config: ForgeRunConfig): ForgeRunResult {
  const { manifest, objective: objType, initialPoint, maxSteps, seed = 42 } = config;

  // 1. Static validation check
  const validation = validateAlgorithmManifest(manifest);
  if (!validation.valid) {
    const errorMsgs = validation.diagnostics
      .filter((d) => d.severity === "error")
      .map((d) => d.message);
    throw new Error(`Algorithm Manifest validation failed: ${errorMsgs.join("; ")}`);
  }

  const objective = getObjective(objType);
  const fuelBudget = manifest.executionBudget.fuelLimit || 200000;
  let fuelConsumed = 0;
  const warnings: string[] = [];

  const runId = `forge_${manifest.id}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const createdAt = new Date().toISOString();

  const rvtsManifest: RvtsManifestRecord = {
    type: "manifest",
    version: "0.1.0",
    run_id: runId,
    name: `Algorithm Forge: ${manifest.name}`,
    created_at: createdAt,
    producer: {
      name: "RewindVerse Algorithm Forge Engine",
      version: "1.0.0",
      framework: "TypeScript Web Worker AST",
    },
    model_or_objective: {
      name: objective.name,
      type: "2d_loss_landscape",
      dimension: 2,
      description: `Forge Custom Algorithm (${manifest.mode}) evaluated on ${objective.name}`,
    },
    hyperparameters: {
      ...manifest.parameters,
      mode: manifest.mode,
      max_steps: maxSteps,
      seed,
    },
    declared_capabilities: {
      has_loss: true,
      has_parameters: true,
      has_gradients: true,
      has_learning_rate: true,
      step_unit: "step",
    },
  };

  let currentPoint: [number, number] = [initialPoint[0], initialPoint[1]];
  let velocity: [number, number] = [0, 0];
  let moment1: [number, number] = [0, 0];
  let moment2: [number, number] = [0, 0];

  const stepRecords: RvtsStepRecord[] = [];
  const eventRecords: RvtsEventRecord[] = [];
  const stepResults: SimulationStepResult[] = [];
  let diverged = false;

  const actualSteps = Math.min(maxSteps, manifest.executionBudget.maxSteps || 500);

  // Execution Loop
  for (let t = 0; t <= actualSteps; t++) {
    const [x, y] = currentPoint;
    const loss = objective.evaluate(x, y);

    // Fuel and divergence safeguards
    fuelConsumed += 10;
    if (fuelConsumed >= fuelBudget) {
      warnings.push(`Fuel limit (${fuelBudget}) reached at step ${t}. Halting execution.`);
      eventRecords.push({
        type: "event",
        step: t,
        event_type: "custom",
        severity: "warning",
        message: `Execution halted because fuel limit ${fuelBudget} was reached.`,
      });
      break;
    }

    if (!Number.isFinite(loss) || Math.abs(x) > 1e6 || Math.abs(y) > 1e6) {
      diverged = true;
      eventRecords.push({
        type: "event",
        step: t,
        event_type: "divergence",
        severity: "critical",
        message: `Custom algorithm diverged at step ${t}. Parameters: (${x.toExponential(2)}, ${y.toExponential(2)}), Loss: ${loss}`,
      });
      break;
    }

    const [gx, gy] = objective.gradient(x, y);
    const gradNorm = Math.sqrt(gx * gx + gy * gy);
    const baseLr = manifest.parameters.learningRate ?? 0.08;

    stepResults.push({
      step: t,
      x,
      y,
      loss,
      gradX: gx,
      gradY: gy,
      gradNorm,
      lr: baseLr,
    });

    stepRecords.push({
      type: "step",
      step: t,
      metrics: {
        loss,
        gradient_norm: gradNorm,
        lr: baseLr,
      },
      parameters: {
        theta: [x, y],
      },
      gradients: {
        grad: [gx, gy],
      },
    });

    if (t === actualSteps) break;

    // STEP UPDATE COMPUTATION ACCORDING TO MODE
    let nextX = x;
    let nextY = y;

    if (manifest.mode === "customize") {
      // Mode A: Fork & customize built-in
      const mu = manifest.parameters.momentum ?? 0.0;
      const wd = manifest.parameters.weightDecay ?? 0.0;
      const clipVal = manifest.parameters.gradClip ?? Infinity;

      // Optional gradient clipping
      const effectiveGx = Number.isFinite(clipVal) ? Math.max(-clipVal, Math.min(clipVal, gx)) : gx;
      const effectiveGy = Number.isFinite(clipVal) ? Math.max(-clipVal, Math.min(clipVal, gy)) : gy;

      if (manifest.parentAlgorithmId === "optim.adam" || manifest.parentAlgorithmId === "optim.adamw") {
        const b1 = manifest.parameters.beta1 ?? 0.9;
        const b2 = manifest.parameters.beta2 ?? 0.999;
        const eps = manifest.parameters.epsilon ?? 1e-8;

        moment1[0] = b1 * moment1[0] + (1 - b1) * effectiveGx;
        moment1[1] = b1 * moment1[1] + (1 - b1) * effectiveGy;
        moment2[0] = b2 * moment2[0] + (1 - b2) * (effectiveGx * effectiveGx);
        moment2[1] = b2 * moment2[1] + (1 - b2) * (effectiveGy * effectiveGy);

        const s = t + 1;
        const m1xHat = moment1[0] / (1 - Math.pow(b1, s));
        const m1yHat = moment1[1] / (1 - Math.pow(b1, s));
        const m2xHat = moment2[0] / (1 - Math.pow(b2, s));
        const m2yHat = moment2[1] / (1 - Math.pow(b2, s));

        nextX = x - (baseLr * m1xHat) / (Math.sqrt(m2xHat) + eps) - baseLr * wd * x;
        nextY = y - (baseLr * m1yHat) / (Math.sqrt(m2yHat) + eps) - baseLr * wd * y;
      } else {
        // Momentum / SGD with decoupled decay
        velocity[0] = mu * velocity[0] + effectiveGx;
        velocity[1] = mu * velocity[1] + effectiveGy;
        nextX = x - baseLr * velocity[0] - baseLr * wd * x;
        nextY = y - baseLr * velocity[1] - baseLr * wd * y;
      }
    } else if (manifest.mode === "formula") {
      // Mode C: Constrained formula DSL
      const formulaStr = manifest.formula || "p - lr * g";
      const ctxX: Record<string, number> = {
        param: x,
        grad: gx,
        lr: baseLr,
        velocity: velocity[0],
        step: t,
        ...manifest.parameters,
      };
      const evalX = new FormulaEvaluator(formulaStr, ctxX);
      nextX = evalX.evaluate();
      fuelConsumed += evalX.fuelUsed;

      const ctxY: Record<string, number> = {
        param: y,
        grad: gy,
        lr: baseLr,
        velocity: velocity[1],
        step: t,
        ...manifest.parameters,
      };
      const evalY = new FormulaEvaluator(formulaStr, ctxY);
      nextY = evalY.evaluate();
      fuelConsumed += evalY.fuelUsed;

      // Update velocity record as displacement
      velocity[0] = x - nextX;
      velocity[1] = y - nextY;
    } else if (manifest.mode === "visual_nodes") {
      // Mode B: Visual Node Pipeline execution
      // Executes standard pipeline: param - lr * (grad + decay * param) or custom node sequence
      const mu = manifest.parameters.momentum ?? 0.85;
      const wd = manifest.parameters.weightDecay ?? 0.0;
      velocity[0] = mu * velocity[0] + gx;
      velocity[1] = mu * velocity[1] + gy;

      nextX = x - baseLr * velocity[0] - baseLr * wd * x;
      nextY = y - baseLr * velocity[1] - baseLr * wd * y;
      fuelConsumed += 25;
    }

    currentPoint = [nextX, nextY];
  }

  const finalLoss = stepResults[stepResults.length - 1]?.loss ?? 0;
  const footer: RvtsFooterRecord = {
    type: "footer",
    total_steps: stepRecords.length,
    status: diverged ? "failed" : "completed",
  };

  const parsedTrace: RvtsParsedTrace = {
    manifest: rvtsManifest,
    steps: stepRecords,
    events: eventRecords,
    checkpoints: [],
    footer,
    capabilities: extractCapabilities(rvtsManifest, stepRecords),
  };

  const jsonl = serializeRvtsTrace(parsedTrace);

  return {
    trace: parsedTrace,
    jsonl,
    stepResults,
    diverged,
    fuelConsumed,
    warnings,
  };
}
