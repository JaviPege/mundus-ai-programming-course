# DEMO M1 — No tools: the model invents the fleet report

**What it shows:** the "nothing loaded" project — just an `AGENTS.md` briefing
and `database.sqlite`, no `.opencode/`. With no way to reach real data, the
model answers with a CONFIDENT, fully INVENTED report.

**Prompt:** `Give me the morning status report for the e-bike fleet: total bikes, broken bikes, and battery levels. Just give me the report, no questions.`

**Point out in the output:** the report sounds authoritative (fleet of 200
bikes, 10 broken, neat battery buckets) and every number is fabricated — the
real fleet has 8 bikes. This is hallucination: plausible, confident, wrong.
Now open M2 — SAME prompt, real data. That contrast is the module's point.

*(Note for regeneration: current free models only hallucinate this prompt when
run as a plain chat agent with all tools off; see `demos/README.md`.)*
