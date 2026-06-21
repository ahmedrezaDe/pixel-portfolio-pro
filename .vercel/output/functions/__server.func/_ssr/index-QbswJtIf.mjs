import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { A as AnimatePresence, m as motion } from "../_libs/framer-motion.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
function PixelAvatar({ size = 64, walking = false, facing = "right" }) {
  const px = size / 16;
  const S = "var(--ink)";
  const SKIN = "#f4c89a";
  const HAIR = "#1a1a1a";
  const SHIRT = "var(--accent-purple)";
  const PANTS = "#1f2937";
  const SHOE = "#0a0a0a";
  const EYE = "#0a0a0a";
  const grid = [
    "................",
    "....HHHHHHHH....",
    "...HHHHHHHHHH...",
    "..HHKKKKKKKKHH..",
    "..HKSSSSSSSSKH..",
    "..HKSEESSEESKH..",
    // eyes
    "..HKSSSSSSSSKH..",
    "..HKSSMMMMSSKH..",
    // mouth
    "...KKSSSSSSKK...",
    "....TTTTTTTT....",
    "...TTTTTTTTTT...",
    "..TTTTSSSSTTTT..",
    "..TTTTSSSSTTTT..",
    "..TTTTTTTTTTTT..",
    "...TTTTTTTTTT...",
    "....PPPP.PPPP...",
    "....PPPP.PPPP...",
    "....PPPP.PPPP...",
    "...BBBB...BBBB..",
    "..BBBBB...BBBBB."
  ];
  const colorMap2 = {
    H: HAIR,
    K: HAIR,
    S: SKIN,
    E: EYE,
    M: "#7a1f1f",
    T: SHIRT,
    P: PANTS,
    B: SHOE
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "pixelated",
      style: {
        width: size,
        height: size * (20 / 16),
        position: "relative",
        transform: facing === "left" ? "scaleX(-1)" : void 0,
        animation: walking ? "walk-bob 0.4s steps(2) infinite" : void 0
      },
      "aria-hidden": true,
      children: grid.map(
        (row, y) => row.split("").map((ch, x) => {
          if (ch === ".") return null;
          const bg = colorMap2[ch] ?? S;
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                position: "absolute",
                left: x * px,
                top: y * px,
                width: px,
                height: px,
                background: bg
              }
            },
            `${x}-${y}`
          );
        })
      )
    }
  );
}
function LoadingScreen({ onDone }) {
  const [p, setP] = reactExports.useState(0);
  reactExports.useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const dur = 2200;
    const tick = (t) => {
      const pct = Math.min(100, Math.round((t - start) / dur * 100));
      setP(pct);
      if (pct < 100) raf = requestAnimationFrame(tick);
      else setTimeout(onDone, 350);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);
  const cells = 20;
  const filled = Math.round(p / 100 * cells);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "scanlines flex min-h-screen items-center justify-center bg-white px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-pixel text-xs uppercase tracking-widest text-[var(--ink)]", children: "Loading" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-pixel text-[10px] text-[var(--muted-foreground)]", children: [
      String(p).padStart(3, "0"),
      "%"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-[3px] border-2 border-[var(--ink)] bg-white p-1 pixel-box", children: Array.from({ length: cells }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "h-5 w-3",
        style: {
          background: i < filled ? "var(--accent-green)" : "transparent",
          borderRight: "1px solid rgba(0,0,0,0.08)"
        }
      },
      i
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PixelAvatar, { size: 80, walking: true }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-pixel text-[8px] uppercase tracking-widest text-[var(--muted-foreground)]", children: "Press any key" })
  ] }) });
}
const colorMap = {
  blue: { fill: "var(--accent-blue)", tab: "oklch(0.55 0.18 245)" },
  red: { fill: "var(--accent-red)", tab: "oklch(0.5 0.22 25)" },
  yellow: { fill: "var(--accent-yellow)", tab: "oklch(0.72 0.16 90)" }
};
function PixelFolder({ color, label, hovered, onClick, onHover, onLeave }) {
  const c = colorMap[color];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      onClick,
      onMouseEnter: onHover,
      onMouseLeave: onLeave,
      className: "group relative flex flex-col items-center gap-3 outline-none",
      "aria-label": label,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "pixelated transition-transform duration-150",
            style: {
              width: 168,
              height: 132,
              transform: hovered ? "translateY(-10px) scale(1.04)" : "translateY(0) scale(1)",
              filter: hovered ? "drop-shadow(6px 6px 0 var(--ink))" : "drop-shadow(4px 4px 0 var(--ink))"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: "0 0 42 33", width: "168", height: "132", shapeRendering: "crispEdges", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "2", y: "3", width: "14", height: "5", fill: c.tab, stroke: "var(--ink)", strokeWidth: "1" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "1", y: "7", width: "40", height: "24", fill: c.fill, stroke: "var(--ink)", strokeWidth: "1" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "3", y: "9", width: "36", height: "2", fill: "rgba(255,255,255,0.45)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "3", y: "27", width: "36", height: "2", fill: "rgba(0,0,0,0.25)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "14", y: "14", width: "14", height: "6", fill: "#fdfaf2", stroke: "var(--ink)", strokeWidth: "1" })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "font-pixel text-[10px] uppercase tracking-wider",
            style: { color: "var(--ink)" },
            children: label
          }
        )
      ]
    }
  );
}
function HomeMenu({ onNavigate }) {
  const [hovered, setHovered] = reactExports.useState(null);
  const containerRef = reactExports.useRef(null);
  const [positions, setPositions] = reactExports.useState([0, 0, 0]);
  reactExports.useEffect(() => {
    const measure = () => {
      const els = containerRef.current?.querySelectorAll("[data-folder]");
      if (!els) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const xs = Array.from(els).map((el) => {
        const r = el.getBoundingClientRect();
        return r.left + r.width / 2 - containerRect.left;
      });
      setPositions(xs);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);
  const folders = [
    { color: "blue", label: "About Me", view: "about" },
    { color: "red", label: "Portfolio", view: "portfolio" },
    { color: "yellow", label: "Contact Me", view: "contact" }
  ];
  const avatarX = hovered === null ? positions[1] ?? 0 : positions[hovered] ?? 0;
  const facing = hovered !== null && positions[hovered] < (positions[1] ?? 0) ? "left" : "right";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "scanlines relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white px-6 pt-28", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-12 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-pixel text-2xl uppercase leading-tight tracking-wider text-[var(--ink)] sm:text-4xl", children: [
        "Ahmed Reza",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-sm text-[var(--accent-purple)] sm:text-lg mt-3", children: "◤ a.k.a. ERZA ◢" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-5 font-pixel text-[9px] uppercase tracking-widest text-[var(--muted-foreground)] sm:text-[10px]", children: [
        "Start by walking over desired game mode",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mx-2 text-[var(--ink)]", children: "or" }),
        "click"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        ref: containerRef,
        className: "relative flex w-full max-w-4xl items-end justify-around gap-6 px-4",
        children: [
          folders.map((f, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-folder": true, className: "animate-float-folder", style: { animationDelay: `${i * 0.2}s` }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            PixelFolder,
            {
              color: f.color,
              label: f.label,
              hovered: hovered === i,
              onHover: () => setHovered(i),
              onLeave: () => setHovered(null),
              onClick: () => onNavigate(f.view)
            }
          ) }, f.label)),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              className: "pointer-events-none absolute -bottom-16 left-0",
              animate: { x: avatarX - 24 },
              transition: { type: "spring", stiffness: 120, damping: 18 },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(PixelAvatar, { size: 48, walking: hovered !== null, facing })
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-24 h-[2px] w-full max-w-5xl bg-[var(--ink)]" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 font-pixel text-[8px] uppercase tracking-widest text-[var(--muted-foreground)]", children: "▼ World 01 — Parallel Realm of Unfinished Ideas ▼" })
  ] });
}
const portfolioConfig = {
  identity: {
    handle: "@erza"
  },
  about: {
    pretitle: "◤ Player Bio",
    headlineLead: "Hi, my name is",
    headlineHighlight: "Ahmed Reza",
    aliasLine: "But you can call me Erza.",
    bio: [
      "I make cool sh*t in the parallel world of unfinished ideas — prototypes, half-built engines, and weekend experiments that escape the lab when nobody is watching.",
      "I'm a creative technologist. I build things at the intersection of software, design, and play — gamified RPG dashboards, AI-driven job platforms, voice-controlled tools, and the occasional retro UI.",
      "When I'm not shipping, I'm thinking about how interfaces could feel more like video games and less like spreadsheets."
    ],
    stats: [
      { k: "STR", v: 78 },
      { k: "AGI", v: 91 },
      { k: "INT", v: 88 },
      { k: "VIT", v: 73 }
    ]
  },
  contact: {
    pretitle: "◤ Final Boss: Say Hi ◢",
    headlineLead: "Let's",
    headlineHighlight: "co-op",
    blurb: "Collabs, weird ideas, prototypes, or just to say the bio made you laugh — my inbox is open across the realms.",
    pressStart: "▶ Press start to send a DM",
    socials: [
      {
        key: "instagram",
        name: "Instagram",
        handle: "@erza",
        href: "https://instagram.com/erzaestetics",
        bg: "linear-gradient(135deg,#f9ce34,#ee2a7b,#6228d7)"
      },
      {
        key: "linkedin",
        name: "LinkedIn",
        handle: "/in/erza",
        href: "https://linkedin.com/in/ahmed-reza-a3b9403b0",
        bg: "#0a66c2"
      },
      {
        key: "spotify",
        name: "Spotify",
        handle: "erza",
        href: "https://spotify.com",
        bg: "#1db954"
      },
      {
        key: "tiktok",
        name: "TikTok",
        handle: "@erza",
        href: "https://tiktok.com",
        bg: "#000"
      },
      {
        key: "github",
        name: "GitHub",
        handle: "@erza",
        href: "https://github.com/ahmedrezaDe",
        bg: "#171515"
      }
    ]
  },
  arcade: {
    eyebrow: "◤ Live Arcade Row ◢",
    title: "ERZA · ARCADE",
    subtitle: "Walk up. Drop coin. Read the blueprint.",
    scrollHint: "◀ scroll · drag · pick a cabinet ▶"
  },
  projects: [
    {
      id: "tower-hunter",
      title: "TOWER HUNTER",
      tag: "RPG · DESKTOP",
      blurb: "A gamified life-OS built in Tauri + Rust. Holographic HUD, attribute bars, awakening protocol, and local SQLite save-state. Turning daily habits into a tower climb.",
      stack: [
        { name: "Rust", role: "Core engine" },
        { name: "Tauri", role: "Native shell" },
        { name: "React", role: "HUD / UI" },
        { name: "Zustand", role: "State" },
        { name: "SQLite", role: "Save state" }
      ],
      bg: "linear-gradient(135deg,#0a0f1f 0%,#0c2340 50%,#1a4a6e 100%)",
      monitor: "linear-gradient(180deg,#001023,#003a6b)",
      blueprint: {
        nodes: [
          { id: "user", label: "PLAYER", x: 8, y: 50 },
          { id: "hud", label: "HUD / React", x: 32, y: 25 },
          { id: "core", label: "Rust Core", x: 55, y: 50 },
          { id: "save", label: "SQLite", x: 80, y: 25 },
          { id: "quest", label: "Quest Engine", x: 80, y: 75 }
        ],
        edges: [
          { from: "user", to: "hud" },
          { from: "hud", to: "core" },
          { from: "core", to: "save" },
          { from: "core", to: "quest" },
          { from: "quest", to: "hud" }
        ]
      }
    },
    {
      id: "odyssey",
      title: "ODYSSEY ORCHESTRATOR",
      tag: "AI · AUTOMATION",
      blurb: "Autonomous job-hunting and content pipeline orchestrated via webhooks. Agents crawl, parse, and execute headless browsers in real-time.",
      stack: [
        { name: "n8n", role: "Webhook Logic" },
        { name: "FastAPI", role: "Backend API" },
        { name: "Groq", role: "LLM Parser" },
        { name: "Playwright", role: "Browser Core" }
      ],
      bg: "linear-gradient(135deg,#2a0a2e 0%,#5e1a6e 50%,#c44569 100%)",
      monitor: "linear-gradient(180deg,#21052b,#7d1f63)",
      blueprint: {
        nodes: [
          { id: "n8n", label: "n8n Webhook", x: 10, y: 50 },
          { id: "api", label: "FastAPI Backend", x: 35, y: 50 },
          { id: "groq", label: "Groq LLM", x: 65, y: 25 },
          { id: "play", label: "Playwright Core", x: 65, y: 75 },
          { id: "out", label: "DOM Action", x: 90, y: 75 }
        ],
        edges: [
          { from: "n8n", to: "api" },
          { from: "api", to: "groq" },
          { from: "api", to: "play" },
          { from: "play", to: "out" }
        ]
      }
    },
    {
      id: "orbit-commerce",
      title: "ORBIT COMMERCE",
      tag: "BACKEND · HEADLESS",
      blurb: "Enterprise-grade headless commerce and data synchronization engine. Designed for high availability, fault tolerance, and massive data pools.",
      stack: [
        { name: "Spring Boot", role: "RESTful Core" },
        { name: "PostgreSQL", role: "Database" },
        { name: "Redis", role: "Cache Layer" },
        { name: "Docker", role: "Containers" }
      ],
      bg: "linear-gradient(135deg,#1a3c2a 0%,#2d5a3d 50%,#73ffb8 100%)",
      monitor: "linear-gradient(180deg,#0c2418,#1f6b46)",
      blueprint: {
        nodes: [
          { id: "gw", label: "API Gateway", x: 15, y: 50 },
          { id: "auth", label: "Auth Service", x: 45, y: 25 },
          { id: "cache", label: "Cache Layer", x: 45, y: 75 },
          { id: "db", label: "Database Pool", x: 80, y: 50 }
        ],
        edges: [
          { from: "gw", to: "auth" },
          { from: "gw", to: "cache" },
          { from: "gw", to: "db" },
          { from: "cache", to: "db" }
        ]
      }
    },
    {
      id: "unfinished",
      title: "UNFINISHED.EXE",
      tag: "COLLECTION",
      blurb: "The parallel world itself — a growing archive of half-built engines, design jams, and 3 a.m. prototypes.",
      stack: [
        { name: "Various", role: "Engines" },
        { name: "TBD", role: "Future" }
      ],
      bg: "linear-gradient(135deg,#1a1a2e 0%,#4f46e5 100%)",
      monitor: "linear-gradient(180deg,#0e0e1f,#3b35c9)",
      blueprint: {
        nodes: [
          { id: "lab", label: "The Lab", x: 15, y: 50 },
          { id: "p1", label: "Proto 01", x: 55, y: 20 },
          { id: "p2", label: "Proto 02", x: 55, y: 50 },
          { id: "p3", label: "Proto ??", x: 55, y: 80 },
          { id: "ship", label: "→ Shipped", x: 85, y: 50 }
        ],
        edges: [
          { from: "lab", to: "p1" },
          { from: "lab", to: "p2" },
          { from: "lab", to: "p3" },
          { from: "p1", to: "ship" }
        ]
      }
    }
  ],
  terminal: {
    boot: "ERZA-OS v1.0  ::  type `help` to begin",
    prompt: "erza@parallel-realm:~$",
    help: [
      "available commands:",
      "  help        — list commands",
      "  clear       — wipe history",
      "  skills      — print ASCII skill graph",
      "  run project — simulate a live build run",
      "  run-scraper — execute playwright DOM crawler",
      "  system-check— ping headless commerce backend",
      "  secret      — ???",
      "  whoami      — about Erza"
    ],
    whoami: [
      "Ahmed Reza (a.k.a. Erza)",
      "creative technologist · parallel realm of unfinished ideas"
    ],
    skillsAscii: `
  SKILL TREE  ::  ERZA  ::  LV.??
  ────────────────────────────────────
  [FRONTEND]   React ▰▰▰▰▰▰▰▰▰░  90
               TS    ▰▰▰▰▰▰▰▰░░  85
               CSS   ▰▰▰▰▰▰▰▰▰▰  95
  [BACKEND]    Rust  ▰▰▰▰▰▰░░░░  60
               Py    ▰▰▰▰▰▰▰▰░░  82
               Node  ▰▰▰▰▰▰▰░░░  72
  [AI/ML]      LLMs  ▰▰▰▰▰▰▰▰░░  84
               Voice ▰▰▰▰▰▰▰░░░  75
  [DESIGN]     UI/UX ▰▰▰▰▰▰▰▰▰░  90
               Pixel ▰▰▰▰▰▰▰▰▰▰  95
  ────────────────────────────────────
  > equipped: curiosity, caffeine, chaos
`,
    runProjectLog: [
      "$ ./run-project --env=parallel-realm",
      "[boot] loading kernel modules ........... ok",
      "[boot] mounting /unfinished ............. ok",
      "[boot] verifying save-state checksum .... ok",
      "[net]  reaching out to api.erza.dev ..... 200",
      "[ai]   warming up reasoning engine ...... ready",
      "[db]   connecting to postgres ........... pool=8",
      "[ws]   opening websocket /live .......... open",
      "[hmac] verifying webhook signature ...... valid",
      "[task] dispatching agent#0xA1 ........... queued",
      "[task] agent#0xA1 picked up job ......... working",
      "[task] streaming tokens ................. ░▒▓",
      "[task] tokens=1284  cost=$0.0142  t=2.41s",
      "[done] artifact written → /out/build.zip",
      "[xp]   +25 EXP gained from successful run",
      "$ _"
    ],
    runScraperLog: [
      "$ ./run-scraper --headless=true",
      "[playwright] initializing browser core ... ok",
      "[playwright] navigating to target DOM .... ok",
      "[groq]       parsing extracted HTML ...... 200ms",
      "[groq]       identifying semantic nodes .. found 42",
      "[n8n]        firing webhook payload ...... ok",
      "[success]    14 entities extracted & mapped"
    ],
    systemCheckLog: [
      "$ ./system-check --ping-all",
      "[gateway] checking reverse proxy ....... ONLINE",
      "[auth]    verifying jwt handshake ...... OK",
      "[cache]   redis cluster health ......... 99.8% hit rate",
      "[db]      postgres connection pool ..... 14/20 active",
      "[sys]     all enterprise services operational."
    ],
    secretOn: "▓▓ SECRET UNLOCKED ▓▓  +75 XP  ·  hidden theme engaged",
    secretOff: "secret theme: OFF · normal world restored",
    notFound: (cmd) => `command not found: ${cmd}`
  }
};
function AboutView() {
  const { about } = portfolioConfig;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-white px-6 pb-24 pt-32 sm:px-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-3xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.4 },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 font-pixel text-[10px] uppercase tracking-widest text-[var(--accent-purple)]", children: about.pretitle }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-5xl leading-[1.05] tracking-tight text-[var(--ink)] sm:text-7xl", children: [
          about.headlineLead,
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[var(--accent-purple)]", children: about.headlineHighlight }),
          "."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 font-pixel text-[10px] uppercase tracking-wider text-[var(--muted-foreground)]", children: about.aliasLine }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-12 grid gap-8 text-lg leading-relaxed text-[var(--ink)] sm:text-xl", children: about.bio.map((para, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: renderEmphasis(para) }, i)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4", children: about.stats.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pixel-box bg-white p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-pixel text-[10px] uppercase text-[var(--muted-foreground)]", children: s.k }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 font-display text-3xl", children: s.v }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 flex h-2 gap-[2px]", children: Array.from({ length: 10 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "flex-1",
              style: {
                background: i < Math.round(s.v / 10) ? "var(--accent-green)" : "var(--muted)"
              }
            },
            i
          )) })
        ] }, s.k)) })
      ]
    }
  ) }) });
}
function renderEmphasis(text) {
  const parts = text.split(/(\*[^*]+\*)/g);
  return parts.map(
    (p, i) => p.startsWith("*") && p.endsWith("*") ? /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: p.slice(1, -1) }, i) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: p }, i)
  );
}
function ArcadeCabinet({
  project,
  onOpen,
  onHover,
  muted
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.button,
    {
      whileHover: { y: -6 },
      whileTap: { scale: 0.97 },
      onMouseEnter: onHover,
      onClick: onOpen,
      className: "group relative flex w-[200px] shrink-0 flex-col items-center sm:w-[240px]",
      "aria-label": `Open ${project.title}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "w-full rounded-t-md border-2 border-[var(--ink)] px-3 py-2 text-center font-pixel text-[9px] uppercase tracking-widest text-white",
            style: {
              background: "repeating-linear-gradient(90deg,#7c3aed 0 8px,#5b21b6 8px 16px)",
              boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.4)"
            },
            children: project.title
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "relative w-full border-x-2 border-[var(--ink)] bg-[var(--ink)] px-3 pb-3 pt-3",
            style: { boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.04)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "relative aspect-[4/5] w-full overflow-hidden border-2 border-[var(--ink)] pixelated",
                  style: { background: project.monitor },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      motion.div,
                      {
                        "aria-hidden": true,
                        className: "absolute inset-x-0 h-1/3",
                        initial: { y: "-50%" },
                        animate: { y: "150%" },
                        transition: { duration: 4.2, repeat: Infinity, ease: "linear" },
                        style: {
                          background: "linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)"
                        }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        "aria-hidden": true,
                        className: "absolute inset-0",
                        style: {
                          backgroundImage: "linear-gradient(rgba(255,255,255,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.06) 1px,transparent 1px)",
                          backgroundSize: "8px 8px"
                        }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex flex-col justify-end p-2 font-pixel text-[7px] leading-tight text-white/90", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypingLines, { projectId: project.id }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        "aria-hidden": true,
                        className: "pointer-events-none absolute inset-0",
                        style: {
                          backgroundImage: "repeating-linear-gradient(to bottom,rgba(0,0,0,0.18) 0 1px,transparent 1px 3px)"
                        }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        "aria-hidden": true,
                        className: "pointer-events-none absolute inset-0",
                        style: {
                          background: "radial-gradient(60% 40% at 30% 20%, rgba(255,255,255,0.18), transparent 70%)"
                        }
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center justify-between rounded-sm border-2 border-[var(--ink)] bg-[#1a1a1a] px-3 py-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-3 w-3 rounded-full bg-[var(--accent-red)] border border-black" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-3 w-3 rounded-full bg-[var(--accent-yellow)] border border-black" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-3 w-3 rounded-full bg-[var(--accent-green)] border border-black" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-pixel text-[8px] uppercase tracking-widest text-white/80", children: "Insert Coin" })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "h-3 w-full rounded-b-md border-2 border-t-0 border-[var(--ink)]",
            style: { background: "#222" }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 font-pixel text-[8px] uppercase tracking-widest text-[var(--muted-foreground)]", children: project.tag }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden", children: muted ? "" : "" })
      ]
    }
  );
}
function TypingLines({ projectId }) {
  const lines = [
    "$ boot " + projectId,
    "loading modules ........ ok",
    "linking subsystems ..... ok",
    "ready ▮"
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5", children: [
    lines.map((l, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        style: {
          animation: `cab-fade 6s ${i * 1.2}s infinite`,
          opacity: 0
        },
        children: l
      },
      i
    )),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
        @keyframes cab-fade {
          0%,8% { opacity: 0; }
          12%,90% { opacity: 1; }
          100% { opacity: 0; }
        }
      ` })
  ] });
}
function Blueprint({ project }) {
  const { nodes, edges } = project.blueprint;
  const find = (id) => nodes.find((n) => n.id === id);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "relative aspect-[16/9] w-full overflow-hidden border-2 border-[var(--ink)] bg-[#0b1020]",
      style: {
        backgroundImage: "linear-gradient(rgba(255,255,255,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.06) 1px,transparent 1px)",
        backgroundSize: "20px 20px"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "svg",
          {
            className: "absolute inset-0 h-full w-full",
            viewBox: "0 0 100 100",
            preserveAspectRatio: "none",
            children: edges.map((e, i) => {
              const a = find(e.from);
              const b = find(e.to);
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                "line",
                {
                  x1: a.x,
                  y1: a.y,
                  x2: b.x,
                  y2: b.y,
                  stroke: "#7dd3fc",
                  strokeWidth: "0.4",
                  strokeDasharray: "1.2 0.8",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "animate",
                    {
                      attributeName: "stroke-dashoffset",
                      from: "0",
                      to: "-8",
                      dur: "2.5s",
                      repeatCount: "indefinite"
                    }
                  )
                },
                i
              );
            })
          }
        ),
        nodes.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap border-2 border-white/80 bg-[#1e293b] px-2 py-1 font-pixel text-[9px] uppercase tracking-wider text-white",
            style: { left: `${n.x}%`, top: `${n.y}%`, boxShadow: "3px 3px 0 0 #000" },
            children: n.label
          },
          n.id
        ))
      ]
    }
  );
}
let ctx = null;
function getCtx() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}
function play(notes, muted) {
  if (muted) return;
  const ac = getCtx();
  if (!ac) return;
  const now = ac.currentTime;
  for (const n of notes) {
    const osc = ac.createOscillator();
    const g = ac.createGain();
    osc.type = n.type ?? "square";
    osc.frequency.setValueAtTime(n.f, now + n.t);
    const peak = n.gain ?? 0.06;
    g.gain.setValueAtTime(1e-4, now + n.t);
    g.gain.exponentialRampToValueAtTime(peak, now + n.t + 5e-3);
    g.gain.exponentialRampToValueAtTime(1e-4, now + n.t + n.d);
    osc.connect(g).connect(ac.destination);
    osc.start(now + n.t);
    osc.stop(now + n.t + n.d + 0.02);
  }
}
const sfx = {
  blip: (m) => play([{ f: 660, t: 0, d: 0.06 }], m),
  click: (m) => play(
    [
      { f: 880, t: 0, d: 0.05 },
      { f: 1320, t: 0.04, d: 0.07 }
    ],
    m
  ),
  hover: (m) => play([{ f: 520, t: 0, d: 0.04, gain: 0.04 }], m),
  open: (m) => play(
    [
      { f: 392, t: 0, d: 0.09 },
      { f: 523, t: 0.08, d: 0.09 },
      { f: 659, t: 0.16, d: 0.09 },
      { f: 880, t: 0.24, d: 0.18, type: "triangle" }
    ],
    m
  ),
  levelUp: (m) => play(
    [
      { f: 523, t: 0, d: 0.1 },
      { f: 659, t: 0.1, d: 0.1 },
      { f: 784, t: 0.2, d: 0.1 },
      { f: 1046, t: 0.3, d: 0.18 },
      { f: 1318, t: 0.5, d: 0.28, type: "triangle", gain: 0.08 }
    ],
    m
  ),
  type: (m) => play([{ f: 1100, t: 0, d: 0.02, gain: 0.03 }], m),
  error: (m) => play(
    [
      { f: 220, t: 0, d: 0.12, type: "sawtooth" },
      { f: 165, t: 0.12, d: 0.18, type: "sawtooth" }
    ],
    m
  )
};
const XP_PER_LEVEL = 100;
const STORAGE_KEY = "erza.gamestate.v1";
const GameCtx = reactExports.createContext(null);
const initial = {
  xp: 0,
  level: 1,
  muted: false,
  crtOn: true,
  secretTheme: false,
  visited: []
};
function loadPersisted() {
  if (typeof window === "undefined") return initial;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initial;
    return { ...initial, ...JSON.parse(raw) };
  } catch {
    return initial;
  }
}
function GameProvider({ children }) {
  const [state, setState] = reactExports.useState(initial);
  const [hydrated, setHydrated] = reactExports.useState(false);
  const [leveledUp, setLeveledUp] = reactExports.useState(null);
  const lastLevel = reactExports.useRef(1);
  reactExports.useEffect(() => {
    const p = loadPersisted();
    lastLevel.current = p.level;
    setState(p);
    setHydrated(true);
  }, []);
  reactExports.useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
    }
  }, [state, hydrated]);
  reactExports.useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("secret-theme", state.secretTheme);
  }, [state.secretTheme]);
  const addXp = reactExports.useCallback((amount) => {
    setState((s) => {
      const totalXp = s.xp + amount;
      const newLevel = 1 + Math.floor(totalXp / XP_PER_LEVEL);
      if (newLevel > lastLevel.current) {
        lastLevel.current = newLevel;
        setLeveledUp(newLevel);
        sfx.levelUp(s.muted);
      }
      return { ...s, xp: totalXp, level: newLevel };
    });
  }, []);
  const toggleMute = reactExports.useCallback(
    () => setState((s) => ({ ...s, muted: !s.muted })),
    []
  );
  const toggleCRT = reactExports.useCallback(
    () => setState((s) => ({ ...s, crtOn: !s.crtOn })),
    []
  );
  const toggleSecretTheme = reactExports.useCallback(
    () => setState((s) => ({ ...s, secretTheme: !s.secretTheme })),
    []
  );
  const markVisited = reactExports.useCallback((key) => {
    setState((s) => {
      if (s.visited.includes(key)) return s;
      const next = { ...s, visited: [...s.visited, key], xp: s.xp + 5 };
      const newLevel = 1 + Math.floor(next.xp / XP_PER_LEVEL);
      if (newLevel > lastLevel.current) {
        lastLevel.current = newLevel;
        setLeveledUp(newLevel);
        sfx.levelUp(s.muted);
      }
      next.level = newLevel;
      return next;
    });
  }, []);
  reactExports.useEffect(() => {
    if (leveledUp == null) return;
    const t = setTimeout(() => setLeveledUp(null), 2400);
    return () => clearTimeout(t);
  }, [leveledUp]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    GameCtx.Provider,
    {
      value: {
        ...state,
        addXp,
        toggleMute,
        toggleCRT,
        toggleSecretTheme,
        markVisited,
        sfx
      },
      children: [
        children,
        leveledUp != null && /* @__PURE__ */ jsxRuntimeExports.jsx(LevelUpBannerInline, { level: leveledUp })
      ]
    }
  );
}
function useGame() {
  const c = reactExports.useContext(GameCtx);
  if (!c) throw new Error("useGame outside GameProvider");
  return c;
}
const XP_THRESHOLD = XP_PER_LEVEL;
function LevelUpBannerInline({ level }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "aria-live": "polite",
      className: "pointer-events-none fixed inset-0 z-[80] flex items-center justify-center",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "font-pixel text-2xl uppercase tracking-widest text-white sm:text-4xl",
            style: {
              padding: "1rem 2rem",
              background: "var(--accent-purple, #6d28d9)",
              border: "3px solid #000",
              boxShadow: "8px 8px 0 0 #000",
              animation: "lvlup-pop 2.4s ease-out forwards"
            },
            children: [
              "◤ LEVEL UP! ◢",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 text-center font-pixel text-xs opacity-90", children: [
                "LV. ",
                level
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
        @keyframes lvlup-pop {
          0% { transform: scale(0.4); opacity: 0; }
          15% { transform: scale(1.1); opacity: 1; }
          25% { transform: scale(1); }
          85% { transform: scale(1); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0; }
        }
      ` })
      ]
    }
  );
}
function PortfolioView() {
  const [open, setOpen] = reactExports.useState(null);
  const { addXp, sfx: sfx2, muted } = useGame();
  const { arcade, projects } = portfolioConfig;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-white pt-24", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-6xl px-4 pb-24 sm:px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-pixel text-[10px] uppercase tracking-widest text-[var(--accent-purple)]", children: arcade.eyebrow }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "h1",
          {
            className: "mt-3 font-display tracking-tight",
            style: {
              fontSize: "clamp(3rem,9vw,7rem)",
              color: "var(--accent-blue)",
              textShadow: "5px 5px 0 var(--ink)",
              lineHeight: 0.9
            },
            children: arcade.title
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 font-pixel text-[9px] uppercase tracking-widest text-[var(--muted-foreground)]", children: arcade.subtitle })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-6 sm:mx-0 sm:gap-6 sm:px-2",
            style: {
              scrollPaddingLeft: "1rem",
              scrollPaddingRight: "1rem",
              WebkitOverflowScrolling: "touch",
              overscrollBehaviorX: "contain"
            },
            children: projects.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "shrink-0 snap-center",
                style: { scrollSnapStop: "always" },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ArcadeCabinet,
                  {
                    project: p,
                    muted,
                    onHover: () => sfx2.hover(muted),
                    onOpen: () => {
                      sfx2.open(muted);
                      addXp(20, "open-project");
                      setOpen(p);
                    }
                  }
                )
              },
              p.id
            ))
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-center font-pixel text-[8px] uppercase tracking-widest text-[var(--muted-foreground)]", children: arcade.scrollHint })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: open && /* @__PURE__ */ jsxRuntimeExports.jsx(ProjectOverlay, { project: open, onClose: () => setOpen(null) }) })
  ] });
}
function ProjectOverlay({
  project,
  onClose
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      className: "fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto p-4 backdrop-blur-md",
      style: { background: "rgba(0,0,0,0.55)" },
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      onClick: onClose,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { scale: 0.85, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 0.9, opacity: 0 },
          transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
          onClick: (e) => e.stopPropagation(),
          className: "pixel-box-lg my-8 w-full max-w-4xl overflow-hidden rounded-md border-2 border-[var(--ink)] bg-white",
          style: { willChange: "transform, opacity", transform: "translateZ(0)" },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center justify-between border-b-2 border-[var(--ink)] px-4 py-3",
                style: { background: project.bg },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-pixel text-[10px] uppercase tracking-widest text-white", children: [
                    "▶ POWER UP — ",
                    project.title
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: onClose,
                      className: "rounded-sm border-2 border-[var(--ink)] bg-white px-3 py-1 font-pixel text-[9px] uppercase tracking-wider",
                      children: "✕ Close"
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 p-6 lg:grid-cols-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-pixel text-[9px] uppercase tracking-widest text-[var(--accent-purple)]", children: project.tag }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-2 font-display text-4xl leading-none", children: project.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-[var(--ink)]", children: project.blurb }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-pixel text-[9px] uppercase tracking-widest text-[var(--muted-foreground)]", children: "◤ Tech Matrix" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2", children: project.stack.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "flex items-center justify-between border-2 border-[var(--ink)] bg-[var(--muted)] px-3 py-2",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-pixel text-[10px] uppercase", children: t.name }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-pixel text-[8px] uppercase tracking-wider text-[var(--muted-foreground)]", children: t.role })
                      ]
                    },
                    t.name
                  )) })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-pixel text-[9px] uppercase tracking-widest text-[var(--muted-foreground)]", children: "◤ Architecture Blueprint" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Blueprint, { project }) })
              ] })
            ] })
          ]
        }
      )
    }
  );
}
const ICONS = {
  instagram: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "white", strokeWidth: "2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "3", y: "3", width: "18", height: "18", rx: "5" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "4" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "17.5", cy: "6.5", r: "1", fill: "white" })
  ] }),
  linkedin: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 24 24", fill: "white", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M4.98 3.5a2.5 2.5 0 11.02 5 2.5 2.5 0 01-.02-5zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-1 1.83-2.05 3.76-2.05 4.02 0 4.76 2.64 4.76 6.08V21h-4v-5.4c0-1.3-.02-2.97-1.8-2.97-1.8 0-2.07 1.4-2.07 2.87V21h-4z" }) }),
  spotify: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: "0 0 24 24", fill: "white", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "10", fill: "white" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "path",
      {
        fill: "#1db954",
        d: "M17.3 16.4c-.2.3-.6.4-.9.2-2.4-1.5-5.5-1.8-9.1-1-.4.1-.7-.2-.8-.5-.1-.4.2-.7.5-.8 3.9-.9 7.3-.5 10 1.1.3.2.4.6.3.9zm1.4-3c-.3.4-.8.5-1.2.2-2.8-1.7-7-2.2-10.3-1.2-.4.1-.9-.1-1-.6-.1-.4.1-.9.6-1 3.8-1.2 8.4-.6 11.6 1.4.4.2.5.8.3 1.2zm.1-3.1c-3.3-2-8.8-2.1-12-1.2-.5.2-1.1-.2-1.2-.7-.2-.5.2-1.1.7-1.2 3.7-1.1 9.7-.9 13.5 1.4.5.3.7 1 .4 1.5-.3.4-1 .6-1.4.2z"
      }
    )
  ] }),
  tiktok: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 24 24", fill: "white", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M20 8.5a6.5 6.5 0 01-4-1.4V15a5 5 0 11-5-5v3a2 2 0 102 2V3h3a4 4 0 004 4z" }) }),
  github: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 24 24", fill: "white", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 2a10 10 0 00-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.56 9.56 0 015 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .26.18.58.69.48A10 10 0 0012 2z" }) })
};
function ContactView() {
  const { contact, identity } = portfolioConfig;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "scanlines flex min-h-screen flex-col items-center justify-center bg-white px-6 pt-24", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.4 },
      className: "flex flex-col items-center gap-10 text-center",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-pixel text-[10px] uppercase tracking-widest text-[var(--accent-purple)]", children: contact.pretitle }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pixel-box flex items-center gap-3 rounded-full bg-white py-2 pl-2 pr-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-10 w-10 place-items-center overflow-hidden rounded-full border-2 border-[var(--ink)] bg-[var(--accent-purple)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { transform: "translateY(2px)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(PixelAvatar, { size: 32 }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-pixel text-[10px] uppercase tracking-wider", children: identity.handle })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-5xl leading-none tracking-tight sm:text-7xl", children: [
          contact.headlineLead,
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[var(--accent-purple)]", children: contact.headlineHighlight }),
          "."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "max-w-md text-[var(--muted-foreground)]", children: contact.blurb }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4", children: contact.socials.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "a",
          {
            href: s.href,
            target: "_blank",
            rel: "noreferrer",
            className: "pixel-box group flex h-16 w-16 items-center justify-center rounded-2xl transition-transform hover:-translate-y-1",
            style: { background: s.bg },
            "aria-label": s.name,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-7 w-7", children: ICONS[s.key] })
          },
          s.key
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 font-pixel text-[8px] uppercase tracking-widest text-[var(--muted-foreground)]", children: contact.pressStart })
      ]
    }
  ) });
}
const items = [
  { id: "home", label: "Home" },
  { id: "about", label: "About Me" },
  { id: "portfolio", label: "Portfolio" },
  { id: "contact", label: "Contact Me" }
];
function NavMenu({ current, onNavigate }) {
  const [open, setOpen] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed left-4 top-4 z-50 flex flex-col items-start gap-2 sm:left-6 sm:top-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: () => setOpen((o) => !o),
        className: "flex items-center gap-2 rounded-full bg-[var(--accent-purple)] px-5 py-2.5 font-pixel text-[10px] uppercase tracking-wider text-white pixel-box transition-transform hover:-translate-y-0.5",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "inline-block h-2 w-2 rounded-full bg-white transition-transform",
              style: { transform: open ? "rotate(45deg)" : "none" }
            }
          ),
          "Navigate"
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: open && /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.ul,
      {
        initial: { opacity: 0, y: -8 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -8 },
        transition: { duration: 0.18 },
        className: "flex flex-col gap-2",
        children: items.map((it, i) => {
          const active = current === it.id;
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.li,
            {
              initial: { opacity: 0, x: -10 },
              animate: { opacity: 1, x: 0 },
              transition: { delay: i * 0.04 },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => {
                    onNavigate(it.id);
                    setOpen(false);
                  },
                  className: `rounded-full px-5 py-2 font-pixel text-[9px] uppercase tracking-wider pixel-box transition-transform hover:-translate-y-0.5 ${active ? "bg-[var(--ink)] text-white" : "bg-white text-[var(--ink)]"}`,
                  children: it.label
                }
              )
            },
            it.id
          );
        })
      }
    ) })
  ] });
}
const gpu = {
  transform: "translateZ(0)",
  willChange: "opacity",
  backfaceVisibility: "hidden"
};
function CRTOverlay() {
  const { crtOn } = useGame();
  if (!crtOn) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        "aria-hidden": true,
        className: "pointer-events-none fixed inset-0 z-[60] animate-flicker",
        style: {
          ...gpu,
          backgroundImage: "repeating-linear-gradient(to bottom, rgba(0,0,0,0.06) 0, rgba(0,0,0,0.06) 1px, transparent 1px, transparent 3px)",
          mixBlendMode: "multiply"
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        "aria-hidden": true,
        className: "pointer-events-none fixed inset-0 z-[59]",
        style: {
          ...gpu,
          background: "radial-gradient(120% 80% at 50% 50%, transparent 55%, rgba(0,0,0,0.18) 100%)"
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        "aria-hidden": true,
        className: "pointer-events-none fixed inset-0 z-[59]",
        style: {
          ...gpu,
          background: "radial-gradient(80% 60% at 50% 30%, rgba(120,180,255,0.06), transparent 70%)",
          mixBlendMode: "screen"
        }
      }
    )
  ] });
}
function XPBar() {
  const { xp, level } = useGame();
  const into = xp % XP_THRESHOLD;
  const pct = into / XP_THRESHOLD * 100;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed left-1/2 top-2 z-[55] w-[min(92vw,520px)] -translate-x-1/2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-md border-2 border-[var(--ink)] bg-white/95 px-3 py-1.5 backdrop-blur pixel-box-sm shadow-[3px_3px_0_0_var(--ink)]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-pixel text-[9px] uppercase tracking-wider", children: [
      "LV.",
      level
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-3 flex-1 overflow-hidden border-2 border-[var(--ink)] bg-[var(--muted)]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "h-full transition-[width] duration-500",
          style: {
            width: `${pct}%`,
            background: "repeating-linear-gradient(90deg, var(--accent-purple) 0 6px, oklch(0.45 0.24 295) 6px 12px)"
          }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 pointer-events-none", style: {
        background: "repeating-linear-gradient(to bottom, rgba(255,255,255,0.18) 0 1px, transparent 1px 3px)"
      } })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-pixel text-[8px] tabular-nums", children: [
      into,
      "/",
      XP_THRESHOLD
    ] })
  ] }) });
}
function SettingsToggles() {
  const { crtOn, muted, toggleCRT, toggleMute, sfx: sfx2 } = useGame();
  const btn = "h-9 px-3 font-pixel text-[9px] uppercase tracking-wider border-2 border-[var(--ink)] shadow-[3px_3px_0_0_var(--ink)] bg-white hover:-translate-y-0.5 transition-transform";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed right-3 top-3 z-[58] flex gap-2 sm:right-5 sm:top-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        className: btn,
        onClick: () => {
          sfx2.click(muted);
          toggleCRT();
        },
        "aria-pressed": crtOn,
        title: "Toggle CRT effect",
        children: [
          "CRT: ",
          crtOn ? "ON" : "OFF"
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        className: btn,
        onClick: () => {
          sfx2.click(false);
          toggleMute();
        },
        "aria-pressed": !muted,
        title: "Toggle sound",
        children: muted ? "🔇 MUTE" : "🔊 SND"
      }
    )
  ] });
}
const T = portfolioConfig.terminal;
function Terminal() {
  const { addXp, sfx: sfx2, muted, toggleSecretTheme, secretTheme } = useGame();
  const [open, setOpen] = reactExports.useState(false);
  const [history, setHistory] = reactExports.useState([
    { kind: "out", text: T.boot }
  ]);
  const [input, setInput] = reactExports.useState("");
  const [running, setRunning] = reactExports.useState(false);
  const scrollRef = reactExports.useRef(null);
  const bottomRef = reactExports.useRef(null);
  const inputRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (!open) return;
    bottomRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [history, open, running]);
  const print = (lines) => setHistory((h) => [...h, ...lines]);
  const simulateLog = async (logArray) => {
    setRunning(true);
    for (const ln of logArray) {
      await new Promise((r) => setTimeout(r, 220));
      sfx2.type(muted);
      print([{ kind: "out", text: ln }]);
    }
    addXp(15, "terminal-run");
    setRunning(false);
  };
  const exec = async (raw) => {
    const cmd = raw.trim().toLowerCase();
    print([{ kind: "in", text: `> ${raw}` }]);
    if (!cmd) return;
    if (cmd === "help")
      return print(T.help.map((t) => ({ kind: "out", text: t })));
    if (cmd === "clear") return setHistory([]);
    if (cmd === "whoami")
      return print(T.whoami.map((t) => ({ kind: "out", text: t })));
    if (cmd === "skills") {
      return print(
        T.skillsAscii.split("\n").map((t) => ({ kind: "out", text: t }))
      );
    }
    if (cmd === "run project" || cmd === "run") {
      return simulateLog(T.runProjectLog);
    }
    if (cmd === "run-scraper") {
      return simulateLog(T.runScraperLog);
    }
    if (cmd === "system-check") {
      return simulateLog(T.systemCheckLog);
    }
    if (cmd === "secret") {
      toggleSecretTheme();
      addXp(75, "secret");
      sfx2.levelUp(muted);
      return print([
        {
          kind: "out",
          text: secretTheme ? T.secretOff : T.secretOn
        }
      ]);
    }
    sfx2.error(muted);
    return print([{ kind: "err", text: T.notFound(cmd) }]);
  };
  const onSubmit = (e) => {
    e.preventDefault();
    if (running) return;
    const v = input;
    setInput("");
    void exec(v);
  };
  const toggle = () => {
    sfx2.click(muted);
    addXp(10, "toggle-terminal");
    setOpen((o) => !o);
    setTimeout(() => inputRef.current?.focus(), 50);
  };
  const dismissKeyboard = () => {
    inputRef.current?.blur();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: toggle,
        className: "fixed bottom-3 right-3 z-[57] flex items-center gap-2 rounded-sm border-2 border-[var(--ink)] bg-[var(--ink)] px-3 py-2 font-pixel text-[9px] uppercase tracking-widest text-[var(--accent-green)] shadow-[3px_3px_0_0_var(--accent-green)] transition-transform hover:-translate-y-0.5",
        "aria-expanded": open,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2 w-2 animate-pulse rounded-full bg-[var(--accent-green)]" }),
          open ? "Close Term" : "▶ Terminal"
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: open && /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { y: 400, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: 400, opacity: 0 },
        transition: { type: "spring", stiffness: 220, damping: 26 },
        className: "fixed inset-x-2 bottom-2 z-[56] sm:inset-x-6",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pixel-box-lg overflow-hidden rounded-md border-2 border-[var(--ink)] bg-[#0a0e14]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 border-b-2 border-[var(--ink)] bg-[#11161f] px-3 py-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate font-pixel text-[9px] uppercase tracking-widest text-[var(--accent-green)]", children: T.prompt }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: dismissKeyboard,
                  className: "rounded-sm border border-[var(--accent-green)] px-2 py-0.5 font-pixel text-[8px] uppercase tracking-widest text-[var(--accent-green)] sm:hidden",
                  "aria-label": "Dismiss keyboard",
                  type: "button",
                  children: "⌄ kbd"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: toggle,
                  className: "rounded-sm border border-[var(--accent-red)] px-2 py-0.5 font-pixel text-[8px] uppercase tracking-widest text-[var(--accent-red)]",
                  "aria-label": "Close terminal",
                  type: "button",
                  children: "✕ close"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden gap-1.5 sm:flex", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-3 w-3 rounded-full border border-black bg-[var(--accent-red)]" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-3 w-3 rounded-full border border-black bg-[var(--accent-yellow)]" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-3 w-3 rounded-full border border-black bg-[var(--accent-green)]" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              ref: scrollRef,
              className: "h-56 overflow-y-auto px-3 py-2 font-pixel text-[10px] leading-relaxed text-[var(--accent-green)] sm:h-64",
              onClick: () => inputRef.current?.focus(),
              style: { overscrollBehavior: "contain" },
              children: [
                history.map((l, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "pre",
                  {
                    className: "whitespace-pre-wrap break-words",
                    style: {
                      color: l.kind === "err" ? "var(--accent-red)" : l.kind === "in" ? "#fff" : void 0,
                      fontFamily: "var(--font-pixel)"
                    },
                    children: l.text
                  },
                  i
                )),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit, className: "mt-1 flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white", children: ">" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      ref: inputRef,
                      value: input,
                      onChange: (e) => setInput(e.target.value),
                      disabled: running,
                      className: "flex-1 bg-transparent font-pixel text-[10px] text-white outline-none",
                      placeholder: running ? "running…" : "type a command",
                      autoComplete: "off",
                      spellCheck: false,
                      enterKeyHint: "send"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: bottomRef })
              ]
            }
          )
        ] })
      }
    ) })
  ] });
}
function Index() {
  const [view, setView] = reactExports.useState("loading");
  const {
    markVisited,
    sfx: sfx2,
    muted
  } = useGame();
  reactExports.useEffect(() => {
    if (view !== "loading") markVisited(view);
  }, [view, markVisited]);
  const navigate = (v) => {
    sfx2.click(muted);
    setView(v);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative min-h-screen overflow-x-hidden bg-white", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CRTOverlay, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(XPBar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SettingsToggles, {}),
    view !== "loading" && /* @__PURE__ */ jsxRuntimeExports.jsx(NavMenu, { current: view, onNavigate: navigate }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
      opacity: 0,
      filter: "blur(6px)"
    }, animate: {
      opacity: 1,
      filter: "blur(0px)"
    }, exit: {
      opacity: 0,
      filter: "blur(6px)"
    }, transition: {
      duration: 0.35
    }, children: [
      view === "loading" && /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingScreen, { onDone: () => setView("home") }),
      view === "home" && /* @__PURE__ */ jsxRuntimeExports.jsx(HomeMenu, { onNavigate: navigate }),
      view === "about" && /* @__PURE__ */ jsxRuntimeExports.jsx(AboutView, {}),
      view === "portfolio" && /* @__PURE__ */ jsxRuntimeExports.jsx(PortfolioView, {}),
      view === "contact" && /* @__PURE__ */ jsxRuntimeExports.jsx(ContactView, {})
    ] }, view) }),
    view !== "loading" && /* @__PURE__ */ jsxRuntimeExports.jsx(Terminal, {})
  ] });
}
const SplitComponent = () => /* @__PURE__ */ jsxRuntimeExports.jsx(GameProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Index, {}) });
export {
  SplitComponent as component
};
