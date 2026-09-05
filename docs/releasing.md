# Review and release

## Initial GitHub delivery

A minimal main bootstrap provides a base for codex/portable-workflow-foundation.
The full package is proposed in a draft PR. Review scope, provenance, CI and
behavioral evidence before merge. Follow the user's actual publication authority.

## Prepare a release

1. Select regression cases before execution. Broad instruction changes require
   the full suite; repeat stochastic cases as the evaluation protocol requires.
   Do not count unexecuted scenarios as passing.
2. Run package checks and tooling tests. Require both operating-system CI jobs
   before merge. Keep behavioral evidence separate in docs/evaluation.md.
3. Verify a clean installation and integrity. Check menu, project context,
   missing specialists, local specialist priority, revocation and resumption in
   fresh host tasks. Record the actual host/model details available.
4. Review compatibility, personal-policy migration and license. Set the plugin
   version and move Unreleased changes to a dated CHANGELOG entry.
5. With explicit authorization, merge the reviewed PR, create the corresponding
   version tag and GitHub release. Correct a release by publishing a new version.

Protect main with required CI checks, PR flow, resolved conversations and blocked
force pushes/deletion. A solo maintainer can use zero required second-party
approvals while still enforcing checks and PRs.

## Plugin distribution

The repository root is the workflow-skill plugin. Its manifest points to skills/.
There are no bundled services, hooks or credentials. Agent actions still depend
on host permissions and user authorization.

Use the host's current plugin-creator/validator and an explicit development
marketplace when installation as a plugin is requested. Validate in a fresh task.
A manifest check or GitHub PR does not publish a plugin-directory listing.
Follow the official target-host process:
https://learn.chatgpt.com/pt-BR/docs/build-plugins

## Updating an installation

Install a selected tag into a new explicit destination. Compare the changes and
personal policies before replacing an active installation. Retain the prior
known-good version until the update is verified. The installer does not silently
overwrite a different installation or edit host settings.
