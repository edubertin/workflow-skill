"""Stage a validated skill and install only into an explicit, unused folder.

Existing installations are never replaced. Use --check to compare an installed
folder against its provenance and this checkout. For updates, install to a new
folder, inspect it, then select that version using your host's skill settings.
Preparation completes before exclusive destination creation. A publication
failure leaves the new partial folder in place for inspection, exits nonzero,
and has no valid completion receipt. Select a different unused folder to retry.
"""

from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

from package_support import PackageError, content_hashes, reject_links, safe_files, validate_package

RECEIPT = ".workflow-install.json"


def source_revision(root: Path) -> dict:
    if shutil.which("git") is None:
        return {"commit": None, "dirty": None, "revision_status": "git-unavailable"}
    command = ["git", "-C", str(root)]
    top = subprocess.run([*command, "rev-parse", "--show-toplevel"], capture_output=True, text=True)
    if top.returncode or Path(top.stdout.strip()).resolve() != root.resolve():
        return {"commit": None, "dirty": None, "revision_status": "not-package-checkout"}
    revision = subprocess.run([*command, "rev-parse", "--verify", "HEAD"], capture_output=True, text=True)
    if revision.returncode:
        return {"commit": None, "dirty": None, "revision_status": "no-readable-commit"}
    status = subprocess.run([*command, "status", "--porcelain"], capture_output=True, text=True)
    if status.returncode:
        raise PackageError("Unable to determine source checkout status")
    return {"commit": revision.stdout.strip(), "dirty": bool(status.stdout), "revision_status": "recorded"}


def load_receipt(destination: Path) -> dict:
    path = destination / RECEIPT
    if not path.is_file():
        raise PackageError("Existing directory has no install receipt; preserved unchanged")
    try:
        receipt = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as error:
        raise PackageError("Install receipt is invalid; directory preserved unchanged") from error
    if not isinstance(receipt, dict) or receipt.get("schema") != 1:
        raise PackageError("Unsupported install receipt; directory preserved unchanged")
    if not isinstance(receipt.get("files"), dict):
        raise PackageError("Install receipt lacks file hashes; directory preserved unchanged")
    return receipt


def check_install(destination: Path, expected: dict[str, str]) -> dict:
    reject_links(destination)
    if not destination.is_dir():
        raise PackageError("Installed destination is missing or not a directory")
    actual = content_hashes(destination, frozenset({RECEIPT}))
    receipt = load_receipt(destination)
    if actual != receipt["files"]:
        raise PackageError("Installed files have drifted from their receipt; preserved unchanged")
    if actual != expected:
        raise PackageError("Installation differs from this source; use a new destination for the update")
    return {"status": "identical", "files": len(actual), "version": receipt.get("version")}


def copy_exclusive(source: Path, destination: Path) -> None:
    reject_links(source)
    reject_links(destination)
    destination.parent.mkdir(parents=True, exist_ok=True)
    reject_links(destination)
    with source.open("rb") as incoming, destination.open("xb") as outgoing:
        shutil.copyfileobj(incoming, outgoing)


def prepare_install(source: Path, staging: Path, hashes: dict[str, str], receipt: dict) -> None:
    for file in safe_files(source):
        copy_exclusive(file, staging / file.relative_to(source))
    if content_hashes(staging) != hashes:
        raise PackageError("Source changed during preparation; installation cancelled")
    with (staging / RECEIPT).open("x", encoding="utf-8", newline="\n") as output:
        output.write(json.dumps(receipt, indent=2, sort_keys=True) + "\n")


def publish_prepared(staging: Path, destination: Path) -> None:
    reject_links(destination)
    destination.mkdir()
    try:
        files = safe_files(staging)
        for file in files:
            if file.name != RECEIPT:
                copy_exclusive(file, destination / file.relative_to(staging))
        copy_exclusive(staging / RECEIPT, destination / RECEIPT)
    except (OSError, PackageError) as error:
        raise PackageError("Placement interrupted; partial destination preserved. "
                           "Inspect it and retry using a different unused destination") from error


def install(root: Path, destination: Path, check: bool = False) -> dict:
    root, destination = root.absolute(), destination.absolute()
    reject_links(root)
    reject_links(destination)
    root, destination = root.resolve(), destination.resolve()
    package = validate_package(root)
    source = root / "skills/workflow"
    if destination.is_relative_to(root) or root.is_relative_to(destination):
        raise PackageError("Installation destination must be outside the source checkout")
    hashes = content_hashes(source)
    if check or destination.exists():
        return check_install(destination, hashes)
    if not destination.parent.is_dir():
        raise PackageError("Destination parent must already exist")
    receipt = {"schema": 1, "name": package["name"], "version": package["version"],
               "files": hashes, **source_revision(root)}
    with tempfile.TemporaryDirectory(prefix=".workflow-stage-", dir=destination.parent) as temporary:
        staging = Path(temporary)
        prepare_install(source, staging, hashes, receipt)
        publish_prepared(staging, destination)
    return {"status": "installed", "files": len(hashes), "version": package["version"]}


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--destination", type=Path, required=True, help="Explicit skill folder, outside checkout")
    parser.add_argument("--source-root", type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument("--check", action="store_true", help="Check receipt and source hashes without writes")
    args = parser.parse_args()
    try:
        result = install(args.source_root, args.destination, args.check)
    except (PackageError, OSError, UnicodeError) as error:
        print(f"Installation failed: {error}", file=sys.stderr)
        return 1
    print(json.dumps(result, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
