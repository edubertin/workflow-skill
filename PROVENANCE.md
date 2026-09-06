# Provenance and distribution scope

The starting material is the six-file Workflow skill maintained in the author's
local Codex environment on 2026-09-05: SKILL.md, agents/openai.yaml and the
project-context, regression-suite, model-protocol and GPT-5.6-profile references.
The portable edition adapts this selected material and adds original tooling,
maintenance documentation and specialist discovery guidance.

The earlier public snapshot is
https://github.com/edubertin/workflow-v2-review/tree/main/.codex/skills/workflow.
It is historical context, not a dependency or a complete record of local edits.

The distribution excludes global Codex/Claude configuration, external agent
files, third-party skills, creator implementations, plugin caches, credentials
and personal traces. Paths to external specialists were replaced with discovery
guidance; their implementations were not copied. The two maintenance profiles
were written for this repository.

The plugin manifest was scaffolded using the locally provided plugin-creator and
filled with project metadata. The creator and its validators are development
tools and are not redistributed. External documentation is linked at its source.
The included material is distributed under the MIT License, Copyright (c) 2026
Eduardo Bertin. LICENSE is authoritative; skills/workflow/LICENSE preserves the
same notice in standalone installations. Linked tools, models and agents retain
their own terms. Confirm the origin of new material before adding it.

## Website and visual assets

The website in `site/` started from a Vinext/React starter with the Shadcn/Base UI
catalog. The product pages, manual, motion and mobile adaptation were developed
for Workflow. Starter components remain identifiable under `site/components/ui/`;
their presence does not mean every component is used or individually reviewed.
Dependency versions are recorded in `site/package-lock.json`, and dependencies
retain their own licenses. They are not part of the installed instruction package.

`site/public/hero-ribbon.png` and `site/public/og.png` were generated with Imagegen
for this site's approved dark editorial direction. The mobile WebP is a lossless
encoding of the original hero; it is intentionally kept alongside the desktop
PNG. `site/public/icon.svg` is the product icon. Social campaign images, design
concepts and working prompts are local delivery material outside this repository.

The source is mirrored into a separate Sites deployment checkout as documented
in [docs/site.md](docs/site.md). That mirror, historical verification records and
the standalone skill license are deliberate duplication. Generated builds,
dependency directories, private traces and local publication archives are excluded
from Git. The current delivery is identified in
[docs/site-release-0.3.2.md](docs/site-release-0.3.2.md).
