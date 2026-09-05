"""Deterministic package validation; this does not evaluate agent behavior."""

from __future__ import annotations

import hashlib
import json
import os
import re
import stat
from pathlib import Path
from urllib.parse import unquote, urlsplit

import yaml


class PackageError(ValueError):
    pass


class UniqueLoader(yaml.SafeLoader):
    pass


def unique_mapping(loader: UniqueLoader, node: yaml.MappingNode) -> dict:
    result = {}
    for key_node, value_node in node.value:
        key = loader.construct_object(key_node)
        if not isinstance(key, str) or key in result:
            raise PackageError("YAML keys must be unique strings")
        result[key] = loader.construct_object(value_node)
    return result


UniqueLoader.add_constructor(
    yaml.resolver.BaseResolver.DEFAULT_MAPPING_TAG, unique_mapping
)
PERSONAL_PATH = re.compile(r"(?<![A-Za-z])[A-Za-z]:[\\/]|/(?:Users|home)/|~[\\/]|\$(?:HOME|CODEX_HOME)[\\/]")
SENSITIVE_NAMES = {".env", "credentials.json", "credentials", "auth.json", "id_rsa", "id_ed25519"}
SENSITIVE_SUFFIXES = {".pem", ".key", ".pfx", ".p12", ".crt", ".cer", ".zip", ".sqlite", ".db"}
IGNORED_DIRS = {".git", "__pycache__", ".venv"}
SITE_GENERATED_DIRS = frozenset({
    "site/node_modules", "site/dist", "site/.wrangler", "site/.vinext",
    "site/.next", "site/coverage", "site/test-results", "site/playwright-report",
})


def reject_links(path: Path) -> None:
    for candidate in (path, *path.parents):
        if not os.path.lexists(candidate):
            continue
        details = candidate.lstat()
        reparse = getattr(details, "st_file_attributes", 0) & 0x400
        if stat.S_ISLNK(details.st_mode) or reparse:
            raise PackageError(f"Links and reparse points are not supported: {candidate.name}")


def is_sensitive(path: Path) -> bool:
    name = path.name.lower()
    return (
        name in SENSITIVE_NAMES or name.startswith(".env.")
        or name.startswith("secrets.") or path.suffix.lower() in SENSITIVE_SUFFIXES
    )


def safe_files(root: Path, exclude: frozenset[str] = frozenset(),
               exclude_paths: frozenset[str] = frozenset()) -> list[Path]:
    reject_links(root)
    if not root.is_dir():
        raise PackageError(f"Directory missing: {root.name}")
    found = []
    for directory, names, files in os.walk(root, followlinks=False):
        for name in [*names, *files]:
            path = Path(directory) / name
            reject_links(path)
            if is_sensitive(path):
                raise PackageError(f"Sensitive or generated artifact path: {path.relative_to(root)}")
        names[:] = [name for name in names if name not in exclude
                    and (Path(directory) / name).relative_to(root).as_posix() not in exclude_paths]
        for name in files:
            path = Path(directory) / name
            if not stat.S_ISREG(path.stat().st_mode):
                raise PackageError(f"Not a regular file: {path.relative_to(root)}")
            found.append(path)
    return sorted(found)


def read_mapping(text: str, label: str) -> dict:
    try:
        value = yaml.load(text, Loader=UniqueLoader)
    except yaml.YAMLError as error:
        raise PackageError(f"Invalid YAML in {label}") from error
    if not isinstance(value, dict):
        raise PackageError(f"Expected YAML mapping in {label}")
    return value


def require_text(mapping: dict, key: str, label: str) -> str:
    value = mapping.get(key)
    if not isinstance(value, str) or not value.strip():
        raise PackageError(f"{label} requires nonempty {key}")
    return value


def validate_frontmatter(skill: Path) -> None:
    text = (skill / "SKILL.md").read_text(encoding="utf-8")
    match = re.match(r"\A---\r?\n(.*?)\r?\n---(?:\r?\n|$)", text, re.S)
    if not match:
        raise PackageError("SKILL.md requires YAML frontmatter")
    metadata = read_mapping(match.group(1), "SKILL.md")
    if require_text(metadata, "name", "SKILL.md") != "workflow":
        raise PackageError("Skill name must be workflow")
    require_text(metadata, "description", "SKILL.md")


def validate_interface(skill: Path) -> None:
    metadata = read_mapping((skill / "agents/openai.yaml").read_text(encoding="utf-8"), "openai.yaml")
    interface = metadata.get("interface")
    if not isinstance(interface, dict):
        raise PackageError("openai.yaml requires interface mapping")
    for key in ("display_name", "short_description", "default_prompt"):
        require_text(interface, key, "openai.yaml interface")
    if "$workflow" not in interface["default_prompt"]:
        raise PackageError("Default prompt must invoke $workflow")
    policy = metadata.get("policy")
    if not isinstance(policy, dict) or not isinstance(policy.get("allow_implicit_invocation"), bool):
        raise PackageError("openai.yaml policy requires boolean allow_implicit_invocation")


def contained_reference(base: Path, target: str, boundary: Path) -> Path:
    target = unquote(target).replace("\\", "/")
    if not target or target.startswith("/") or re.match(r"^[A-Za-z]:", target):
        raise PackageError(f"Reference must be relative: {target}")
    path = base / target
    reject_links(path)
    resolved = path.resolve()
    if not resolved.is_relative_to(boundary.resolve()):
        raise PackageError(f"Reference escapes package: {target}")
    if not resolved.exists():
        raise PackageError(f"Broken local reference: {target}")
    return resolved


def markdown_targets(text: str) -> list[str]:
    links = re.findall(r"\[[^\]\n]+\]\(([^)\n]+)\)", text)
    definitions = re.findall(r"^\s*\[[^\]\n]+\]:\s*(\S+)", text, re.M)
    code = re.findall(r"`((?:\.{1,2}/)?(?:references|agents)/[^`\n]+)`", text)
    return [*links, *definitions, *code]


def validate_references(path: Path, skill: Path) -> None:
    text = path.read_text(encoding="utf-8")
    if PERSONAL_PATH.search(text):
        raise PackageError(f"Personal absolute path in {path.relative_to(skill)}")
    targets = markdown_targets(text)
    if path.parent.name == "references":
        siblings = re.findall(r"`([a-z][a-z0-9-]+\.md)`", text)
        targets.extend(siblings)
    for target in targets:
        target = target.strip().split(' "', 1)[0].strip("<>")
        parsed = urlsplit(target)
        if parsed.scheme in {"https", "http", "mailto"} or target.startswith("#"):
            continue
        if parsed.scheme or parsed.netloc:
            raise PackageError(f"Unsupported reference in {path.name}")
        contained_reference(path.parent, parsed.path, skill)


def validate_scenarios(skill: Path) -> int:
    suite = skill / "references/workflow-regression-suite.md"
    text = suite.read_text(encoding="utf-8")
    cases = re.findall(r"^\|\s*(WF-\d+)\s*\|", text, re.M)
    if not cases or len(cases) != len(set(cases)):
        raise PackageError("Regression case IDs must be present and unique")
    for row in re.findall(r"^\|\s*WF-\d+\s*\|.*$", text, re.M):
        if len(row.split("|")) < 10:
            raise PackageError("Regression cases require all eight matrix columns")
    return len(cases)


def validate_license(root: Path, skill: Path, manifest: dict) -> None:
    notices = (root / "LICENSE", skill / "LICENSE")
    if "license" not in manifest and not any(path.exists() for path in notices):
        return
    require_text(manifest, "license", "Plugin")
    for path in notices:
        if not path.is_file():
            raise PackageError(f"License notice missing: {path.relative_to(root)}")
    text = notices[0].read_bytes()
    if not text.strip():
        raise PackageError("LICENSE must contain a nonempty license notice")
    if text != notices[1].read_bytes():
        raise PackageError("Root and installed skill LICENSE notices must match byte-for-byte")


def validate_manifest(root: Path, skill: Path) -> dict:
    path = root / ".codex-plugin/plugin.json"
    if not path.exists():
        validate_license(root, skill, {})
        return {"name": "workflow", "version": None}
    try:
        manifest = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as error:
        raise PackageError("Invalid plugin JSON") from error
    if not isinstance(manifest, dict):
        raise PackageError("Plugin manifest must be an object")
    name = require_text(manifest, "name", "Plugin")
    if not re.fullmatch(r"[a-z][a-z0-9-]*", name):
        raise PackageError("Plugin name must use lowercase letters, digits and hyphens")
    version = require_text(manifest, "version", "Plugin")
    if not re.fullmatch(r"\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?", version):
        raise PackageError("Plugin version must use semantic version format")
    folder = contained_reference(root, require_text(manifest, "skills", "Plugin"), root)
    if not folder.is_dir() or not skill.is_relative_to(folder):
        raise PackageError("Plugin skills path must include skills/workflow")
    validate_license(root, skill, manifest)
    return {"name": name, "version": version}


def content_hashes(folder: Path, exclude: frozenset[str] = frozenset()) -> dict[str, str]:
    return {
        path.relative_to(folder).as_posix(): hashlib.sha256(path.read_bytes()).hexdigest()
        for path in safe_files(folder)
        if path.relative_to(folder).as_posix() not in exclude
    }


def validate_package(root: Path) -> dict:
    root = root.absolute()
    reject_links(root)
    root = root.resolve()
    safe_files(root, frozenset(IGNORED_DIRS), SITE_GENERATED_DIRS)
    skill = root / "skills/workflow"
    files = safe_files(skill)
    validate_frontmatter(skill)
    validate_interface(skill)
    for path in files:
        if path.suffix in {".md", ".yaml", ".yml", ".json"}:
            validate_references(path, skill)
    manifest = validate_manifest(root, skill)
    return {"kind": "structural", "files": len(files), "scenarios": validate_scenarios(skill), **manifest}
