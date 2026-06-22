import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useGame } from "@/lib/game-state";
import { portfolioConfig, type SocialKey } from "@/lib/portfolioConfig";

// --- Custom SVGs Restored ---
const ICONS: Record<SocialKey, React.ReactNode> = {
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

// --- Decryption Text Effect ---
const GLITCH_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*/<>[]{}";

function DecryptText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let iteration = 0;
    let animationFrame: number;
    
    const startTimeout = setTimeout(() => {
      const animate = () => {
        setDisplayText(
          text
            .split("")
            .map((letter, index) => {
              if (index < iteration) return text[index];
              if (letter === " ") return " ";
              return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
            })
            .join("")
        );
        iteration += Math.max(0.5, text.length / 50);
        if (iteration < text.length) {
          animationFrame = requestAnimationFrame(animate);
        } else {
          setDisplayText(text);
        }
      };
      animationFrame = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(startTimeout);
      cancelAnimationFrame(animationFrame);
    };
  }, [text, delay]);

  return <span>{displayText || "..."}</span>;
}

// --- Main Component ---
type SubspaceProps = {
  mode: "about" | "contact";
  onClose: () => void;
};

export function SubspaceTransmission({ mode, onClose }: SubspaceProps) {
  const { sfx, muted } = useGame();
  const { about, contact, identity } = portfolioConfig;

  useEffect(() => {
    sfx.open(muted);
    setTimeout(() => sfx.type(muted), 400);
    setTimeout(() => sfx.type(muted), 800);
  }, [muted, sfx]);

  const isAbout = mode === "about";
  const data = isAbout ? about : contact;
  const themeColor = isAbout ? "var(--accent-purple)" : "var(--accent-green)";
  
  // ==========================================
  // IMAGE LINKS: Update these paths right here
  // ==========================================
  const imageSource = isAbout 
    ? "https://github.com/ahmedrezaDe.png" // Example: Web URL for About image
    : "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=1000"; // Example: Cool space image for Contact

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black overflow-hidden font-pixel">
      
      {/* CRT Effects */}
      <div className="pointer-events-none absolute inset-0 z-50 opacity-10" 
           style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 2px, #fff 3px)" }} />
      <div className="pointer-events-none absolute inset-0 z-50 shadow-[inset_0_0_100px_rgba(0,0,0,0.9)]" />

      {/* Terminal Window */}
      <motion.div
        className="relative w-full max-w-5xl h-[85vh] border-2 border-[#1a1a2e] bg-[#05050a] shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col"
        initial={{ scaleY: 0.005, scaleX: 0 }}
        animate={{ scaleY: [0.005, 0.005, 1], scaleX: [0, 1, 1] }}
        exit={{ scaleY: [1, 0.005, 0], scaleX: [1, 1, 0], opacity: 0 }}
        transition={{ duration: 0.7, ease: "easeInOut", times: [0, 0.4, 1] }}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#1a1a2e] bg-[#0a0a14] px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="h-3 w-3 animate-pulse bg-red-500 rounded-full" />
            <span className="text-[10px] uppercase tracking-widest text-red-500">
              SECURE CHANNEL ✦ ENCRYPTED
            </span>
          </div>
          <button 
            onClick={() => { sfx.click(muted); onClose(); }}
            className="text-[10px] uppercase tracking-widest text-white/50 hover:text-white transition-colors"
          >
            [X] TERMINATE CONNECTION
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-12">
          <div className="grid lg:grid-cols-[1fr_2fr] gap-12">
            
            {/* Left Column: Image & Stats */}
            <div className="flex flex-col gap-8">
              {/* Actual Image Profile */}
              <motion.div 
                className="aspect-square border border-white/10 relative overflow-hidden group"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <img 
                  src={imageSource} 
                  alt={isAbout ? "Target Identity" : "Signal Origin"}
                  className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                />
                
                {/* CRT Scanline overlay specifically for the image to blend it in */}
                <div className="absolute inset-0 pointer-events-none opacity-30 mix-blend-overlay" style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 1px, #fff 2px)" }} />
                
                {/* Targeting UI */}
                <div className="absolute top-2 left-2 flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 animate-pulse" />
                  <p className="text-[8px] text-white/80 bg-black/50 px-1">TARGET_ID: {identity.alias.toUpperCase()}</p>
                </div>
              </motion.div>

              {/* Stats (Only show in About) */}
              {isAbout && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.5 }}>
                  <p className="text-[10px] text-white/50 uppercase tracking-widest mb-4 border-b border-white/10 pb-2">ENTITY_STATS</p>
                  <div className="flex flex-col gap-3">
                    {about.stats.map((stat, i) => (
                      <div key={stat.k} className="flex items-center gap-4">
                        <span className="w-8 text-[10px] text-[var(--accent-purple)]">{stat.k}</span>
                        <div className="flex-1 h-2 bg-white/5 overflow-hidden">
                          <motion.div 
                            className="h-full bg-[var(--accent-purple)]"
                            initial={{ width: 0 }}
                            animate={{ width: `${stat.v}%` }}
                            transition={{ delay: 1.8 + (i * 0.2), duration: 1, type: "spring" }}
                          />
                        </div>
                        <span className="w-6 text-right text-[10px] text-white/70">{stat.v}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right Column: Text & Data */}
            <motion.div 
              className="flex flex-col justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <p className="text-[10px] uppercase tracking-widest text-white/50 mb-2">
                <DecryptText text={data.pretitle} delay={800} />
              </p>
              <h1 className="font-display text-4xl sm:text-6xl text-white leading-none mb-6">
                <DecryptText text={data.headlineLead} delay={1000} /> <br/>
                <span style={{ color: themeColor }}>
                  <DecryptText text={data.headlineHighlight} delay={1400} />
                </span>
              </h1>
              
              {isAbout && "aliasLine" in data && (
                <p className="text-[12px] text-white/70 uppercase tracking-widest mb-8">
                  <DecryptText text={data.aliasLine} delay={1800} />
                </p>
              )}

              {/* BIO / BLURB */}
              <div className="text-sm leading-relaxed text-white/80 max-w-2xl flex flex-col gap-4 font-sans font-medium">
                {isAbout && "bio" in data ? (
                  data.bio.map((paragraph, i) => (
                    <p key={i}>
                      <DecryptText text={paragraph} delay={2000 + (i * 500)} />
                    </p>
                  ))
                ) : (
                  <p><DecryptText text={contact.blurb} delay={1800} /></p>
                )}
              </div>

              {/* SOCIAL LINKS - Original SVG Setup Restored */}
              {!isAbout && (
                <motion.div 
                  className="mt-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.5 }}
                >
                  <p className="text-[10px] text-white/50 uppercase tracking-widest mb-6 border-b border-white/10 pb-2">COMMUNICATION_CHANNELS</p>
                  <div className="flex flex-wrap gap-4">
                    {contact.socials.map((social) => (
                      <a 
                        key={social.key}
                        href={social.href}
                        target="_blank"
                        rel="noreferrer"
                        className="relative flex items-center justify-center w-14 h-14 border border-white/10 bg-white/5 overflow-hidden transition-all group hover:-translate-y-1"
                        onMouseEnter={() => sfx.click(muted)}
                        title={social.name}
                      >
                        {/* Custom background color slide-up effect on hover */}
                        <div 
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                          style={{ background: social.bg }} 
                        />
                        <div className="relative z-10 w-6 h-6 opacity-70 group-hover:opacity-100 transition-opacity">
                          {ICONS[social.key as SocialKey]}
                        </div>
                      </a>
                    ))}
                  </div>
                </motion.div>
              )}

            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}