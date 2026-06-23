import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { attachAnalyser, resumeAudioCtx } from "@/lib/audio-analyser";

// The Playlist: You will drop these MP3 files into your `public/audio` folder.
const PLAYLIST = [
  { id: 1, title: "01_NEON_DRIFTER.mp3", src: "/audio/track1.mp3" },
  { id: 2, title: "02_VOID_WALKER.mp3", src: "/audio/track2.mp3" },
  { id: 3, title: "03_SYSTEM_HALT.mp3", src: "/audio/track3.mp3" },
];

export function AudioPlayer() {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Safe bounds for dragging
  const [bounds, setBounds] = useState({ right: 1000, bottom: 800 }); // Fallback

  // Calculate window size only on the client
  useEffect(() => {
    const updateBounds = () => {
      setBounds({
        right: window.innerWidth - 300,
        bottom: window.innerHeight - 100,
      });
    };
    
    updateBounds(); // Run once on mount
    window.addEventListener("resize", updateBounds);
    return () => window.removeEventListener("resize", updateBounds);
  }, []);

  const currentTrack = PLAYLIST[trackIndex];

  // Wire the analyser once the audio element exists
  useEffect(() => {
    if (audioRef.current) attachAnalyser(audioRef.current);
  }, []);

  // Handle Play/Pause
  const togglePlay = () => {
    if (!audioRef.current) return;
    attachAnalyser(audioRef.current);
    resumeAudioCtx();
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      void audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Handle Next Track
  const nextTrack = () => {
    setTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
    setIsPlaying(true); // Auto-play next
  };

  // Auto-play when track changes if it was already playing
  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play();
    }
  }, [trackIndex, isPlaying]);

  return (
    // 'drag' makes the whole widget floating and movable across the OS
    <motion.div
      drag
      dragConstraints={{ left: 0, right: bounds.right, top: 0, bottom: bounds.bottom }}
      dragMomentum={false}
      className="fixed top-24 right-8 z-[60] flex flex-col shadow-[4px_4px_0_0_#000]"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1 }}
    >
      {/* Hidden Audio Element */}
      <audio 
        ref={audioRef} 
        src={currentTrack.src} 
        onEnded={nextTrack} 
        loop={false}
      />

      <AnimatePresence mode="wait">
        {!isMinimized ? (
          /* --- EXPANDED VINTAGE DECK --- */
          <motion.div
            key="expanded"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="w-64 border-2 border-[var(--ink)] bg-[#11161f] rounded-md overflow-hidden"
          >
            {/* Top Bar / Drag Handle */}
            <div className="bg-[#0a0e14] border-b-2 border-[var(--ink)] px-2 py-1 flex justify-between items-center cursor-grab active:cursor-grabbing">
              <span className="font-pixel text-[8px] text-[var(--accent-purple)] uppercase tracking-widest">
                AMP-OS MEDIA
              </span>
              <button 
                onClick={() => setIsMinimized(true)}
                className="text-[var(--accent-red)] font-pixel text-[8px] hover:text-white"
              >
                [_] MINIMIZE
              </button>
            </div>

            {/* LCD Screen */}
            <div className="p-3 bg-[#0a0e14]">
              <div className="border border-white/10 bg-[#04040c] p-2 rounded-sm relative overflow-hidden">
                {/* Scanline overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-20" style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 1px, #fff 2px)" }} />
                
                <p className="font-pixel text-[8px] text-[var(--accent-green)] mb-1 uppercase opacity-70">
                  NOW PLAYING
                </p>
                {/* Marquee Effect for Track Name */}
                <div className="w-full overflow-hidden whitespace-nowrap">
                  <motion.p 
                    className="font-pixel text-[10px] text-[var(--accent-green)] inline-block"
                    animate={{ x: [0, -100] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "linear", repeatType: "mirror" }}
                  >
                    {currentTrack.title}
                  </motion.p>
                </div>
                
                {/* Fake Visualizer */}
                <div className="flex gap-[2px] mt-2 h-4 items-end">
                  {[...Array(12)].map((_, i) => (
                    <motion.div 
                      key={i}
                      className="w-1 bg-[var(--accent-green)] opacity-80"
                      animate={{ height: isPlaying ? ["20%", "100%", "40%", "80%", "20%"] : "20%" }}
                      transition={{ duration: Math.random() * 0.5 + 0.3, repeat: Infinity, repeatType: "reverse" }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Hardware Controls */}
            <div className="p-2 flex gap-2 justify-center bg-[#11161f]">
              <button onClick={togglePlay} className="flex-1 py-1 border border-[var(--ink)] bg-[#0a0e14] hover:bg-white/10 text-[var(--accent-yellow)] font-pixel text-[8px] transition-colors">
                {isPlaying ? "|| PAUSE" : "> PLAY"}
              </button>
              <button onClick={nextTrack} className="flex-1 py-1 border border-[var(--ink)] bg-[#0a0e14] hover:bg-white/10 text-white/50 font-pixel text-[8px] transition-colors">
                {">> SKIP"}
              </button>
            </div>
          </motion.div>
        ) : (
          /* --- MINIMIZED CASSETTE TAPE --- */
          <motion.div
            key="minimized"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="border-2 border-[var(--ink)] bg-[#11161f] rounded-full p-2 cursor-grab active:cursor-grabbing flex items-center gap-3 shadow-lg"
          >
            <div className="flex items-center gap-2">
              {/* Spinning Tape Reels */}
              <motion.div 
                animate={{ rotate: isPlaying ? 360 : 0 }} 
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-[var(--accent-green)] rounded-full border-t-transparent"
              />
            </div>
            
            <button onClick={togglePlay} className="text-[var(--accent-yellow)] font-pixel text-[8px] hover:text-white">
               {isPlaying ? "||" : ">"}
            </button>

            <button onClick={() => setIsMinimized(false)} className="text-[var(--accent-purple)] font-pixel text-[8px] ml-1 hover:text-white">
              [+]
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}