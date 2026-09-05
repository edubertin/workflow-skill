# Evaluation evidence

## Evidence levels

Package validation checks metadata, references and distribution boundaries.
Tooling tests exercise installation and validation code against isolated files.
Decision simulations inspect an agent's written choices without executing the
requested operations. Behavioral execution checks actual tool use and state in
an isolated fixture. These are different evidence levels.

Use the installed skill's model-evaluation protocol and regression suite for
cases, fixed criteria, trial metadata and pass/fail/inconclusive scoring. Read
the protocol before model or broad instruction comparisons. No claim about a
model upgrade follows from structural checks or a single host trial.

## Portable edition baseline

The personal predecessor had 33 documented cases. The portable suite preserves
their intent, generalizes user-specific fixtures and adds specialist/installation
cases. WF-01 now explicitly uses a minimal, local, read-only fixture classified
Low. Broader audits can have a different risk; this calibration is not evidence
of a model improvement.

Historical personal-version simulations and fixtures are not portable-edition
results. Their private traces are not included in this public package.

## Release criteria

Run deterministic package checks and tooling tests on every PR. For a broad skill
change, run the full decision suite and meaningful execution cases in isolated
fixtures. Preserve both failed attempts and retests. Repeat sensitive stochastic
cases as specified by the protocol and record shared-context limitations.

An independent executor receives the task, skill and necessary raw fixtures, but
not the expected answer or proposed fix. A separate reviewer grades observable
results. Menu-only testing preloads the skill as host context, so loading it is
not counted as project inspection. Missing unavailable tools cannot count as
an attempted real execution.

Record evidence here before a release. A draft PR can carry incomplete behavioral
coverage provided those gaps are explicit. No stable release is declared by the
initial package scaffolding.

## Initial local evidence — 2026-09-05

- Structural: bundled skill-creator and plugin-creator validators passed. The
  repository validator found seven skill files and 37 unique scenarios. Fourteen
  local Markdown links across the repository resolved at the delivery check.
- Tooling execution: 37 tests passed without skips on Windows with Python 3.12.14.
  These include real symlink/junction cases, normalized path containment,
  existing-target preservation, interrupted placement, receipt drift and CLI use.
  An actual temporary installation, identical reinstall and integrity check passed.
  During integration, a failing provenance test exposed that an exported package
  inside another checkout could inherit the enclosing repository's commit. The
  installer now requires the Git root to match the package root; the full test
  suite passed after correction.
- Independent task execution: a fresh evaluator first received only the skill,
  two requests and raw fixtures, without the regression rubric. It corrected an
  accent in a project guide after reading the designated local copy profile,
  then corrected a README spelling error in a project without that profile.
  The integrator checked both exact resulting texts and an untouched sentinel.
  No Git mutations, external writes, secret access or extra delegation occurred.

The two execution cases support local specialist discovery and a simple fallback;
they do not cover every mode. The later rubric-aware suite review is a separate
activity. Host instructions still applied, both requests shared one evaluator
context, and exact effective model/effort metadata was not independently verified.
No claim of measured model improvement, fresh host plugin installation, actual
context compaction or full behavioral execution coverage follows from this run.

The full rubric-aware review is recorded in
[decision-review-2026-09-05.json](decision-review-2026-09-05.json): 35 cases were
compatible at the static level and two were inconclusive (WF-11/WF-30 model
execution unavailable). Fifteen additional conceptual attempts covered five
sensitive cases. None is a separately executed or statistically independent trial.

GitHub CI initially passed on Ubuntu but failed on Windows temporary paths.
The validator compared a canonical path with an unresolved spelling of the same
location. A new equivalent-path regression reproduced the failure locally. The
validator now rejects links before canonicalizing its root, and all 37 local
tests pass. The initial failed GitHub runs remain in the repository history.

A clean clone of the published implementation branch at e694bca was installed
into a separate temporary destination. Its receipt recorded that exact commit
and dirty=false; a second integrity check passed. This verifies package copying
and provenance, not activation in a fresh Codex host or plugin marketplace.
