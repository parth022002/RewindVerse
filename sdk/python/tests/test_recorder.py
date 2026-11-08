import os
import sys
import tempfile
import unittest

# Ensure package root is in sys.path
_pkg_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if _pkg_root not in sys.path:
    sys.path.insert(0, _pkg_root)

from rewindverse_trace import RunRecorder, validate_trace


class TestRunRecorder(unittest.TestCase):
    def test_run_recorder_creates_valid_trace(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            trace_path = os.path.join(tmpdir, "test.rvtrace")

            with RunRecorder(
                output_path=trace_path,
                run_name="Python Unit Test",
                model_name="TestModel",
                hyperparameters={"learning_rate": 0.01},
            ) as rec:
                for step in range(5):
                    rec.log_step(
                        step=step,
                        metrics={"loss": 1.0 / (step + 1), "grad_norm": 0.5},
                        parameters={"w": [0.1 * step, 0.2 * step]},
                        lr=0.01,
                    )
                rec.log_event(
                    step=4,
                    event_type="checkpoint_saved",
                    message="Saved checkpoint at step 4",
                )

            self.assertTrue(os.path.exists(trace_path))

            # Validate with python validator
            valid, errors, warnings = validate_trace(trace_path)
            self.assertTrue(valid, f"Validation failed with errors: {errors}")
            self.assertEqual(len(errors), 0)

    def test_validator_detects_invalid_traces(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            # 1. Non-manifest first line
            bad_path1 = os.path.join(tmpdir, "bad1.rvtrace")
            with open(bad_path1, "w", encoding="utf-8") as f:
                f.write('{"type": "step", "step": 0, "metrics": {"loss": 1.0}}\n')
            valid, errors, _ = validate_trace(bad_path1)
            self.assertFalse(valid)
            self.assertTrue(any("First line must be a manifest" in e for e in errors))

            # 2. Non-increasing step order
            bad_path2 = os.path.join(tmpdir, "bad2.rvtrace")
            with open(bad_path2, "w", encoding="utf-8") as f:
                f.write('{"type": "manifest", "version": "0.1.0", "run_id": "test"}\n')
                f.write('{"type": "step", "step": 5, "metrics": {"loss": 1.0}}\n')
                f.write('{"type": "step", "step": 3, "metrics": {"loss": 0.8}}\n')
            valid, errors, _ = validate_trace(bad_path2)
            self.assertFalse(valid)
            self.assertTrue(any("Non-increasing step" in e for e in errors))

            # 3. Missing loss metric
            bad_path3 = os.path.join(tmpdir, "bad3.rvtrace")
            with open(bad_path3, "w", encoding="utf-8") as f:
                f.write('{"type": "manifest", "version": "0.1.0", "run_id": "test"}\n')
                f.write('{"type": "step", "step": 0, "metrics": {"accuracy": 0.9}}\n')
            valid, errors, _ = validate_trace(bad_path3)
            self.assertFalse(valid)
            self.assertTrue(any("containing 'loss'" in e for e in errors))

    def test_shared_conformance_fixtures(self):
        # Locate root fixtures/rvts directory
        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "fixtures", "rvts"))

        # 1. Valid minimal
        valid, errors, _ = validate_trace(os.path.join(base_dir, "valid_minimal.rvtrace"))
        self.assertTrue(valid, f"Expected valid_minimal.rvtrace to be valid: {errors}")
        self.assertEqual(len(errors), 0)

        # 2. Invalid non monotonic
        valid, errors, _ = validate_trace(os.path.join(base_dir, "invalid_non_monotonic.rvtrace"))
        self.assertFalse(valid)
        self.assertTrue(any("Non-increasing step" in e for e in errors))

        # 3. Invalid missing loss
        valid, errors, _ = validate_trace(os.path.join(base_dir, "invalid_missing_loss.rvtrace"))
        self.assertFalse(valid)
        self.assertTrue(any("containing 'loss'" in e for e in errors))

        # 4. Invalid no manifest
        valid, errors, _ = validate_trace(os.path.join(base_dir, "invalid_no_manifest.rvtrace"))
        self.assertFalse(valid)
        self.assertTrue(any("First line must be a manifest" in e for e in errors))


if __name__ == "__main__":
    unittest.main()

