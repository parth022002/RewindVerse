"""
RVTS trace validator in Python.
"""

import json
from typing import Dict, List, Tuple


def validate_trace(file_path: str) -> Tuple[bool, List[str], List[str]]:
    """
    Validates an RVTS JSON Lines trace file.
    Returns: (is_valid, errors, warnings)
    """
    errors: List[str] = []
    warnings: List[str] = []

    try:
        with open(file_path, "r", encoding="utf-8") as f:
            lines = [line.strip() for line in f if line.strip()]
    except Exception as e:
        return False, [f"Could not open file: {e}"], []

    if not lines:
        return False, ["Trace file is empty."], []

    # 1. First record must be manifest
    try:
        manifest = json.loads(lines[0])
        if manifest.get("type") != "manifest":
            errors.append("First line must be a manifest record.")
        if manifest.get("version") != "0.1.0":
            errors.append(f"Unsupported RVTS version: {manifest.get('version')}. Expected 0.1.0.")
        if not manifest.get("run_id"):
            errors.append("Manifest missing 'run_id'.")
    except Exception as e:
        errors.append(f"Line 1: Invalid JSON for manifest: {e}")

    last_step = -1
    step_count = 0

    for i, line in enumerate(lines[1:], start=2):
        try:
            rec = json.loads(line)
            rec_type = rec.get("type")

            if rec_type == "step":
                step_num = rec.get("step")
                if not isinstance(step_num, int) or step_num < 0:
                    errors.append(f"Line {i}: 'step' must be a non-negative integer.")
                elif step_num <= last_step:
                    errors.append(f"Line {i}: Non-increasing step index {step_num} after {last_step}.")
                last_step = step_num
                step_count += 1

                metrics = rec.get("metrics")
                if not isinstance(metrics, dict) or "loss" not in metrics:
                    errors.append(f"Line {i}: Step record must include a metrics dict containing 'loss'.")

            elif rec_type == "event":
                if "step" not in rec or not rec.get("message"):
                    errors.append(f"Line {i}: Event record must specify 'step' and 'message'.")

            elif rec_type == "footer":
                if i != len(lines):
                    warnings.append(f"Line {i}: Footer record appears before end of file.")

        except Exception as e:
            errors.append(f"Line {i}: Invalid JSON: {e}")

    if step_count == 0:
        warnings.append("Trace file contains no step records.")

    return len(errors) == 0, errors, warnings
