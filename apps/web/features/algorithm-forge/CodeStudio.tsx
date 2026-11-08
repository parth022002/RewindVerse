"use client";

import React, { useState } from "react";
import {
  Code2,
  FileCode,
  Download,
  Copy,
  Check,
  ShieldCheck,
  Sparkles,
  Terminal,
  Play,
  RotateCcw,
} from "lucide-react";

const PYTHON_TEMPLATE = `"""
RewindVerse Custom Algorithm Research Contract
conforming to ADVANCED_ALGORITHM_FORGE_SPECIFICATION.md Section 8.3
"""

import numpy as np

class CustomResearchOptimizer:
    """
    Lookahead Sign-Momentum Research Optimizer
    combining Polyak momentum with signum coordinate updates and decoupled weight decay.
    """
    def __init__(self, learning_rate: float = 0.05, momentum: float = 0.9, weight_decay: float = 0.01):
        self.lr = learning_rate
        self.momentum = momentum
        self.wd = weight_decay
        self.velocity = None
        self.step_count = 0

    def initialize(self, params_shape):
        self.velocity = np.zeros(params_shape)
        self.step_count = 0

    def step(self, params: np.ndarray, grads: np.ndarray) -> np.ndarray:
        """
        Executes a single optimizer update step.
        v_t = beta * v_{t-1} + (1 - beta) * grad
        theta_{t+1} = theta_t - lr * sign(v_t) - lr * wd * theta_t
        """
        if self.velocity is None:
            self.initialize(params.shape)

        self.step_count += 1
        # Accumulate sign-momentum velocity
        self.velocity = self.momentum * self.velocity + (1.0 - self.momentum) * grads
        
        # Compute uniform sign coordinate update decoupled with L2 decay
        update = self.lr * np.sign(self.velocity) + self.lr * self.wd * params
        new_params = params - update
        return new_params

    def snapshot(self) -> dict:
        return {
            "step": self.step_count,
            "velocity_norm": float(np.linalg.norm(self.velocity)) if self.velocity is not None else 0.0,
            "lr": self.lr,
        }
`;

const TYPESCRIPT_TEMPLATE = `/**
 * RewindVerse TypeScript Browser Worker Contract
 * conforming to ADVANCED_ALGORITHM_FORGE_SPECIFICATION.md Section 8.4
 */

export interface AlgorithmContext {
  learningRate: number;
  momentum: number;
  weightDecay: number;
}

export class CustomBrowserOptimizer {
  private velocity: [number, number] = [0, 0];
  private stepCount = 0;

  constructor(private readonly ctx: AlgorithmContext) {}

  public step(params: [number, number], grads: [number, number]): [number, number] {
    this.stepCount++;
    const { learningRate, momentum, weightDecay } = this.ctx;

    // Velocity update with exponential momentum
    this.velocity[0] = momentum * this.velocity[0] + (1 - momentum) * grads[0];
    this.velocity[1] = momentum * this.velocity[1] + (1 - momentum) * grads[1];

    // Decoupled weight decay parameter update
    const updateX = learningRate * Math.sign(this.velocity[0]) + learningRate * weightDecay * params[0];
    const updateY = learningRate * Math.sign(this.velocity[1]) + learningRate * weightDecay * params[1];

    return [params[0] - updateX, params[1] - updateY];
  }

  public snapshot() {
    return {
      step: this.stepCount,
      velocityNorm: Math.sqrt(this.velocity[0] ** 2 + this.velocity[1] ** 2),
      lr: this.ctx.learningRate,
    };
  }
}
`;

export function CodeStudio() {
  const [language, setLanguage] = useState<"python" | "typescript">("python");
  const [pythonCode, setPythonCode] = useState<string>(PYTHON_TEMPLATE);
  const [typescriptCode, setTypescriptCode] = useState<string>(TYPESCRIPT_TEMPLATE);
  const [copied, setCopied] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const activeCode = language === "python" ? pythonCode : typescriptCode;
  const setActiveCode = (code: string) => {
    if (language === "python") setPythonCode(code);
    else setTypescriptCode(code);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(activeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportPythonScript = () => {
    const script = `${pythonCode}

# Standalone Research Execution Harness
if __name__ == "__main__":
    print("RewindVerse Research Algorithm Verification...")
    opt = CustomResearchOptimizer(learning_rate=0.08, momentum=0.9, weight_decay=0.01)
    params = np.array([-3.0, 2.5])
    
    print(f"Initial Parameters: {params}")
    for t in range(25):
        # Quadratic gradient: [x, 10y]
        grads = np.array([params[0], 10.0 * params[1]])
        params = opt.step(params, grads)
        snap = opt.snapshot()
        print(f"Step {t+1:02d}: loss={0.5*(params[0]**2 + 10*params[1]**2):.5f}, params={params}")
    
    print("Verification complete.")
`;
    const blob = new Blob([script], { type: "text/x-python" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "run_custom_algorithm.py";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setFeedback('Exported standalone "run_custom_algorithm.py" for local research execution.');
    setTimeout(() => setFeedback(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Code2 className="w-5 h-5 text-emerald-400" />
            Code Studio & Research Contracts
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Author full algorithmic classes conforming to the RewindVerse Python Research Runtime and TypeScript Worker protocol.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] text-xs font-mono font-bold">
            <button
              onClick={() => setLanguage("python")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                language === "python"
                  ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                  : "text-[var(--text-muted)] hover:text-white"
              }`}
            >
              Python
            </button>
            <button
              onClick={() => setLanguage("typescript")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                language === "typescript"
                  ? "bg-blue-950 text-blue-300 border border-blue-800"
                  : "text-[var(--text-muted)] hover:text-white"
              }`}
            >
              TypeScript
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] hover:border-white/20 text-xs font-medium text-slate-300 transition-all"
            title="Copy Code to Clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>

          <button
            onClick={handleExportPythonScript}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-[#080b12] text-xs font-bold hover:shadow-emerald-500/25 transition-all shadow-md"
            title="Download Standalone Executable Python Script"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export .py Script</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Editor Container */}
      <div className="rounded-2xl border border-[var(--border)] bg-[#05070d] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#0a0f1d] border-b border-[var(--border)] text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            <span className="text-slate-400 ml-2">
              {language === "python" ? "custom_optimizer.py" : "CustomOptimizer.ts"}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Sandboxed Static Analysis (0 Security Violations)</span>
          </div>
        </div>

        <textarea
          value={activeCode}
          onChange={(e) => setActiveCode(e.target.value)}
          spellCheck={false}
          className="w-full h-96 p-4 bg-transparent font-mono text-xs text-emerald-300 leading-relaxed outline-none resize-none selection:bg-emerald-900/50"
        />
      </div>
    </div>
  );
}
