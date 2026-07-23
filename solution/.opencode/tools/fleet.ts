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

// ── WRITE tools (implemented in Module 3) ─────────────────────────

export const assign_mechanic = tool({
  description: "Assigns a mechanic to a maintenance ticket and marks the ticket as 'assigned'.",
  args: {
    ticket_id: tool.schema.number().describe("ID of the ticket to assign"),
    mechanic: tool.schema.string().describe("Name of the mechanic"),
  },
  async execute(args, context) {
    const db = openDb(context.directory);
    try {
      const ticket = db
        .query("SELECT bike_id FROM tickets WHERE id = ?")
        .get(args.ticket_id) as { bike_id: number } | null;
      if (!ticket) {
        return JSON.stringify({ ok: false, error: "ticket not found" });
      }
      db.query("UPDATE tickets SET mechanic = ?, status = 'assigned' WHERE id = ?").run(
        args.mechanic,
        args.ticket_id
      );
      return JSON.stringify({
        ok: true,
        ticket_id: args.ticket_id,
        bike_id: ticket.bike_id,
        mechanic: args.mechanic,
      });
    } finally {
      db.close();
    }
  },
});

export const mark_bike_fixed = tool({
  description: "Marks a bike as repaired (status 'ok') and closes all its open or assigned tickets.",
  args: {
    bike_id: tool.schema.number().describe("ID of the bike that has been repaired"),
  },
  async execute(args, context) {
    const db = openDb(context.directory);
    try {
      db.query("UPDATE bikes SET status = 'ok' WHERE id = ?").run(args.bike_id);
      db.query(
        "UPDATE tickets SET status = 'closed' WHERE bike_id = ? AND status IN ('open','assigned')"
      ).run(args.bike_id);
      return JSON.stringify({ ok: true, bike_id: args.bike_id, status: "ok" });
    } finally {
      db.close();
    }
  },
});
