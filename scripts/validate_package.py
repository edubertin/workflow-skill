"""Validate distributable files without running models or contacting services."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from package_support import PackageError, validate_package


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1])
    args = parser.parse_args()
    try:
        result = validate_package(args.root)
    except (PackageError, OSError, UnicodeError) as error:
        print(f"Validation failed: {error}", file=sys.stderr)
        return 1
    print(json.dumps(result, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
