"""
RunRecorder: Incremental streaming recorder for RVTS format.
"""

import json
import os
import sys
import time
from typing import Any, Dict, List, Optional, Union


class RunRecorder:
    def __init__(
        self,
        output_path: str,
        run_name: str,
        model_name: str,
        hyperparameters: Optional[Dict[str, Any]] = None,
        model_type: str = "custom",
    ):
        self.output_path = output_path
        self.run_name = run_name
        self.model_name = model_name
        self.hyperparameters = hyperparameters or {}
        self.model_type = model_type
        self.file_handle = None
        self.total_steps = 0
        self.start_time = None
        self.closed = False

    def __enter__(self):
        self.start()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        status = "failed" if exc_type else "completed"
        self.close(status=status)
        return False  # Do not suppress original exceptions

    def start(self):
        os.makedirs(os.path.dirname(os.path.abspath(self.output_path)), exist_ok=True)
        self.file_handle = open(self.output_path, "w", encoding="utf-8")
        self.start_time = time.time()

        run_id = f"py_run_{int(time.time())}_{os.urandom(3).hex()}"
        manifest = {
            "type": "manifest",
            "version": "0.1.0",
            "run_id": run_id,
            "name": self.run_name,
            "created_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "producer": {
                "name": "rewindverse-trace Python SDK",
                "version": "0.1.0",
                "framework": "python",
                "environment": sys.version.split()[0],
            },
            "model_or_objective": {
                "name": self.model_name,
                "type": self.model_type,
            },
            "hyperparameters": self.hyperparameters,
            "declared_capabilities": {
                "has_loss": True,
                "step_unit": "step",
            },
        }
        self._write_line(manifest)

    def log_step(
        self,
        step: int,
        metrics: Dict[str, float],
        parameters: Optional[Dict[str, Union[float, List[float]]]] = None,
        gradients: Optional[Dict[str, Union[float, List[float]]]] = None,
        lr: Optional[float] = None,
    ):
        if self.closed:
            return

        try:
            m = dict(metrics)
            if lr is not None and "lr" not in m:
                m["lr"] = float(lr)

            record: Dict[str, Any] = {
                "type": "step",
                "step": int(step),
                "timestamp_ms": int((time.time() - (self.start_time or time.time())) * 1000),
                "metrics": m,
            }
            if parameters:
                record["parameters"] = parameters
            if gradients:
                record["gradients"] = gradients

            self._write_line(record)
            self.total_steps += 1
        except Exception as e:
            sys.stderr.write(f"[rewindverse-trace Warning] Failed to log step {step}: {e}\n")

    def log_event(
        self,
        step: int,
        event_type: str,
        message: str,
        severity: str = "info",
        evidence: Optional[Dict[str, Any]] = None,
    ):
        if self.closed:
            return

        record: Dict[str, Any] = {
            "type": "event",
            "step": int(step),
            "event_type": event_type,
            "severity": severity,
            "message": message,
        }
        if evidence:
            record["evidence"] = evidence

        self._write_line(record)

    def _write_line(self, obj: Dict[str, Any]):
        if self.file_handle and not self.file_handle.closed:
            self.file_handle.write(json.dumps(obj) + "\n")
            self.file_handle.flush()

    def close(self, status: str = "completed"):
        if self.closed:
            return
        self.closed = True

        duration = int((time.time() - (self.start_time or time.time())) * 1000)
        footer = {
            "type": "footer",
            "total_steps": self.total_steps,
            "status": status,
            "duration_ms": duration,
        }
        self._write_line(footer)

        if self.file_handle and not self.file_handle.closed:
            self.file_handle.close()
