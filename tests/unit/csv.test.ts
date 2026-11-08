import { describe, it, expect } from "vitest";
import {
  parseCsvLine,
  sanitizeCell,
  detectCsvMapping,
  parseCsvHeadersAndPreview,
  convertCsvToRvts,
} from "../../packages/rvts/src/csv";

describe("CSV to RVTS Converter", () => {
  it("parses lines with quoted commas correctly", () => {
    const line = '1,"0.452,10",0.01,"run, experiment A"';
    const parsed = parseCsvLine(line);
    expect(parsed).toEqual(["1", "0.452,10", "0.01", "run, experiment A"]);
  });

  it("sanitizes dangerous spreadsheet formulas per security specs", () => {
    expect(sanitizeCell("=1+2")).toBe("1+2");
    expect(sanitizeCell("+cmd|' /C calc'!A0")).toBe("cmd|' /C calc'!A0");
    expect(sanitizeCell("-10.5")).toBe("10.5");
    expect(sanitizeCell("@SUM(A1:B10)")).toBe("SUM(A1:B10)");
    expect(sanitizeCell("0.054")).toBe("0.054");
  });

  it("auto-detects standard ML training column headers", () => {
    const headers = ["epoch", "train_loss", "lr", "val_loss", "accuracy"];
    const mapping = detectCsvMapping(headers);

    expect(mapping.stepColumn).toBe("epoch");
    expect(mapping.lossColumn).toBe("train_loss");
    expect(mapping.lrColumn).toBe("lr");
    expect(mapping.valLossColumn).toBe("val_loss");
    expect(mapping.accuracyColumn).toBe("accuracy");
  });

  it("converts raw CSV string into fully valid RVTS trace", () => {
    const csvData = `step,loss,lr
0,0.85,0.01
1,0.65,0.01
2,0.42,0.009
3,0.31,0.008`;

    const { trace, jsonl, errors } = convertCsvToRvts(csvData);
    expect(errors.length).toBe(0);
    expect(trace.manifest.declared_capabilities.has_loss).toBe(true);
    expect(trace.steps.length).toBe(4);
    expect(trace.steps[0].metrics.loss).toBe(0.85);
    expect(trace.steps[3].metrics.loss).toBe(0.31);
    expect(trace.steps[3].metrics.lr).toBe(0.008);
    expect(trace.capabilities.has_loss).toBe(true);
    expect(jsonl).toContain('"type":"manifest"');
    expect(jsonl).toContain('"type":"step"');
    expect(jsonl).toContain('"type":"footer"');
  });
});

