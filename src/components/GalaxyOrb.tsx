import { useEffect, useRef } from "react";

export type GalaxyKind = "spiral" | "nebula" | "cluster";

type Particle = {
  r: number;
  a: number;
  arm: number;
  size: number;
  hueShift: number;
  vr: number;
};

type Props = {
  kind: GalaxyKind;
  color: string;
  size?: number;
  hovered?: boolean;
};

/**
 * Rotating particle galaxy rendered on a small <canvas>.
 * - spiral  → tight 3-arm rotation (Genesis blue)
 * - nebula  → soft cloud with slow swirl (Elysium purple)
 * - cluster → chaotic, jittery shell (Tartarus red)
 *
 * The whole canvas rotates on its Z axis via rAF and reacts to `hovered`
 * by accelerating spin and expanding particle radius.
 */
export function GalaxyOrb({ kind, color, size = 96, hovered = false }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hoveredRef = useRef(hovered);
  hoveredRef.current = hovered;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = size * dpr;
    const H = size * dpr;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cx = W / 2;
    const cy = H / 2;
    const maxR = (Math.min(W, H) / 2) * 0.92;

    // Seed particles per kind
    const count = kind === "cluster" ? 220 : kind === "nebula" ? 160 : 200;
    const arms = kind === "spiral" ? 3 : kind === "cluster" ? 5 : 2;
    const particles: Particle[] = Array.from({ length: count }).map(() => {
      const arm = Math.floor(Math.random() * arms);
      const r =
        kind === "nebula"
          ? Math.pow(Math.random(), 0.6) * maxR
          : Math.pow(Math.random(), 0.5) * maxR;
      return {
        r,
        a: (arm / arms) * Math.PI * 2 + Math.random() * 0.4,
        arm,
        size:
          kind === "cluster"
            ? Math.random() * 2.2 + 0.6
            : Math.random() * 1.6 + 0.4,
        hueShift: (Math.random() - 0.5) * 28,
        vr: kind === "cluster" ? (Math.random() - 0.5) * 0.6 : 0,
      };
    });

    let rotation = 0;
    let raf = 0;
    const baseSpeed =
      kind === "spiral" ? 0.004 : kind === "nebula" ? 0.0018 : 0.007;

    const render = () => {
      // fade trails
      ctx.fillStyle =
        kind === "nebula" ? "rgba(5,5,15,0.18)" : "rgba(5,5,15,0.28)";
      ctx.fillRect(0, 0, W, H);

      const speedMul = hoveredRef.current ? 2.2 : 1;
      const growMul = hoveredRef.current ? 1.25 : 1;
      rotation += baseSpeed * speedMul;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotation);

      for (const p of particles) {
        if (kind === "cluster") {
          // chaotic radial jitter
          p.r += p.vr;
          if (p.r > maxR || p.r < 4) p.vr *= -1;
          p.a += 0.012 * speedMul;
        } else if (kind === "spiral") {
          // tighter spin near center
          p.a += (0.004 + (1 - p.r / maxR) * 0.018) * speedMul;
        } else {
          // nebula: gentle swirl
          p.a += (0.0015 + (1 - p.r / maxR) * 0.004) * speedMul;
        }

        // logarithmic spiral offset for arms
        const armOffset =
          kind === "spiral" ? (p.r / maxR) * 2.3 : kind === "cluster" ? 0 : 0.6;
        const ang = p.a + armOffset;
        const x = Math.cos(ang) * p.r;
        const y = Math.sin(ang) * p.r;

        const t = 1 - p.r / maxR; // brighter near core
        const alpha =
          kind === "nebula"
            ? 0.18 + t * 0.45
            : kind === "cluster"
              ? 0.35 + Math.random() * 0.35
              : 0.3 + t * 0.55;

        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.globalAlpha = alpha;
        const ps = p.size * dpr * growMul * (kind === "nebula" ? 1.8 : 1);
        ctx.arc(x, y, ps, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.restore();

      // bright core
      const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR * 0.55);
      core.addColorStop(0, `${color}cc`);
      core.addColorStop(0.4, `${color}33`);
      core.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = core;
      ctx.fillRect(0, 0, W, H);

      raf = requestAnimationFrame(render);
    };
    render();

    return () => cancelAnimationFrame(raf);
  }, [kind, color, size]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: size,
        height: size,
        borderRadius: "9999px",
        imageRendering: "pixelated",
        boxShadow: `0 0 30px ${color}66, 0 0 80px ${color}22`,
        background: "#04040c",
      }}
    />
  );
}
