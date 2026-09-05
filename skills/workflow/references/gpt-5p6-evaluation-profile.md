# Historical GPT-5.6 Workflow Evaluation Profile

This optional profile preserves a target-specific comparison recipe; it is not
a declaration of current availability or a default model. Use it only for an
explicitly requested GPT-5.6 migration, audit,
prompting update, or reasoning-effort comparison. Follow
[Model Evaluation Protocol](model-evaluation-protocol.md) for modalities,
controlled comparisons, measurements, and reporting.

Live official guidance is canonical and must be checked before relying on model
names, reasoning levels, defaults, or optional capabilities:

Consult the [current model guide](https://developers.openai.com/api/docs/guides/latest-model).

Verify the requested target in the actual host or evaluation harness as well;
an API guide alone does not establish host support.

## Target posture

- Preserve an explicitly requested GPT-5.6 target and effort.
- This profile does not establish model availability. Verify effective model and
  effort from the current harness; report unavailable or unverifiable metadata.
  Do not silently substitute a different target or call an incompatible run a pass.
- Do not turn one requested quality-first audit into a global model default.
- Do not adopt `max`, Pro mode, persisted reasoning, explicit caching,
  Programmatic Tool Calling, or multi-agent behavior as part of a baseline
  migration unless the user requests it or evaluations show a measured need.

## Comparison matrix

For an explicit GPT-5.6 Sol `xhigh` audit, prefer:

1. Original instructions and the previous model/effort when runnable.
2. The same original instructions with GPT-5.6 Sol at `xhigh`.
3. Revised instructions with the same Sol `xhigh` configuration, only when a
   prompt or routing change is being evaluated.
4. A separate Sol `high` comparison using the same cases, instructions, and tools
   as its Sol `xhigh` control when runnable.

Do not assume the highest effort wins. Select the lowest effort that preserves
the required quality and safety on representative tasks.

Keep the target-specific comparison here; use the common protocol for evidence
and prompt-change discipline. Missing baseline or capability support limits the
conclusions as described there, and does not authorize a different model.
