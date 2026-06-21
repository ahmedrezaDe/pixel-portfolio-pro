import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useGame } from "@/lib/game-state";
import { skillsAscii, runProjectLog } from "@/lib/data/skills";

type Line = { kind: "in" | "out" | "err"; text: string };

const HELP = [
  "available commands:",
  "  help        — list commands",
  "  clear       — wipe history",
  "  skills      — print ASCII skill graph",
  "  run project — simulate a live build run",
  "  secret      — ???",
  "  whoami      — about Erza",
];

export function Terminal() {
  const { addXp, sfx, muted, toggleSecretTheme, secretTheme } = useGame();
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<Line[]>([
    { kind: "out", text: "ERZA-OS v1.0  ::  type `help` to begin" },
  ]);
  const [input, setInput] = useState("");
  const [running, setRunning] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 9e9 });
  }, [history, open]);

  const print = (lines: Line[]) =>
    setHistory((h) => [...h, ...lines]);

  const exec = async (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    print([{ kind: "in", text: `> ${raw}` }]);
    if (!cmd) return;

    if (cmd === "help") return print(HELP.map((t) => ({ kind: "out", text: t })));
    if (cmd === "clear") return setHistory([]);
    if (cmd === "whoami")
      return print([
        { kind: "out", text: "Ahmed Reza (a.k.a. Erza)" },
        { kind: "out", text: "creative technologist · parallel realm of unfinished ideas" },
      ]);
    if (cmd === "skills") {
      return print(
        skillsAscii.split("\n").map((t) => ({ kind: "out", text: t })),
      );
    }
    if (cmd === "run project" || cmd === "run") {
      setRunning(true);
      for (const ln of runProjectLog) {
        await new Promise((r) => setTimeout(r, 220));
        sfx.type(muted);
        print([{ kind: "out", text: ln }]);
      }
      addXp(15, "terminal-run");
      setRunning(false);
      return;
    }
    if (cmd === "secret") {
      toggleSecretTheme();
      addXp(75, "secret");
      sfx.levelUp(muted);
      return print([
        {
          kind: "out",
          text: secretTheme
            ? "secret theme: OFF · normal world restored"
            : "▓▓ SECRET UNLOCKED ▓▓  +75 XP  ·  hidden theme engaged",
        },
      ]);
    }
    sfx.error(muted);
    return print([{ kind: "err", text: `command not found: ${cmd}` }]);
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

  return (
    <>
      <button
        onClick={toggle}
        className="fixed bottom-3 right-3 z-[57] flex items-center gap-2 rounded-sm border-2 border-[var(--ink)] bg-[var(--ink)] px-3 py-2 font-pixel text-[9px] uppercase tracking-widest text-[var(--accent-green)] shadow-[3px_3px_0_0_var(--accent-green)] hover:-translate-y-0.5 transition-transform"
        aria-expanded={open}
      >
        <span className="h-2 w-2 rounded-full bg-[var(--accent-green)] animate-pulse" />
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
            <div className="overflow-hidden rounded-md border-2 border-[var(--ink)] bg-[#0a0e14] pixel-box-lg">
              <div className="flex items-center justify-between border-b-2 border-[var(--ink)] bg-[#11161f] px-3 py-1.5">
                <span className="font-pixel text-[9px] uppercase tracking-widest text-[var(--accent-green)]">
                  erza@parallel-realm:~$
                </span>
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-[var(--accent-red)] border border-black" />
                  <span className="h-3 w-3 rounded-full bg-[var(--accent-yellow)] border border-black" />
                  <span className="h-3 w-3 rounded-full bg-[var(--accent-green)] border border-black" />
                </div>
              </div>

              <div
                ref={scrollRef}
                className="h-56 overflow-y-auto px-3 py-2 font-pixel text-[10px] leading-relaxed text-[var(--accent-green)] sm:h-64"
                onClick={() => inputRef.current?.focus()}
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
                  />
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
