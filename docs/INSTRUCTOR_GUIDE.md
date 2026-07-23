# Instructor Guide — AI E-Bike Fleet Manager

90-minute hands-on workshop for secondary-school students. They work
**inside the OpenCode desktop app** with **free models** (no account, no
API key, no billing). Everything was verified live with OpenCode CLI
1.17.11 and the free model `opencode/big-pickle` (Big Pickle);
`opencode/deepseek-v4-flash-free` and `opencode/nemotron-3-ultra-free`
behave the same on the read paths.

> **Spoilers ahead** — this guide contains the solutions.

## Timing

| Block | Time | Content |
|-------|------|---------|
| Setup | 10' | Install OpenCode desktop, open `starter/`, pick a free model |
| Module 1 | 15' | Context window: sessions, memory, tokens, `/compact`, `/init` |
| Module 2 | 20' | Hooks & RAG: hallucination demo, grounding rule, guard plugin |
| Module 3 | 20' | Function calling: implement the two write tools |
| Module 4 | 20' | Autonomous agent: complete and run `fleet-manager` |
| Wrap-up | 5' | Recap and questions |

## Pre-workshop checklist (do this the day before, per machine)

Student machines are all **Windows**. Per machine:

1. Install **OpenCode Desktop — Windows (x64)** from
   https://opencode.ai/download.
2. Open `solution/` in OpenCode (*File → Open Folder*). This first open
   auto-installs `@opencode-ai/plugin` into `.opencode/` — **it needs
   internet once per machine**; students never install anything manually.
3. Pick a free model (Big Pickle) and send one test message
   (*"How is the fleet?"*) — confirm it answers.
4. Run the Module 4 agent once (see below) and confirm all tickets end
   up closed.
5. Reset the database with the pristine copy before the session
   (no Python needed):

   ```powershell
   Copy-Item tools\database.pristine.sqlite starter\database.sqlite -Force
   Copy-Item tools\database.pristine.sqlite solution\database.sqlite -Force
   ```

## Resetting between sessions

OpenCode stores chats/sessions **globally** in
`%USERPROFILE%\.local\share\opencode` on Windows
(`~/.local/share/opencode` on macOS/Linux), **not** in the project
folder. Resetting the workshop for the next group = **only the database
copy** — no session cleanup needed:

1. Copy `tools\database.pristine.sqlite` over `starter\database.sqlite`
   (Explorer copy-paste or the `Copy-Item` command above).
2. Optionally delete old sessions from the app's session list, or just
   start a new session.

To regenerate the sample data instead (Python installed), use the `py`
launcher: `py tools\seed_db.py starter\database.sqlite`.

The project files themselves stay clean. OpenCode may create
`node_modules`, `package.json` and lock files inside `.opencode/` when
it auto-installs the plugin dependency; the included
`.opencode/.gitignore` keeps them out of git.

## Known quirks of the free models (verified)

- **Transient `No provider available` errors.** The free endpoints rate
  limit; roughly 1 in 5 runs failed with this error during verification
  and succeeded on retry ~30 seconds later. If a student hits it: wait,
  retry, or switch to another free model in the selector.
- **Free models are well-behaved — almost too well.** With the fleet
  tools visible, all three free models called the read tools and gave
  real data *even without* the grounding rule in AGENTS.md. Plan the
  Module 2 hallucination demo accordingly (below).
- **Models spontaneously refuse destructive SQL.** Asked to run
  `DROP TABLE`, Big Pickle and Nemotron refused on their own. Good —
  but it means the guard plugin (Module 2b) is best demonstrated with
  `rm -rf`, which models *will* attempt.
- **Permission prompts.** The desktop app asks before running tools
  (`ask`/`allow`). Teach students to click *allow* for the `fleet_*`
  tools — or to pick "always allow" for the session. This is a feature,
  not a bug: it is the same gate the guard plugin reinforces.

## Module 1 — Context window (15', no code)

**Goal:** an LLM is stateless; "memory" is just the text in the context
window; tokens are the unit of that window.

**Demo (instructor, projected):** in the app with any free model —

1. New session → type *"My name is Alex. Remember it."*
2. Ask *"What is my name?"* → it knows. Point at the **token counter**
   growing with each message.
3. Open a **new session** → *"What is my name?"* → forgotten. The model
   itself has no memory; the session history was the memory.
4. Go back to the first session → it remembers again.
5. Run `/compact` → the history is summarized; the name survives, the
   token count drops.
6. Run `/init` → OpenCode generates an `AGENTS.md`: a file of project
   rules injected into every session. (This is exactly the mechanism
   they will edit in Module 2.)

**Where students type:** the app's chat box. Nothing to edit.

**Failure modes:** none mechanical. If students ask why the new session
"forgot", resist saying "the model forgot" — the model never knew; each
API call only sees what is in the context window.

## Module 2 — Hooks & RAG (20')

**Goal:** LLMs invent plausible data when they lack access to real data
(hallucination); grounding (RAG) fixes it with real data; hooks are
middleware that can enforce rules deterministically.

### 2a. The hallucination demo

**Verified reality:** inside the `starter/` project the free models see
the `fleet_*` tools and usually call them even without the grounding
rule, so the classic "ask and watch it invent" does NOT trigger
reliably there. Do the demo in two steps:

1. **In a new chat in an EMPTY folder** (or any window without the
   project), ask:

   > *"You're my e-bike fleet manager with 8 bikes. Give me the morning
   > status report: battery levels and which bikes are broken. Just
   > give me the report, no questions."*

   Verified with Big Pickle: it invents a full, confident report —
   fabricated bike IDs, batteries and breakdowns ("EB-06 — front brake
   caliper seized"). (Asked less pushily, the same model honestly says
   it has no data — the "just give me the report" framing is what makes
   it hallucinate. That contrast is itself a teaching moment.)
2. **Now open `starter/`** and ask *"How is the fleet? Which bikes are
   broken?"* → the model calls `fleet_get_fleet_status` and answers
   with real data: bikes **#3 and #7 broken, #5 in maintenance**.

Discussion: the difference is access to real data (RAG/grounding), not
a smarter model.

### 2b. The grounding rule — students edit `starter/AGENTS.md`

Marker: `<!-- TODO (Module 2): add the grounding rule here -->`.

Intended solution (already in `solution/AGENTS.md`):

```
GROUNDING RULE: Before answering ANY question about the fleet, bikes or
maintenance tickets, ALWAYS call the fleet_* tools to get real data from
the local database. NEVER invent or guess fleet numbers.
```

Test: new session, ask *"How is the fleet? Which bikes are broken?"* →
the answer must cite #3 and #7 broken, #5 in maintenance.

**Failure mode:** a free model occasionally ignores the rule. Fix: make
the rule more explicit (put it first, use capitals, name the exact
tools) or switch to another free model. Remind students that AGENTS.md
changes only apply to **new** sessions.

### 2c. The guard hook — students edit `starter/.opencode/plugins/guard.ts`

Marker: `// TODO (Module 2):`. Plugins are middleware around every tool
execution; the `"tool.execute.before"` hook can inspect and block.
Intended solution (in `solution/`):

```ts
"tool.execute.before": async (input, output) => {
  if (input.tool !== "bash") return;
  const command = String(output.args?.command ?? "").toLowerCase();
  for (const bad of BLOCKED) {
    if (command.includes(bad)) {
      throw new Error(`Blocked by fleet guard: the command contains "${bad}".`);
    }
  }
},
```

Test: ask the model to *"Run this exact shell command:
`rm -rf /tmp/whatever`"*. Verified: the bash call fails with
`Error: Blocked by fleet guard: the command contains "rm -rf"` and the
model reports the block. The command is intercepted **before it ever
runs**, so this demo is safe on any OS, Windows included. The `BLOCKED`
list in the file already covers both worlds (`rm -rf`, `del /s`,
`rmdir /s`, `remove-item`, `format `, `drop table`); matching is
case-insensitive (the command is lowercased before matching). Note the
model may refuse `drop table` prompts itself (see quirks) — the hook is
the deterministic backstop.

**Failure modes:** edits to the plugin require a **new session** (or
app restart) to load. If the hook never fires, check the file is
exactly `.opencode/plugins/guard.ts` and the export is a named export
(`export const FleetGuard = ...`).

## Module 3 — Function calling (20')

**Goal:** the model can trigger real code: custom tools = TypeScript
functions OpenCode offers the model; the model chooses when to call
them and with which arguments.

Students edit `starter/.opencode/tools/fleet.ts`, markers
`// TODO (Module 3):` in `assign_mechanic` and `mark_bike_fixed`.
Both use `bun:sqlite` (built into OpenCode's runtime) and open the DB
at `path.join(context.directory, "database.sqlite")`.

Intended solutions (in `solution/`):

```ts
// assign_mechanic
const ticket = db.query("SELECT bike_id FROM tickets WHERE id = ?").get(args.ticket_id);
if (!ticket) return JSON.stringify({ ok: false, error: "ticket not found" });
db.query("UPDATE tickets SET mechanic = ?, status = 'assigned' WHERE id = ?")
  .run(args.mechanic, args.ticket_id);
return JSON.stringify({ ok: true, ticket_id: args.ticket_id, bike_id: ticket.bike_id, mechanic: args.mechanic });

// mark_bike_fixed
db.query("UPDATE bikes SET status = 'ok' WHERE id = ?").run(args.bike_id);
db.query("UPDATE tickets SET status = 'closed' WHERE bike_id = ? AND status IN ('open','assigned')")
  .run(args.bike_id);
return JSON.stringify({ ok: true, bike_id: args.bike_id, status: "ok" });
```

**Verified test:** *"Bike #3 is repaired. Use the fleet tools."* →
Big Pickle called `fleet_mark_bike_fixed {"bike_id":3}`; afterwards
bike #3 was `ok` and tickets #1 and #4 were `closed` in the DB.

**Failure modes:**

- *DB not found / empty result* → the tool must build the path from
  `context.directory`, never a hardcoded relative path; the session
  must run with the project folder as cwd (true when the folder is
  opened in the app).
- *Tool not visible* → file must be exactly
  `.opencode/tools/fleet.ts`; tool names are `fleet_<export name>`.
  Start a new session after editing.
- *Permission prompt before the call* → normal; click allow.
- *Model calls the tool with the wrong id* → reseed and retry; free
  models are non-deterministic.

## Module 4 — Autonomous agent (20')

**Goal:** an agent = model + system prompt + tools + a loop budget
(`steps`). It iterates on its own until the goal is met or the budget
runs out.

Students complete `starter/.opencode/agents/fleet-manager.md` (markers
`TODO (Module 4)`): `description`, `mode: primary`, `steps: 20`, the
`tools:` map (`fleet_*: true`, `write`/`edit`/`bash: false`) and the
loop in the body: list pending tickets → for the first one, assign a
mechanic then mark the bike fixed → repeat → stop with a summary when
none remain.

**Verified test:** in the app, switch to the **fleet-manager** agent
(agent selector) and send the single goal *"Resolve all pending
maintenance tickets"*. Verified headless with
`opencode run -m opencode/big-pickle --agent fleet-manager ...`: the
agent looped `list_pending_tickets → assign_mechanic → mark_bike_fixed`
three times (it picked mechanic "Carlos"), then stopped on its own.
Final DB state: all 8 bikes `ok`, all 5 tickets `closed` — and it
correctly reported that ticket #4 closed automatically when bike #3 was
fixed.

**Failure modes:**

- *Agent does not appear in the selector* → `mode` must be `primary`
  (or `all`); check YAML frontmatter syntax (indentation with spaces).
  Start a new session after editing.
- *Agent stops after one ticket* → the body must say explicitly "go
  back to step 1 / repeat until none remain"; free models otherwise
  declare victory early. Raising `steps` does not fix a lazy prompt.
- *Agent runs out of steps* → 20 is plenty for 4 pending tickets; if
  students lower it, show them the truncated run — it is a good lesson
  on loop budgets.

## Reference: data and tool contracts

Schema (`tools/seed_db.py` regenerates it):

```sql
bikes(id, model, battery_pct, status IN ('ok','maintenance','broken'))
tickets(id, bike_id → bikes.id, description, mechanic, status IN ('open','assigned','closed'))
```

Seed data: 8 bikes (#3, #7 broken; #5 maintenance; rest ok) and 5
tickets (#1–#3 open, #4 assigned to Luis, #5 closed by Ana).

Tool contract (tool name → behavior → JSON string returned):

| Tool | Behavior | Returns |
|------|----------|---------|
| `fleet_get_fleet_status` | SELECT all bikes | `[{"id":1,"model":"VoltRunner X2","battery_pct":87,"status":"ok"},…]` |
| `fleet_list_pending_tickets` | tickets `open`/`assigned` | `[{"ticket_id":1,"bike_id":3,"description":"…","mechanic":null,"status":"open"},…]` |
| `fleet_assign_mechanic` | ticket → `assigned` + mechanic | `{"ok":true,"ticket_id":1,"bike_id":3,"mechanic":"Ana"}` or `{"ok":false,"error":"ticket not found"}` |
| `fleet_mark_bike_fixed` | bike → `ok`, its open/assigned tickets → `closed` | `{"ok":true,"bike_id":3,"status":"ok"}` |

## Headless testing (instructor only)

Useful for pre-workshop validation or live demos without the UI. With
the OpenCode CLI on macOS/Linux:

```bash
cd solution
opencode run -m opencode/big-pickle --dangerously-skip-permissions "How is the fleet?"
opencode run -m opencode/big-pickle --agent fleet-manager --dangerously-skip-permissions \
  "Resolve all pending maintenance tickets"
```

On Windows (PowerShell, CLI installed via scoop or npm; note the backtick
line continuation):

```powershell
cd solution
opencode run -m opencode/big-pickle --dangerously-skip-permissions "How is the fleet?"
opencode run -m opencode/big-pickle --agent fleet-manager --dangerously-skip-permissions `
  "Resolve all pending maintenance tickets"
```

`--dangerously-skip-permissions` auto-approves tool prompts (fine here;
the guard plugin still blocks dangerous bash commands — it runs before
the permission check). Each run takes 30–90 s; retry on
`No provider available`.
