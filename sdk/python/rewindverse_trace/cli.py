"""
CLI tool for RVTS traces: validate, inspect, view.
"""

import argparse
import json
import os
import sys
import webbrowser
from .validator import validate_trace


def cmd_validate(args):
    path = args.path
    if not os.path.exists(path):
        sys.stderr.write(f"Error: File not found: {path}\n")
        sys.exit(1)

    valid, errors, warnings = validate_trace(path)
    if valid:
        print(f"✓ Trace is valid: {path}")
        if warnings:
            for w in warnings:
                print(f"  [Warning] {w}")
        sys.exit(0)
    else:
        print(f"✗ Validation failed for: {path}")
        for err in errors:
            print(f"  • {err}")
        sys.exit(1)


def cmd_inspect(args):
    path = args.path
    if not os.path.exists(path):
        sys.stderr.write(f"Error: File not found: {path}\n")
        sys.exit(1)

    with open(path, "r", encoding="utf-8") as f:
        lines = [l.strip() for l in f if l.strip()]

    if not lines:
        print("Empty trace file.")
        sys.exit(1)

    manifest = json.loads(lines[0])
    steps = [json.loads(l) for l in lines[1:] if '"type": "step"' in l or '"type":"step"' in l]
    events = [json.loads(l) for l in lines[1:] if '"type": "event"' in l or '"type":"event"' in l]

    print("=" * 60)
    print(f"RewindVerse Trace: {manifest.get('name', 'Unnamed')}")
    print(f"Run ID:      {manifest.get('run_id')}")
    print(f"Producer:    {manifest.get('producer', {}).get('name')}")
    print(f"Model/Obj:   {manifest.get('model_or_objective', {}).get('name')}")
    print(f"Total Steps: {len(steps)}")
    print(f"Events:      {len(events)}")
    if steps:
        first_loss = steps[0].get("metrics", {}).get("loss")
        last_loss = steps[-1].get("metrics", {}).get("loss")
        print(f"Initial Loss: {first_loss}")
        print(f"Final Loss:   {last_loss}")
    print("=" * 60)


def cmd_view(args):
    path = args.path
    if not os.path.exists(path):
        sys.stderr.write(f"Error: File not found: {path}\n")
        sys.exit(1)

    url = f"http://localhost:3000/studio/import"
    print(f"Opening Rewind Studio to import and view: {path}")
    webbrowser.open(url)


def main():
    parser = argparse.ArgumentParser(
        prog="rvtrace",
        description="RewindVerse Training Trace CLI tool."
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    # validate
    p_val = subparsers.add_parser("validate", help="Validate an RVTS trace file.")
    p_val.add_argument("path", help="Path to .rvtrace file.")
    p_val.set_defaults(func=cmd_validate)

    # inspect
    p_insp = subparsers.add_parser("inspect", help="Inspect metadata and summary metrics.")
    p_insp.add_argument("path", help="Path to .rvtrace file.")
    p_insp.set_defaults(func=cmd_inspect)

    # view
    p_view = subparsers.add_parser("view", help="Open local trace in Rewind Studio Replay Viewer.")
    p_view.add_argument("path", help="Path to .rvtrace file.")
    p_view.set_defaults(func=cmd_view)

    args = parser.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
