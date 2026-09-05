# Review and release

## Release maturity

The first public package is the experimental prerelease v0.1.0-alpha.1, reviewed
in PR #1. It provides the portable instructions and installation tools for
evaluation. It is not a stable qualification or a plugin-directory listing.

An experimental GitHub prerelease requires reviewed scope/provenance, the selected
license in both distribution forms, green CI, a clean installation with integrity
verification, and documented representative local execution. Record the full
decision review and all unexecuted or inconclusive cases. Mark the GitHub release
as a prerelease, use a prerelease version, and state these limits in its notes.

Stable qualification additionally requires the fresh host and broader behavioral
checks below. The alpha designation does not turn a static review or conceptual
attempt into execution evidence. Preserve earlier failures and open criteria.

## Qualify a stable release

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

For either maturity, verify the exact reviewed head and required checks before
merge. Tag the resulting main commit. Publish source/plugin and standalone skill
archives from that tag with SHA256 checksums. The standalone skill must include
LICENSE; the full archive must include both identical notices. Inspect archive
members before upload and verify the published tag and asset digests afterward.

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
