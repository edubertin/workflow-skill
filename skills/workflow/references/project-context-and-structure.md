# Project Context and Structure

Read only for project restart, new-project structure, repository audits, or an
authorized structural migration. Use project-supplied standards when present.
No personal standard, agent directory, or external service is required.

## Project Restart / Context Bootstrap

Use for "reinicia o contexto", "retoma esse projeto", or equivalent requests to
reconnect with an existing project. Treat the working directory as a starting
point; verify the actual project root from local instructions and repository
state unless the user provides a target. Start read-only.

1. Read relevant instructions, README, project context, local specialist guidance,
   roadmap, specs, ADRs, and release docs when present.
2. Inspect Git state when available: branch, changes, remote, recent commits,
   and relevant PR context. Report a non-Git directory without requiring Git.
3. Identify stack, package manager, commands, checks, and app/service layout.
4. Recover current decisions, unfinished work, QA evidence, and material risks.
5. Consult connected sources only when referenced by local context, requested,
   or necessary for the scoped task; use narrow read-only queries.
6. Report the root, influential sources, current state, pending decisions, and
   next action. Do not update files, planning tools, or external systems merely
   to record the bootstrap.

An explicit request to resume already-authorized implementation may proceed
after state reconciliation. Context bootstrap alone grants no such authority.

## New Project / Structure Bootstrap

Start with a short plan grounded in product intent, platform, audience, first
usable surface, and risk. Creating a requested local project is authorized;
GitHub publication requires its own applicable authorization.

Read relevant project-supplied conventions and use
[Specialist Discovery](specialist-discovery.md) if repository or product judgment
would improve the plan. Missing specialists are not a reason to invent files or
block an ordinary scaffold.

- Choose the smallest useful shape. Add multiple apps or shared packages only
  when current needs justify them.
- Define boundaries for source, content, assets, fixtures, generated outputs,
  caches, and local scratch work.
- Give `AGENTS.md`, `PROJECT.md`, and README distinct purposes when those files
  are useful: operational instructions, durable project map, and user entrypoint.
- Provide only the install, development, check, build, and QA commands the first
  usable slice needs.
- Identify relevant data, production, store, and publication gates without
  adding unrelated infrastructure or mandatory services.

Record anticipated growth in a project map when useful; avoid empty architecture
folders. Preserve existing repository conventions unless a change is requested
or needed for the task.

## Repository Structure Audit

For "organiza projeto", "estrutura", "inventário", "limpeza", or similar
requests concerning an existing repository, inspect before proposing migration.
Read applicable instructions, project maps, local specialist guidance, package
or workspace files, Git state, ignore rules, and the top-level layout.

Report healthy exceptions, missing context, source and generated-file boundaries,
heavy folders, and Git/ignore risks without reading secrets. Compare with the
project's own standards and explain any proposed departure. Do not require a
monorepo or copy a different project's conventions by default.

For authorized migration, define owned paths, consumers/imports/build scripts
affected, verification, and recovery steps before moving or renaming. Respect
the user's destructive-operation rules. Production, stores, user data, auth,
database, or large-media impacts require risk-appropriate approval and mitigation.
