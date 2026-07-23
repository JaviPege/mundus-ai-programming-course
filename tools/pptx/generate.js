/**
 * Generates: AI-EBike-Fleet-Manager-Workshop.pptx (repo root)
 * Source script: docs/WORKSHOP_SLIDES.md (26 slides incl. closing)
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

function addServiceFlowSlide(pptx, { title, steps, activeIndex = 0 }) {
  const slide = pptx.addSlide({ masterName: "CONTENT" });
  addLogo(slide);
  slideTitle(slide, title);

  const count = steps.length;
  const gap = 0.3;
  const cardW = (12.33 - (count - 1) * gap) / count;
  const cardH = 4.2;

  steps.forEach((step, i) => {
    const xPos = 0.5 + i * (cardW + gap);
    const yPos = 1.5;
    const isActive = i === activeIndex;

    slide.addShape(pptx.ShapeType.roundRect, {
      x: xPos, y: yPos, w: cardW, h: cardH,
      fill: { color: isActive ? X.GREEN : X.WHITE },
      line: isActive ? undefined : { color: X.GREEN, width: 1.5 },
      rectRadius: 0.15
    });

    slide.addText(String(i + 1).padStart(2, "0"), {
      x: xPos, y: yPos + 0.2, w: cardW, h: 0.8,
      fontSize: 36, fontFace: FONT.TITLE,
      color: isActive ? X.WHITE : X.GREEN,
      align: "center", valign: "middle"
    });

    slide.addText(step.title, {
      x: xPos + 0.2, y: yPos + 1.1, w: cardW - 0.4, h: 0.6,
      fontSize: 16, fontFace: FONT.BODY, bold: true,
      color: isActive ? X.WHITE : X.BLACK,
      align: "center", valign: "middle"
    });

    if (step.description) {
      slide.addText(step.description, {
        x: xPos + 0.2, y: yPos + 1.8, w: cardW - 0.4, h: 2.0,
        fontSize: 12, fontFace: FONT.BODY,
        color: isActive ? X.WHITE : X.GRAY,
        align: "center", valign: "top"
      });
    }
  });

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
  slide.addNotes("Bienvenida. Presentarse en una frase. Mensaje clave: \"no vengo a dar teoría; vais a gobernar un agente de IA real con código vuestro, dentro de la app OpenCode y con modelos gratis — sin cuentas, sin API keys, sin pagar nada\". La app gestiona una flota de bicis eléctricas. Preguntar a mano alzada: ¿quién ha usado ChatGPT? ¿quién ha usado un agente de código?");
}

// --- Slide 2 — The mission (manual rich-text bullets, key phrases bold GREEN_DARK) ---
{
  const slide = contentSlide("The mission");
  slide.addText("Your mission today", {
    x: 0.5, y: 1.4, w: 12.33, h: 0.5,
    fontSize: 18, fontFace: FONT.BODY, bold: true, color: X.BLACK
  });
  const kw = { fontSize: 16, fontFace: FONT.BODY, bold: true, color: X.GREEN_DARK };
  const tx = { fontSize: 16, fontFace: FONT.BODY, color: X.GRAY_DARK };
  slide.addText([
    ...para([
      { text: "Fix an AI that ", options: tx },
      { text: "forgets everything", options: kw },
      { text: " (context)", options: tx }
    ], bulletOpts({ fontSize: 16 })),
    ...para([
      { text: "Stop it ", options: tx },
      { text: "inventing data", options: kw },
      { text: " (grounding)", options: tx }
    ], bulletOpts({ fontSize: 16 })),
    ...para([
      { text: "Give it ", options: tx },
      { text: "hands", options: kw },
      { text: " — tools that change a real database", options: tx }
    ], bulletOpts({ fontSize: 16 })),
    ...para([
      { text: "Turn it loose as an ", options: tx },
      { text: "autonomous agent", options: kw }
    ], bulletOpts({ fontSize: 16 }))
  ], { x: 0.5, y: 2.1, w: 12.33, h: 4.2, valign: "top", lineSpacingMultiple: 1.4 });
  slide.addNotes("Vender el arco narrativo: empiezan con un chat que olvida y alucina y acaban con un agente que resuelve tickets de mantenimiento solo. Todo ocurre dentro de OpenCode, pero lo que gobierna al modelo es código suyo: una regla, un plugin, dos tools y un agente. Cada fallo de la app es un concepto real de la ingeniería de LLMs.");
}

// --- Slide 3 — Roadmap (table) ---
{
  const slide = addTableSlide(pptx, {
    title: "Roadmap",
    headers: ["Time", "Phase", "Concept"],
    rows: [
      ["10'", "Setup", "OpenCode app, free models"],
      ["15'", "Module 1", "Context window"],
      ["20'", "Module 2", "Grounding & hooks"],
      ["20'", "Module 3", "Custom tools"],
      ["20'", "Module 4", "Autonomous agent"],
      ["5'", "Wrap-up", "The big picture"]
    ],
    colW: [1.5, 3.0, 7.83]
  });
  slide.addNotes("Enseñar los tiempos y avisar: \"los que terminéis antes, ayudáis al de al lado — enseñar es la mejor forma de aprender\". No hace falta memorizar nada: el trabajo está marcado en el proyecto con comentarios `TODO (Module N)`.");
}

// --- Slide 4 — What an LLM actually does (highlighted one-liner + 3 bullets) ---
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
  slide.addNotes("El concepto más importante del taller. El modelo es una función matemática gigante: `f(texto) → texto`. Cuando parezca que \"recuerda\", \"consulta\" o \"actúa\", en realidad es el software que lo rodea — hoy ese software es OpenCode más el código que ellos escribirán.");
}

// --- Slide 5 — Tokens (bullets + monospace example) ---
{
  const slide = contentSlide("Tokens");
  slide.addText([
    ...para([
      { text: "Models don't read words — they read ", options: { fontSize: 16, fontFace: FONT.BODY, color: X.GRAY_DARK } },
      { text: "tokens", options: { fontSize: 16, fontFace: FONT.BODY, bold: true, color: X.GREEN_DARK } }
    ], { paraSpaceAfter: 10 }),
    ...para([{ text: "1 token ≈ 4 characters ≈ ¾ of a word" }], bulletOpts({ fontSize: 16 })),
    ...para([{ text: "Tokens are the \"currency\" of every model call" }], bulletOpts({ fontSize: 16 })),
    ...para([{ text: "The context window has a token budget — watch the counter in the app" }], bulletOpts({ fontSize: 16 }))
  ], { x: 0.5, y: 1.5, w: 12.33, h: 2.6, valign: "top", lineSpacingMultiple: 1.3 });
  codeBox(slide,
    "\"Battery not charging\"  →  ~5 tokens",
    { x: 0.5, y: 4.4, w: 12.33, h: 1.0, fontSize: 14 });
  slide.addNotes("Enseñar el ejemplo troceando la frase en la pizarra si hace falta. Por qué importa: el modelo tiene un límite máximo de tokens por llamada y los tokens son la \"moneda\" de las APIs (los modelos gratis de hoy también tienen límite). En el Módulo 1 verán el contador de tokens de la app crecer en vivo.");
}

// --- Slide 6 — Context window & statelessness ---
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
  slide.addNotes("Hacer la analogía: es como hablar con alguien con amnesia total al que le pasas una transcripción escrita de toda la conversación en cada frase. Esto ES el Módulo 1 que experimentarán en 10 minutos. Que quede claro: la \"memoria\" del chat es software (la sesión), no magia.");
}

// --- Slide 7 — Meet OpenCode (service flow: 4 cards) ---
{
  const slide = addServiceFlowSlide(pptx, {
    title: "Meet OpenCode",
    steps: [
      { title: "Session", description: "The context window — the model's \"memory\"" },
      { title: "AGENTS.md", description: "Persistent project rules, read every session" },
      { title: "Custom tools", description: "Function calling: real code the model can trigger" },
      { title: "Agents", description: "Autonomous loops with a step budget" }
    ],
    activeIndex: 0
  });
  slide.addText([
    { text: "The app is the middleware between you and the model. ", options: { fontSize: 14, fontFace: FONT.BODY, color: X.GRAY_DARK } },
    { text: "You don't just chat with it — you GOVERN it.", options: { fontSize: 14, fontFace: FONT.BODY, bold: true, color: X.GREEN_DARK } }
  ], { x: 0.5, y: 6.0, w: 12.33, h: 0.5, align: "center" });
  slide.addNotes("El mapa del taller: cada fila es un módulo. OpenCode hace de middleware: empaqueta el contexto, ofrece las tools al modelo y ejecuta lo que el modelo pide. Ellos no van a programar un cliente desde cero; van a gobernar un agente profesional: reglas, guard, tools y agente autónomo.");
}

// --- Slide 8 — Install OpenCode ---
{
  const slide = contentSlide("Install OpenCode");
  slide.addText([
    ...para([
      { text: "1.  Go to ", options: { fontSize: 18, fontFace: FONT.BODY, color: X.GRAY_DARK } },
      { text: "opencode.ai/download", options: { fontSize: 18, fontFace: FONT.BODY, bold: true, color: X.GREEN_DARK } },
      { text: " → ", options: { fontSize: 18, fontFace: FONT.BODY, color: X.GRAY_DARK } },
      { text: "OpenCode Desktop — Windows (x64)", options: { fontSize: 18, fontFace: FONT.BODY, bold: true, color: X.BLACK } }
    ], { paraSpaceAfter: 14 }),
    ...para([{ text: "2.  Install & launch", options: { fontSize: 18, fontFace: FONT.BODY, color: X.GRAY_DARK } }], { paraSpaceAfter: 24 }),
    ...para([{ text: "Free models included:  NO account · NO API key · NO billing", options: { fontSize: 18, fontFace: FONT.BODY, bold: true, color: X.GREEN_DARK } }], { paraSpaceAfter: 12 }),
    ...para([{ text: "First project open auto-installs plugin dependencies — internet needed ONCE", options: { fontSize: 14, fontFace: FONT.BODY, italic: true, color: X.GRAY } }])
  ], { x: 0.5, y: 1.9, w: 12.33, h: 3.6, valign: "top", lineSpacingMultiple: 1.3 });
  slide.addNotes("Primer checkpoint. Todos los equipos son Windows: descargar \"OpenCode Desktop — Windows (x64)\" desde opencode.ai/download. Tener los instaladores descargados de antemano (USB) por si el WiFi del aula va lento. Recalcar la ventaja frente a otros talleres: sin registro, sin tarjeta, sin keys — los modelos gratuitos vienen integrados. Avisar: al abrir el proyecto por primera vez, la app auto-instala las dependencias del plugin en `.opencode/` — necesita internet solo esa vez.");
}

// --- Slide 9 — Get the code ---
{
  const slide = contentSlide("Get the code");
  slide.addText([
    { text: "Option A — ", options: { fontSize: 15, fontFace: FONT.BODY, bold: true, color: X.BLACK } },
    { text: "Git for Windows", options: { fontSize: 15, fontFace: FONT.BODY, bold: true, color: X.GREEN_DARK } },
    { text: " (PowerShell):", options: { fontSize: 15, fontFace: FONT.BODY, color: X.GRAY_DARK } }
  ], { x: 0.5, y: 1.35, w: 12.33, h: 0.45 });
  codeBox(slide,
    "git clone <repo-url>\ncd C001",
    { x: 0.5, y: 1.85, w: 12.33, h: 1.3, fontSize: 14 });
  slide.addText([
    { text: "Option B — ", options: { fontSize: 15, fontFace: FONT.BODY, bold: true, color: X.BLACK } },
    { text: "GitHub → Code → Download ZIP", options: { fontSize: 15, fontFace: FONT.BODY, bold: true, color: X.GREEN_DARK } },
    { text: " → extract", options: { fontSize: 15, fontFace: FONT.BODY, color: X.GRAY_DARK } }
  ], { x: 0.5, y: 3.35, w: 12.33, h: 0.45 });
  slide.addText([
    { text: "Then in OpenCode:  ", options: { fontSize: 15, fontFace: FONT.BODY, color: X.GRAY_DARK } },
    { text: "File → Open Folder… → starter/", options: { fontSize: 15, fontFace: FONT.BODY, bold: true, color: X.BLACK } }
  ], { x: 0.5, y: 3.95, w: 12.33, h: 0.5 });
  slide.addText([
    ...para([
      { text: "starter/", options: { fontSize: 15, fontFace: FONT.MONO, color: X.GRAY_DARK } },
      { text: " → ", options: { fontSize: 15, fontFace: FONT.BODY, color: X.GRAY_DARK } },
      { text: "your project", options: { fontSize: 15, fontFace: FONT.BODY, bold: true, color: X.GREEN_DARK } },
      { text: " (with TODOs)", options: { fontSize: 15, fontFace: FONT.BODY, color: X.GRAY_DARK } }
    ], bulletOpts({ fontSize: 15 })),
    ...para([
      { text: "solution/", options: { fontSize: 15, fontFace: FONT.MONO, color: X.GRAY_DARK } },
      { text: " → the teacher's copy. ", options: { fontSize: 15, fontFace: FONT.BODY, color: X.GRAY_DARK } },
      { text: "Don't peek. 🙈", options: { fontSize: 15, fontFace: FONT.BODY, bold: true, color: X.GREEN_DARK } }
    ], bulletOpts({ fontSize: 15 }))
  ], { x: 0.5, y: 4.6, w: 12.33, h: 1.8, valign: "top", lineSpacingMultiple: 1.3 });
  slide.addNotes("Dos caminos, ambos Windows: `git clone` en PowerShell (Git for Windows) o el botón \"Code → Download ZIP\" de GitHub y descomprimir. Después, todos abren la carpeta `starter/` en la app (File → Open Folder). Paseo de 30 segundos por el árbol: `AGENTS.md` (las reglas), `.opencode/tools` (las tools), `.opencode/plugins` (el guard), `.opencode/agents` (el agente), `database.sqlite`. Advertencia simpática sobre `solution/`: mirarla es hacerse spoiler a uno mismo.");
}

// --- Slide 10 — Pick a free model ---
{
  const slide = contentSlide("Pick a free model");
  slide.addText([
    ...para([
      { text: "Model selector (bottom of the window) → ", options: { fontSize: 17, fontFace: FONT.BODY, color: X.GRAY_DARK } },
      { text: "Big Pickle", options: { fontSize: 17, fontFace: FONT.BODY, bold: true, color: X.GREEN_DARK } }
    ], { paraSpaceAfter: 12 }),
    ...para([
      { text: "Other free options: ", options: { fontSize: 15, fontFace: FONT.BODY, color: X.GRAY_DARK } },
      { text: "nemotron-3-ultra-free · deepseek-v4-flash-free", options: { fontSize: 15, fontFace: FONT.MONO, color: X.GRAY_DARK } }
    ], bulletOpts({ fontSize: 15 })),
    ...para([{ text: "First run needs internet ONCE (OpenCode auto-installs plugin deps)" }], bulletOpts({ fontSize: 15 })),
    ...para([
      { text: "No provider available", options: { fontSize: 15, fontFace: FONT.MONO, color: X.GRAY_DARK } },
      { text: "? Wait ~30 s and retry (free-tier rate limit)", options: { fontSize: 15, fontFace: FONT.BODY, color: X.GRAY_DARK } }
    ], bulletOpts({ fontSize: 15 }))
  ], { x: 0.5, y: 1.7, w: 12.33, h: 4.4, valign: "top", lineSpacingMultiple: 1.35 });
  slide.addNotes("Enseñar el selector de modelos en la parte inferior. La primera ejecución descarga las dependencias del plugin en `.opencode/` — solo una vez y necesita red. Avisar del quirk verificado: los endpoints gratuitos hacen rate limit; si sale \"No provider available\", esperar medio minuto y reintentar, o cambiar a otro modelo gratis.");
}

// --- Slide 11 — First chat ---
{
  const slide = contentSlide("First chat");
  slide.addText("New session → type:", {
    x: 0.5, y: 1.5, w: 12.33, h: 0.5,
    fontSize: 16, fontFace: FONT.BODY, bold: true, color: X.BLACK
  });
  slide.addText([
    ...para([{ text: "My name is <your name>. Remember it.", options: { fontSize: 15, fontFace: FONT.MONO, color: X.GRAY_DARK } }], bulletOpts({ fontSize: 15 })),
    ...para([{ text: "What is my name?", options: { fontSize: 15, fontFace: FONT.MONO, color: X.GRAY_DARK } }], bulletOpts({ fontSize: 15 }))
  ], { x: 0.5, y: 2.1, w: 12.33, h: 1.6, valign: "top", lineSpacingMultiple: 1.3 });
  slide.addText([
    { text: "It knows… ", options: { fontSize: 22, fontFace: FONT.BODY, color: X.GRAY_DARK } },
    { text: "for now. 😏", options: { fontSize: 22, fontFace: FONT.BODY, bold: true, color: X.GREEN_DARK } }
  ], { x: 0.5, y: 4.2, w: 12.33, h: 0.7 });
  slide.addText([
    { text: "Guided tutorial: type ", options: { fontSize: 12, fontFace: FONT.BODY, italic: true, color: X.GRAY } },
    { text: "/module-1", options: { fontSize: 12, fontFace: FONT.MONO, italic: true, color: X.GREEN_DARK } },
    { text: " — the AI becomes your step-by-step tutor (hints, not solutions).", options: { fontSize: 12, fontFace: FONT.BODY, italic: true, color: X.GRAY } }
  ], { x: 0.5, y: 6.4, w: 12.33, h: 0.4 });
  slide.addNotes("Que jueguen 1-2 minutos. NO explicar todavía: en el Módulo 1 abrirán una sesión nueva y descubrirán la amnesia por sí mismos. Presentar el tutorial guiado: el proyecto trae 4 comandos (`/module-1` … `/module-4`); al escribirlos, la IA se convierte en su tutor paso a paso — da pistas, no soluciones, y nunca hace el trabajo por ellos. Checkpoint: todos han hablado con el modelo al menos una vez. Fin del Setup (~10').");
}

// --- Slide 12 — The goldfish demo ---
{
  const slide = contentSlide("The goldfish demo");
  const tx = { fontSize: 16, fontFace: FONT.BODY, color: X.GRAY_DARK };
  const mono = { fontSize: 16, fontFace: FONT.MONO, color: X.GRAY_DARK };
  slide.addText([
    ...para([
      { text: "Session 1:  ", options: { ...tx, bold: true, color: X.BLACK } },
      { text: "My name is Alex", options: mono },
      { text: "  →  ", options: tx },
      { text: "What is my name?", options: mono },
      { text: "  →  ✅ it knows", options: tx }
    ], { paraSpaceAfter: 14 }),
    ...para([
      { text: "NEW session:  ", options: { ...tx, bold: true, color: X.BLACK } },
      { text: "What is my name?", options: mono },
      { text: "  →  🤷 forgotten", options: tx }
    ], { paraSpaceAfter: 14 }),
    ...para([{ text: "Back to session 1  →  it remembers again", options: tx }], { paraSpaceAfter: 24 }),
    ...para([{ text: "Sessions ARE the context window.", options: { fontSize: 22, fontFace: FONT.BODY, bold: true, color: X.GREEN_DARK } }])
  ], { x: 0.5, y: 1.7, w: 12.33, h: 4.6, valign: "top", lineSpacingMultiple: 1.3 });
  slide.addText([
    { text: "Guided tutorial: ", options: { fontSize: 12, fontFace: FONT.BODY, italic: true, color: X.GRAY } },
    { text: "/module-1", options: { fontSize: 12, fontFace: FONT.MONO, italic: true, color: X.GREEN_DARK } }
  ], { x: 0.5, y: 6.45, w: 12.33, h: 0.4 });
  slide.addNotes("Demo en vivo proyectada. Pregunta guía: \"¿por qué la sesión nueva no sabe tu nombre?\" Respuesta: el modelo nunca supo nada — cada llamada solo ve el texto de la sesión actual; la memoria era la sesión, no el modelo. Conectar con la slide 6. Que lo repitan en sus equipos (5 min). Recordar que, si se quedan atrás, pueden lanzar el tutor guiado con `/module-1`.");
}

// --- Slide 13 — Watch the tokens + /compact ---
{
  const slide = contentSlide("Watch the tokens + /compact");
  slide.addText([
    ...para([
      { text: "Every message makes the ", options: { fontSize: 16, fontFace: FONT.BODY, color: X.GRAY_DARK } },
      { text: "token counter", options: { fontSize: 16, fontFace: FONT.BODY, bold: true, color: X.GREEN_DARK } },
      { text: " grow — the app resends the whole session", options: { fontSize: 16, fontFace: FONT.BODY, color: X.GRAY_DARK } }
    ], bulletOpts({ fontSize: 16 })),
    ...para([
      { text: "The window has a budget → ", options: { fontSize: 16, fontFace: FONT.BODY, color: X.GRAY_DARK } },
      { text: "/compact", options: { fontSize: 16, fontFace: FONT.MONO, bold: true, color: X.GREEN_DARK } },
      { text: " summarizes the history so it fits", options: { fontSize: 16, fontFace: FONT.BODY, color: X.GRAY_DARK } }
    ], bulletOpts({ fontSize: 16 })),
    ...para([
      { text: "After ", options: { fontSize: 16, fontFace: FONT.BODY, color: X.GRAY_DARK } },
      { text: "/compact", options: { fontSize: 16, fontFace: FONT.MONO, color: X.GRAY_DARK } },
      { text: ": the name survives, the token count drops", options: { fontSize: 16, fontFace: FONT.BODY, color: X.GRAY_DARK } }
    ], bulletOpts({ fontSize: 16 }))
  ], { x: 0.5, y: 1.8, w: 12.33, h: 4.2, valign: "top", lineSpacingMultiple: 1.4 });
  slide.addNotes("Señalar el contador de tokens creciendo con cada mensaje: es la prueba visible de que la app reenvía toda la conversación. Conectar con la slide 5 (presupuesto). Ejecutar `/compact`: la app resume el historial viejo para que quepa en la ventana — la técnica profesional de verdad. El nombre sobrevive al resumen.");
}

// --- Slide 14 — /init → AGENTS.md ---
{
  const slide = contentSlide("/init → AGENTS.md");
  slide.addText([
    ...para([
      { text: "/init", options: { fontSize: 17, fontFace: FONT.MONO, bold: true, color: X.GREEN_DARK } },
      { text: " generates ", options: { fontSize: 17, fontFace: FONT.BODY, color: X.GRAY_DARK } },
      { text: "AGENTS.md", options: { fontSize: 17, fontFace: FONT.MONO, bold: true, color: X.GREEN_DARK } },
      { text: " — project rules injected into EVERY session", options: { fontSize: 17, fontFace: FONT.BODY, color: X.GRAY_DARK } }
    ], { paraSpaceAfter: 14 }),
    ...para([{ text: "Persistent memory that survives new sessions" }], bulletOpts({ fontSize: 16 })),
    ...para([
      { text: "starter/AGENTS.md", options: { fontSize: 16, fontFace: FONT.MONO, color: X.GRAY_DARK } },
      { text: " already describes the fleet, the DB and the ", options: { fontSize: 16, fontFace: FONT.BODY, color: X.GRAY_DARK } },
      { text: "fleet_*", options: { fontSize: 16, fontFace: FONT.MONO, color: X.GRAY_DARK } },
      { text: " tools", options: { fontSize: 16, fontFace: FONT.BODY, color: X.GRAY_DARK } }
    ], bulletOpts({ fontSize: 16 })),
    ...para([{ text: "In Module 2 you will add a rule of your own" }], bulletOpts({ fontSize: 16 }))
  ], { x: 0.5, y: 1.8, w: 12.33, h: 4.2, valign: "top", lineSpacingMultiple: 1.35 });
  slide.addNotes("AGENTS.md es la memoria persistente del proyecto: cada sesión nueva la lee antes de empezar. Abrir `starter/AGENTS.md` y leerla con ellos: describe la flota, la base de datos SQLite y las cuatro tools. Ahí escribirán su regla de grounding en el Módulo 2 — es el mismo mecanismo que usa `/init`.");
}

// --- Slide 15 — The confident liar (hallucination demo) ---
{
  const slide = contentSlide("The confident liar");
  slide.addText("In an EMPTY window (no project), push it:", {
    x: 0.5, y: 1.4, w: 12.33, h: 0.5,
    fontSize: 16, fontFace: FONT.BODY, color: X.GRAY_DARK
  });
  codeBox(slide,
    "You're my e-bike fleet manager with 8 bikes. Give me the morning\nstatus report: battery levels and which bikes are broken.\nJust give me the report, no questions.",
    { x: 0.5, y: 2.0, w: 12.33, h: 1.9, fontSize: 13 });
  slide.addText([
    ...para([
      { text: "→  A full report. Made up. Very confident. 😅", options: { fontSize: 17, fontFace: FONT.BODY, bold: true, color: X.GREEN_DARK } }
    ], { paraSpaceAfter: 10 }),
    ...para([
      { text: "Ask politely instead → it admits it has no data.  ", options: { fontSize: 16, fontFace: FONT.BODY, color: X.GRAY_DARK } },
      { text: "Hallucination.", options: { fontSize: 16, fontFace: FONT.BODY, bold: true, color: X.BLACK } }
    ])
  ], { x: 0.5, y: 4.3, w: 12.33, h: 1.8, valign: "top", lineSpacingMultiple: 1.3 });
  slide.addText([
    { text: "Guided tutorial: ", options: { fontSize: 12, fontFace: FONT.BODY, italic: true, color: X.GRAY } },
    { text: "/module-2", options: { fontSize: 12, fontFace: FONT.MONO, italic: true, color: X.GREEN_DARK } }
  ], { x: 0.5, y: 6.45, w: 12.33, h: 0.4 });
  slide.addNotes("Demo en vivo FUERA del proyecto (ventana sin el proyecto abierto — dentro de `starter/` el modelo ve las tools y se porta demasiado bien). Verificado con Big Pickle: con el prompt insistente inventa un informe completo con IDs, baterías y averías; preguntado con educación, admite que no tiene datos. Ese contraste ES la lección: su trabajo es sonar plausible, no decir la verdad. Palabra del día: **hallucination**. Discusión de 1 minuto. Recordar que, si se quedan atrás, pueden lanzar el tutor guiado con `/module-2`.");
}

// --- Slide 16 — Grounding: the fix is a rule ---
{
  const slide = contentSlide("Grounding: the fix is a rule");
  slide.addText([
    ...para([
      { text: "Open ", options: { fontSize: 15, fontFace: FONT.BODY, color: X.GRAY_DARK } },
      { text: "starter/", options: { fontSize: 15, fontFace: FONT.MONO, color: X.GRAY_DARK } },
      { text: " → ", options: { fontSize: 15, fontFace: FONT.BODY, color: X.GRAY_DARK } },
      { text: "How is the fleet? Which bikes are broken?", options: { fontSize: 15, fontFace: FONT.MONO, color: X.GRAY_DARK } }
    ], { paraSpaceAfter: 8 }),
    ...para([
      { text: "→  It calls ", options: { fontSize: 15, fontFace: FONT.BODY, color: X.GRAY_DARK } },
      { text: "fleet_get_fleet_status", options: { fontSize: 15, fontFace: FONT.MONO, color: X.GRAY_DARK } },
      { text: " → real data: ", options: { fontSize: 15, fontFace: FONT.BODY, color: X.GRAY_DARK } },
      { text: "#3, #7 broken · #5 maintenance", options: { fontSize: 15, fontFace: FONT.BODY, bold: true, color: X.GREEN_DARK } }
    ], { paraSpaceAfter: 14 }),
    ...para([
      { text: "TODO (Module 2)", options: { fontSize: 15, fontFace: FONT.MONO, bold: true, color: X.GREEN_DARK } },
      { text: "  in ", options: { fontSize: 15, fontFace: FONT.BODY, color: X.GRAY_DARK } },
      { text: "starter/AGENTS.md", options: { fontSize: 15, fontFace: FONT.MONO, color: X.GRAY_DARK } },
      { text: ":", options: { fontSize: 15, fontFace: FONT.BODY, color: X.GRAY_DARK } }
    ])
  ], { x: 0.5, y: 1.5, w: 12.33, h: 2.2, valign: "top", lineSpacingMultiple: 1.3 });
  codeBox(slide,
    "GROUNDING RULE: ALWAYS call the fleet_* tools before answering\nfleet questions. NEVER invent or guess fleet numbers.",
    { x: 0.5, y: 3.9, w: 12.33, h: 1.4, fontSize: 13 });
  slide.addNotes("La diferencia no es un modelo más listo: es acceso a datos reales — esto es grounding (RAG en su versión mínima). Las tools de lectura ya vienen hechas; su trabajo es la regla en el marcador `TODO (Module 2)` de AGENTS.md. Test: NUEVA sesión (los cambios solo aplican a sesiones nuevas), preguntar por la flota → la respuesta debe citar #3, #7 y #5 reales. Si un modelo ignora la regla: ponerla primera, en mayúsculas y nombrando las tools.");
}

// --- Slide 17 — Hooks: middleware around every action (shape flow) ---
{
  const slide = contentSlide("Hooks: middleware around every action");
  slide.addText([
    { text: "A hook = ", options: { fontSize: 16, fontFace: FONT.BODY, color: X.GRAY_DARK } },
    { text: "code that intercepts a tool call BEFORE/AFTER it runs", options: { fontSize: 16, fontFace: FONT.BODY, bold: true, color: X.GREEN_DARK } }
  ], { x: 0.5, y: 1.5, w: 12.33, h: 0.5 });

  const boxY = 2.9, boxH = 1.3, boxW = 3.2;
  const boxes = [
    { x: 0.9, label: "user prompt → model", mono: false, active: false },
    { x: 5.05, label: "plugin hook", mono: true, active: true },
    { x: 9.2, label: "tool execution", mono: false, active: false }
  ];
  boxes.forEach(b => {
    slide.addShape(pptx.ShapeType.roundRect, {
      x: b.x, y: boxY, w: boxW, h: boxH,
      fill: { color: b.active ? X.GREEN : X.WHITE },
      line: b.active ? undefined : { color: X.GREEN, width: 1.5 },
      rectRadius: 0.15
    });
    slide.addText(b.label, {
      x: b.x, y: boxY, w: boxW, h: boxH,
      fontSize: 16, fontFace: b.mono ? FONT.MONO : FONT.BODY,
      bold: true,
      color: b.active ? X.WHITE : X.BLACK,
      align: "center", valign: "middle"
    });
  });
  // Arrows between boxes
  [4.25, 8.4].forEach(ax => {
    slide.addShape(pptx.ShapeType.rightArrow, {
      x: ax, y: boxY + boxH / 2 - 0.25, w: 0.65, h: 0.5,
      fill: { color: X.GREEN }
    });
  });
  slide.addText("Your chance to inspect, allow… or BLOCK.", {
    x: 0.5, y: 4.7, w: 12.33, h: 0.5,
    fontSize: 14, fontFace: FONT.BODY, italic: true,
    color: X.GRAY, align: "center"
  });
  slide.addNotes("Concepto de hook/middleware: un punto de intercepción donde tu código puede inspeccionar y modificar lo que el modelo está a punto de hacer. Patrón general del software, no solo de IA. En OpenCode los plugins envuelven cada ejecución de tool; el hook `tool.execute.before` puede bloquear — y es determinista: no depende del humor del modelo.");
}

// --- Slide 18 — The guard plugin ---
{
  const slide = contentSlide("The guard plugin");
  slide.addText([
    { text: ".opencode/plugins/guard.ts", options: { fontSize: 16, fontFace: FONT.MONO, color: X.GRAY_DARK } },
    { text: "  —  ", options: { fontSize: 16, fontFace: FONT.BODY, color: X.GRAY_DARK } },
    { text: "TODO (Module 2)", options: { fontSize: 16, fontFace: FONT.MONO, bold: true, color: X.GREEN_DARK } }
  ], { x: 0.5, y: 1.4, w: 12.33, h: 0.5 });
  codeBox(slide,
    "\"tool.execute.before\": bash command contains\n  \"rm -rf\" or \"drop table\"  →  throw Error  →  BLOCKED",
    { x: 0.5, y: 2.0, w: 12.33, h: 1.4, fontSize: 13 });
  slide.addText([
    ...para([
      { text: "Demo:  ", options: { fontSize: 16, fontFace: FONT.BODY, bold: true, color: X.BLACK } },
      { text: "Run this exact shell command: rm -rf /tmp/whatever", options: { fontSize: 16, fontFace: FONT.MONO, color: X.GRAY_DARK } }
    ], { paraSpaceAfter: 8 }),
    ...para([
      { text: "→  ", options: { fontSize: 16, fontFace: FONT.BODY, color: X.GRAY_DARK } },
      { text: "Blocked by fleet guard", options: { fontSize: 16, fontFace: FONT.BODY, bold: true, color: X.GREEN_DARK } },
      { text: "  ✅", options: { fontSize: 16, fontFace: FONT.BODY, color: X.GRAY_DARK } }
    ])
  ], { x: 0.5, y: 3.9, w: 12.33, h: 1.8, valign: "top", lineSpacingMultiple: 1.3 });
  slide.addNotes("Implementación (~10 min): solo inspeccionar la tool `bash`, leer `output.args.command`, pasarlo a minúsculas y, si contiene algo de `BLOCKED`, lanzar el Error — el modelo ve el mensaje de bloqueo en vez del resultado. Test en vivo: pedirle que ejecute `rm -rf /tmp/whatever` y ver el bloqueo. Nueva sesión para recargar el plugin. Lección: el modelo a veces se niega por sí solo (con `drop table` suele hacerlo), pero el guard bloquea SIEMPRE — es la red de seguridad determinista.");
}

// --- Slide 19 — Talking ≠ doing ---
{
  const slide = contentSlide("Talking ≠ doing");
  slide.addText([
    ...para([
      { text: "Try:  ", options: { fontSize: 18, fontFace: FONT.BODY, color: X.GRAY_DARK } },
      { text: "\"Bike #3 is repaired\"", options: { fontSize: 18, fontFace: FONT.BODY, bold: true, color: X.BLACK } }
    ], { paraSpaceAfter: 12 }),
    ...para([{ text: "→  The AI agrees… and the database doesn't change. 🤔", options: { fontSize: 18, fontFace: FONT.BODY, color: X.GRAY_DARK } }], { paraSpaceAfter: 24 }),
    ...para([
      { text: "Text is not action. ", options: { fontSize: 24, fontFace: FONT.BODY, bold: true, color: X.GREEN_DARK } },
      { text: "It needs a WRITE tool.", options: { fontSize: 24, fontFace: FONT.BODY, color: X.BLACK } }
    ])
  ], { x: 0.5, y: 2.0, w: 12.33, h: 4.0, valign: "top", lineSpacingMultiple: 1.3 });
  slide.addText([
    { text: "Guided tutorial: ", options: { fontSize: 12, fontFace: FONT.BODY, italic: true, color: X.GRAY } },
    { text: "/module-3", options: { fontSize: 12, fontFace: FONT.MONO, italic: true, color: X.GREEN_DARK } }
  ], { x: 0.5, y: 6.45, w: 12.33, h: 0.4 });
  slide.addNotes("Nueva limitación. El proyecto solo trae tools de lectura: por muy bien que hable, sin una tool de escritura no puede ejecutar el `UPDATE`. Pregunta puente: \"¿cómo le daríamos manos de verdad?\" La respuesta: custom tools propias. Recordar que, si se quedan atrás, pueden lanzar el tutor guiado con `/module-3`.");
}

// --- Slide 20 — Custom tools anatomy ---
{
  const slide = contentSlide("Custom tools anatomy");
  slide.addText(".opencode/tools/fleet.ts", {
    x: 0.5, y: 1.4, w: 12.33, h: 0.5,
    fontSize: 16, fontFace: FONT.MONO, color: X.GRAY_DARK
  });
  codeBox(slide,
    "export const mark_bike_fixed = tool({ description, args, execute })\n//  → tool name: fleet_mark_bike_fixed",
    { x: 0.5, y: 2.0, w: 12.33, h: 1.4, fontSize: 13 });
  slide.addText([
    ...para([
      { text: "description", options: { fontSize: 15, fontFace: FONT.MONO, color: X.GRAY_DARK } },
      { text: " + Zod ", options: { fontSize: 15, fontFace: FONT.BODY, color: X.GRAY_DARK } },
      { text: "args", options: { fontSize: 15, fontFace: FONT.MONO, color: X.GRAY_DARK } },
      { text: " schema = the contract the model sees", options: { fontSize: 15, fontFace: FONT.BODY, color: X.GRAY_DARK } }
    ], bulletOpts({ fontSize: 15 })),
    ...para([
      { text: "execute()", options: { fontSize: 15, fontFace: FONT.MONO, color: X.GRAY_DARK } },
      { text: " = YOUR code, real SQLite (", options: { fontSize: 15, fontFace: FONT.BODY, color: X.GRAY_DARK } },
      { text: "bun:sqlite", options: { fontSize: 15, fontFace: FONT.MONO, color: X.GRAY_DARK } },
      { text: ")", options: { fontSize: 15, fontFace: FONT.BODY, color: X.GRAY_DARK } }
    ], bulletOpts({ fontSize: 15 })),
    ...para([{ text: "The model proposes; your code disposes.", options: { fontSize: 17, fontFace: FONT.BODY, bold: true, color: X.GREEN_DARK } }], { paraSpaceAfter: 0 })
  ], { x: 0.5, y: 3.8, w: 12.33, h: 2.6, valign: "top", lineSpacingMultiple: 1.35 });
  slide.addNotes("Anatomía de una tool: OpenCode carga cada archivo de `.opencode/tools/` y cada export se convierte en una tool llamada `<fichero>_<export>`. El modelo solo ve la descripción y el esquema de argumentos, y decide cuándo llamarla y con qué datos; quien ejecuta el SQL es NUESTRO código. Recordar la implicación de seguridad: nunca ejecutar a ciegas — de ahí el guard y los permisos ask/allow de la app.");
}

// --- Slide 21 — Build it (Module 3) ---
{
  const slide = contentSlide("Build it (Module 3)");
  const num = { fontSize: 16, fontFace: FONT.BODY, bold: true, color: X.GREEN_DARK };
  const tx = { fontSize: 16, fontFace: FONT.BODY, color: X.GRAY_DARK };
  const mono = { fontSize: 16, fontFace: FONT.MONO, color: X.GRAY_DARK };
  slide.addText([
    ...para([
      { text: "TODO (Module 3)", options: { fontSize: 17, fontFace: FONT.MONO, bold: true, color: X.GREEN_DARK } },
      { text: "  in ", options: { fontSize: 17, fontFace: FONT.BODY, color: X.GRAY_DARK } },
      { text: "fleet.ts", options: { fontSize: 17, fontFace: FONT.MONO, color: X.GRAY_DARK } },
      { text: ":", options: { fontSize: 17, fontFace: FONT.BODY, color: X.GRAY_DARK } }
    ], { paraSpaceAfter: 14 }),
    ...para([
      { text: "1.  ", options: num },
      { text: "assign_mechanic", options: mono },
      { text: " → check the ticket, then ", options: tx },
      { text: "UPDATE tickets SET mechanic, status='assigned'", options: mono }
    ], { paraSpaceAfter: 12 }),
    ...para([
      { text: "2.  ", options: num },
      { text: "mark_bike_fixed", options: mono },
      { text: " → ", options: tx },
      { text: "UPDATE bikes → 'ok'", options: mono },
      { text: " + close its open/assigned tickets", options: tx }
    ], { paraSpaceAfter: 20 }),
    ...para([
      { text: "Test:  ", options: { fontSize: 16, fontFace: FONT.BODY, bold: true, color: X.BLACK } },
      { text: "Bike #3 is repaired. Use the fleet tools.", options: { fontSize: 16, fontFace: FONT.MONO, color: X.GRAY_DARK } },
      { text: "  →  ", options: { fontSize: 16, fontFace: FONT.BODY, color: X.GRAY_DARK } },
      { text: "check the DB", options: { fontSize: 16, fontFace: FONT.BODY, bold: true, color: X.GREEN_DARK } }
    ])
  ], { x: 0.5, y: 1.6, w: 12.33, h: 4.8, valign: "top", lineSpacingMultiple: 1.3 });
  slide.addNotes("Es la parte más \"de verdad\" del taller (~12-15 min). Las pistas están en los comentarios del stub: el `SELECT bike_id`, los dos `UPDATE` y el JSON de retorno. Recordatorios: abrir la BD con `openDb(context.directory)`, nueva sesión tras editar, y click en *allow* cuando la app pida permiso. Test verificado: bike #3 pasa a `ok` y los tickets #1 y #4 a `closed`.");
}

// --- Slide 22 — Chatbot vs agent (two columns + loop code box) ---
{
  const slide = contentSlide("Chatbot vs agent");
  // Left: Chatbot
  slide.addText("Chatbot", {
    x: 0.5, y: 1.4, w: 5.9, h: 0.5,
    fontSize: 20, fontFace: FONT.BODY, bold: true, color: X.GRAY
  });
  slide.addText("You talk, it answers.", {
    x: 0.5, y: 1.95, w: 5.9, h: 0.5,
    fontSize: 15, fontFace: FONT.BODY, color: X.GRAY_DARK
  });
  // Right: Agent
  slide.addText("Agent", {
    x: 6.9, y: 1.4, w: 5.9, h: 0.5,
    fontSize: 20, fontFace: FONT.BODY, bold: true, color: X.GREEN_DARK
  });
  slide.addText([
    { text: "You give a ", options: { fontSize: 15, fontFace: FONT.BODY, color: X.GRAY_DARK } },
    { text: "GOAL", options: { fontSize: 15, fontFace: FONT.BODY, bold: true, color: X.GREEN_DARK } },
    { text: ", it works.", options: { fontSize: 15, fontFace: FONT.BODY, color: X.GRAY_DARK } }
  ], { x: 6.9, y: 1.95, w: 5.9, h: 0.5 });
  // Divider
  slide.addShape(pptx.ShapeType.rect, {
    x: 6.55, y: 1.4, w: 0.02, h: 1.2,
    fill: { color: X.GRAY_LIGHT }
  });
  // Agent loop code box
  codeBox(slide,
    "loop: observe → decide → act → repeat\n      (until done… or out of steps)",
    { x: 0.5, y: 3.0, w: 12.33, h: 1.4, fontSize: 14 });
  slide.addText([
    { text: "Your only input:  ", options: { fontSize: 15, fontFace: FONT.BODY, color: X.GRAY_DARK } },
    { text: "\"Resolve all pending maintenance tickets\"", options: { fontSize: 15, fontFace: FONT.BODY, italic: true, bold: true, color: X.BLACK } }
  ], { x: 0.5, y: 4.8, w: 12.33, h: 0.5 });
  slide.addText([
    { text: "Guided tutorial: ", options: { fontSize: 12, fontFace: FONT.BODY, italic: true, color: X.GRAY } },
    { text: "/module-4", options: { fontSize: 12, fontFace: FONT.MONO, italic: true, color: X.GREEN_DARK } }
  ], { x: 0.5, y: 6.45, w: 12.33, h: 0.4 });
  slide.addNotes("El salto conceptual: el bucle deja de ser humano↔IA y pasa a ser IA↔tools. El modelo decide QUÉ tool usar en cada paso según el estado, y para cuando el objetivo está cumplido… o cuando se agota el presupuesto de pasos — el fusible contra bucles infinitos. Recordar que, si se quedan atrás, pueden lanzar el tutor guiado con `/module-4`.");
}

// --- Slide 23 — Agent anatomy ---
{
  const slide = contentSlide("Agent anatomy");
  slide.addText([
    { text: ".opencode/agents/fleet-manager.md", options: { fontSize: 16, fontFace: FONT.MONO, color: X.GRAY_DARK } },
    { text: "  —  ", options: { fontSize: 16, fontFace: FONT.BODY, color: X.GRAY_DARK } },
    { text: "TODO (Module 4)", options: { fontSize: 16, fontFace: FONT.MONO, bold: true, color: X.GREEN_DARK } }
  ], { x: 0.5, y: 1.4, w: 12.33, h: 0.5 });
  slide.addText([
    ...para([
      { text: "description", options: { fontSize: 15, fontFace: FONT.MONO, color: X.GRAY_DARK } },
      { text: " + ", options: { fontSize: 15, fontFace: FONT.BODY, color: X.GRAY_DARK } },
      { text: "mode: primary", options: { fontSize: 15, fontFace: FONT.MONO, color: X.GRAY_DARK } },
      { text: " → shows up in the agent selector", options: { fontSize: 15, fontFace: FONT.BODY, color: X.GRAY_DARK } }
    ], bulletOpts({ fontSize: 15 })),
    ...para([
      { text: "steps: 20", options: { fontSize: 15, fontFace: FONT.MONO, bold: true, color: X.GREEN_DARK } },
      { text: " → the safety fuse", options: { fontSize: 15, fontFace: FONT.BODY, color: X.GRAY_DARK } }
    ], bulletOpts({ fontSize: 15 })),
    ...para([
      { text: "tools:", options: { fontSize: 15, fontFace: FONT.MONO, color: X.GRAY_DARK } },
      { text: " → ", options: { fontSize: 15, fontFace: FONT.BODY, color: X.GRAY_DARK } },
      { text: "fleet_*: true", options: { fontSize: 15, fontFace: FONT.MONO, color: X.GRAY_DARK } },
      { text: "  ·  ", options: { fontSize: 15, fontFace: FONT.BODY, color: X.GRAY_DARK } },
      { text: "write / edit / bash: false", options: { fontSize: 15, fontFace: FONT.MONO, color: X.GRAY_DARK } }
    ], bulletOpts({ fontSize: 15 })),
    ...para([
      { text: "Body = the loop:  ", options: { fontSize: 15, fontFace: FONT.BODY, color: X.GRAY_DARK } },
      { text: "list → assign → fix → repeat → stop with a summary", options: { fontSize: 15, fontFace: FONT.BODY, bold: true, color: X.GREEN_DARK } }
    ], bulletOpts({ fontSize: 15 }))
  ], { x: 0.5, y: 2.1, w: 12.33, h: 4.0, valign: "top", lineSpacingMultiple: 1.4 });
  slide.addNotes("Recorrer el frontmatter YAML: `description` (una línea), `mode: primary` (si no, no aparece en el selector), `steps: 20` y el mapa de tools — aquí directamente deshabilitamos `write`/`edit`/`bash` (los permisos de OpenCode van ask/allow/deny; el agente solo necesita las `fleet_*`). El cuerpo es el system prompt: hay que decir EXPLÍCITAMENTE \"vuelve al paso 1 hasta que no queden tickets\" o el modelo declara victoria tras el primero. Nueva sesión tras editar.");
}

// --- Slide 24 — Let it loose ---
{
  const slide = contentSlide("Let it loose");
  slide.addText([
    { text: "Agent selector → ", options: { fontSize: 16, fontFace: FONT.BODY, color: X.GRAY_DARK } },
    { text: "fleet-manager", options: { fontSize: 16, fontFace: FONT.BODY, bold: true, color: X.GREEN_DARK } },
    { text: " → send:", options: { fontSize: 16, fontFace: FONT.BODY, color: X.GRAY_DARK } }
  ], { x: 0.5, y: 1.4, w: 12.33, h: 0.5 });
  codeBox(slide,
    "Resolve all pending maintenance tickets",
    { x: 0.5, y: 2.0, w: 12.33, h: 1.0, fontSize: 15 });
  slide.addText([
    ...para([
      { text: "Watch it:  ", options: { fontSize: 16, fontFace: FONT.BODY, bold: true, color: X.BLACK } },
      { text: "list tickets → assign mechanic → fix bike → repeat ×3 → stops on its own", options: { fontSize: 16, fontFace: FONT.BODY, bold: true, color: X.GREEN_DARK } },
      { text: "  ✅", options: { fontSize: 16, fontFace: FONT.BODY, color: X.GRAY_DARK } }
    ], { paraSpaceAfter: 12 }),
    ...para([
      { text: "Check the DB:  all bikes ", options: { fontSize: 15, fontFace: FONT.BODY, color: X.GRAY_DARK } },
      { text: "ok", options: { fontSize: 15, fontFace: FONT.MONO, color: X.GRAY_DARK } },
      { text: ", all tickets ", options: { fontSize: 15, fontFace: FONT.BODY, color: X.GRAY_DARK } },
      { text: "closed", options: { fontSize: 15, fontFace: FONT.MONO, color: X.GRAY_DARK } }
    ])
  ], { x: 0.5, y: 3.6, w: 12.33, h: 2.2, valign: "top", lineSpacingMultiple: 1.35 });
  slide.addNotes("Gran final: ejecutar el agente en pantalla grande (~5 min de run). Verificado: itera tres veces (elige un mecánico, p.ej. \"Carlos\") y se detiene solo con un resumen; incluso reporta que el ticket #4 se cerró automáticamente al arreglar la bici #3. Si para tras un solo ticket: el prompt del bucle es perezoso — buena lección. Si bajan `steps` y se trunca: lección sobre presupuestos de bucle.");
}

// --- Slide 25 — Today you built ---
{
  const slide = contentSlide("Today you built");
  const concept = { fontSize: 18, fontFace: FONT.BODY, bold: true, color: X.GREEN_DARK };
  const sep = { fontSize: 18, fontFace: FONT.BODY, color: X.GRAY_LIGHT };
  const desc = { fontSize: 15, fontFace: FONT.BODY, color: X.GRAY_DARK };
  slide.addText([
    ...para([
      { text: "Memory", options: concept },
      { text: " (sessions & AGENTS.md)", options: desc },
      { text: "   ·   ", options: sep },
      { text: "Truth", options: concept },
      { text: " (grounding)", options: desc },
      { text: "   ·   ", options: sep },
      { text: "Hands", options: concept },
      { text: " (custom tools)", options: desc },
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
  slide.addNotes("Recap con la frase de cierre: los 4 conceptos de hoy son los mismos que usan ChatGPT, Copilot y cualquier agente serio. Ideas para casa: añadir una tool nueva (¿`order_parts`?), endurecer el guard con más patrones o probar otro modelo gratis. Q&A y despedida (5 min).");
}

// --- Slide 26 — Closing ---
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
