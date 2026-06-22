import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { LoadingScreen } from "@/components/LoadingScreen";
import { HomeMenu } from "@/components/HomeMenu";
import { AboutView } from "@/components/AboutView";
import { PortfolioView } from "@/components/PortfolioView";
import { ContactView } from "@/components/ContactView";
import { NavMenu } from "@/components/NavMenu";
import { CRTOverlay } from "@/components/CRTOverlay";
import { XPBar } from "@/components/XPBar";
import { SettingsToggles } from "@/components/SettingsToggles";
import { Terminal } from "@/components/Terminal";
import TheVoidBattle from "@/components/TheVoidBattle";
import { GameProvider, useGame } from "@/lib/game-state";
import type { View } from "@/lib/views";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Erza — Parallel World of Unfinished Ideas" },
      { name: "description", content: "Ahmed Reza (Erza) — gamified portfolio of a creative technologist building in the parallel world of unfinished ideas." },
      { property: "og:title", content: "Erza — Parallel World of Unfinished Ideas" },
      { property: "og:description", content: "Ahmed Reza (Erza) — gamified 8-bit portfolio." },
    ],
  }),
  component: () => (
    <GameProvider>
      <Index />
    </GameProvider>
  ),
});

function Index() {
  const [view, setView] = useState<View>("loading");
  const { markVisited, sfx, muted } = useGame();

  useEffect(() => {
    if (view !== "loading") markVisited(view);
  }, [view, markVisited]);

  const navigate = (v: View) => {
    sfx.click(muted);
    setView(v);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-white">
      <CRTOverlay />
      <XPBar />
      <SettingsToggles />
      {view !== "loading" && <NavMenu current={view} onNavigate={navigate} />}

      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, filter: "blur(6px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 0.35 }}
        >
          {view === "loading" && <LoadingScreen onDone={() => setView("home")} />}
          {view === "home" && <HomeMenu onNavigate={navigate} />}
          {view === "about" && <AboutView />}
          {view === "portfolio" && <PortfolioView />}
          {view === "contact" && <ContactView />}
        </motion.div>
      </AnimatePresence>

      {view !== "loading" && <Terminal />}
    </div>
  );
}
