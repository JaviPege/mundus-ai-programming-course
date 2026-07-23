# Workshop Slides — AI E-Bike Fleet Manager

Guión slide a slide para la presentación del taller (90 minutos).
- **Contenido de las slides:** inglés (alumnos de Varna), telegráfico.
- **Notas del presentador (🎤):** español, qué contar, qué demo hacer y cuánto tiempo.
- Referencia de tiempos: Setup 10' · M1 Context 15' · M2 Grounding & hooks 20' · M3 Tools 20' · M4 Agent 20' · Cierre 5'.

Total: 26 slides (la última es el cierre). Ritmo medio: las de conceptos van rápido (30-60 s); las de módulo se proyectan mientras los alumnos trabajan en la app.

---

## PART 0 — OPENING (3 min)

### Slide 1 — Title

> # AI E-Bike Fleet Manager 🚲⚡
> ### A 90-minute hands-on AI workshop
> You will govern a real AI agent — inside the OpenCode app. No API keys. No billing.

🎤 **Notas:** Bienvenida. Presentarse en una frase. Mensaje clave: "no vengo a dar teoría; vais a gobernar un agente de IA real con código vuestro, dentro de la app OpenCode y con modelos gratis — sin cuentas, sin API keys, sin pagar nada". La app gestiona una flota de bicis eléctricas. Preguntar a mano alzada: ¿quién ha usado ChatGPT? ¿quién ha usado un agente de código?

---

### Slide 2 — The mission

> **Your mission today**
> - Fix an AI that forgets everything (context)
> - Stop it inventing data (grounding)
> - Give it hands — tools that change a real database
> - Turn it loose as an autonomous agent

🎤 **Notas:** Vender el arco narrativo: empiezan con un chat que olvida y alucina y acaban con un agente que resuelve tickets de mantenimiento solo. Todo ocurre dentro de OpenCode, pero lo que gobierna al modelo es código suyo: una regla, un plugin, dos tools y un agente. Cada fallo de la app es un concepto real de la ingeniería de LLMs.

---

### Slide 3 — Roadmap

> | Time | Phase | Concept |
> |------|-------|---------|
> | 10' | Setup | OpenCode app, free models |
> | 15' | Module 1 | Context window |
> | 20' | Module 2 | Grounding & hooks |
> | 20' | Module 3 | Custom tools |
> | 20' | Module 4 | Autonomous agent |
> | 5' | Wrap-up | The big picture |

🎤 **Notas:** Enseñar los tiempos y avisar: "los que terminéis antes, ayudáis al de al lado — enseñar es la mejor forma de aprender". No hace falta memorizar nada: el trabajo está marcado en el proyecto con comentarios `TODO (Module N)`.

---

## PART 1 — BASIC CONCEPTS (5 min)

### Slide 4 — What an LLM actually does

> **An LLM in one sentence:**
> Text in → probability machine → text out.
> - It does NOT "know" things — it predicts plausible text
> - It does NOT remember you — no memory of its own
> - It cannot DO anything — every action is code running for it

🎤 **Notas:** El concepto más importante del taller. El modelo es una función matemática gigante: `f(texto) → texto`. Cuando parezca que "recuerda", "consulta" o "actúa", en realidad es el software que lo rodea — hoy ese software es OpenCode más el código que ellos escribirán.

---

### Slide 5 — Tokens

> **Models don't read words — they read tokens**
> - 1 token ≈ 4 characters ≈ ¾ of a word
> - `"Battery not charging"` → ~5 tokens
> - Tokens are the "currency" of every model call
> - The context window has a token budget — watch the counter in the app

🎤 **Notas:** Enseñar el ejemplo troceando la frase en la pizarra si hace falta. Por qué importa: el modelo tiene un límite máximo de tokens por llamada y los tokens son la "moneda" de las APIs (los modelos gratis de hoy también tienen límite). En el Módulo 1 verán el contador de tokens de la app crecer en vivo.

---

### Slide 6 — Context window & statelessness

> **The context window = the model's entire world**
> - The ONLY thing the model sees is the text in the current session
> - Every call starts from ZERO — no memory between calls
> - "Memory" = the app resending the conversation every time

🎤 **Notas:** Hacer la analogía: es como hablar con alguien con amnesia total al que le pasas una transcripción escrita de toda la conversación en cada frase. Esto ES el Módulo 1 que experimentarán en 10 minutos. Que quede claro: la "memoria" del chat es software (la sesión), no magia.

---

### Slide 7 — Meet OpenCode

> **The app is the middleware between you and the model:**
> - Session → the context window (its "memory")
> - `AGENTS.md` → persistent project rules, read every session
> - Custom tools → function calling: real code the model can trigger
> - Agents → autonomous loops with a step budget
>
> **You don't just chat with it — you GOVERN it.**

🎤 **Notas:** El mapa del taller: cada fila es un módulo. OpenCode hace de middleware: empaqueta el contexto, ofrece las tools al modelo y ejecuta lo que el modelo pide. Ellos no van a programar un cliente desde cero; van a gobernar un agente profesional: reglas, guard, tools y agente autónomo.

---

## PART 2 — SETUP (10 min)

### Slide 8 — Install OpenCode

> 1. Go to **opencode.ai/download** → **OpenCode Desktop — Windows (x64)**
> 2. Install & launch
>
> **Free models included: NO account · NO API key · NO billing**
> First project open auto-installs plugin dependencies — internet needed ONCE

🎤 **Notas:** Primer checkpoint. Todos los equipos son Windows: descargar "OpenCode Desktop — Windows (x64)" desde opencode.ai/download. Tener los instaladores descargados de antemano (USB) por si el WiFi del aula va lento. Recalcar la ventaja frente a otros talleres: sin registro, sin tarjeta, sin keys — los modelos gratuitos vienen integrados. Avisar: al abrir el proyecto por primera vez, la app auto-instala las dependencias del plugin en `.opencode/` — necesita internet solo esa vez.

---

### Slide 9 — Get the code

> **Option A — Git for Windows** (PowerShell):
> ```powershell
> git clone <repo-url>
> cd C001
> ```
> **Option B — GitHub → Code → Download ZIP → extract**
> Then in OpenCode: **File → Open Folder… → `starter/`**
> - `starter/` → **your project** (with TODOs)
> - `solution/` → the teacher's copy. **Don't peek.** 🙈

🎤 **Notas:** Dos caminos, ambos Windows: `git clone` en PowerShell (Git for Windows) o el botón "Code → Download ZIP" de GitHub y descomprimir. Después, todos abren la carpeta `starter/` en la app (File → Open Folder). Paseo de 30 segundos por el árbol: `AGENTS.md` (las reglas), `.opencode/tools` (las tools), `.opencode/plugins` (el guard), `.opencode/agents` (el agente), `database.sqlite`. Advertencia simpática sobre `solution/`: mirarla es hacerse spoiler a uno mismo.

---

### Slide 10 — Pick a free model

> Model selector (bottom of the window) → **Big Pickle**
> - Other free options: `nemotron-3-ultra-free` · `deepseek-v4-flash-free`
> - First run needs internet ONCE (OpenCode auto-installs plugin deps)
> - `No provider available`? Wait ~30 s and retry (free-tier rate limit)

🎤 **Notas:** Enseñar el selector de modelos en la parte inferior. La primera ejecución descarga las dependencias del plugin en `.opencode/` — solo una vez y necesita red. Avisar del quirk verificado: los endpoints gratuitos hacen rate limit; si sale "No provider available", esperar medio minuto y reintentar, o cambiar a otro modelo gratis.

---

### Slide 11 — First chat

> New session → type:
> - `My name is <your name>. Remember it.`
> - `What is my name?`
>
> It knows… **for now.** 😏
>
> Guided tutorial: type **`/module-1`** — the AI becomes your step-by-step tutor (hints, not solutions).

🎤 **Notas:** Que jueguen 1-2 minutos. NO explicar todavía: en el Módulo 1 abrirán una sesión nueva y descubrirán la amnesia por sí mismos. Presentar el tutorial guiado: el proyecto trae 4 comandos (`/module-1` … `/module-4`); al escribirlos, la IA se convierte en su tutor paso a paso — da pistas, no soluciones, y nunca hace el trabajo por ellos. Checkpoint: todos han hablado con el modelo al menos una vez. Fin del Setup (~10').

---

## PART 3 — MODULE 1: CONTEXT WINDOW (15 min)

### Slide 12 — The goldfish demo

> Session 1: `My name is Alex` → `What is my name?` → ✅ it knows
> **NEW session:** `What is my name?` → 🤷 forgotten
> Back to session 1 → it remembers again
>
> **Sessions ARE the context window.**
>
> Guided tutorial: `/module-1`

🎤 **Notas:** Demo en vivo proyectada. Pregunta guía: "¿por qué la sesión nueva no sabe tu nombre?" Respuesta: el modelo nunca supo nada — cada llamada solo ve el texto de la sesión actual; la memoria era la sesión, no el modelo. Conectar con la slide 6. Que lo repitan en sus equipos (5 min). Recordar que, si se quedan atrás, pueden lanzar el tutor guiado con `/module-1`.

---

### Slide 13 — Watch the tokens + /compact

> - Every message makes the **token counter** grow — the app resends the whole session
> - The window has a budget → `/compact` summarizes the history so it fits
> - After `/compact`: the name survives, the token count drops

🎤 **Notas:** Señalar el contador de tokens creciendo con cada mensaje: es la prueba visible de que la app reenvía toda la conversación. Conectar con la slide 5 (presupuesto). Ejecutar `/compact`: la app resume el historial viejo para que quepa en la ventana — la técnica profesional de verdad. El nombre sobrevive al resumen.

---

### Slide 14 — /init → AGENTS.md

> `/init` generates **`AGENTS.md`** — project rules injected into EVERY session
> - Persistent memory that survives new sessions
> - `starter/AGENTS.md` already describes the fleet, the DB and the `fleet_*` tools
> - In Module 2 you will add a rule of your own

🎤 **Notas:** AGENTS.md es la memoria persistente del proyecto: cada sesión nueva la lee antes de empezar. Abrir `starter/AGENTS.md` y leerla con ellos: describe la flota, la base de datos SQLite y las cuatro tools. Ahí escribirán su regla de grounding en el Módulo 2 — es el mismo mecanismo que usa `/init`.

---

## PART 4 — MODULE 2: HOOKS & RAG (20 min)

### Slide 15 — The confident liar

> In an EMPTY window (no project), push it:
> ```
> You're my e-bike fleet manager with 8 bikes. Give me the morning
> status report: battery levels and which bikes are broken.
> Just give me the report, no questions.
> ```
> → A full report. Made up. Very confident. 😅
> Ask politely instead → it admits it has no data. **Hallucination.**
>
> Guided tutorial: `/module-2`

🎤 **Notas:** Demo en vivo FUERA del proyecto (ventana sin el proyecto abierto — dentro de `starter/` el modelo ve las tools y se porta demasiado bien). Verificado con Big Pickle: con el prompt insistente inventa un informe completo con IDs, baterías y averías; preguntado con educación, admite que no tiene datos. Ese contraste ES la lección: su trabajo es sonar plausible, no decir la verdad. Palabra del día: **hallucination**. Discusión de 1 minuto. Recordar que, si se quedan atrás, pueden lanzar el tutor guiado con `/module-2`.

---

### Slide 16 — Grounding: the fix is a rule

> Open `starter/` → `How is the fleet? Which bikes are broken?`
> → It calls `fleet_get_fleet_status` → real data: **#3, #7 broken · #5 maintenance**
> **TODO (Module 2)** in `starter/AGENTS.md`:
> ```
> GROUNDING RULE: ALWAYS call the fleet_* tools before answering
> fleet questions. NEVER invent or guess fleet numbers.
> ```

🎤 **Notas:** La diferencia no es un modelo más listo: es acceso a datos reales — esto es grounding (RAG en su versión mínima). Las tools de lectura ya vienen hechas; su trabajo es la regla en el marcador `TODO (Module 2)` de AGENTS.md. Test: NUEVA sesión (los cambios solo aplican a sesiones nuevas), preguntar por la flota → la respuesta debe citar #3, #7 y #5 reales. Si un modelo ignora la regla: ponerla primera, en mayúsculas y nombrando las tools.

---

### Slide 17 — Hooks: middleware around every action

> **A hook = code that intercepts a tool call BEFORE/AFTER it runs**
> ```
> user prompt → model → [ plugin hook ] → tool execution
> ```
> Your chance to inspect, allow… or **BLOCK**.

🎤 **Notas:** Concepto de hook/middleware: un punto de intercepción donde tu código puede inspeccionar y modificar lo que el modelo está a punto de hacer. Patrón general del software, no solo de IA. En OpenCode los plugins envuelven cada ejecución de tool; el hook `tool.execute.before` puede bloquear — y es determinista: no depende del humor del modelo.

---

### Slide 18 — The guard plugin

> `.opencode/plugins/guard.ts` — **TODO (Module 2)**
> ```ts
> "tool.execute.before": bash command contains
>   "rm -rf" or "drop table"  →  throw Error  →  BLOCKED
> ```
> Demo: `Run this exact shell command: rm -rf /tmp/whatever`
> → **Blocked by fleet guard** ✅

🎤 **Notas:** Implementación (~10 min): solo inspeccionar la tool `bash`, leer `output.args.command`, pasarlo a minúsculas y, si contiene algo de `BLOCKED`, lanzar el Error — el modelo ve el mensaje de bloqueo en vez del resultado. Test en vivo: pedirle que ejecute `rm -rf /tmp/whatever` y ver el bloqueo. Nueva sesión para recargar el plugin. Lección: el modelo a veces se niega por sí solo (con `drop table` suele hacerlo), pero el guard bloquea SIEMPRE — es la red de seguridad determinista.

---

## PART 5 — MODULE 3: CUSTOM TOOLS (20 min)

### Slide 19 — Talking ≠ doing

> Try: **"Bike #3 is repaired"**
> → The AI agrees… and the database doesn't change. 🤔
> **Text is not action.** It needs a WRITE tool.
>
> Guided tutorial: `/module-3`

🎤 **Notas:** Nueva limitación. El proyecto solo trae tools de lectura: por muy bien que hable, sin una tool de escritura no puede ejecutar el `UPDATE`. Pregunta puente: "¿cómo le daríamos manos de verdad?" La respuesta: custom tools propias. Recordar que, si se quedan atrás, pueden lanzar el tutor guiado con `/module-3`.

---

### Slide 20 — Custom tools anatomy

> `.opencode/tools/fleet.ts`
> ```ts
> export const mark_bike_fixed = tool({ description, args, execute })
> //  → tool name: fleet_mark_bike_fixed
> ```
> - `description` + Zod `args` schema = the contract the model sees
> - `execute()` = YOUR code, real SQLite (`bun:sqlite`)
> - **The model proposes; your code disposes.**

🎤 **Notas:** Anatomía de una tool: OpenCode carga cada archivo de `.opencode/tools/` y cada export se convierte en una tool llamada `<fichero>_<export>`. El modelo solo ve la descripción y el esquema de argumentos, y decide cuándo llamarla y con qué datos; quien ejecuta el SQL es NUESTRO código. Recordar la implicación de seguridad: nunca ejecutar a ciegas — de ahí el guard y los permisos ask/allow de la app.

---

### Slide 21 — Build it (Module 3)

> **TODO (Module 3)** in `fleet.ts`:
> 1. `assign_mechanic` → check the ticket, then `UPDATE tickets SET mechanic, status='assigned'`
> 2. `mark_bike_fixed` → `UPDATE bikes → 'ok'` + close its open/assigned tickets
>
> Test: `Bike #3 is repaired. Use the fleet tools.` → **check the DB**

🎤 **Notas:** Es la parte más "de verdad" del taller (~12-15 min). Las pistas están en los comentarios del stub: el `SELECT bike_id`, los dos `UPDATE` y el JSON de retorno. Recordatorios: abrir la BD con `openDb(context.directory)`, nueva sesión tras editar, y click en *allow* cuando la app pida permiso. Test verificado: bike #3 pasa a `ok` y los tickets #1 y #4 a `closed`.

---

## PART 6 — MODULE 4: AUTONOMOUS AGENT (20 min)

### Slide 22 — Chatbot vs agent

> **Chatbot:** you talk, it answers. **Agent:** you give a GOAL, it works.
> ```
> loop: observe → decide → act → repeat
>       (until done… or out of steps)
> ```
> Your only input: *"Resolve all pending maintenance tickets"*
>
> Guided tutorial: `/module-4`

🎤 **Notas:** El salto conceptual: el bucle deja de ser humano↔IA y pasa a ser IA↔tools. El modelo decide QUÉ tool usar en cada paso según el estado, y para cuando el objetivo está cumplido… o cuando se agota el presupuesto de pasos — el fusible contra bucles infinitos. Recordar que, si se quedan atrás, pueden lanzar el tutor guiado con `/module-4`.

---

### Slide 23 — Agent anatomy

> `.opencode/agents/fleet-manager.md` — **TODO (Module 4)**
> - `description` + `mode: primary` → shows up in the agent selector
> - `steps: 20` → the safety fuse
> - `tools:` → `fleet_*: true` · `write` / `edit` / `bash: false`
> - Body = the loop: **list → assign → fix → repeat → stop with a summary**

🎤 **Notas:** Recorrer el frontmatter YAML: `description` (una línea), `mode: primary` (si no, no aparece en el selector), `steps: 20` y el mapa de tools — aquí directamente deshabilitamos `write`/`edit`/`bash` (los permisos de OpenCode van ask/allow/deny; el agente solo necesita las `fleet_*`). El cuerpo es el system prompt: hay que decir EXPLÍCITAMENTE "vuelve al paso 1 hasta que no queden tickets" o el modelo declara victoria tras el primero. Nueva sesión tras editar.

---

### Slide 24 — Let it loose

> Agent selector → **fleet-manager** → send:
> `Resolve all pending maintenance tickets`
> Watch it: **list tickets → assign mechanic → fix bike → repeat ×3 → stops on its own** ✅
> Check the DB: all bikes `ok`, all tickets `closed`

🎤 **Notas:** Gran final: ejecutar el agente en pantalla grande (~5 min de run). Verificado: itera tres veces (elige un mecánico, p.ej. "Carlos") y se detiene solo con un resumen; incluso reporta que el ticket #4 se cerró automáticamente al arreglar la bici #3. Si para tras un solo ticket: el prompt del bucle es perezoso — buena lección. Si bajan `steps` y se trunca: lección sobre presupuestos de bucle.

---

## PART 7 — WRAP-UP (5 min)

### Slide 25 — Today you built

> **Memory** (sessions & AGENTS.md) · **Truth** (grounding) · **Hands** (custom tools) · **Autonomy** (agents)
>
> **That is 90% of modern AI engineering.**

🎤 **Notas:** Recap con la frase de cierre: los 4 conceptos de hoy son los mismos que usan ChatGPT, Copilot y cualquier agente serio. Ideas para casa: añadir una tool nueva (¿`order_parts`?), endurecer el guard con más patrones o probar otro modelo gratis. Q&A y despedida (5 min).

---

### Slide 26 — Closing

> # Now go build.
> Questions?
> Workshop materials: github repo · opencode.ai

🎤 **Notas:** Slide de cierre. Abrir turno de preguntas y recordar dónde están los materiales: el repo del taller y opencode.ai para seguir practicando en casa (gratis, sin cuenta).

---

## Apéndice — Notas logísticas para el instructor

- **Antes del taller (checklist del `docs/INSTRUCTOR_GUIDE.md`), por equipo Windows:**
  - Instalar OpenCode Desktop — Windows (x64) (opencode.ai/download) en TODOS los equipos de alumnos.
  - Abrir `solution/` una vez por equipo — la primera apertura auto-instala las dependencias del plugin en `.opencode/` (**necesita internet** solo esa vez).
  - Elegir Big Pickle y preguntar *"How is the fleet?"* para validar que un modelo gratis responde. Ejecutar el agente del Módulo 4 una vez y confirmar que todos los tickets quedan cerrados.
  - Resetear la BD antes de la sesión (sin Python): copiar `tools/database.pristine.sqlite` sobre `starter/database.sqlite`.
- **Quirks verificados de los modelos gratis:**
  - `No provider available` transitorio (rate limit del free tier; ~1 de cada 5 runs): esperar ~30 s y reintentar, o cambiar de modelo en el selector.
  - Fallbacks gratuitos que se comportan igual en las rutas de lectura: `nemotron-3-ultra-free` · `deepseek-v4-flash-free`.
  - Los modelos gratis se portan *demasiado* bien: dentro de `starter/` llaman a las tools de lectura incluso sin la regla — la demo de alucinación (slide 15) debe hacerse FUERA del proyecto.
  - Los modelos suelen rechazar `DROP TABLE` por sí solos: la demo del guard se hace con `rm -rf`, que sí intentan ejecutar.
  - Los prompts de permiso (ask/allow) son una feature: enseñar a dar *allow* a las `fleet_*`.
- **Reset entre grupos (ya NO hace falta Python):** copiar `tools/database.pristine.sqlite` sobre `starter/database.sqlite` — copiar-pegar en el Explorador de Windows o `Copy-Item tools\database.pristine.sqlite starter\database.sqlite -Force` en PowerShell. Python (`py tools\seed_db.py ...`) solo hace falta para REGENERAR los datos de ejemplo. Las sesiones se guardan globalmente en `%USERPROFILE%\.local\share\opencode` — no hace falta limpiarlas.
- **Tiempos de guarda:** las slides 4-6 (conceptos) se pueden comprimir a 3 min si el setup va lento; el Módulo 4 admite recorte a "ver la demo del instructor" si se acaba el tiempo.
