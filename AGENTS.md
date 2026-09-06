# Repository instructions

Read PROJECT.md and docs/evaluation.md before changing behavioral expectations.
This repository distributes instructions, not an agent runtime.

- Setup: `python -m pip install -r requirements-dev.txt` (Python 3.11+).
- Check: `python scripts/validate_package.py`.
- Test: `python -m unittest discover -s tests -v`.
- Release procedure: docs/releasing.md; no implicit merge, tag or publication.
- Authoritative local profiles: docs/agents/skill-maintainer.md and
  docs/agents/evaluation-reviewer.md. Read only the relevant profile.
- Never copy global agent folders, plugin caches or personal configuration.
  The skill must respect applicable user and project authorization rules.
- Separate package/tooling tests from model behavior evidence. Preserve failed
  and inconclusive records when retesting.
- Installer tests use isolated temporary destinations, never an active installation.
- Generated installations and private traces belong in ignored local output.
- Python functions: at most 40 lines. Report or propagate errors.
- Website work: read site/AGENTS.md and docs/site.md. Its Node checks and deployment
  are separate from skill installation and release qualification.
