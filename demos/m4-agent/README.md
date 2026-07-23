# DEMO M4 — Autonomous agent: resolves all tickets in a loop

**What it shows:** a custom agent (`.opencode/agents/fleet-manager.md`) with a
goal and a loop, running unattended until the work is done.

**Prompt (run with `--agent fleet-manager`):** `Resolve all pending maintenance tickets`

**Point out in the output:** the loop — `fleet_list_pending_tickets` →
`fleet_assign_mechanic` → `fleet_mark_bike_fixed`, repeated 3 times (tickets
#1, #2, #3 — ticket #4's bike is the same as #1's, so it closes along the
way), then the agent STOPS BY ITSELF when no pending tickets remain and prints
a one-line summary. Note the agent's restricted tool set (no bash/write/edit)
and `steps: 20` cap in the agent file.
