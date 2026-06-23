import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";


import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { GameProvider, useGame } from "@/lib/game-state";
import TheVoidBattle from "@/components/TheVoidBattle";
import { VoidEncounter } from "@/components/VoidEncounter";
import { AudioPlayer } from '@/components/AudioPlayer'

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Erza — Parallel World of Unfinished Ideas" },
      { name: "description", content: "Ahmed Reza (Erza) — creative technologist building in the parallel world of unfinished ideas." },
      { property: "og:title", content: "Erza — Parallel World of Unfinished Ideas" },
      { property: "og:description", content: "Ahmed Reza (Erza) — creative technologist building in the parallel world of unfinished ideas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Inter:wght@400;500;600;700;900&family=Bowlby+One&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        {/* Bypassing TanStack's broken links array */}
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <GameProvider>
        <RootInner />
      </GameProvider>
    </QueryClientProvider>
  );
}

function RootInner() {
  const { secretTheme, toggleSecretTheme, addXp, sfx, muted } = useGame();

  const handleDebug = () => {
    sfx.click(muted);
    addXp(10, "combat-debug");
  };

  const handleRefactor = () => {
    sfx.levelUp(muted);
    addXp(15, "combat-heal");
  };

  const handleCaffeine = () => {
    sfx.click(muted);
    addXp(20, "combat-buff");
  };

  const handleForcePush = () => {
    sfx.error(muted);
    addXp(250, "boss-defeated");
    setTimeout(() => {
      toggleSecretTheme();
    }, 2000);
  };

  return (
    <>
      <AudioPlayer />
      <Outlet />
      <VoidEncounter />
      <TheVoidBattle
        open={secretTheme}
        onClose={toggleSecretTheme}
        onDebug={handleDebug}
        onRefactor={handleRefactor}
        onCaffeine={handleCaffeine}
        onGitPush={handleForcePush}
      />
    </>
  );
}