#!/usr/bin/env python3
"""Import the pre-fabricated DEMO sessions (demos/demo-sessions.json) into the
local OpenCode database. Python stdlib only; works on Windows (`py`) and
macOS/Linux (`python3`).

Usage (from the repo root):
    py tools\\import_demo_sessions.py                 (Windows)
    python3 tools/import_demo_sessions.py             (macOS / Linux)

Options:
    --db PATH    path to opencode.db
                 (default: %USERPROFILE%\\.local\\share\\opencode\\opencode.db on
                  Windows, ~/.local/share/opencode/opencode.db elsewhere)
    --repo PATH  repo root (default: parent of this script's tools/ folder)
    --json PATH  sessions dump (default: <repo>/demos/demo-sessions.json)

Behavior:
  * Locates (or creates) the OpenCode project whose worktree is this repo.
  * INSERT OR REPLACEs each demo session with directory pointed at the
    LOCAL path of the demo folder, plus its message/part/session_message/todo
    rows. Re-running just refreshes the demo sessions (idempotent).
  * Backs up opencode.db to opencode.db.bak before writing.
  * Only ever writes rows for the demo session ids found in the JSON.

IMPORTANT: close the OpenCode app/CLI before importing.
"""

import argparse
import json
import os
import secrets
import shutil
import sqlite3
import sys
import time

SESSION_TABLES = ["message", "part", "session_message", "todo"]


def default_db_path():
    if os.name == "nt":
        return os.path.join(os.environ.get("USERPROFILE", os.path.expanduser("~")),
                            ".local", "share", "opencode", "opencode.db")
    return os.path.expanduser(os.path.join("~", ".local", "share", "opencode", "opencode.db"))


def open_db(path):
    try:
        conn = sqlite3.connect(path, timeout=10)
        conn.execute("SELECT 1 FROM session LIMIT 1")
        return conn
    except sqlite3.OperationalError as e:
        if "locked" in str(e):
            sys.exit("error: database is locked — close the OpenCode app/CLI and retry.")
        raise


def ensure_project(conn, repo):
    """Return the project id for this repo's worktree, creating a minimal
    project row (fresh random 40-hex id) when missing."""
    row = conn.execute("SELECT id FROM project WHERE worktree = ?", (repo,)).fetchone()
    if row:
        return row[0], False

    # Mirror the columns of an existing project row as a template.
    template = conn.execute("SELECT * FROM project WHERE id != 'global' LIMIT 1").fetchone()
    cols = [d[1] for d in conn.execute("PRAGMA table_info(project)").fetchall()]
    now = int(time.time() * 1000)
    values = {c: None for c in cols}
    if template:
        values.update(dict(zip(cols, template)))
    values.update({
        "id": secrets.token_hex(20),
        "worktree": repo,
        "vcs": "git" if os.path.isdir(os.path.join(repo, ".git")) else None,
        "name": os.path.basename(repo),
        "time_created": now,
        "time_updated": now,
        "sandboxes": "[]",
    })
    conn.execute(
        "INSERT INTO project (%s) VALUES (%s)"
        % (", ".join(values.keys()), ", ".join("?" for _ in values)),
        list(values.values()),
    )
    return values["id"], True


def insert_or_replace(conn, table, row):
    cols = list(row.keys())
    conn.execute(
        "INSERT OR REPLACE INTO %s (%s) VALUES (%s)"
        % (table, ", ".join(cols), ", ".join("?" for _ in cols)),
        [row[c] for c in cols],
    )


def main():
    ap = argparse.ArgumentParser(description="Import DEMO sessions into the local OpenCode db")
    ap.add_argument("--db", default=default_db_path(), help="path to opencode.db")
    ap.add_argument("--repo", default=os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                    help="repo root (default: parent of tools/)")
    ap.add_argument("--json", default=None, help="sessions dump (default: <repo>/demos/demo-sessions.json)")
    args = ap.parse_args()

    repo = os.path.abspath(args.repo)
    json_path = args.json or os.path.join(repo, "demos", "demo-sessions.json")

    if not os.path.exists(args.db):
        sys.exit("error: OpenCode not found at %s\n"
                 "Open the OpenCode app once first, then re-run this script." % args.db)
    if not os.path.exists(json_path):
        sys.exit("error: %s not found — run this from the workshop repo checkout." % json_path)

    with open(json_path, "r", encoding="utf-8") as f:
        dump = json.load(f)

    # Backup before writing.
    backup = args.db + ".bak"
    try:
        shutil.copy2(args.db, backup)
    except sqlite3.OperationalError:
        sys.exit("error: database is locked — close the OpenCode app/CLI and retry.")
    print("backup written: %s" % backup)

    conn = open_db(args.db)
    try:
        project_id, created = ensure_project(conn, repo)
        print("project %s for worktree %s (%s)"
              % (project_id, repo, "created" if created else "found"))

        for entry in dump["sessions"]:
            session = dict(entry["session"])
            session["project_id"] = project_id
            # Point the session at the LOCAL demo folder, with the path
            # separators this OS produces (os.path.join / abspath).
            session["directory"] = os.path.abspath(os.path.join(repo, *entry["demo"].split("/")))
            sid = session["id"]
            insert_or_replace(conn, "session", session)
            counts = []
            for table in SESSION_TABLES:
                rows = entry.get(table) or []
                for row in rows:
                    insert_or_replace(conn, table, row)
                counts.append("%s=%d" % (table, len(rows)))
            print("installed %-8s %s  %s" % (sid[:12] + "…", session["title"], ", ".join(counts)))
        conn.commit()
    except sqlite3.OperationalError as e:
        conn.close()
        if "locked" in str(e):
            sys.exit("error: database is locked — close the OpenCode app/CLI and retry.")
        raise
    conn.close()
    print("done: %d demo session(s) installed." % len(dump["sessions"]))


if __name__ == "__main__":
    main()
