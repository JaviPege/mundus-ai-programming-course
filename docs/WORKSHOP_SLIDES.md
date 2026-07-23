# Workshop Slides — AI E-Bike Fleet Manager

Guión slide a slide para la presentación del taller (90 minutos, MUY práctico).
- **Contenido de las slides:** inglés (alumnos de Varna), telegráfico.
- **Notas del presentador (🎤):** español, qué contar, coreografía exacta de las demos y tiempos.
- Referencia de tiempos: Setup 10' · How AI works 15' · M1-M4 15' cada uno · Cierre 5'.
- **Sin compilación en todo el taller:** los alumnos solo necesitan la app OpenCode funcionando.
- Las demos son PRE-FABRICADAS: cada módulo tiene un proyecto `demos/<carpeta>` con una sesión grabada `DEMO M…` (ver `demos/README.md`).

Total: 20 slides. Ritmo por módulo: mini-teoría → demo grabada proyectada → hands-on con el tutor (`/module-N`).

---

## PART 0 — OPENING (3 min)

### Slide 1 — Title

> # AI E-Bike Fleet Manager 🚲⚡
> ### A 90-minute hands-on AI workshop
> You will govern a real AI agent — inside the OpenCode app. No API keys. No billing.

🎤 **Notas:** Bienvenida. Presentarse en una frase. Mensaje clave: "no vengo a dar teoría; vais a gobernar un agente de IA real dentro de la app OpenCode, con modelos gratis — sin cuentas, sin keys, sin compilar nada". La app gestiona una flota de bicis eléctricas. Preguntar a mano alzada: ¿quién ha usado ChatGPT? ¿quién un agente de código?

---

### Slide 2 — How today works

> **How today works — the practical contract**
> - Short theory block (~2 min per concept)
> - I show you a **recorded demo** — real prompts, real outputs
> - **YOU do it** — an AI tutor guides you: `/module-1` … `/module-4`
> - No compiling, no SDKs — **one app is all you need**

🎤 **Notas:** Vender el formato: taller MUY práctico. Ritmo de cada módulo: (1) mini-teoría de 2 minutos, (2) yo proyecto una demo GRABADA — cero riesgo de que el modelo falle en vivo, (3) vosotros lo hacéis con un tutor IA (`/module-N`) que guía paso a paso con pistas, sin hacer el trabajo por vosotros. Recalcar: no vamos a compilar nada en 90 minutos; la app es la única herramienta.

---

### Slide 3 — Roadmap

> | Time | Phase | What happens |
> |------|-------|--------------|
> | 10' | Setup | Install & first chat |
> | 15' | How AI works | LLM, models, tokens, context, effort |
> | 15' | Module 1 | Context window |
> | 15' | Module 2 | Grounding & hooks |
> | 15' | Module 3 | Custom tools |
> | 15' | Module 4 | Autonomous agent |
> | 5' | Wrap-up | The big picture |

🎤 **Notas:** Enseñar los tiempos: 4 módulos de 15 minutos, cada uno con su concepto, su demo grabada y su hands-on con tutor. Avisar: "los que terminéis antes, ayudáis al de al lado — enseñar es la mejor forma de aprender".

---

## PART 1 — PRE-REQUISITES (10 min)

### Slide 4 — What to install… and what NOT

> **You need exactly TWO things:**
> 1. **OpenCode Desktop — Windows (x64)** → `opencode.ai/download`
> 2. **This repo** → `git clone <repo-url>` · or · GitHub → Code → Download ZIP
> Then: open `starter/` in OpenCode · pick a free model (**Big Pickle**)
>
> **NOT needed: NO compiler · NO SDK · NO Python · NO API key · NO account · NO billing**
> We will not compile any code — **the agent IS the only tool you need.**

🎤 **Notas:** Todos los equipos son Windows: "OpenCode Desktop — Windows (x64)" desde opencode.ai/download; tener los instaladores en USB por si el WiFi del aula va lento. El repo: `git clone` en PowerShell (Git for Windows) o el botón "Code → Download ZIP" y descomprimir. Leer la lista de NO en voz alta: no se compila nada en todo el taller — el agente es la única herramienta. Aviso: la primera apertura del proyecto auto-instala las dependencias del plugin (internet solo esa vez).

---

### Slide 5 — Check it works

> 1. Open `starter/` → new session → send `Hello` → it answers ✅
> 2. Stuck later? Type **`/module-1` … `/module-4`** — the AI tutors you step by step
> 3. The `demos/` folders = the instructor's recorded demos (not for you… yet)

🎤 **Notas:** Checkpoint: todo el mundo abre `starter/` (File → Open Folder), elige Big Pickle en el selector y recibe respuesta a un "Hello". Troubleshooting: la primera apertura auto-instala dependencias (internet una vez); si sale "No provider available" es rate limit del free tier — esperar ~30 s y reintentar, o cambiar a otro modelo gratis. Presentar los comandos tutor: guían paso a paso, dan pistas, no soluciones. Los `demos/` son solo del instructor. Fin del Setup (~10').

---

## PART 2 — HOW AN AI WORKS (15 min)

### Slide 6 — What an LLM actually does

> **An LLM in one sentence:**
> Text in → probability machine → text out.
> - It does NOT "know" things — it predicts plausible text
> - It does NOT remember you — no memory of its own
> - It cannot DO anything — every action is code running for it

🎤 **Notas:** El concepto más importante del taller (~2 min). El modelo es una función matemática gigante: `f(texto) → texto`. Cuando parezca que "recuerda", "consulta" o "actúa", en realidad es el software que lo rodea — hoy, OpenCode.

---

### Slide 7 — Models

> **Not all models are equal:**
> - Big ↔ small · fast ↔ smart · free ↔ paid
> - Today: FREE models inside OpenCode — **Big Pickle** & friends
> - Pick yours in the **model selector** (bottom of the window)

🎤 **Notas:** Los tres ejes sin entrar en benchmarks: tamaño, velocidad, coste — todo es un trade-off. Hoy usamos los modelos gratuitos integrados en OpenCode. Enseñar el selector en la parte inferior de la ventana. Fallbacks si uno falla: `nemotron-3-ultra-free` · `deepseek-v4-flash-free`. (~2 min)

---

### Slide 8 — Tokens

> **Models don't read words — they read tokens**
> - 1 token ≈ 4 characters ≈ ¾ of a word
> - Tokens = the "currency" of every model call
> - Every call bills input + output — **long conversations cost more**
> - `"Battery not charging"` → ~5 tokens

🎤 **Notas:** Trocear la frase de ejemplo en la pizarra si hace falta. Los tokens son la unidad de TODO: de lo que envías y de lo que recibes — por eso las conversaciones largas cuestan más y por eso existe el presupuesto de la ventana (siguiente slide) y el comando `/compact` (Módulo 1). (~2 min)

---

### Slide 9 — Context window & statelessness

> **The context window = the model's entire world**
> - The ONLY thing the model sees is the text in the current session
> - Every call starts from ZERO — no memory between calls
> - "Memory" = the app resending the conversation every time

🎤 **Notas:** La analogía de la amnesia: hablar con alguien a quien hay que pasarle la transcripción completa de la conversación en cada frase. Esto ES el Módulo 1 que experimentarán en media hora. La "memoria" del chat es software (la sesión), no magia. (~2 min)

---

### Slide 10 — Reasoning effort

> **Models can "think longer" before answering**
> - More effort → better reasoning… slower, more tokens
> - Less effort → fast and cheap… more mistakes
> - Crank it up for hard problems; keep it fast for chat

🎤 **Notas:** Analogía: pensar despacio antes de hablar vs responder de corrido. En la app se puede ajustar el nivel de esfuerzo de razonamiento; para el taller el nivel por defecto va sobrado — mencionarlo como herramienta cuando un modelo falle en una tarea retorcida (y recordar que más esfuerzo = más tokens = más coste). (~2 min)

---

## PART 3 — THE FOUR MODULES (4 × 15 min)

### Slide 11 — Module 1 · Context in practice

> - A **session** IS the context window — its "memory"
> - New session = **total amnesia**
> - `/compact` summarizes long history so it fits
> - **`AGENTS.md`** = the project's persistent memory (read every session)

🎤 **Notas:** Mapa del módulo (2 min, sin código): sesiones, `/compact`, `/init` → AGENTS.md. A continuación la demo grabada M1; después ellos hacen los experimentos con el tutor `/module-1` (nombre → nueva sesión → amnesia → volver → contador de tokens → /compact → /init).

---

### Slide 12 — Module 1 · DEMO: an agent with NOTHING

> Open `demos/m1-bare` → session **`DEMO M1 — No tools: the model invents the fleet report`**
> ```
> Give me the morning status report for the e-bike fleet: total bikes,
> broken bikes, and battery levels. Just give me the report, no questions.
> ```
> - Confident, detailed… and **100% invented** (200 bikes?! the real fleet has 8)
> - Ask the room: **"how would you know?"**
>
> Then YOU: **`/module-1`**

🎤 **Notas:** Coreografía: abrir la carpeta `demos/m1-bare` en OpenCode, abrir la sesión grabada `DEMO M1…` (instalada con `import_demo_sessions.py`). Recorrer prompt y salida: informe seguro de sí mismo — flota de 200 bicis, 10 averiadas, buckets de batería ordenados — TODO fabricado; la flota real tiene 8 bicis. Palabra del día: **hallucination**. Preguntar a la sala: "¿cómo sabríais que miente?". Después: `/module-1` (15').

---

### Slide 13 — Module 2 · Grounding & hooks

> - **Grounding:** give the model the FACTS — `AGENTS.md` rule + read tools = the simplest RAG
> - **Hooks:** middleware that intercepts tool calls BEFORE they run
> - Our guard **blocks dangerous commands — deterministically**

🎤 **Notas:** Las dos defensas contra lo visto en M1 (2 min): (1) grounding — una regla en AGENTS.md obliga a llamar a las tools de lectura antes de responder, RAG en su versión mínima; (2) un hook (`tool.execute.before`) que inspecciona cada llamada a tool y puede bloquearla — no depende del humor del modelo.

---

### Slide 14 — Module 2 · DEMO: same prompt, different output

> Open `demos/m2-grounded` → session **`DEMO M2 — Same prompt, grounded: real data via fleet tools`**
> - The SAME prompt → `fleet_get_fleet_status` → **real data: 8 bikes · #3, #7 broken · #5 maintenance**
> - Same prompt, different output — **grounding, not a smarter model**
> - LIVE: `run rm -rf /tmp/whatever` → the guard **blocks it** ✅
>
> Then YOU: **`/module-2`**

🎤 **Notas:** EL MONEY SHOT: abrir `demos/m2-grounded`, sesión `DEMO M2…` — es EXACTAMENTE la misma prompt que en M1, pero la salida cita la llamada a `fleet_get_fleet_status` y los datos reales (8 bicis, #3 y #7 averiadas, #5 en mantenimiento). Poner M1 y M2 una al lado de la otra. Después, demo EN VIVO del guard (es determinista): pedirle que ejecute `rm -rf /tmp/whatever` y ver el bloqueo del plugin. Ellos: `/module-2` (15').

---

### Slide 15 — Module 3 · Function calling

> - A **tool** = YOUR function, described to the model (name + Zod schema = the contract)
> - The model **PROPOSES** the call: `fleet_mark_bike_fixed {"bike_id": 3}`
> - YOUR code **executes** it — a real `UPDATE` via `node:sqlite`
>
> **The model proposes; your code disposes.**

🎤 **Notas:** Anatomía de una tool (2 min): `.opencode/tools/fleet.ts`; cada export se convierte en una tool `<fichero>_<export>`; el modelo ve la descripción y el esquema y decide cuándo llamarla y con qué argumentos; quien ejecuta el SQL es NUESTRO código. Seguridad: permisos ask/allow de la app + el guard del Módulo 2.

---

### Slide 16 — Module 3 · DEMO: a sentence writes to the DB

> Open `demos/m3-tools` → session **`DEMO M3 — Function calling: 'Bike #3 is repaired' writes to the DB`**
> ```
> Bike #3 is repaired.
> ```
> - One plain sentence → **`fleet_mark_bike_fixed {"bike_id": 3}`**
> - The DB actually changed: bike #3 → `ok`, its tickets → `closed`
>
> Then YOU: **`/module-3`**

🎤 **Notas:** Abrir `demos/m3-tools`, sesión `DEMO M3…`. Señalar: el modelo eligió la tool Y el argumento por sí solo; una frase en inglés se convirtió en un UPDATE real (la BD de la demo está reseteada a pristine — la sesión grabada es la prueba). Ellos implementan las dos tools de escritura con el tutor `/module-3` (15').

---

### Slide 17 — Module 4 · Agents

> - **Chatbot:** you talk, it answers. **Agent:** you give a GOAL, it works
> - The loop: **observe → decide → act → repeat**
> - `steps: 20` = the safety fuse · permissions: **ask / allow / deny**

🎤 **Notas:** El salto conceptual (2 min): el bucle deja de ser humano↔IA y pasa a ser IA↔tools. El agente `fleet-manager` tiene SOLO las tools `fleet_*` (sin bash/write/edit) y un tope de 20 pasos como fusible contra bucles infinitos. Los permisos de la app son la otra puerta de seguridad.

---

### Slide 18 — Module 4 · DEMO: let it loose

> Open `demos/m4-agent` → session **`DEMO M4 — Autonomous agent: resolves all tickets in a loop`**
> ```
> Resolve all pending maintenance tickets
> ```
> - The loop: **list → assign → fix ×3** (ticket #4 closes along the way)
> - It **STOPS BY ITSELF** when none remain ✅
>
> Then YOU: **`/module-4`**

🎤 **Notas:** Abrir `demos/m4-agent`, sesión `DEMO M4…`. Recorrer el bucle: `fleet_list_pending_tickets` → `fleet_assign_mechanic` → `fleet_mark_bike_fixed`, tres veces (tickets #1-#3; el #4 se cierra solo al arreglar la bici #3), y se DETIENE SOLO con un resumen. Mostrar después el archivo `.opencode/agents/fleet-manager.md`. Ellos completan el agente con `/module-4` (15').

---

## PART 4 — WRAP-UP (5 min)

### Slide 19 — Today you built

> **Memory** (context) · **Truth** (grounding) · **Hands** (tools) · **Autonomy** (agents)
>
> **That is 90% of modern AI engineering.**

🎤 **Notas:** Recap: los 4 conceptos de hoy son los mismos que usan ChatGPT, Copilot y cualquier agente serio. Ideas para casa: añadir una tool nueva (¿`order_parts`?), endurecer el guard con más patrones o probar otro modelo gratis. Q&A y despedida (5 min).

---

### Slide 20 — Closing

> # Now go build.
> Questions?
> Workshop materials: github repo · opencode.ai

🎤 **Notas:** Slide de cierre. Abrir turno de preguntas y recordar dónde están los materiales: el repo del taller y opencode.ai para seguir practicando en casa (gratis, sin cuenta).

---

## Apéndice — Notas logísticas para el instructor

- **Antes del taller (por equipo Windows, y en el equipo del instructor):**
  - Instalar OpenCode Desktop — Windows (x64) (opencode.ai/download) en TODOS los equipos de alumnos.
  - En el equipo del INSTRUCTOR: abrir la app una vez (crea su base de datos) y cerrarla por completo; ejecutar `py tools\import_demo_sessions.py` (idempotente, hace backup de `opencode.db`) y verificar que las 4 sesiones `DEMO M…` aparecen al abrir cada carpeta `demos/m*/`.
  - Abrir `solution/` una vez por equipo — la primera apertura auto-instala las dependencias del plugin en `.opencode/` (**necesita internet** solo esa vez).
  - Elegir Big Pickle y preguntar *"How is the fleet?"* para validar que un modelo gratis responde.
  - Resetear la BD antes de la sesión (sin Python): copiar `tools\database.pristine.sqlite` sobre `starter\database.sqlite`.
- **Demos pre-fabricadas:** coreografía completa en `demos/README.md` (cero riesgo de modelo en vivo). La única demo en vivo es el guard `rm -rf` (determinista). Si el import falla: prompts de respaldo en vivo en `demos/README.md` ("If the import fails").
- **Reset entre grupos (sin Python):** copiar `tools\database.pristine.sqlite` sobre `starter\database.sqlite` — Explorador de Windows o `Copy-Item tools\database.pristine.sqlite starter\database.sqlite -Force`. Las sesiones viven en `%USERPROFILE%\.local\share\opencode` — no hace falta limpiarlas. Python (`py tools\seed_db.py …`) solo para REGENERAR datos de ejemplo.
- **Quirks verificados de los modelos gratis:**
  - `No provider available` transitorio (rate limit; ~1 de cada 5 runs): esperar ~30 s y reintentar, o cambiar de modelo en el selector.
  - Fallbacks gratuitos: `nemotron-3-ultra-free` · `deepseek-v4-flash-free`.
  - Los modelos suelen rechazar `DROP TABLE` por sí solos: la demo del guard se hace con `rm -rf`, que sí intentan ejecutar.
  - Los prompts de permiso (ask/allow) son una feature: enseñar a dar *allow* a las `fleet_*`.
- **Tiempos de guarda:** las slides 7-10 (models/tokens/context/effort) se pueden comprimir a 7 min si el setup va lento; el Módulo 4 admite recorte a "ver la demo del instructor" si se acaba el tiempo.
