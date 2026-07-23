#!/usr/bin/env python3
"""Export the pre-fabricated DEMO sessions from the local OpenCode database
into demos/demo-sessions.json (portable, repo-relative, stdlib only).

Usage (from the repo root):
    python3 tools/export_demo_sessions.py            # uses default db + repo
    python3 tools/export_demo_sessions.py --db PATH --repo PATH

What it does:
  * Finds every session whose title starts with "DEMO M" and whose
    directory is one of the four demo folders (demos/m1-bare, ...).
  * Dumps the session row plus all dependent rows (message, part,
    session_message, todo) for those session ids only.
  * Stores the demo folder path REPO-RELATIVE (e.g. "demos/m1-bare")
    and drops project_id (re-resolved at import time).

It never touches any other session.
"""

import argparse
import json
import os
import sqlite3
import sys
import time

DEMO_DIRS = ["demos/m1-bare", "demos/m2-grounded", "demos/m3-tools", "demos/m4-agent"]
TITLE_PREFIX = "DEMO M"
# Tables dumped per session, with the column that scopes rows to a session.
SESSION_TABLES = ["message", "part", "session_message", "todo"]


def default_db_path():
    if os.name == "nt":
        return os.path.join(os.environ.get("USERPROFILE", os.path.expanduser("~")),
                            ".local", "share", "opencode", "opencode.db")
    return os.path.expanduser(os.path.join("~", ".local", "share", "opencode", "opencode.db"))


def rows_as_dicts(conn, sql, params=()):
    conn.row_factory = sqlite3.Row
    cur = conn.execute(sql, params)
    return [dict(r) for r in cur.fetchall()]


def main():
    ap = argparse.ArgumentParser(description="Export DEMO sessions to demos/demo-sessions.json")
    ap.add_argument("--db", default=default_db_path(), help="path to opencode.db")
    ap.add_argument("--repo", default=os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                    help="repo root (default: parent of tools/)")
    ap.add_argument("--out", default=None, help="output JSON (default: <repo>/demos/demo-sessions.json)")
    args = ap.parse_args()

    repo = os.path.abspath(args.repo)
    out = args.out or os.path.join(repo, "demos", "demo-sessions.json")

    if not os.path.exists(args.db):
        sys.exit("error: opencode.db not found at %s" % args.db)

    conn = sqlite3.connect(args.db)
    demo_abs = {d: os.path.join(repo, *d.split("/")) for d in DEMO_DIRS}

    sessions = []
    for rel, absdir in demo_abs.items():
        found = rows_as_dicts(
            conn,
            "SELECT * FROM session WHERE directory = ? AND title LIKE ? ORDER BY time_created",
            (absdir, TITLE_PREFIX + "%"),
        )
        for s in found:
            sessions.append((rel, s))

    if not sessions:
        sys.exit("error: no sessions titled '%s...' found in the demo folders" % TITLE_PREFIX)

    dump = {
        "version": 1,
        "generated_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "source_db": os.path.basename(args.db),
        "sessions": [],
    }

    for rel, s in sessions:
        sid = s["id"]
        entry = {"demo": rel, "session": s}
        entry["session"]["directory"] = rel      # repo-relative, portable
        entry["session"]["project_id"] = None    # resolved at import
        for table in SESSION_TABLES:
            entry[table] = rows_as_dicts(
                conn, "SELECT * FROM %s WHERE session_id = ? ORDER BY time_created, rowid" % table,
                (sid,),
            )
        dump["sessions"].append(entry)
        print("exported %-20s %s  (%d messages, %d parts)  %s"
              % (rel, sid, len(entry["message"]), len(entry["part"]), s["title"]))

    conn.close()

    with open(out, "w", encoding="utf-8") as f:
        json.dump(dump, f, ensure_ascii=False, indent=1)
    print("wrote %s (%d sessions, %d bytes)" % (out, len(dump["sessions"]), os.path.getsize(out)))


if __name__ == "__main__":
    main()
