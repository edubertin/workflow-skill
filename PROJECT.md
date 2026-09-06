# Project map

Workflow Skill is a portable instruction package for scoped execution,
continuity and evidence-based review. Version 0.1.0-alpha.1 is the initial public
experimental release under MIT. Stable qualification and host/plugin activation
coverage remain pending. The skill has no runtime service. Its public presentation
and technical manual are a separate website with no database or authentication.

| Path | Responsibility |
| --- | --- |
| skills/workflow/ | Installable instructions, metadata and conditional references |
| .codex-plugin/plugin.json | Plugin metadata pointing to the same skill |
| scripts/ | Validation and explicit-destination installation |
| tests/ | Isolated tooling tests |
| .github/workflows/ci.yml | Read-only CI on Windows and Linux |
| site/ | Website source, visual assets and technical manual, hosted with Sites |
| .github/workflows/site.yml | Independent website checks, without automatic deployment |
| docs/site.md | Website development, versioning and publication boundaries |
| docs/agents/ | Original maintenance/review profiles used as project context |
| docs/evaluation.md | Behavioral evidence, procedures and verified limits |
| docs/personalization.md | Optional personal and project policies |
| docs/releasing.md | Review, versioning and distribution |
| PROVENANCE.md | Source selection and excluded material |

Commands are in AGENTS.md. Update this map when responsibilities change.
The personal Workflow installation is separate; this release does not replace it.
Adoption requires a reviewed version and an explicit installation target.

Initial scope: portability, specialist discovery, installation, validation,
documentation and GitHub review. The runtime in workflow-2.0 and the historical
snapshot remain independent projects. Store submission and automatic replacement
of personal configuration are outside this slice.
