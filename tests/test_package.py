"""Structural validation and installer tests, not agent behavioral evaluations."""

from __future__ import annotations

import json
import os
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))

from install_workflow import RECEIPT, check_install, install, publish_prepared, source_revision
from package_support import PackageError, content_hashes, validate_package


def write(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


def create_package(root: Path) -> Path:
    skill = root / "skills/workflow"
    write(skill / "SKILL.md", "---\nname: workflow\ndescription: Route scoped work.\n---\n"
          "# Workflow\nRead [Cases](references/workflow-regression-suite.md).\n")
    write(skill / "agents/openai.yaml", "interface:\n  display_name: Workflow\n"
          "  short_description: Route scoped work\n  default_prompt: Use $workflow.\n"
          "policy:\n  allow_implicit_invocation: true\n")
    write(skill / "references/workflow-regression-suite.md",
          "# Cases\n| WF-01 | Request | Read-only | Low | None | Inspect | Edit | Observed |\n")
    write(root / ".codex-plugin/plugin.json", json.dumps({"name": "workflow-skill", "version": "0.1.0",
                                                        "skills": "./skills/"}))
    return skill


def declare_license(root: Path, license_name: object = "MIT") -> None:
    path = root / ".codex-plugin/plugin.json"
    manifest = json.loads(path.read_text(encoding="utf-8"))
    manifest["license"] = license_name
    write(path, json.dumps(manifest))


def license_package(root: Path, skill: Path) -> None:
    declare_license(root)
    notice = "MIT License\n\nCopyright (c) 2026 Test Author\n\nSynthetic fixture notice.\n"
    write(root / "LICENSE", notice)
    write(skill / "LICENSE", notice)


class PackageTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temporary = tempfile.TemporaryDirectory(prefix="workflow-test-")
        self.addCleanup(self.temporary.cleanup)
        self.space = Path(self.temporary.name)
        self.root = self.space / "source"
        self.skill = create_package(self.root)
        self.destination = self.space / "installed"

    def append_skill(self, text: str) -> None:
        path = self.skill / "SKILL.md"
        write(path, path.read_text(encoding="utf-8") + text)

    def test_valid_package_reports_structure_only(self) -> None:
        result = validate_package(self.root)
        self.assertEqual(result, {"kind": "structural", "files": 3, "scenarios": 1,
                                  "name": "workflow-skill", "version": "0.1.0"})

    def test_missing_frontmatter_fails(self) -> None:
        write(self.skill / "SKILL.md", "# Missing metadata")
        with self.assertRaisesRegex(PackageError, "frontmatter"):
            validate_package(self.root)

    def test_validation_canonicalizes_equivalent_source_paths(self) -> None:
        sibling = self.space / "sibling"
        sibling.mkdir()
        equivalent = sibling / ".." / "source"
        self.assertEqual(validate_package(equivalent), validate_package(self.root))

    def test_invalid_yaml_fails(self) -> None:
        write(self.skill / "SKILL.md", "---\nname: [broken\n---\n")
        with self.assertRaisesRegex(PackageError, "Invalid YAML"):
            validate_package(self.root)

    def test_duplicate_yaml_keys_fail(self) -> None:
        write(self.skill / "SKILL.md", "---\nname: workflow\nname: replacement\ndescription: x\n---\n")
        with self.assertRaisesRegex(PackageError, "unique"):
            validate_package(self.root)

    def test_missing_description_fails(self) -> None:
        write(self.skill / "SKILL.md", "---\nname: workflow\n---\n")
        with self.assertRaisesRegex(PackageError, "description"):
            validate_package(self.root)

    def test_string_policy_is_not_boolean(self) -> None:
        path = self.skill / "agents/openai.yaml"
        write(path, path.read_text(encoding="utf-8").replace("true", "'true'"))
        with self.assertRaisesRegex(PackageError, "boolean"):
            validate_package(self.root)

    def test_broken_markdown_reference_fails(self) -> None:
        self.append_skill("[Missing](references/missing.md)\n")
        with self.assertRaisesRegex(PackageError, "Broken local reference"):
            validate_package(self.root)

    def test_broken_backtick_reference_fails(self) -> None:
        self.append_skill("Read `references/missing.md`.\n")
        with self.assertRaisesRegex(PackageError, "Broken local reference"):
            validate_package(self.root)

    def test_reference_traversal_fails_even_for_existing_file(self) -> None:
        write(self.root / "outside.md", "Outside skill")
        self.append_skill("[Escape](../../outside.md)\n")
        with self.assertRaisesRegex(PackageError, "escapes"):
            validate_package(self.root)

    def test_encoded_reference_traversal_fails(self) -> None:
        write(self.root / "outside.md", "Outside skill")
        self.append_skill("[Escape](%2e%2e/%2e%2e/outside.md)\n")
        with self.assertRaisesRegex(PackageError, "escapes"):
            validate_package(self.root)

    def test_external_reference_and_anchor_are_allowed(self) -> None:
        self.append_skill("[Docs](https://example.com/docs) [Top](#workflow)\n")
        self.assertEqual(validate_package(self.root)["files"], 3)

    def test_personal_absolute_paths_fail(self) -> None:
        for personal in (r"C:\Users\someone\agent.md", "/home/someone/agent.md", "~/agent.md"):
            with self.subTest(personal=personal):
                create_package(self.root)
                self.append_skill(f"Read `{personal}`.\n")
                with self.assertRaisesRegex(PackageError, "Personal absolute path"):
                    validate_package(self.root)

    def test_duplicate_scenario_ids_fail(self) -> None:
        path = self.skill / "references/workflow-regression-suite.md"
        write(path, path.read_text(encoding="utf-8") * 2)
        with self.assertRaisesRegex(PackageError, "unique"):
            validate_package(self.root)

    def test_incomplete_scenario_row_fails(self) -> None:
        write(self.skill / "references/workflow-regression-suite.md", "| WF-01 | Request |\n")
        with self.assertRaisesRegex(PackageError, "eight"):
            validate_package(self.root)

    def test_plugin_metadata_and_path_failures(self) -> None:
        for override in ({"name": "Invalid name"}, {"version": "latest"}, {"skills": "../"}):
            with self.subTest(override=override):
                manifest = {"name": "workflow-skill", "version": "0.1.0", "skills": "./skills/", **override}
                write(self.root / ".codex-plugin/plugin.json", json.dumps(manifest))
                with self.assertRaises(PackageError):
                    validate_package(self.root)

    def test_declared_license_requires_both_notices_before_installation(self) -> None:
        for present in ((), ("LICENSE",), ("skills/workflow/LICENSE",)):
            with self.subTest(present=present), tempfile.TemporaryDirectory() as temporary:
                root = Path(temporary) / "source"
                create_package(root)
                declare_license(root)
                for name in present:
                    write(root / name, "MIT License\n\nSynthetic fixture notice.\n")
                with self.assertRaisesRegex(PackageError, "License notice missing"):
                    install(root, self.destination)
                self.assertFalse(self.destination.exists())

    def test_license_notices_must_match_without_normalization(self) -> None:
        license_package(self.root, self.skill)
        path = self.skill / "LICENSE"
        path.write_bytes(path.read_bytes() + b"\n")
        with self.assertRaisesRegex(PackageError, "match byte-for-byte"):
            install(self.root, self.destination)
        self.assertFalse(self.destination.exists())

    def test_matching_empty_license_notices_are_rejected(self) -> None:
        license_package(self.root, self.skill)
        for path in (self.root / "LICENSE", self.skill / "LICENSE"):
            write(path, " \n")
        with self.assertRaisesRegex(PackageError, "nonempty license notice"):
            validate_package(self.root)

    def test_license_notice_requires_manifest_declaration(self) -> None:
        for location in ("LICENSE", "skills/workflow/LICENSE"):
            with self.subTest(location=location), tempfile.TemporaryDirectory() as temporary:
                root = Path(temporary) / "source"
                create_package(root)
                write(root / location, "MIT License\n\nSynthetic fixture notice.\n")
                with self.assertRaisesRegex(PackageError, "requires nonempty license"):
                    validate_package(root)

    def test_license_notice_without_manifest_is_rejected(self) -> None:
        license_package(self.root, self.skill)
        (self.root / ".codex-plugin/plugin.json").unlink()
        with self.assertRaisesRegex(PackageError, "requires nonempty license"):
            validate_package(self.root)

    def test_invalid_license_declarations_are_rejected(self) -> None:
        for declaration in (None, "", "  ", 42):
            with self.subTest(declaration=declaration):
                declare_license(self.root, declaration)
                with self.assertRaisesRegex(PackageError, "requires nonempty license"):
                    validate_package(self.root)

    def test_sensitive_path_rejected_before_reading_any_content(self) -> None:
        write(self.root / ".env", "synthetic fixture")
        with patch.object(Path, "read_text", side_effect=AssertionError("Must not read contents")):
            with self.assertRaisesRegex(PackageError, "Sensitive"):
                validate_package(self.root)

    def test_site_generated_dependencies_do_not_block_skill_installation(self) -> None:
        for folder in ("node_modules", "dist", ".wrangler", ".vinext", ".next",
                       "coverage", "test-results", "playwright-report"):
            write(self.root / "site" / folder / "fixture.key", "Synthetic generated fixture")
        write(self.root / "site/app/page.tsx", "export default function Page() { return null; }")
        self.assertEqual(validate_package(self.root)["files"], 3)
        result = install(self.root, self.destination)
        self.assertEqual(result["status"], "installed")
        self.assertFalse((self.destination / "site").exists())
        self.assertEqual(check_install(self.destination, content_hashes(self.skill))["status"], "identical")

    def test_site_source_secrets_still_fail_before_contents_are_read(self) -> None:
        for location in ("site/.env", "site/app/.env.local", "site/public/certificate.pem",
                         "site/docs/credentials.json"):
            with self.subTest(location=location), tempfile.TemporaryDirectory() as temporary:
                root = Path(temporary) / "source"
                create_package(root)
                write(root / location, "Synthetic fixture")
                with patch.object(Path, "read_text", side_effect=AssertionError("Must not read contents")):
                    with self.assertRaisesRegex(PackageError, "Sensitive"):
                        validate_package(root)

    def test_generated_site_exclusion_is_not_applied_to_other_paths(self) -> None:
        for location in ("node_modules/fixture.key", "docs/site/dist/fixture.key",
                         "site/app/node_modules/fixture.key", "skills/workflow/site/dist/fixture.key"):
            with self.subTest(location=location), tempfile.TemporaryDirectory() as temporary:
                root = Path(temporary) / "source"
                create_package(root)
                write(root / location, "Synthetic fixture")
                with self.assertRaisesRegex(PackageError, "Sensitive"):
                    validate_package(root)

    def test_generated_site_folder_cannot_be_a_symlink(self) -> None:
        external = self.space / "external"
        external.mkdir()
        link = self.root / "site/node_modules"
        link.parent.mkdir()
        try:
            link.symlink_to(external, target_is_directory=True)
        except OSError as error:
            self.skipTest(f"Symlink creation is unavailable: {error}")
        with self.assertRaisesRegex(PackageError, "Links"):
            validate_package(self.root)

    def test_symlink_source_is_rejected(self) -> None:
        external = self.space / "external.md"
        write(external, "Fixture")
        link = self.skill / "linked.md"
        try:
            link.symlink_to(external)
        except OSError as error:
            self.skipTest(f"Symlink creation is unavailable: {error}")
        with self.assertRaisesRegex(PackageError, "Links"):
            validate_package(self.root)

    @unittest.skipUnless(os.name == "nt", "Windows junction check")
    def test_windows_junction_source_is_rejected(self) -> None:
        external = self.space / "external"
        external.mkdir()
        link = self.skill / "linked"
        environment = {**os.environ, "WORKFLOW_LINK": str(link), "WORKFLOW_TARGET": str(external)}
        subprocess.run(["powershell", "-NoProfile", "-Command", "New-Item -ItemType Junction "
                        "-Path $env:WORKFLOW_LINK -Target $env:WORKFLOW_TARGET | Out-Null"],
                       env=environment, check=True, capture_output=True, text=True)
        with self.assertRaisesRegex(PackageError, "Links"):
            validate_package(self.root)

    def test_fresh_install_has_matching_hashes_and_provenance(self) -> None:
        result = install(self.root, self.destination)
        self.assertEqual(result["status"], "installed")
        receipt = json.loads((self.destination / RECEIPT).read_text(encoding="utf-8"))
        self.assertEqual(receipt["files"], content_hashes(self.skill))
        self.assertEqual(receipt["version"], "0.1.0")
        self.assertIn("revision_status", receipt)
        self.assertEqual(check_install(self.destination, receipt["files"])["status"], "identical")

    def test_fresh_install_preserves_license_notice_and_receipt_hash(self) -> None:
        license_package(self.root, self.skill)
        self.assertEqual(install(self.root, self.destination)["status"], "installed")
        self.assertEqual((self.destination / "LICENSE").read_bytes(),
                         (self.root / "LICENSE").read_bytes())
        receipt = json.loads((self.destination / RECEIPT).read_text(encoding="utf-8"))
        self.assertEqual(receipt["files"]["LICENSE"], content_hashes(self.skill)["LICENSE"])
        self.assertEqual(install(self.root, self.destination, check=True)["status"], "identical")

    def test_check_detects_dropped_installed_license_without_replacing_it(self) -> None:
        license_package(self.root, self.skill)
        install(self.root, self.destination)
        (self.destination / "LICENSE").unlink()
        with self.assertRaisesRegex(PackageError, "drifted"):
            install(self.root, self.destination, check=True)
        self.assertFalse((self.destination / "LICENSE").exists())

    def test_reinstall_is_idempotent_and_does_not_touch_files(self) -> None:
        install(self.root, self.destination)
        before = {path.name: path.stat().st_mtime_ns for path in self.destination.rglob("*")}
        result = install(self.root, self.destination)
        after = {path.name: path.stat().st_mtime_ns for path in self.destination.rglob("*")}
        self.assertEqual(result["status"], "identical")
        self.assertEqual(before, after)

    def test_check_detects_modified_installed_file_without_changes(self) -> None:
        install(self.root, self.destination)
        write(self.destination / "SKILL.md", "Local change")
        before = content_hashes(self.destination)
        with self.assertRaisesRegex(PackageError, "drifted"):
            install(self.root, self.destination, check=True)
        self.assertEqual(content_hashes(self.destination), before)

    def test_check_detects_added_file(self) -> None:
        install(self.root, self.destination)
        write(self.destination / "extra.md", "Local addition")
        with self.assertRaisesRegex(PackageError, "drifted"):
            install(self.root, self.destination, check=True)

    def test_check_detects_new_source_version(self) -> None:
        install(self.root, self.destination)
        self.append_skill("New documented behavior.\n")
        before = content_hashes(self.destination)
        with self.assertRaisesRegex(PackageError, "new destination"):
            install(self.root, self.destination, check=True)
        self.assertEqual(content_hashes(self.destination), before)

    def test_existing_nonidentical_directory_is_preserved(self) -> None:
        write(self.destination / "personal.md", "Keep my files")
        before = content_hashes(self.destination)
        with self.assertRaisesRegex(PackageError, "no install receipt"):
            install(self.root, self.destination)
        self.assertEqual(content_hashes(self.destination), before)

    def test_existing_empty_directory_is_preserved(self) -> None:
        self.destination.mkdir()
        with self.assertRaisesRegex(PackageError, "no install receipt"):
            install(self.root, self.destination)
        self.assertEqual(list(self.destination.iterdir()), [])

    def test_check_missing_destination_does_not_create_it(self) -> None:
        with self.assertRaisesRegex(PackageError, "missing"):
            install(self.root, self.destination, check=True)
        self.assertFalse(self.destination.exists())

    def test_install_into_source_is_rejected(self) -> None:
        with self.assertRaisesRegex(PackageError, "outside"):
            install(self.root, self.root / "new-install")
        self.assertFalse((self.root / "new-install").exists())

    def test_normalized_destination_cannot_overlap_source(self) -> None:
        sibling = self.space / "sibling"
        sibling.mkdir()
        disguised = sibling / ".." / "source" / "new-install"
        with self.assertRaisesRegex(PackageError, "outside"):
            install(self.root, disguised)
        self.assertFalse((self.root / "new-install").exists())

    def test_normalized_destination_outside_source_is_allowed(self) -> None:
        sibling = self.space / "sibling"
        sibling.mkdir()
        normalized = sibling / ".." / "installed"
        self.assertEqual(install(self.root, normalized)["status"], "installed")
        self.assertTrue((self.destination / RECEIPT).is_file())

    def test_symlink_destination_parent_is_rejected(self) -> None:
        target = self.space / "target"
        target.mkdir()
        link = self.space / "linked"
        try:
            link.symlink_to(target, target_is_directory=True)
        except OSError as error:
            self.skipTest(f"Symlink creation is unavailable: {error}")
        with self.assertRaisesRegex(PackageError, "Links"):
            install(self.root, link / "installed")
        self.assertEqual(list(target.iterdir()), [])

    def test_preparation_failure_never_creates_destination(self) -> None:
        with patch("install_workflow.prepare_install", side_effect=OSError("Simulated disk failure")):
            with self.assertRaisesRegex(OSError, "disk failure"):
                install(self.root, self.destination)
        self.assertFalse(self.destination.exists())
        self.assertFalse(list(self.space.glob(".workflow-stage-*")))

    def test_publish_does_not_replace_destination_created_after_preparation(self) -> None:
        staging = self.space / "prepared"
        write(staging / "SKILL.md", "Prepared skill")
        self.destination.mkdir()
        with self.assertRaises(FileExistsError):
            publish_prepared(staging, self.destination)
        self.assertEqual(list(self.destination.iterdir()), [])

    def test_interrupted_placement_preserves_partial_folder_without_valid_receipt(self) -> None:
        staging = self.space / "prepared"
        write(staging / "SKILL.md", "Prepared skill")
        write(staging / RECEIPT, "{}")
        with patch("install_workflow.copy_exclusive", side_effect=OSError("Simulated disk failure")):
            with self.assertRaisesRegex(PackageError, "partial destination preserved"):
                publish_prepared(staging, self.destination)
        self.assertTrue(self.destination.is_dir())
        self.assertFalse((self.destination / RECEIPT).exists())

    def test_invalid_receipt_is_preserved(self) -> None:
        install(self.root, self.destination)
        write(self.destination / RECEIPT, "{broken")
        with self.assertRaisesRegex(PackageError, "receipt is invalid"):
            install(self.root, self.destination)
        self.assertEqual((self.destination / RECEIPT).read_text(encoding="utf-8"), "{broken")

    def test_cli_validator_and_installer_execute(self) -> None:
        scripts = Path(__file__).resolve().parents[1] / "scripts"
        commands = [
            [str(scripts / "validate_package.py"), "--root", str(self.root)],
            [str(scripts / "install_workflow.py"), "--source-root", str(self.root),
             "--destination", str(self.destination)],
            [str(scripts / "install_workflow.py"), "--source-root", str(self.root),
             "--destination", str(self.destination), "--check"],
        ]
        for command in commands:
            with self.subTest(command=command[0]):
                result = subprocess.run([sys.executable, *command], capture_output=True, text=True)
                self.assertEqual(result.returncode, 0, result.stderr)
                self.assertIsInstance(json.loads(result.stdout), dict)

    def test_nested_export_does_not_record_enclosing_repository_commit(self) -> None:
        def enclosing_git(command: list[str], **kwargs: object) -> subprocess.CompletedProcess:
            output = str(self.space) if "--show-toplevel" in command else ""
            if "HEAD" in command:
                output = "unrelated-commit"
            return subprocess.CompletedProcess(command, 0, output, "")

        with patch("install_workflow.shutil.which", return_value="git"):
            with patch("install_workflow.subprocess.run", side_effect=enclosing_git):
                revision = source_revision(self.root)
        self.assertIsNone(revision["commit"])
        self.assertEqual(revision["revision_status"], "not-package-checkout")


if __name__ == "__main__":
    unittest.main()
