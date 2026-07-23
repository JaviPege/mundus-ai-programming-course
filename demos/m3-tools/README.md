# DEMO M3 — Function calling: a sentence writes to the database

**What it shows:** one plain-English sentence becomes a WRITE tool call.
The project has the `fleet_*` tools but no grounding rule and no plugin.

**Prompt:** `Bike #3 is repaired.`

**Point out in the output:** the model maps the sentence to
`fleet_mark_bike_fixed {"bike_id": 3}` — one call that sets bike #3 to `ok`
AND closes its tickets. If you want, show `database.sqlite` before/after in a
DB viewer (the copy here is reset to pristine; the recorded session is the
proof). Emphasize: the model chose the tool and the argument by itself.
