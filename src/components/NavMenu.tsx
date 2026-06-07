import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { View } from "@/lib/views";

const items: { id: View; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "about", label: "About Me" },
  { id: "portfolio", label: "Portfolio" },
  { id: "contact", label: "Contact Me" },
];

export function NavMenu({ current, onNavigate }: { current: View; onNavigate: (v: View) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed left-4 top-4 z-50 flex flex-col items-start gap-2 sm:left-6 sm:top-6">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full bg-[var(--accent-purple)] px-5 py-2.5 font-pixel text-[10px] uppercase tracking-wider text-white pixel-box transition-transform hover:-translate-y-0.5"
      >
        <span
          className="inline-block h-2 w-2 rounded-full bg-white transition-transform"
          style={{ transform: open ? "rotate(45deg)" : "none" }}
        />
        Navigate
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="flex flex-col gap-2"
          >
            {items.map((it, i) => {
              const active = current === it.id;
              return (
                <motion.li
                  key={it.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <button
                    onClick={() => {
                      onNavigate(it.id);
                      setOpen(false);
                    }}
                    className={`rounded-full px-5 py-2 font-pixel text-[9px] uppercase tracking-wider pixel-box transition-transform hover:-translate-y-0.5 ${
                      active
                        ? "bg-[var(--ink)] text-white"
                        : "bg-white text-[var(--ink)]"
                    }`}
                  >
                    {it.label}
                  </button>
                </motion.li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
