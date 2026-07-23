# AI E-Bike Fleet Manager 🚲⚡

A 90-minute hands-on workshop for secondary-school students: learn how
AI assistants really work — context windows, grounding (RAG), function
calling and autonomous agents — **inside the OpenCode desktop app**, by
building an AI fleet manager for an e-bike sharing company.

No API keys, no accounts, no billing: OpenCode ships **free models**
(e.g. Big Pickle) that work out of the box.

## Repository map

```
README.md                       ← you are here
docs/INSTRUCTOR_GUIDE.md        ← instructor guide (spoilers!)
docs/WORKSHOP_SLIDES.md         ← slide source
tools/seed_db.py                ← regenerates the SQLite database with sample data
tools/database.pristine.sqlite  ← clean copy of the database, for easy resets
starter/                        ← the project you open in OpenCode (with TODOs)
solution/                       ← the reference solution, fully implemented (don't peek!)
demos/                          ← pre-fabricated demo sessions, one folder per module (instructor)
```

## Setup (10 minutes) — Windows

1. **Install OpenCode Desktop — Windows (x64)** from
   https://opencode.ai/download. It's free and needs no account, no API
   key, no billing for the free models.
2. **Get this repo** — either with Git for Windows:

   ```powershell
   git clone <this-repo-url>
   cd C001
   ```

   or click **Code → Download ZIP** on GitHub and extract it.
3. **Open the `starter` folder in OpenCode** (*File → Open Folder…*).
   The first time a project is opened, OpenCode auto-installs its plugin
   dependency (`@opencode-ai/plugin`) into `.opencode/` — this needs
   internet **once per machine**; there is nothing else to install.
   If you ever see `Cannot find package '@opencode-ai/plugin'`: close
   OpenCode completely and reopen the folder, then wait a few seconds
   before sending your first message (the install runs on project open).
4. **Pick a free model** in the model selector — e.g. **Big Pickle**.
5. **Start the guided tutorial**: type `/module-1` in the chat. The
   `/module-1` … `/module-4` commands turn the AI into your step-by-step
   tutor for each module — it tells you exactly what to type, where, and
   how to check it worked, one step at a time.

> Python is **not** needed for the workshop — see
> [Resetting the database](#resetting-the-database) below.

## The 4 modules

| # | Time | Topic | What you will do | Where |
|---|------|-------|------------------|-------|
| Setup | 10' | — | Install OpenCode, open `starter/`, pick a free model | — |
| 1 | 15' | Context window | Experiment: sessions, memory, tokens, `/compact`, `/init` | the app (no code) |
| 2 | 20' | Hooks & RAG | Catch the model hallucinating fleet data, then ground it with a rule and guard it with a plugin | `starter/AGENTS.md` + `starter/.opencode/plugins/guard.ts` |
| 3 | 20' | Function calling | Implement the two write tools so the model can repair bikes for real | `starter/.opencode/tools/fleet.ts` |
| 4 | 20' | Autonomous agent | Complete a custom agent that resolves all pending tickets by itself | `starter/.opencode/agents/fleet-manager.md` |
| Wrap-up | 5' | — | Recap and questions | — |

Work points are marked with `TODO (Module N)` comments — search for them
in your editor.

## The scenario

The database holds a fleet of **8 e-bikes** (5 ok, 2 broken, 1 in
maintenance) and **5 maintenance tickets** (3 open, 1 assigned, 1
closed). Your AI assistant must answer questions about the fleet with
**real data** (not invented numbers), perform real repairs through
**tools**, and finally run as an **autonomous agent** that clears the
ticket backlog on its own.

## Resetting the database

If your tests leave the DB in a mess, copy the pristine copy over it —
no Python needed. In Windows Explorer: copy `tools\database.pristine.sqlite`
and paste it over `starter\database.sqlite`. Or in PowerShell:

```powershell
Copy-Item tools\database.pristine.sqlite starter\database.sqlite -Force
Copy-Item tools\database.pristine.sqlite solution\database.sqlite -Force
```

If you have Python installed and want to regenerate the sample data
instead, `tools\seed_db.py` does that — on Windows use the `py` launcher
(`python` may not exist):

```powershell
py tools\seed_db.py starter\database.sqlite
```
