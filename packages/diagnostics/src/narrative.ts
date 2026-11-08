import { RvtsParsedTrace } from "@rewindverse/rvts";
import { DiagnosticFinding, DiagnosticsReport } from "./types";
import {
  detectDivergence,
  detectPlateau,
  detectGradientIssues,
  detectLrInstability,
} from "./detectors";

/**
 * Analyzes an RVTS trace using evidence-based heuristic detectors.
 * Follows the strict rule: "Evidence before explanation."
 */
export function analyzeTraceDiagnostics(trace: RvtsParsedTrace): DiagnosticsReport {
  const findings: DiagnosticFinding[] = [];

  const divergence = detectDivergence(trace.steps);
  if (divergence) {
    findings.push(divergence);
  }

  const lrInstability = detectLrInstability(trace.steps);
  if (lrInstability) {
    findings.push(lrInstability);
  }

  const gradIssues = detectGradientIssues(trace.steps);
  findings.push(...gradIssues);

  // If no divergence or extreme instability, check for plateau
  if (!divergence) {
    const plateau = detectPlateau(trace.steps);
    if (plateau) {
      findings.push(plateau);
    }
  }

  return {
    runId: trace.manifest.run_id,
    generatedAt: new Date().toISOString(),
    totalFindings: findings.length,
    findings,
  };
}
