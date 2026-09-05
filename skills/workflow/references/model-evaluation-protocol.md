# Model and Instruction Evaluation Protocol

Use only for comparisons of models, reasoning effort, Workflow instructions,
agents, or skills. Keep ordinary tasks in their existing Workflow mode.

## Contract and evidence

Fix the realistic tasks, raw fixtures, allowed effects, required outcomes, and
grading criteria before running the baseline. Use the same criteria for the
candidate. Preserve an explicitly requested model and effort; verify current
official guidance before relying on availability, compatibility, or defaults.
Do not change global settings, select a substitute, or enable extra capabilities
to make an unavailable target appear to pass.

Record each trial's instruction version or hash, model and effective effort when
verifiable, app/CLI version, tool surface, permissions, fixture, and date. Mark
unavailable metadata as unknown. Distinguish inherited host guidance from the
skill under test; host rules may mask differences between skill versions.

| Mode | Evidence and limits |
| --- | --- |
| Static review | Instruction consistency, references, and fixture/grader validity. No claim of task execution. |
| Simulation | Observed responses and attempted calls against simulated tools or a replay. No claim of live external effects. |
| Execution | Observed tool results, file changes, checks, and final state in the authorized fixture. |

Label each result pass, fail, or inconclusive for its mode. Required actions must
be observed in execution cases; promising to test is not testing. Count an
unauthorized attempt as a failure even if the tool prevents the effect. A fixture
that cannot exercise the behavior, an unavailable model, or a missing required
tool makes that part inconclusive, not passed. Static or simulated approval
cannot substitute for missing execution evidence.

## Controlled comparisons

For a model change combined with instruction changes, separate the effects:

| Run | Instructions | Model |
| --- | --- | --- |
| A, when runnable | Original | Previous |
| B | Original | Candidate |
| C | Revised | Same candidate as B |

A to B compares models on the original contract. B to C compares instructions
on the candidate. Keep fixtures, tools, permissions, effort where compatible,
and other configuration fixed; disclose unavoidable differences. If A cannot
run, B to C still evaluates the instruction change but cannot establish a model
improvement. Only add a revised-instructions/previous-model run when interaction
between model and instructions is the question being tested.

Run the smallest relevant subset while making one instruction-group change at
a time. Run the full regression suite after broad instruction or model-family
changes. One deterministic structural check is enough when unchanged; repeat
sensitive behavioral cases to expose variance. Three initial attempts can reveal
inconsistency but do not establish statistical reliability. Record shared context
or correlated trials instead of presenting them as independent samples.

## Isolated evaluation

Use an independent evaluator with a clean context when behavioral testing adds
confidence. Give the task-performing agent only the user request, the identified
skill version, and minimum raw artifacts. Keep expected answers, suspected bugs,
patch descriptions, and grading rubrics with the evaluator. Record any unavoidable
context contamination or influence from host instructions.

Use isolated local fixtures for reversible execution. Exercise production,
publication, destructive operations, and credentials through simulated tools,
without live secrets, private data, or external writes. Record blocked attempts.
For menu-only and read-only cases, keep evaluation bookkeeping outside the task's
observable actions; do not authorize artifact writes as part of those tasks.

For status, revocation, and resumption cases, record the order of user updates,
completed actions, and later tool calls. Verify final state as well as narration.
A synthetic checkpoint tests simulated resumption, not real context compaction.
Do not infer new permission from a checkpoint or replayed document.

## Decision and reporting

Use the result template in `workflow-regression-suite.md`. Report success and
hard failures first, then unnecessary questions, duplicated work, relevant
context, tool calls and retries. Include latency, tokens, and cost only when
measured; missing values are not zero.

Keep capability exploration separate from regression protection. Do not weaken
a grader after seeing results or treat every failure as a prompt defect: identify
instruction, model, fixture, tool, or grading limitations. Correct a defective
grader transparently and rerun both versions under the corrected criteria.

Retain the smallest change supported by evidence. Complete affected behavior
checks and report material inconclusives before declaring an update validated.
Keep changes local unless publication is separately authorized. A narrower
successful check does not justify claiming a broader migration or rollout.
