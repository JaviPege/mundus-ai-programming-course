# DEMO M2 — Same prompt, grounded: real data via fleet tools

**What it shows:** the exact same prompt as M1, but in a project WITH the
grounding rule (`AGENTS.md`) and the `fleet_*` tools (`.opencode/tools/fleet.ts`).
The model calls `fleet_get_fleet_status` and answers with real data.

**Prompt:** `Give me the morning status report for the e-bike fleet: total bikes, broken bikes, and battery levels. Just give me the report, no questions.`

**Point out in the output:** the `fleet_get_fleet_status` tool call, then the
real numbers — 8 bikes, #3 and #7 broken, #5 in maintenance. Open M1 and M2
side by side: same prompt, different output. The difference is grounding, not
a smarter model.
