import type { ReactNode } from "react";
import { motion } from "motion/react";
import { PixelAvatar } from "./PixelAvatar";
import { portfolioConfig, type SocialKey } from "@/lib/portfolioConfig";

const ICONS: Record<SocialKey, ReactNode> = {
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="white" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="white">
      <path d="M4.98 3.5a2.5 2.5 0 11.02 5 2.5 2.5 0 01-.02-5zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-1 1.83-2.05 3.76-2.05 4.02 0 4.76 2.64 4.76 6.08V21h-4v-5.4c0-1.3-.02-2.97-1.8-2.97-1.8 0-2.07 1.4-2.07 2.87V21h-4z" />
    </svg>
  ),
  spotify: (
    <svg viewBox="0 0 24 24" fill="white">
      <circle cx="12" cy="12" r="10" fill="white" />
      <path
        fill="#1db954"
        d="M17.3 16.4c-.2.3-.6.4-.9.2-2.4-1.5-5.5-1.8-9.1-1-.4.1-.7-.2-.8-.5-.1-.4.2-.7.5-.8 3.9-.9 7.3-.5 10 1.1.3.2.4.6.3.9zm1.4-3c-.3.4-.8.5-1.2.2-2.8-1.7-7-2.2-10.3-1.2-.4.1-.9-.1-1-.6-.1-.4.1-.9.6-1 3.8-1.2 8.4-.6 11.6 1.4.4.2.5.8.3 1.2zm.1-3.1c-3.3-2-8.8-2.1-12-1.2-.5.2-1.1-.2-1.2-.7-.2-.5.2-1.1.7-1.2 3.7-1.1 9.7-.9 13.5 1.4.5.3.7 1 .4 1.5-.3.4-1 .6-1.4.2z"
      />
    </svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" fill="white">
      <path d="M20 8.5a6.5 6.5 0 01-4-1.4V15a5 5 0 11-5-5v3a2 2 0 102 2V3h3a4 4 0 004 4z" />
    </svg>
  ),
  github: (
    <svg viewBox="0 0 24 24" fill="white">
      <path d="M12 2a10 10 0 00-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.56 9.56 0 015 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .26.18.58.69.48A10 10 0 0012 2z" />
    </svg>
  ),
};

export function ContactView() {
  const { contact, identity } = portfolioConfig;

  return (
    <div className="scanlines flex min-h-screen flex-col items-center justify-center bg-white px-6 pt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center gap-10 text-center"
      >
        <div className="font-pixel text-[10px] uppercase tracking-widest text-[var(--accent-purple)]">
          {contact.pretitle}
        </div>

        {/* Profile pill */}
        <div className="pixel-box flex items-center gap-3 rounded-full bg-white py-2 pl-2 pr-6">
          <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-full border-2 border-[var(--ink)] bg-[var(--accent-purple)]">
            <div style={{ transform: "translateY(2px)" }}>
              <PixelAvatar size={32} />
            </div>
          </div>
          <span className="font-pixel text-[10px] uppercase tracking-wider">
            {identity.handle}
          </span>
        </div>

        <h1 className="font-display text-5xl leading-none tracking-tight sm:text-7xl">
          {contact.headlineLead}{" "}
          <span className="text-[var(--accent-purple)]">
            {contact.headlineHighlight}
          </span>
          .
        </h1>
        <p className="max-w-md text-[var(--muted-foreground)]">
          {contact.blurb}
        </p>

        {/* Social row */}
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {contact.socials.map((s) => (
            <a
              key={s.key}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="pixel-box group flex h-16 w-16 items-center justify-center rounded-2xl transition-transform hover:-translate-y-1"
              style={{ background: s.bg }}
              aria-label={s.name}
            >
              <div className="h-7 w-7">{ICONS[s.key]}</div>
            </a>
          ))}
        </div>

        <div className="mt-6 font-pixel text-[8px] uppercase tracking-widest text-[var(--muted-foreground)]">
          {contact.pressStart}
        </div>
      </motion.div>
    </div>
  );
}
