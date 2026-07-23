/**
 * Generates: AI-EBike-Fleet-Manager-Workshop.pptx (repo root)
 * Source script: docs/WORKSHOP_SLIDES.md (20 slides incl. closing)
 * Brand: xpegy-presentations skill (references/components.md + brand.md)
 * Fonts: Arial Black / Arial (universal compatibility — classroom Windows machines)
 *
 * NOTE: rich text is built ONLY with the para() helper (flat runs with
 * string `text` + breakLine). Never pass an array as a run's `text` value —
 * pptxgenjs renders it as "[object Object]".
 */

const path = require("path");
const pptxgen = require("pptxgenjs");

// ---------------------------------------------------------------------------
// Setup constants (verbatim from components.md, fonts swapped per brand.md
// universal-compatibility rule)
// ---------------------------------------------------------------------------

const X = {
  GREEN: "22C55E", GREEN_DARK: "16A34A", GREEN_DEEP: "15803D",
  GREEN_BG: "F0FDF4", GREEN_SOFT: "DCFCE7",
  DARK_TEXT: "292B2D",
  BLACK: "111827", GRAY_DARK: "1F2937", GRAY: "4B5563",
  GRAY_LIGHT: "9CA3AF", GRAY_BG: "F9FAFB", WHITE: "FFFFFF",
  DARK: "0F172A", DARK_ALT: "1E293B"
};

const FONT = {
  TITLE: "Arial Black",  // Universal-compatibility fallback (brand.md)
  BODY: "Arial",         // Universal-compatibility fallback (brand.md)
  LOGO: "Arial Bold",    // xPegy logo only
  MONO: "Courier New"    // Code boxes
};

// ---------------------------------------------------------------------------
// Presentation Setup
// ---------------------------------------------------------------------------

const pptx = new pptxgen();
pptx.layout = "LAYOUT_WIDE"; // 13.33 x 7.5 inches
pptx.author = "xPegy";
pptx.company = "xPegy";
pptx.title = "AI E-Bike Fleet Manager — Workshop";

// ---------------------------------------------------------------------------
// Slide Masters (verbatim from components.md)
// ---------------------------------------------------------------------------

// Dark masters: TITLE_SLIDE + CLOSING
["TITLE_SLIDE", "CLOSING"].forEach(title => pptx.defineSlideMaster({
  title,
  background: { color: X.DARK },
  objects: [
    { rect: { x: 0, y: 7.0, w: 13.33, h: 0.12, fill: { color: X.GREEN } } }
  ]
}));

// Light masters: CONTENT + TWO_COLUMN + CHART_SLIDE
["CONTENT", "TWO_COLUMN", "CHART_SLIDE"].forEach(title => pptx.defineSlideMaster({
  title,
  background: { color: X.WHITE },
  objects: [
    { rect: { x: 0, y: 0, w: 13.33, h: 0.05, fill: { color: X.GREEN } } },
    { rect: { x: 0.5, y: 7.0, w: 12.33, h: 0.005, fill: { color: X.GRAY_LIGHT } } },
    { text: { text: "Confidencial", options: { x: 0.5, y: 7.05, w: 3.0, h: 0.3, fontSize: 8, fontFace: FONT.BODY, color: X.GRAY_LIGHT } } }
  ],
  slideNumber: { x: 6.3, y: 7.05, w: 0.8, h: 0.3, fontSize: 8, color: X.GRAY_LIGHT }
}));

// SECTION_DIVIDER
pptx.defineSlideMaster({
  title: "SECTION_DIVIDER",
  background: { color: X.DARK_ALT },
  objects: [
    { rect: { x: 0, y: 0, w: 0.08, h: 7.5, fill: { color: X.GREEN } } }
  ]
});

// BLANK
pptx.defineSlideMaster({
  title: "BLANK",
  background: { color: X.WHITE },
  objects: []
});

// ---------------------------------------------------------------------------
// Logo & Brand Helpers (verbatim from components.md)
// ---------------------------------------------------------------------------

// Logo — call on EVERY slide (not in masters!)
// opts: boolean (dark) or object { dark, large }
function addLogo(slide, opts = {}) {
  const { dark = false, large = false } = typeof opts === 'boolean' ? { dark: opts } : opts;
  const textColor = dark ? X.WHITE : X.BLACK;
  const sz = large ? 33 : 9;
  const pos = large
    ? { x: 11.0, y: 0.5, w: 2.0, h: 0.6, align: "right" }
    : { x: 12.3, y: dark ? 6.55 : 7.05, w: 0.9, h: 0.3, align: "right" };
  slide.addText([
    { text: "x", options: { bold: true, color: textColor, fontSize: sz, fontFace: FONT.LOGO } },
    { text: "P", options: { bold: true, color: X.GREEN, fontSize: sz, fontFace: FONT.LOGO } },
    { text: "egy", options: { bold: true, color: textColor, fontSize: sz, fontFace: FONT.LOGO } }
  ], pos);
}

// Returns text runs for inline "xPegy" with P in green
function xpegyRuns(opts = {}) {
  const { fontSize = 14, fontFace = FONT.BODY, color = X.BLACK, bold = false } = opts;
  return [
    { text: "x", options: { fontSize, fontFace, color, bold } },
    { text: "P", options: { fontSize, fontFace, color: X.GREEN, bold } },
    { text: "egy", options: { fontSize, fontFace, color, bold } }
  ];
}

// Shared title bar for content slides
function slideTitle(slide, title) {
  slide.addText(title, {
    x: 0.5, y: 0.3, w: 12.33, h: 0.7,
    fontSize: 33, fontFace: FONT.BODY,
    color: X.BLACK, align: "left"
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.5, y: 1.0, w: 1.5, h: 0.04,
    fill: { color: X.GREEN }
  });
}

// ---------------------------------------------------------------------------
// Slide helpers used in this deck (verbatim from components.md)
// ---------------------------------------------------------------------------

function addTitleSlide(pptx, { title, subtitle, date, client }) {
  const slide = pptx.addSlide({ masterName: "TITLE_SLIDE" });
  addLogo(slide, { dark: true, large: true });  // Large logo top-right
  addLogo(slide, { dark: true });                // Small logo bottom-right

  slide.addText(title, {
    x: 0.9, y: 4.0, w: 11.5, h: 0.8,
    fontSize: 50, fontFace: FONT.BODY,
    color: X.WHITE, align: "left"
  });

  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.9, y: 4.8, w: 11.5, h: 0.7,
      fontSize: 42, fontFace: FONT.TITLE,
      color: X.GREEN, align: "left"
    });
  }

  if (client) {
    slide.addText(client, {
      x: 0.9, y: 5.5, w: 8.0, h: 0.4,
      fontSize: 14, fontFace: FONT.BODY,
      color: X.WHITE, align: "left"
    });
  }

  if (date) {
    slide.addText(date, {
      x: 9.0, y: 6.4, w: 4.0, h: 0.3,
      fontSize: 12, fontFace: FONT.TITLE,
      color: X.WHITE, align: "right"
    });
  }

  return slide;
}

function addTableSlide(pptx, { title, headers, rows, colW, note }) {
  const slide = pptx.addSlide({ masterName: "CONTENT" });
  addLogo(slide);
  slideTitle(slide, title);

  const cellBorder = [
    { type: "solid", pt: 0.5, color: X.GRAY_LIGHT },
    { type: "solid", pt: 0.5, color: X.GRAY_LIGHT },
    { type: "solid", pt: 0.5, color: X.GRAY_LIGHT },
    { type: "solid", pt: 0.5, color: X.GRAY_LIGHT }
  ];
  const cellMargin = [5, 8, 5, 8];

  const tableRows = [];

  tableRows.push(headers.map(h => ({
    text: h,
    options: {
      bold: true, color: X.WHITE, fontSize: 14, fontFace: FONT.BODY,
      fill: { color: X.GREEN_DARK },
      border: cellBorder,
      margin: cellMargin
    }
  })));

  rows.forEach((row, rowIndex) => {
    const bgColor = rowIndex % 2 === 0 ? X.WHITE : X.GRAY_BG;
    tableRows.push(row.map((cell, colIndex) => {
      if (typeof cell === "object" && cell.text) {
        return {
          text: cell.text,
          options: {
            ...cell.options,
            fontSize: cell.options?.fontSize || 12,
            fontFace: FONT.BODY,
            fill: { color: cell.options?.fill?.color || bgColor },
            border: cellBorder,
            margin: cellMargin
          }
        };
      }
      return {
        text: cell,
        options: {
          bold: colIndex === 0,
          color: colIndex === 0 ? X.GREEN_DARK : X.GRAY_DARK,
          fontSize: 12, fontFace: FONT.BODY,
          fill: { color: bgColor },
          border: cellBorder,
          margin: cellMargin
        }
      };
    }));
  });

  const tableColW = colW || Array(headers.length).fill(12.33 / headers.length);
  slide.addTable(tableRows, {
    x: 0.5, y: 1.3, w: 12.33,
    colW: tableColW,
    rowH: 0.4,
    autoPage: false
  });

  if (note) {
    const noteY = 1.3 + (rows.length + 1) * 0.4 + 0.2;
    slide.addText(note, {
      x: 0.5, y: Math.min(noteY, 6.2), w: 12.33, h: 0.5,
      fontSize: 14, fontFace: FONT.BODY, italic: true,
      color: X.GREEN_DARK, align: "left"
    });
  }

  return slide;
}

function addClosingSlide(pptx, { title, cta, contact }) {
  const slide = pptx.addSlide({ masterName: "CLOSING" });
  addLogo(slide, { dark: true });

  slide.addText(title || "¿Empezamos?", {
    x: 2.0, y: 2.5, w: 9.33, h: 1.5,
    fontSize: 44, fontFace: FONT.BODY,
    color: X.WHITE, align: "center", valign: "middle"
  });

  if (cta) {
    slide.addText(cta, {
      x: 2.0, y: 5.8, w: 9.33, h: 0.4,
      fontSize: 18, fontFace: FONT.BODY,
      color: X.GREEN, align: "center"
    });
  }

  if (contact) {
    const contactText = Array.isArray(contact) ? contact.join("  ·  ") : contact;
    slide.addText(contactText, {
      x: 2.0, y: 6.2, w: 9.33, h: 0.4,
      fontSize: 10, fontFace: FONT.BODY,
      color: X.GRAY_LIGHT, align: "center"
    });
  }

  return slide;
}

// ---------------------------------------------------------------------------
// Local helpers for this deck
// ---------------------------------------------------------------------------

// Base content slide: CONTENT master + logo + title bar
function contentSlide(title) {
  const slide = pptx.addSlide({ masterName: "CONTENT" });
  addLogo(slide);
  slideTitle(slide, title);
  return slide;
}

// Monospace code box: GRAY_BG rounded rect, Courier New
function codeBox(slide, code, { x = 0.5, y = 1.5, w = 12.33, h = 2.0, fontSize = 12, pad = 0.25 } = {}) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x, y, w, h,
    fill: { color: X.GRAY_BG },
    line: { color: X.GRAY_LIGHT, width: 0.5 },
    rectRadius: 0.1
  });
  slide.addText(code, {
    x: x + pad, y: y + 0.1, w: w - pad * 2, h: h - 0.2,
    fontSize, fontFace: FONT.MONO,
    color: X.GRAY_DARK, align: "left", valign: "middle",
    lineSpacingMultiple: 1.15
  });
}

// Standard bullet paragraph options
function bulletOpts(extra = {}) {
  return {
    fontSize: 14, fontFace: FONT.BODY, color: X.GRAY_DARK,
    bullet: { code: "2022", color: X.GREEN },
    paraSpaceAfter: 8, ...extra
  };
}

// Paragraph builder: takes an array of runs ({text, options}) plus shared
// paragraph options, returns a flat run array with breakLine on the last run.
// pptxgenjs does NOT accept arrays as a run's `text` value — use this helper
// and spread the result into slide.addText([...], pos).
function para(runs, opts = {}) {
  const merged = runs.map(r => ({ text: r.text, options: { ...opts, ...(r.options || {}) } }));
  merged[merged.length - 1].options.breakLine = true;
  return merged;
}

// Consistent look for the recorded-demo slides:
// header "Open <folder> → session <DEMO M…>", optional prompt code box,
// "point out" bullets, and the "Then YOU: /module-N" handoff line.
function addDemoSlide({ title, folder, session, prompt, promptH = 1.4, points, thenYou }) {
  const slide = contentSlide(title);

  // Folder + session header
  slide.addText([
    { text: "Open ", options: { fontSize: 14, fontFace: FONT.BODY, color: X.GRAY_DARK } },
    { text: folder, options: { fontSize: 14, fontFace: FONT.MONO, bold: true, color: X.BLACK } },
    { text: "  →  session  ", options: { fontSize: 14, fontFace: FONT.BODY, color: X.GRAY_DARK } },
    { text: session, options: { fontSize: 14, fontFace: FONT.BODY, bold: true, color: X.GREEN_DARK } }
  ], { x: 0.5, y: 1.3, w: 12.33, h: 0.8, valign: "top" });

  // Prompt code box (optional — M2 reuses the M1 prompt)
  let pointsY = 2.3;
  if (prompt) {
    codeBox(slide, prompt, { x: 0.5, y: 2.1, w: 12.33, h: promptH, fontSize: 13 });
    pointsY = 2.1 + promptH + 0.25;
  }

  // What to point out
  slide.addText(points, { x: 0.5, y: pointsY, w: 12.33, h: 6.1 - pointsY, valign: "top", lineSpacingMultiple: 1.35 });

  // Handoff line
  slide.addText([
    { text: "Then YOU:  ", options: { fontSize: 16, fontFace: FONT.BODY, bold: true, color: X.BLACK } },
    { text: thenYou, options: { fontSize: 16, fontFace: FONT.MONO, bold: true, color: X.GREEN_DARK } }
  ], { x: 0.5, y: 6.3, w: 12.33, h: 0.5 });

  return slide;
}

// ---------------------------------------------------------------------------
// Slides — content from docs/WORKSHOP_SLIDES.md (English on slides,
// Spanish 🎤 notes via slide.addNotes)
// ---------------------------------------------------------------------------

// --- Slide 1 — Title ---
{
  const slide = addTitleSlide(pptx, {
    title: "AI E-Bike Fleet Manager",
    subtitle: "A 90-minute hands-on AI workshop",
    client: "Naiden Gerov Secondary School · Varna",
    date: "90 minutes · Hands-on"
  });
  slide.addNotes("Bienvenida. Presentarse en una frase. Mensaje clave: \"no vengo a dar teoría; vais a gobernar un agente de IA real dentro de la app OpenCode, con modelos gratis — sin cuentas, sin keys, sin compilar nada\". La app gestiona una flota de bicis eléctricas. Preguntar a mano alzada: ¿quién ha usado ChatGPT? ¿quién un agente de código?");
}

// --- Slide 2 — How today works ---
{
  const slide = contentSlide("How today works");
  slide.addText("The practical contract", {
    x: 0.5, y: 1.4, w: 12.33, h: 0.5,
    fontSize: 18, fontFace: FONT.BODY, bold: true, color: X.BLACK
  });
  const kw = { fontSize: 16, fontFace: FONT.BODY, bold: true, color: X.GREEN_DARK };
  const tx = { fontSize: 16, fontFace: FONT.BODY, color: X.GRAY_DARK };
  slide.addText([
    ...para([
      { text: "Short theory block", options: kw },
      { text: " (~2 min per concept)", options: tx }
    ], bulletOpts({ fontSize: 16 })),
    ...para([
      { text: "I show you a ", options: tx },
      { text: "recorded demo", options: kw },
      { text: " — real prompts, real outputs", options: tx }
    ], bulletOpts({ fontSize: 16 })),
    ...para([
      { text: "YOU do it", options: kw },
      { text: " — an AI tutor guides you: ", options: tx },
      { text: "/module-1 … /module-4", options: { fontSize: 16, fontFace: FONT.MONO, bold: true, color: X.GREEN_DARK } }
    ], bulletOpts({ fontSize: 16 })),
    ...para([
      { text: "No compiling, no SDKs — ", options: tx },
      { text: "one app is all you need", options: kw }
    ], bulletOpts({ fontSize: 16 }))
  ], { x: 0.5, y: 2.1, w: 12.33, h: 4.2, valign: "top", lineSpacingMultiple: 1.4 });
  slide.addNotes("Vender el formato: taller MUY práctico. Ritmo de cada módulo: (1) mini-teoría de 2 minutos, (2) yo proyecto una demo GRABADA — cero riesgo de que el modelo falle en vivo, (3) vosotros lo hacéis con un tutor IA (`/module-N`) que guía paso a paso con pistas, sin hacer el trabajo por vosotros. Recalcar: no vamos a compilar nada en 90 minutos; la app es la única herramienta.");
}

// --- Slide 3 — Roadmap (table) ---
{
  const slide = addTableSlide(pptx, {
    title: "Roadmap",
    headers: ["Time", "Phase", "What happens"],
    rows: [
      ["10'", "Setup", "Install & first chat"],
      ["15'", "How AI works", "LLM, models, tokens, context, effort"],
      ["15'", "Module 1", "Context window"],
      ["15'", "Module 2", "Grounding & hooks"],
      ["15'", "Module 3", "Custom tools"],
      ["15'", "Module 4", "Autonomous agent"],
      ["5'", "Wrap-up", "The big picture"]
    ],
    colW: [1.5, 3.2, 7.63]
  });
  slide.addNotes("Enseñar los tiempos: 4 módulos de 15 minutos, cada uno con su concepto, su demo grabada y su hands-on con tutor. Avisar: \"los que terminéis antes, ayudáis al de al lado — enseñar es la mejor forma de aprender\".");
}

// --- Slide 4 — What to install… and what NOT ---
{
  const slide = contentSlide("What to install… and what NOT");
  slide.addText([
    ...para([{ text: "You need exactly TWO things:", options: { fontSize: 17, fontFace: FONT.BODY, bold: true, color: X.BLACK } }], { paraSpaceAfter: 10 }),
    ...para([
      { text: "1.  ", options: { fontSize: 16, fontFace: FONT.BODY, bold: true, color: X.GREEN_DARK } },
      { text: "OpenCode Desktop — Windows (x64)", options: { fontSize: 16, fontFace: FONT.BODY, bold: true, color: X.BLACK } },
      { text: "  →  ", options: { fontSize: 16, fontFace: FONT.BODY, color: X.GRAY_DARK } },
      { text: "opencode.ai/download", options: { fontSize: 16, fontFace: FONT.MONO, color: X.GRAY_DARK } }
    ], { paraSpaceAfter: 8 }),
    ...para([
      { text: "2.  ", options: { fontSize: 16, fontFace: FONT.BODY, bold: true, color: X.GREEN_DARK } },
      { text: "This repo", options: { fontSize: 16, fontFace: FONT.BODY, bold: true, color: X.BLACK } },
      { text: "  →  ", options: { fontSize: 16, fontFace: FONT.BODY, color: X.GRAY_DARK } },
      { text: "git clone <repo-url>", options: { fontSize: 16, fontFace: FONT.MONO, color: X.GRAY_DARK } },
      { text: "  ·  or  ·  GitHub → Code → Download ZIP", options: { fontSize: 16, fontFace: FONT.BODY, color: X.GRAY_DARK } }
    ], { paraSpaceAfter: 8 }),
    ...para([
      { text: "Then: open ", options: { fontSize: 16, fontFace: FONT.BODY, color: X.GRAY_DARK } },
      { text: "starter/", options: { fontSize: 16, fontFace: FONT.MONO, color: X.GRAY_DARK } },
      { text: " in OpenCode · pick a free model (", options: { fontSize: 16, fontFace: FONT.BODY, color: X.GRAY_DARK } },
      { text: "Big Pickle", options: { fontSize: 16, fontFace: FONT.BODY, bold: true, color: X.GREEN_DARK } },
      { text: ")", options: { fontSize: 16, fontFace: FONT.BODY, color: X.GRAY_DARK } }
    ])
  ], { x: 0.5, y: 1.5, w: 12.33, h: 2.9, valign: "top", lineSpacingMultiple: 1.3 });
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.5, y: 4.5, w: 12.33, h: 1.0,
    fill: { color: X.GREEN_BG }, rectRadius: 0.12
  });
  slide.addText("NOT needed:  NO compiler · NO SDK · NO Python · NO API key · NO account · NO billing", {
    x: 0.7, y: 4.5, w: 11.93, h: 1.0,
    fontSize: 15, fontFace: FONT.BODY, bold: true,
    color: X.GREEN_DARK, align: "left", valign: "middle"
  });
  slide.addText("We will not compile any code — the agent IS the only tool you need.", {
    x: 0.5, y: 5.8, w: 12.33, h: 0.6,
    fontSize: 20, fontFace: FONT.BODY, bold: true, color: X.BLACK, align: "center"
  });
  slide.addNotes("Todos los equipos son Windows: \"OpenCode Desktop — Windows (x64)\" desde opencode.ai/download; tener los instaladores en USB por si el WiFi del aula va lento. El repo: `git clone` en PowerShell (Git for Windows) o el botón \"Code → Download ZIP\" y descomprimir. Leer la lista de NO en voz alta: no se compila nada en todo el taller — el agente es la única herramienta. Aviso: la primera apertura del proyecto auto-instala las dependencias del plugin (internet solo esa vez).");
}

// --- Slide 5 — Check it works ---
{
  const slide = contentSlide("Check it works");
  slide.addText([
    ...para([
      { text: "1.  Open ", options: { fontSize: 16, fontFace: FONT.BODY, color: X.GRAY_DARK } },
      { text: "starter/", options: { fontSize: 16, fontFace: FONT.MONO, color: X.GRAY_DARK } },
      { text: " → new session → send ", options: { fontSize: 16, fontFace: FONT.BODY, color: X.GRAY_DARK } },
      { text: "Hello", options: { fontSize: 16, fontFace: FONT.MONO, color: X.GRAY_DARK } },
      { text: " → it answers ✅", options: { fontSize: 16, fontFace: FONT.BODY, color: X.GRAY_DARK } }
    ], { paraSpaceAfter: 14 }),
    ...para([
      { text: "2.  Stuck later? Type ", options: { fontSize: 16, fontFace: FONT.BODY, color: X.GRAY_DARK } },
      { text: "/module-1 … /module-4", options: { fontSize: 16, fontFace: FONT.MONO, bold: true, color: X.GREEN_DARK } },
      { text: " — the AI tutors you step by step", options: { fontSize: 16, fontFace: FONT.BODY, color: X.GRAY_DARK } }
    ], { paraSpaceAfter: 14 }),
    ...para([
      { text: "3.  The ", options: { fontSize: 16, fontFace: FONT.BODY, color: X.GRAY_DARK } },
      { text: "demos/", options: { fontSize: 16, fontFace: FONT.MONO, color: X.GRAY_DARK } },
      { text: " folders = the instructor's recorded demos (not for you… yet)", options: { fontSize: 16, fontFace: FONT.BODY, color: X.GRAY_DARK } }
    ])
  ], { x: 0.5, y: 1.8, w: 12.33, h: 3.8, valign: "top", lineSpacingMultiple: 1.35 });
  slide.addNotes("Checkpoint: todo el mundo abre `starter/` (File → Open Folder), elige Big Pickle en el selector y recibe respuesta a un \"Hello\". Troubleshooting: la primera apertura auto-instala dependencias (internet una vez); si sale \"No provider available\" es rate limit del free tier — esperar ~30 s y reintentar, o cambiar a otro modelo gratis. Presentar los comandos tutor: guían paso a paso, dan pistas, no soluciones. Los `demos/` son solo del instructor. Fin del Setup (~10').");
}

// --- Slide 6 — What an LLM actually does ---
{
  const slide = contentSlide("What an LLM actually does");
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.5, y: 1.5, w: 12.33, h: 1.2,
    fill: { color: X.GREEN_BG }, rectRadius: 0.12
  });
  slide.addText("Text in → probability machine → text out.", {
    x: 0.5, y: 1.5, w: 12.33, h: 1.2,
    fontSize: 24, fontFace: FONT.BODY, bold: true,
    color: X.GREEN_DARK, align: "center", valign: "middle"
  });
  slide.addText([
    { text: "It does NOT \"know\" things — it predicts plausible text", options: bulletOpts() },
    { text: "It does NOT remember you — no memory of its own", options: bulletOpts() },
    { text: "It cannot DO anything — every action is code running for it", options: bulletOpts() }
  ], { x: 0.5, y: 3.1, w: 12.33, h: 3.4, valign: "top", lineSpacingMultiple: 1.3 });
  slide.addNotes("El concepto más importante del taller (~2 min). El modelo es una función matemática gigante: `f(texto) → texto`. Cuando parezca que \"recuerda\", \"consulta\" o \"actúa\", en realidad es el software que lo rodea — hoy, OpenCode.");
}

// --- Slide 7 — Models ---
{
  const slide = contentSlide("Models");
  slide.addText([
    ...para([{ text: "Not all models are equal:", options: { fontSize: 17, fontFace: FONT.BODY, bold: true, color: X.BLACK } }], { paraSpaceAfter: 12 }),
    ...para([{ text: "Big ↔ small · fast ↔ smart · free ↔ paid" }], bulletOpts({ fontSize: 16 })),
    ...para([
      { text: "Today: FREE models inside OpenCode — ", options: { fontSize: 16, fontFace: FONT.BODY, color: X.GRAY_DARK } },
      { text: "Big Pickle", options: { fontSize: 16, fontFace: FONT.BODY, bold: true, color: X.GREEN_DARK } },
      { text: " & friends", options: { fontSize: 16, fontFace: FONT.BODY, color: X.GRAY_DARK } }
    ], bulletOpts({ fontSize: 16 })),
    ...para([
      { text: "Pick yours in the ", options: { fontSize: 16, fontFace: FONT.BODY, color: X.GRAY_DARK } },
      { text: "model selector", options: { fontSize: 16, fontFace: FONT.BODY, bold: true, color: X.GREEN_DARK } },
      { text: " (bottom of the window)", options: { fontSize: 16, fontFace: FONT.BODY, color: X.GRAY_DARK } }
    ], bulletOpts({ fontSize: 16 }))
  ], { x: 0.5, y: 1.7, w: 12.33, h: 4.2, valign: "top", lineSpacingMultiple: 1.4 });
  slide.addNotes("Los tres ejes sin entrar en benchmarks: tamaño, velocidad, coste — todo es un trade-off. Hoy usamos los modelos gratuitos integrados en OpenCode. Enseñar el selector en la parte inferior de la ventana. Fallbacks si uno falla: `nemotron-3-ultra-free` · `deepseek-v4-flash-free`. (~2 min)");
}

// --- Slide 8 — Tokens ---
{
  const slide = contentSlide("Tokens");
  slide.addText([
    ...para([
      { text: "Models don't read words — they read ", options: { fontSize: 16, fontFace: FONT.BODY, color: X.GRAY_DARK } },
      { text: "tokens", options: { fontSize: 16, fontFace: FONT.BODY, bold: true, color: X.GREEN_DARK } }
    ], { paraSpaceAfter: 10 }),
    ...para([{ text: "1 token ≈ 4 characters ≈ ¾ of a word" }], bulletOpts({ fontSize: 16 })),
    ...para([{ text: "Tokens = the \"currency\" of every model call" }], bulletOpts({ fontSize: 16 })),
    ...para([{ text: "Every call bills input + output — long conversations cost more" }], bulletOpts({ fontSize: 16 }))
  ], { x: 0.5, y: 1.5, w: 12.33, h: 2.6, valign: "top", lineSpacingMultiple: 1.3 });
  codeBox(slide,
    "\"Battery not charging\"  →  ~5 tokens",
    { x: 0.5, y: 4.4, w: 12.33, h: 1.0, fontSize: 14 });
  slide.addNotes("Trocear la frase de ejemplo en la pizarra si hace falta. Los tokens son la unidad de TODO: de lo que envías y de lo que recibes — por eso las conversaciones largas cuestan más y por eso existe el presupuesto de la ventana (siguiente slide) y el comando `/compact` (Módulo 1). (~2 min)");
}

// --- Slide 9 — Context window & statelessness ---
{
  const slide = contentSlide("Context window & statelessness");
  slide.addText([
    ...para([
      { text: "The context window = ", options: { fontSize: 16, fontFace: FONT.BODY, color: X.GRAY_DARK } },
      { text: "the model's entire world", options: { fontSize: 16, fontFace: FONT.BODY, bold: true, color: X.GREEN_DARK } }
    ], { paraSpaceAfter: 12 }),
    ...para([{ text: "The ONLY thing the model sees is the text in the current session" }], bulletOpts({ fontSize: 16 })),
    ...para([{ text: "Every call starts from ZERO — no memory between calls" }], bulletOpts({ fontSize: 16 })),
    ...para([{ text: "\"Memory\" = the app resending the conversation every time" }], bulletOpts({ fontSize: 16 }))
  ], { x: 0.5, y: 1.7, w: 12.33, h: 4.6, valign: "top", lineSpacingMultiple: 1.4 });
  slide.addNotes("La analogía de la amnesia: hablar con alguien a quien hay que pasarle la transcripción completa de la conversación en cada frase. Esto ES el Módulo 1 que experimentarán en media hora. La \"memoria\" del chat es software (la sesión), no magia. (~2 min)");
}

// --- Slide 10 — Reasoning effort ---
{
  const slide = contentSlide("Reasoning effort");
  slide.addText([
    ...para([{ text: "Models can \"think longer\" before answering", options: { fontSize: 17, fontFace: FONT.BODY, bold: true, color: X.BLACK } }], { paraSpaceAfter: 12 }),
    ...para([
      { text: "More effort", options: { fontSize: 16, fontFace: FONT.BODY, bold: true, color: X.GREEN_DARK } },
      { text: " → better reasoning… slower, more tokens", options: { fontSize: 16, fontFace: FONT.BODY, color: X.GRAY_DARK } }
    ], bulletOpts({ fontSize: 16 })),
    ...para([
      { text: "Less effort", options: { fontSize: 16, fontFace: FONT.BODY, bold: true, color: X.GREEN_DARK } },
      { text: " → fast and cheap… more mistakes", options: { fontSize: 16, fontFace: FONT.BODY, color: X.GRAY_DARK } }
    ], bulletOpts({ fontSize: 16 })),
    ...para([{ text: "Crank it up for hard problems; keep it fast for chat" }], bulletOpts({ fontSize: 16 }))
  ], { x: 0.5, y: 1.7, w: 12.33, h: 4.2, valign: "top", lineSpacingMultiple: 1.4 });
  slide.addNotes("Analogía: pensar despacio antes de hablar vs responder de corrido. En la app se puede ajustar el nivel de esfuerzo de razonamiento; para el taller el nivel por defecto va sobrado — mencionarlo como herramienta cuando un modelo falle en una tarea retorcida (y recordar que más esfuerzo = más tokens = más coste). (~2 min)");
}

// --- Slide 11 — Module 1 · Context in practice ---
{
  const slide = contentSlide("Module 1 · Context in practice");
  slide.addText([
    ...para([
      { text: "A ", options: { fontSize: 16, fontFace: FONT.BODY, color: X.GRAY_DARK } },
      { text: "session", options: { fontSize: 16, fontFace: FONT.BODY, bold: true, color: X.GREEN_DARK } },
      { text: " IS the context window — its \"memory\"", options: { fontSize: 16, fontFace: FONT.BODY, color: X.GRAY_DARK } }
    ], bulletOpts({ fontSize: 16 })),
    ...para([
      { text: "New session = ", options: { fontSize: 16, fontFace: FONT.BODY, color: X.GRAY_DARK } },
      { text: "total amnesia", options: { fontSize: 16, fontFace: FONT.BODY, bold: true, color: X.GREEN_DARK } }
    ], bulletOpts({ fontSize: 16 })),
    ...para([
      { text: "/compact", options: { fontSize: 16, fontFace: FONT.MONO, bold: true, color: X.GREEN_DARK } },
      { text: " summarizes long history so it fits", options: { fontSize: 16, fontFace: FONT.BODY, color: X.GRAY_DARK } }
    ], bulletOpts({ fontSize: 16 })),
    ...para([
      { text: "AGENTS.md", options: { fontSize: 16, fontFace: FONT.MONO, bold: true, color: X.GREEN_DARK } },
      { text: " = the project's persistent memory (read every session)", options: { fontSize: 16, fontFace: FONT.BODY, color: X.GRAY_DARK } }
    ], bulletOpts({ fontSize: 16 }))
  ], { x: 0.5, y: 1.8, w: 12.33, h: 4.2, valign: "top", lineSpacingMultiple: 1.4 });
  slide.addNotes("Mapa del módulo (2 min, sin código): sesiones, `/compact`, `/init` → AGENTS.md. A continuación la demo grabada M1; después ellos hacen los experimentos con el tutor `/module-1` (nombre → nueva sesión → amnesia → volver → contador de tokens → /compact → /init).");
}

// --- Slide 12 — Module 1 · DEMO: an agent with NOTHING ---
{
  const slide = addDemoSlide({
    title: "Module 1 · DEMO: an agent with NOTHING",
    folder: "demos/m1-bare",
    session: "DEMO M1 — No tools: the model invents the fleet report",
    prompt: "Give me the morning status report for the e-bike fleet: total bikes,\nbroken bikes, and battery levels. Just give me the report, no questions.",
    promptH: 1.3,
    points: [
      ...para([
        { text: "Confident, detailed… and ", options: { fontSize: 15, fontFace: FONT.BODY, color: X.GRAY_DARK } },
        { text: "100% invented", options: { fontSize: 15, fontFace: FONT.BODY, bold: true, color: X.GREEN_DARK } },
        { text: " (200 bikes?! the real fleet has 8)", options: { fontSize: 15, fontFace: FONT.BODY, color: X.GRAY_DARK } }
      ], bulletOpts({ fontSize: 15 })),
      ...para([
        { text: "Ask the room: ", options: { fontSize: 15, fontFace: FONT.BODY, color: X.GRAY_DARK } },
        { text: "\"how would you know?\"", options: { fontSize: 15, fontFace: FONT.BODY, bold: true, color: X.BLACK } }
      ], bulletOpts({ fontSize: 15 }))
    ],
    thenYou: "/module-1"
  });
  slide.addNotes("Coreografía: abrir la carpeta `demos/m1-bare` en OpenCode, abrir la sesión grabada `DEMO M1…` (instalada con `import_demo_sessions.py`). Recorrer prompt y salida: informe seguro de sí mismo — flota de 200 bicis, 10 averiadas, buckets de batería ordenados — TODO fabricado; la flota real tiene 8 bicis. Palabra del día: **hallucination**. Preguntar a la sala: \"¿cómo sabríais que miente?\". Después: `/module-1` (15').");
}

// --- Slide 13 — Module 2 · Grounding & hooks ---
{
  const slide = contentSlide("Module 2 · Grounding & hooks");
  slide.addText([
    ...para([
      { text: "Grounding:", options: { fontSize: 16, fontFace: FONT.BODY, bold: true, color: X.GREEN_DARK } },
      { text: " give the model the FACTS — ", options: { fontSize: 16, fontFace: FONT.BODY, color: X.GRAY_DARK } },
      { text: "AGENTS.md", options: { fontSize: 16, fontFace: FONT.MONO, color: X.GRAY_DARK } },
      { text: " rule + read tools = the simplest RAG", options: { fontSize: 16, fontFace: FONT.BODY, color: X.GRAY_DARK } }
    ], bulletOpts({ fontSize: 16 })),
    ...para([
      { text: "Hooks:", options: { fontSize: 16, fontFace: FONT.BODY, bold: true, color: X.GREEN_DARK } },
      { text: " middleware that intercepts tool calls BEFORE they run", options: { fontSize: 16, fontFace: FONT.BODY, color: X.GRAY_DARK } }
    ], bulletOpts({ fontSize: 16 })),
    ...para([
      { text: "Our guard ", options: { fontSize: 16, fontFace: FONT.BODY, color: X.GRAY_DARK } },
      { text: "blocks dangerous commands — deterministically", options: { fontSize: 16, fontFace: FONT.BODY, bold: true, color: X.GREEN_DARK } }
    ], bulletOpts({ fontSize: 16 }))
  ], { x: 0.5, y: 1.8, w: 12.33, h: 4.2, valign: "top", lineSpacingMultiple: 1.4 });
  slide.addNotes("Las dos defensas contra lo visto en M1 (2 min): (1) grounding — una regla en AGENTS.md obliga a llamar a las tools de lectura antes de responder, RAG en su versión mínima; (2) un hook (`tool.execute.before`) que inspecciona cada llamada a tool y puede bloquearla — no depende del humor del modelo.");
}

// --- Slide 14 — Module 2 · DEMO: same prompt, different output ---
{
  const slide = addDemoSlide({
    title: "Module 2 · DEMO: same prompt, different output",
    folder: "demos/m2-grounded",
    session: "DEMO M2 — Same prompt, grounded: real data via fleet tools",
    prompt: null,
    points: [
      ...para([
        { text: "The SAME prompt as M1 → ", options: { fontSize: 15, fontFace: FONT.BODY, color: X.GRAY_DARK } },
        { text: "fleet_get_fleet_status", options: { fontSize: 15, fontFace: FONT.MONO, color: X.GRAY_DARK } },
        { text: " → ", options: { fontSize: 15, fontFace: FONT.BODY, color: X.GRAY_DARK } },
        { text: "real data: 8 bikes · #3, #7 broken · #5 maintenance", options: { fontSize: 15, fontFace: FONT.BODY, bold: true, color: X.GREEN_DARK } }
      ], bulletOpts({ fontSize: 15 })),
      ...para([
        { text: "Same prompt, different output — ", options: { fontSize: 15, fontFace: FONT.BODY, color: X.GRAY_DARK } },
        { text: "grounding, not a smarter model", options: { fontSize: 15, fontFace: FONT.BODY, bold: true, color: X.BLACK } }
      ], bulletOpts({ fontSize: 15 })),
      ...para([
        { text: "LIVE: ", options: { fontSize: 15, fontFace: FONT.BODY, bold: true, color: X.BLACK } },
        { text: "run rm -rf /tmp/whatever", options: { fontSize: 15, fontFace: FONT.MONO, color: X.GRAY_DARK } },
        { text: " → the guard ", options: { fontSize: 15, fontFace: FONT.BODY, color: X.GRAY_DARK } },
        { text: "blocks it", options: { fontSize: 15, fontFace: FONT.BODY, bold: true, color: X.GREEN_DARK } },
        { text: " ✅", options: { fontSize: 15, fontFace: FONT.BODY, color: X.GRAY_DARK } }
      ], bulletOpts({ fontSize: 15 }))
    ],
    thenYou: "/module-2"
  });
  slide.addNotes("EL MONEY SHOT: abrir `demos/m2-grounded`, sesión `DEMO M2…` — es EXACTAMENTE la misma prompt que en M1, pero la salida cita la llamada a `fleet_get_fleet_status` y los datos reales (8 bicis, #3 y #7 averiadas, #5 en mantenimiento). Poner M1 y M2 una al lado de la otra. Después, demo EN VIVO del guard (es determinista): pedirle que ejecute `rm -rf /tmp/whatever` y ver el bloqueo del plugin. Ellos: `/module-2` (15').");
}

// --- Slide 15 — Module 3 · Function calling ---
{
  const slide = contentSlide("Module 3 · Function calling");
  slide.addText([
    ...para([
      { text: "A ", options: { fontSize: 16, fontFace: FONT.BODY, color: X.GRAY_DARK } },
      { text: "tool", options: { fontSize: 16, fontFace: FONT.BODY, bold: true, color: X.GREEN_DARK } },
      { text: " = YOUR function, described to the model (name + Zod schema = the contract)", options: { fontSize: 16, fontFace: FONT.BODY, color: X.GRAY_DARK } }
    ], bulletOpts({ fontSize: 16 })),
    ...para([
      { text: "The model ", options: { fontSize: 16, fontFace: FONT.BODY, color: X.GRAY_DARK } },
      { text: "PROPOSES", options: { fontSize: 16, fontFace: FONT.BODY, bold: true, color: X.GREEN_DARK } },
      { text: " the call: ", options: { fontSize: 16, fontFace: FONT.BODY, color: X.GRAY_DARK } },
      { text: "fleet_mark_bike_fixed {\"bike_id\": 3}", options: { fontSize: 16, fontFace: FONT.MONO, color: X.GRAY_DARK } }
    ], bulletOpts({ fontSize: 16 })),
    ...para([
      { text: "YOUR code ", options: { fontSize: 16, fontFace: FONT.BODY, color: X.GRAY_DARK } },
      { text: "executes", options: { fontSize: 16, fontFace: FONT.BODY, bold: true, color: X.GREEN_DARK } },
      { text: " it — a real ", options: { fontSize: 16, fontFace: FONT.BODY, color: X.GRAY_DARK } },
      { text: "UPDATE", options: { fontSize: 16, fontFace: FONT.MONO, color: X.GRAY_DARK } },
      { text: " via ", options: { fontSize: 16, fontFace: FONT.BODY, color: X.GRAY_DARK } },
      { text: "bun:sqlite", options: { fontSize: 16, fontFace: FONT.MONO, color: X.GRAY_DARK } }
    ], bulletOpts({ fontSize: 16 })),
    ...para([{ text: "The model proposes; your code disposes.", options: { fontSize: 18, fontFace: FONT.BODY, bold: true, color: X.GREEN_DARK } }], { paraSpaceAfter: 0 })
  ], { x: 0.5, y: 1.8, w: 12.33, h: 4.2, valign: "top", lineSpacingMultiple: 1.4 });
  slide.addNotes("Anatomía de una tool (2 min): `.opencode/tools/fleet.ts`; cada export se convierte en una tool `<fichero>_<export>`; el modelo ve la descripción y el esquema y decide cuándo llamarla y con qué argumentos; quien ejecuta el SQL es NUESTRO código. Seguridad: permisos ask/allow de la app + el guard del Módulo 2.");
}

// --- Slide 16 — Module 3 · DEMO: a sentence writes to the DB ---
{
  const slide = addDemoSlide({
    title: "Module 3 · DEMO: a sentence writes to the DB",
    folder: "demos/m3-tools",
    session: "DEMO M3 — Function calling: 'Bike #3 is repaired' writes to the DB",
    prompt: "Bike #3 is repaired.",
    promptH: 0.9,
    points: [
      ...para([
        { text: "One plain sentence → ", options: { fontSize: 15, fontFace: FONT.BODY, color: X.GRAY_DARK } },
        { text: "fleet_mark_bike_fixed {\"bike_id\": 3}", options: { fontSize: 15, fontFace: FONT.MONO, bold: true, color: X.GREEN_DARK } }
      ], bulletOpts({ fontSize: 15 })),
      ...para([
        { text: "The DB actually changed: bike #3 → ", options: { fontSize: 15, fontFace: FONT.BODY, color: X.GRAY_DARK } },
        { text: "ok", options: { fontSize: 15, fontFace: FONT.MONO, color: X.GRAY_DARK } },
        { text: ", its tickets → ", options: { fontSize: 15, fontFace: FONT.BODY, color: X.GRAY_DARK } },
        { text: "closed", options: { fontSize: 15, fontFace: FONT.MONO, color: X.GRAY_DARK } }
      ], bulletOpts({ fontSize: 15 }))
    ],
    thenYou: "/module-3"
  });
  slide.addNotes("Abrir `demos/m3-tools`, sesión `DEMO M3…`. Señalar: el modelo eligió la tool Y el argumento por sí solo; una frase en inglés se convirtió en un UPDATE real (la BD de la demo está reseteada a pristine — la sesión grabada es la prueba). Ellos implementan las dos tools de escritura con el tutor `/module-3` (15').");
}

// --- Slide 17 — Module 4 · Agents ---
{
  const slide = contentSlide("Module 4 · Agents");
  slide.addText([
    ...para([
      { text: "Chatbot:", options: { fontSize: 16, fontFace: FONT.BODY, bold: true, color: X.GRAY } },
      { text: " you talk, it answers.  ", options: { fontSize: 16, fontFace: FONT.BODY, color: X.GRAY_DARK } },
      { text: "Agent:", options: { fontSize: 16, fontFace: FONT.BODY, bold: true, color: X.GREEN_DARK } },
      { text: " you give a GOAL, it works", options: { fontSize: 16, fontFace: FONT.BODY, color: X.GRAY_DARK } }
    ], bulletOpts({ fontSize: 16 })),
    ...para([
      { text: "The loop: ", options: { fontSize: 16, fontFace: FONT.BODY, color: X.GRAY_DARK } },
      { text: "observe → decide → act → repeat", options: { fontSize: 16, fontFace: FONT.BODY, bold: true, color: X.GREEN_DARK } }
    ], bulletOpts({ fontSize: 16 })),
    ...para([
      { text: "steps: 20", options: { fontSize: 16, fontFace: FONT.MONO, bold: true, color: X.GREEN_DARK } },
      { text: " = the safety fuse · permissions: ", options: { fontSize: 16, fontFace: FONT.BODY, color: X.GRAY_DARK } },
      { text: "ask / allow / deny", options: { fontSize: 16, fontFace: FONT.BODY, bold: true, color: X.BLACK } }
    ], bulletOpts({ fontSize: 16 }))
  ], { x: 0.5, y: 1.8, w: 12.33, h: 4.2, valign: "top", lineSpacingMultiple: 1.4 });
  slide.addNotes("El salto conceptual (2 min): el bucle deja de ser humano↔IA y pasa a ser IA↔tools. El agente `fleet-manager` tiene SOLO las tools `fleet_*` (sin bash/write/edit) y un tope de 20 pasos como fusible contra bucles infinitos. Los permisos de la app son la otra puerta de seguridad.");
}

// --- Slide 18 — Module 4 · DEMO: let it loose ---
{
  const slide = addDemoSlide({
    title: "Module 4 · DEMO: let it loose",
    folder: "demos/m4-agent",
    session: "DEMO M4 — Autonomous agent: resolves all tickets in a loop",
    prompt: "Resolve all pending maintenance tickets",
    promptH: 0.9,
    points: [
      ...para([
        { text: "The loop: ", options: { fontSize: 15, fontFace: FONT.BODY, color: X.GRAY_DARK } },
        { text: "list → assign → fix ×3", options: { fontSize: 15, fontFace: FONT.BODY, bold: true, color: X.GREEN_DARK } },
        { text: " (ticket #4 closes along the way)", options: { fontSize: 15, fontFace: FONT.BODY, color: X.GRAY_DARK } }
      ], bulletOpts({ fontSize: 15 })),
      ...para([
        { text: "It ", options: { fontSize: 15, fontFace: FONT.BODY, color: X.GRAY_DARK } },
        { text: "STOPS BY ITSELF", options: { fontSize: 15, fontFace: FONT.BODY, bold: true, color: X.GREEN_DARK } },
        { text: " when none remain ✅", options: { fontSize: 15, fontFace: FONT.BODY, color: X.GRAY_DARK } }
      ], bulletOpts({ fontSize: 15 }))
    ],
    thenYou: "/module-4"
  });
  slide.addNotes("Abrir `demos/m4-agent`, sesión `DEMO M4…`. Recorrer el bucle: `fleet_list_pending_tickets` → `fleet_assign_mechanic` → `fleet_mark_bike_fixed`, tres veces (tickets #1-#3; el #4 se cierra solo al arreglar la bici #3), y se DETIENE SOLO con un resumen. Mostrar después el archivo `.opencode/agents/fleet-manager.md`. Ellos completan el agente con `/module-4` (15').");
}

// --- Slide 19 — Today you built ---
{
  const slide = contentSlide("Today you built");
  const concept = { fontSize: 18, fontFace: FONT.BODY, bold: true, color: X.GREEN_DARK };
  const sep = { fontSize: 18, fontFace: FONT.BODY, color: X.GRAY_LIGHT };
  const desc = { fontSize: 15, fontFace: FONT.BODY, color: X.GRAY_DARK };
  slide.addText([
    ...para([
      { text: "Memory", options: concept },
      { text: " (context)", options: desc },
      { text: "   ·   ", options: sep },
      { text: "Truth", options: concept },
      { text: " (grounding)", options: desc },
      { text: "   ·   ", options: sep },
      { text: "Hands", options: concept },
      { text: " (tools)", options: desc },
      { text: "   ·   ", options: sep },
      { text: "Autonomy", options: concept },
      { text: " (agents)", options: desc }
    ])
  ], { x: 0.5, y: 2.2, w: 12.33, h: 0.7 });
  slide.addText("That is 90% of modern AI engineering.", {
    x: 0.5, y: 3.6, w: 12.33, h: 0.9,
    fontSize: 28, fontFace: FONT.BODY, bold: true,
    color: X.BLACK, align: "center"
  });
  slide.addNotes("Recap: los 4 conceptos de hoy son los mismos que usan ChatGPT, Copilot y cualquier agente serio. Ideas para casa: añadir una tool nueva (¿`order_parts`?), endurecer el guard con más patrones o probar otro modelo gratis. Q&A y despedida (5 min).");
}

// --- Slide 20 — Closing ---
{
  const slide = addClosingSlide(pptx, {
    title: "Now go build.",
    cta: "Questions?",
    contact: "Workshop materials: github repo · opencode.ai"
  });
  slide.addNotes("Slide de cierre. Abrir turno de preguntas y recordar dónde están los materiales: el repo del taller y opencode.ai para seguir practicando en casa (gratis, sin cuenta).");
}

// ---------------------------------------------------------------------------
// Write the file (repo root)
// ---------------------------------------------------------------------------

const outFile = path.resolve(__dirname, "..", "..", "AI-EBike-Fleet-Manager-Workshop.pptx");
pptx.writeFile({ fileName: outFile }).then(() => {
  console.log(`Wrote ${outFile}`);
});
