"""Generates the workshop's SQLite database with sample data.

Usage:  python3 tools/seed_db.py [path]   (default ./database.sqlite)

Deletes the file if it already exists and recreates it from scratch.
"""

import os
import sqlite3
import sys

SCHEMA = """
CREATE TABLE bikes (
  id INTEGER PRIMARY KEY,
  model TEXT NOT NULL,
  battery_pct INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('ok','maintenance','broken'))
);
CREATE TABLE tickets (
  id INTEGER PRIMARY KEY,
  bike_id INTEGER NOT NULL REFERENCES bikes(id),
  description TEXT NOT NULL,
  mechanic TEXT,
  status TEXT NOT NULL CHECK (status IN ('open','assigned','closed'))
);
"""

BIKES = [
    (1, "VoltRunner X2", 87, "ok"),
    (2, "EcoZip 500", 62, "ok"),
    (3, "ThunderPedal Pro", 45, "broken"),
    (4, "CityGlide S", 91, "ok"),
    (5, "MountainVolt 8", 33, "maintenance"),
    (6, "SparkCruiser", 78, "ok"),
    (7, "TurboChain Z", 12, "broken"),
    (8, "LunaRide Mini", 55, "ok"),
]

TICKETS = [
    (1, 3, "Front brake not responding", None, "open"),
    (2, 7, "Battery not charging", None, "open"),
    (3, 5, "Loose chain", None, "open"),
    (4, 3, "Motor noise when accelerating", "Luis", "assigned"),
    (5, 2, "Rear brake pad replacement", "Ana", "closed"),
]


def create_db(path):
    if os.path.exists(path):
        os.remove(path)
    conn = sqlite3.connect(path)
    try:
        cur = conn.cursor()
        cur.executescript(SCHEMA)
        cur.executemany(
            "INSERT INTO bikes (id, model, battery_pct, status) VALUES (?,?,?,?)", BIKES
        )
        cur.executemany(
            "INSERT INTO tickets (id, bike_id, description, mechanic, status) "
            "VALUES (?,?,?,?,?)",
            TICKETS,
        )
        conn.commit()
    finally:
        conn.close()

    print(f"Database created at: {path}")
    print(f"  - {len(BIKES)} bikes "
          f"({sum(1 for b in BIKES if b[3] == 'ok')} ok, "
          f"{sum(1 for b in BIKES if b[3] == 'broken')} broken, "
          f"{sum(1 for b in BIKES if b[3] == 'maintenance')} in maintenance)")
    print(f"  - {len(TICKETS)} tickets "
          f"({sum(1 for t in TICKETS if t[4] == 'open')} open, "
          f"{sum(1 for t in TICKETS if t[4] == 'assigned')} assigned, "
          f"{sum(1 for t in TICKETS if t[4] == 'closed')} closed)")


if __name__ == "__main__":
    create_db(sys.argv[1] if len(sys.argv) > 1 else "./database.sqlite")
