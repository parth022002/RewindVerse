export type DiagnosticSeverity = "info" | "warning" | "critical";

export interface DiagnosticFinding {
  id: string;
  detectorName: string;
  detectorVersion: string;
  category: "convergence" | "stability" | "gradient" | "learning_rate" | "overfitting";
  title: string;
  severity: DiagnosticSeverity;
  stepRange: [number, number];
  summary: string;
  evidenceExplanation: string;
  signalsUsed: string[];
  recommendations: string[];
}

export interface DiagnosticsReport {
  runId: string;
  generatedAt: string;
  totalFindings: number;
  findings: DiagnosticFinding[];
}

