# Pre-fabricated demo sessions

One project folder per module, each with a **recorded OpenCode session** (a
`DEMO M…` title in the session picker) produced by one fixed prompt. The
classroom flow becomes deterministic:

> theory block → open the demo folder in OpenCode → open the `DEMO M…` session → talking points

No live-model risk during the workshop.

## The four demos

| Folder | Session title | Shows | Generated with |
|---|---|---|---|
| `m1-bare/` | `DEMO M1 — No tools: the model invents the fleet report` | Nothing loaded: the model hallucinates a confident report (200 bikes?! real fleet: 8) | `opencode/deepseek-v4-flash-free`* |
| `m2-grounded/` | `DEMO M2 — Same prompt, grounded: real data via fleet tools` | SAME prompt as M1 + grounding rule + tools → real data (8 bikes, #3/#7 broken, #5 maintenance) | `opencode/big-pickle` |
| `m3-tools/` | `DEMO M3 — Function calling: 'Bike #3 is repaired' writes to the DB` | One sentence → `fleet_mark_bike_fixed` write call | `opencode/big-pickle` |
| `m4-agent/` | `DEMO M4 — Autonomous agent: resolves all tickets in a loop` | Custom agent loops list → assign → fix ×3 and stops by itself | `opencode/big-pickle` |

\* M1 needed a plain chat agent (no coding system prompt, all tools off) to
hallucinate; `big-pickle` and every other free model honestly refuse when run
as a coding agent — see "Regenerating" below.

Each folder has its own `README.md` with the exact prompt and what to point
out in the output.

## Presentation flow

1. **M1** — open `demos/m1-bare/`, open the `DEMO M1…` session. Talking
   point: the report is confident, detailed… and 100% invented. Ask the room:
   "how would you know?"
2. **M2** — open `demos/m2-grounded/`, open `DEMO M2…`. THE MONEY CONTRAST:
   same prompt, different output. Point at the `fleet_get_fleet_status` call
   and the real numbers. The difference is grounding (rules + tools), not a
   smarter model.
3. **M3** — open `demos/m3-tools/`, open `DEMO M3…`. A plain sentence becomes
   a WRITE to the database. The demo DB is reset to pristine; the recorded
   session is the proof.
4. **M4** — open `demos/m4-agent/`, open `DEMO M4…`. Scroll the loop:
   list → assign → fix, three times, then it stops on its own. Show
   `.opencode/agents/fleet-manager.md` afterwards.

The `rm -rf` guard demo (`solution/`) is deterministic live — the plugin
blocks the command every time — so it needs no pre-fabricated session.

## Installing on the instructor machine (Windows)

Prerequisite: open the OpenCode desktop app once (so it creates its
database), then **close it completely** (app and CLI — the import will
refuse with "close OpenCode and retry" if the database is locked).

From the repo root:

```
py tools\import_demo_sessions.py
```

The script backs up `opencode.db` to `opencode.db.bak`, finds (or creates)
the OpenCode project for this repo, and installs the four `DEMO M…`
sessions, pointing each at the local path of its demo folder. It is
idempotent — re-running just refreshes the demos. It prints a summary of
what it installed. Then open each demo folder in OpenCode and check the
`DEMO M…` session is there.

(On macOS/Linux the same script runs with `python3`; the default database
path is `%USERPROFILE%\.local\share\opencode\opencode.db` on Windows and
`~/.local/share/opencode/opencode.db` elsewhere. `--db` / `--repo` override
the defaults.)

## If the import fails — run the demos live

Open each folder in OpenCode and run, with `-m opencode/big-pickle`:

- **M2** (`demos/m2-grounded`): `Give me the morning status report for the e-bike fleet: total bikes, broken bikes, and battery levels. Just give me the report, no questions.`
- **M3** (`demos/m3-tools`): `Bike #3 is repaired.` — afterwards reset the DB: `copy ..\..\tools\database.pristine.sqlite database.sqlite` (Windows) / `cp ../../tools/database.pristine.sqlite database.sqlite` (macOS/Linux)
- **M4** (`demos/m4-agent`): `opencode run -m opencode/big-pickle --agent fleet-manager "Resolve all pending maintenance tickets"` — reset the DB afterwards as above.
- **M1** (`demos/m1-bare`): a coding agent will NOT hallucinate this prompt
  (it either grounds itself via `sqlite3` or honestly refuses). Run it as a
  plain chat instead — the workshop-verified way is a new chat in an EMPTY
  folder with the role-framed prompt from the instructor guide: *"You're my
  e-bike fleet manager with 8 bikes. Give me the morning status report…"*.
  The pre-fabricated M1 session was generated with
  `opencode/deepseek-v4-flash-free` using a minimal agent
  (`"prompt": "You are a helpful assistant."`, all tools disabled,
  temperature 1.0) in an empty folder, then re-pointed at `demos/m1-bare`.

## Regenerating the pack

1. Generate the four sessions (prompts above; M1 with the chat-agent trick
   above, then `UPDATE session SET directory=…, project_id=…` for the M1 row
   and fix any absolute paths in `message`/`part` JSON).
2. Rename each session in `opencode.db`
   (`UPDATE session SET title='DEMO M…' WHERE id='…'`).
3. For M3/M4: verify the DB writes, then restore the demo DB from
   `tools/database.pristine.sqlite`.
4. Export: `python3 tools/export_demo_sessions.py` → rewrites
   `demos/demo-sessions.json` (sessions matched by `DEMO M` title prefix in
   the four demo folders only; paths stored repo-relative; `project_id`
   dropped and re-resolved at import).
