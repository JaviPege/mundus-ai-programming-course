// Fleet tools — custom OpenCode tools that read and write the local
// SQLite database (database.sqlite, in the project root).
//
// OpenCode loads every file in .opencode/tools/ automatically.
// Each named export becomes a tool named  <filename>_<exportname>,
// so these four exports become:
//   fleet_get_fleet_status, fleet_list_pending_tickets,
//   fleet_assign_mechanic, fleet_mark_bike_fixed
//
// The tools run inside OpenCode's Bun runtime, so we can use the
// built-in "bun:sqlite" module — no npm install needed.

import { tool } from "@opencode-ai/plugin";
import { Database } from "bun:sqlite";
// node:path works on every OS (Windows, macOS, Linux) and in OpenCode's
// Bun runtime — path.join() builds the correct separators automatically.
import path from "node:path";

// Every execute() opens the database on its own.
// context.directory is the folder where the OpenCode session runs
// (the project root), so the DB is always found no matter where
// the tool is called from.
function openDb(directory: string): Database {
  return new Database(path.join(directory, "database.sqlite"));
}

// ── READ tools (given ready-made — used in Module 2) ──────────────

export const get_fleet_status = tool({
  description: "Returns all bikes in the fleet with their battery level and status (ok / maintenance / broken).",
  args: {},
  async execute(args, context) {
    const db = openDb(context.directory);
    try {
      const rows = db
        .query("SELECT id, model, battery_pct, status FROM bikes ORDER BY id")
        .all();
      return JSON.stringify(rows);
    } finally {
      db.close();
    }
  },
});

export const list_pending_tickets = tool({
  description: "Returns the maintenance tickets that are still open or assigned (not yet closed).",
  args: {},
  async execute(args, context) {
    const db = openDb(context.directory);
    try {
      const rows = db
        .query(
          "SELECT id AS ticket_id, bike_id, description, mechanic, status " +
            "FROM tickets WHERE status IN ('open','assigned') ORDER BY id"
        )
        .all();
      return JSON.stringify(rows);
    } finally {
      db.close();
    }
  },
});

// ── WRITE tools (your job in Module 3) ────────────────────────────

export const assign_mechanic = tool({
  description: "Assigns a mechanic to a maintenance ticket and marks the ticket as 'assigned'.",
  args: {
    ticket_id: tool.schema.number().describe("ID of the ticket to assign"),
    mechanic: tool.schema.string().describe("Name of the mechanic"),
  },
  async execute(args, context) {
    // TODO (Module 3): implement this tool.
    // 1. Open the database with openDb(context.directory).
    // 2. Look up the ticket's bike_id:
    //      SELECT bike_id FROM tickets WHERE id = ?
    //    If there is no such ticket, return:
    //      JSON.stringify({ ok: false, error: "ticket not found" })
    // 3. Run the UPDATE:
    //      UPDATE tickets SET mechanic = ?, status = 'assigned' WHERE id = ?
    // 4. Return:
    //      JSON.stringify({ ok: true, ticket_id, bike_id, mechanic })
    throw new Error("TODO (Module 3): assign_mechanic is not implemented yet");
  },
});

export const mark_bike_fixed = tool({
  description: "Marks a bike as repaired (status 'ok') and closes all its open or assigned tickets.",
  args: {
    bike_id: tool.schema.number().describe("ID of the bike that has been repaired"),
  },
  async execute(args, context) {
    // TODO (Module 3): implement this tool.
    // 1. Open the database with openDb(context.directory).
    // 2. Run TWO UPDATEs:
    //      UPDATE bikes SET status = 'ok' WHERE id = ?
    //      UPDATE tickets SET status = 'closed'
    //        WHERE bike_id = ? AND status IN ('open','assigned')
    // 3. Return:
    //      JSON.stringify({ ok: true, bike_id, status: "ok" })
    throw new Error("TODO (Module 3): mark_bike_fixed is not implemented yet");
  },
});
