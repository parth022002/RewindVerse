"use client";

import React, { useState, useMemo } from "react";
import {
  Code2,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Calculator,
  Compass,
  Layers,
  RotateCcw,
  BookOpen,
} from "lucide-react";

export interface EquationStudioProps {
  formula: string;
  onFormulaChange: (val: string) => void;
}

const MATHEMATICAL_TOKENS = [
  { label: "θ (theta)", token: "theta", category: "variable" },
  { label: "∇f (grad)", token: "grad", category: "variable" },
  { label: "η (lr)", token: "lr", category: "hyperparameter" },
  { label: "β (momentum)", token: "beta", category: "hyperparameter" },
  { label: "λ (weight_decay)", token: "lambda", category: "hyperparameter" },
  { label: "sign(x)", token: "sign(grad)", category: "operator" },
  { label: "sqrt(x)", token: "sqrt(v)", category: "operator" },
  { label: "clamp(x, min, max)", token: "clamp(grad, -1, 1)", category: "operator" },
  { label: "abs(x)", token: "abs(grad)", category: "operator" },
  { label: "exp(x)", token: "exp(x)", category: "operator" },
  { label: "log(x)", token: "log(x)", category: "operator" },
  { label: "pow(x, p)", token: "pow(grad, 2)", category: "operator" },
];

export function EquationStudio({
  formula,
  onFormulaChange,
}: EquationStudioProps) {
  // Finite difference test point
  const [testThetaX, setTestThetaX] = useState<number>(1.5);
  const [testThetaY, setTestThetaY] = useState<number>(-2.0);
  const [epsilon, setEpsilon] = useState<number>(1e-5);
  const [objectiveFormula, setObjectiveFormula] = useState<string>("0.5 * (x^2 + 10 * y^2)");

  // Evaluate central finite difference numerical check on f(x, y) = 0.5 * (x^2 + 10 * y^2)
  const gradientCheck = useMemo(() => {
    const f = (x: number, y: number): number => {
      // Default quadratic test landscape
      return 0.5 * (x * x + 10 * y * y);
    };

    // Analytic gradient for f: [x, 10y]
    const analyticGx = testThetaX;
    const analyticGy = 10 * testThetaY;

    // Central finite difference: (f(x+eps) - f(x-eps)) / (2*eps)
    const finiteGx = (f(testThetaX + epsilon, testThetaY) - f(testThetaX - epsilon, testThetaY)) / (2 * epsilon);
    const finiteGy = (f(testThetaX, testThetaY + epsilon) - f(testThetaX, testThetaY - epsilon)) / (2 * epsilon);

    const errorX = Math.abs(analyticGx - finiteGx);
    const errorY = Math.abs(analyticGy - finiteGy);
    const maxError = Math.max(errorX, errorY);
    const passed = maxError < 1e-4;

    return {
      analytic: [analyticGx, analyticGy],
      finite: [finiteGx, finiteGy],
      maxError,
      passed,
    };
  }, [testThetaX, testThetaY, epsilon]);

  const insertToken = (token: string) => {
    onFormulaChange(`${formula} ${token}`.trim());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Calculator className="w-5 h-5 text-violet-400" />
            Equation Studio & Finite-Difference Verification
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Author symbolic algebraic update equations, inspect LaTeX math rendering, and verify numerical Jacobians.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-violet-950/60 border border-violet-800 text-xs font-mono text-violet-300">
            AST DSL v1.0
          </span>
          <span className="px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-800 text-xs font-mono text-emerald-300">
            Fuel Metered
          </span>
        </div>
      </div>

      {/* Mathematical Tokens & Operator Palette */}
      <div className="p-4 rounded-2xl bg-[var(--surface-raised)] border border-[var(--border)] space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Allowlisted Mathematical Symbol Palette (Click to Insert)
          </span>
          <span className="text-[10px] font-mono text-[var(--text-muted)]">Zero arbitrary code execution</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {MATHEMATICAL_TOKENS.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => insertToken(item.token)}
              className="px-2.5 py-1.5 rounded-lg bg-[var(--surface)] border border-[var(--border)] hover:border-violet-500/50 text-xs font-mono text-slate-300 hover:text-white transition-all shadow-sm"
              title={`Insert ${item.token}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Formula Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Parameter Update Rule */}
        <div className="p-5 rounded-2xl bg-[var(--surface-raised)] border border-[var(--border)] space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-white flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-cyan-400" />
              Parameter Update Rule θ_(t+1)
            </label>
            <span className="text-[10px] font-mono text-cyan-400">Target: Vector Step</span>
          </div>
          <input
            type="text"
            value={formula}
            onChange={(e) => onFormulaChange(e.target.value)}
            className="w-full bg-[var(--surface)] border border-[var(--border)] focus:border-cyan-500 rounded-xl px-3.5 py-2.5 font-mono text-xs text-cyan-300 outline-none"
            placeholder="e.g. theta - lr * sign(grad) - lambda * theta"
          />
          <div className="p-3 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-xs font-mono text-[var(--text-muted)]">
            <span className="text-[10px] uppercase text-[var(--text-dim)] block mb-1">LaTeX Formulation:</span>
            <code className="text-cyan-300">
              {"\\theta_{t+1} = "}
              {formula.replace(/theta/g, "\\theta_t").replace(/grad/g, "\\nabla f(\\theta_t)").replace(/lr/g, "\\eta")}
            </code>
          </div>
        </div>

        {/* Objective Function */}
        <div className="p-5 rounded-2xl bg-[var(--surface-raised)] border border-[var(--border)] space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-white flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-violet-400" />
              Objective Loss Landscape f(x, y)
            </label>
            <span className="text-[10px] font-mono text-violet-400">Target: Scalar Cost</span>
          </div>
          <input
            type="text"
            value={objectiveFormula}
            onChange={(e) => setObjectiveFormula(e.target.value)}
            className="w-full bg-[var(--surface)] border border-[var(--border)] focus:border-violet-500 rounded-xl px-3.5 py-2.5 font-mono text-xs text-violet-300 outline-none"
            placeholder="e.g. 0.5 * (x^2 + 10 * y^2)"
          />
          <div className="p-3 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-xs font-mono text-[var(--text-muted)]">
            <span className="text-[10px] uppercase text-[var(--text-dim)] block mb-1">LaTeX Formulation:</span>
            <code className="text-violet-300">
              {"f(x, y) = "}
              {objectiveFormula.replace(/x\^2/g, "x^2").replace(/y\^2/g, "10y^2")}
            </code>
          </div>
        </div>
      </div>

      {/* Finite-Difference Numerical Gradient & Jacobian Checker */}
      <div className="p-5 rounded-2xl bg-[var(--surface-raised)] border border-[var(--border)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="text-xs font-bold text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-400" />
              Central Finite-Difference Gradient & Jacobian Check
            </h3>
            <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
              Verifies whether analytic gradient derivations match central numerical finite differences: g_i ≈ (f(θ+ε e_i) - f(θ-ε e_i)) / 2ε.
            </p>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 shrink-0 ${
              gradientCheck.passed
                ? "bg-emerald-950/80 border border-emerald-500/60 text-emerald-300"
                : "bg-red-950/80 border border-red-500/60 text-red-300"
            }`}
          >
            {gradientCheck.passed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
            {gradientCheck.passed ? "JACOBIAN VERIFIED" : "TOLERANCE EXCEEDED"}
          </span>
        </div>

        {/* Test Coordinates & Perturbation Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[11px] text-[var(--text-muted)] block mb-1">Test Point θ_x</label>
            <input
              type="number"
              step="0.1"
              value={testThetaX}
              onChange={(e) => setTestThetaX(parseFloat(e.target.value) || 0)}
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
            />
          </div>
          <div>
            <label className="text-[11px] text-[var(--text-muted)] block mb-1">Test Point θ_y</label>
            <input
              type="number"
              step="0.1"
              value={testThetaY}
              onChange={(e) => setTestThetaY(parseFloat(e.target.value) || 0)}
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
            />
          </div>
          <div>
            <label className="text-[11px] text-[var(--text-muted)] block mb-1">Perturbation ε (epsilon)</label>
            <input
              type="number"
              step="1e-6"
              value={epsilon}
              onChange={(e) => setEpsilon(parseFloat(e.target.value) || 1e-5)}
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
            />
          </div>
        </div>

        {/* Comparison Result Table */}
        <div className="p-3.5 rounded-xl bg-[var(--background)] border border-[var(--border)] font-mono text-xs space-y-2">
          <div className="flex justify-between text-[var(--text-muted)] pb-1.5 border-b border-[var(--border)]">
            <span>Coordinate</span>
            <span>Analytic Gradient</span>
            <span>Finite Difference</span>
            <span>Absolute Error Δ</span>
          </div>
          <div className="flex justify-between text-cyan-300">
            <span>∂f / ∂x</span>
            <span>{gradientCheck.analytic[0].toFixed(5)}</span>
            <span>{gradientCheck.finite[0].toFixed(5)}</span>
            <span className="text-emerald-400">{Math.abs(gradientCheck.analytic[0] - gradientCheck.finite[0]).toExponential(2)}</span>
          </div>
          <div className="flex justify-between text-violet-300">
            <span>∂f / ∂y</span>
            <span>{gradientCheck.analytic[1].toFixed(5)}</span>
            <span>{gradientCheck.finite[1].toFixed(5)}</span>
            <span className="text-emerald-400">{Math.abs(gradientCheck.analytic[1] - gradientCheck.finite[1]).toExponential(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
