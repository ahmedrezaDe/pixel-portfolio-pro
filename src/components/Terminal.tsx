import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useGame } from "@/lib/game-state";
import { portfolioConfig } from "@/lib/portfolioConfig";

type Line = { kind: "in" | "out" | "err"; text: string };

const T = portfolioConfig.terminal;

export function Terminal() {
  const { addXp, sfx, muted, toggleSecretTheme } = useGame();
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<Line[]>([
    { kind: "out", text: T.boot },
  ]);
  const [input, setInput] = useState("");
  const [running, setRunning] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    bottomRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [history, open, running]);

  const print = (lines: Line[]) => setHistory((h) => [...h, ...lines]);

  const simulateLog = async (logArray: string[]) => {
    setRunning(true);
    for (const ln of logArray) {
      await new Promise((r) => setTimeout(r, 220));
      sfx.type(muted);
      print([{ kind: "out", text: ln }]);
    }
    addXp(15, "terminal-run");
    setRunning(false);
  };

  const exec = async (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    print([{ kind: "in", text: `> ${raw}` }]);
    if (!cmd) return;

    if (cmd === "help") return print(T.help.map((t) => ({ kind: "out", text: t })));
    if (cmd === "clear") return setHistory([]);
    if (cmd === "whoami") return print(T.whoami.map((t) => ({ kind: "out", text: t })));
    if (cmd === "skills") {
      return print(T.skillsAscii.split("\n").map((t) => ({ kind: "out", text: t })));
    }
    
    if (cmd === "run project" || cmd === "run") return simulateLog(T.runProjectLog);
    if (cmd === "run-scraper") return simulateLog(T.runScraperLog);
    if (cmd === "system-check") return simulateLog(T.systemCheckLog);

    if (cmd === "secret") {
      setRunning(true);
      sfx.error(muted); 
      print([{ kind: "err", text: "> WARNING: LOCATING UNFINISHED_IDEA..." }]);

      setTimeout(() => {
        print([{ kind: "err", text: "> TRACE FOUND AT ROOT/THE_VOID." }]);
        sfx.type(muted);
      }, 1000);

      setTimeout(() => {
        print([{ kind: "err", text: "> INITIALIZING CONTAINMENT... [CRITICAL ERROR]" }]);
        sfx.error(muted);
      }, 2200);

      setTimeout(() => {
        toggleSecretTheme(); 
        addXp(500, "void-breach");
        sfx.levelUp(muted);
        setRunning(false);
      }, 3500);
      return;
    }

    sfx.error(muted);
    return print([{ kind: "err", text: T.notFound(cmd) }]);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (running) return;
    const v = input;
    setInput("");
    void exec(v);
  };

  const toggle = () => {
    sfx.click(muted);
    addXp(10, "toggle-terminal");
    setOpen((o) => !o);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const dismissKeyboard = () => {
    inputRef.current?.blur();
  };

  return (
    <>
      <button
        onClick={toggle}
        className="fixed bottom-3 right-3 z-[57] flex items-center gap-2 rounded-sm border-2 border-[var(--ink)] bg-[var(--ink)] px-3 py-2 font-pixel text-[9px] uppercase tracking-widest text-[var(--accent-green)] shadow-[3px_3px_0_0_var(--accent-green)] transition-transform hover:-translate-y-0.5"
        aria-expanded={open}
      >
        <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--accent-green)]" />
        {open ? "Close Term" : "▶ Terminal"}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ y: 400, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 400, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 26 }}
            className="fixed inset-x-2 bottom-2 z-[56] sm:inset-x-6"
          >
            <div className="pixel-box-lg overflow-hidden rounded-md border-2 border-[var(--ink)] bg-[#0a0e14]">
              <div className="flex items-center justify-between gap-2 border-b-2 border-[var(--ink)] bg-[#11161f] px-3 py-1.5">
                <span className="truncate font-pixel text-[9px] uppercase tracking-widest text-[var(--accent-green)]">
                  {T.prompt}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={dismissKeyboard}
                    className="rounded-sm border border-[var(--accent-green)] px-2 py-0.5 font-pixel text-[8px] uppercase tracking-widest text-[var(--accent-green)] sm:hidden"
                    aria-label="Dismiss keyboard"
                    type="button"
                  >
                    ⌄ kbd
                  </button>
                  <button
                    onClick={toggle}
                    className="rounded-sm border border-[var(--accent-red)] px-2 py-0.5 font-pixel text-[8px] uppercase tracking-widest text-[var(--accent-red)]"
                    aria-label="Close terminal"
                    type="button"
                  >
                    ✕ close
                  </button>
                  <div className="hidden gap-1.5 sm:flex">
                    <span className="h-3 w-3 rounded-full border border-black bg-[var(--accent-red)]" />
                    <span className="h-3 w-3 rounded-full border border-black bg-[var(--accent-yellow)]" />
                    <span className="h-3 w-3 rounded-full border border-black bg-[var(--accent-green)]" />
                  </div>
                </div>
              </div>

              <div
                ref={scrollRef}
                className="h-56 overflow-y-auto px-3 py-2 font-pixel text-[10px] leading-relaxed text-[var(--accent-green)] sm:h-64"
                onClick={() => inputRef.current?.focus()}
                style={{ overscrollBehavior: "contain" }}
              >
                {history.map((l, i) => (
                  <pre
                    key={i}
                    className="whitespace-pre-wrap break-words"
                    style={{
                      color:
                        l.kind === "err"
                          ? "var(--accent-red)"
                          : l.kind === "in"
                            ? "#fff"
                            : undefined,
                      fontFamily: "var(--font-pixel)",
                    }}
                  >
                    {l.text}
                  </pre>
                ))}
                <form onSubmit={onSubmit} className="mt-1 flex items-center gap-2">
                  <span className="text-white">{">"}</span>
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={running}
                    className="flex-1 bg-transparent font-pixel text-[10px] text-white outline-none"
                    placeholder={running ? "running…" : "type a command"}
                    autoComplete="off"
                    spellCheck={false}
                    enterKeyHint="send"
                  />
                </form>
                <div ref={bottomRef} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}