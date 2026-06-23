import { useEffect, useRef } from "react";
import { getAudioLevels } from "@/lib/audio-analyser";

type BurstEvent = { x: number; y: number; color: string; mass: number; timestamp: number } | null;

export function UniverseEngine({ burst, warpDirection = 'none' }: { burst: BurstEvent, warpDirection?: 'in' | 'out' | 'none' }) {
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const fgCanvasRef = useRef<HTMLCanvasElement>(null);

  // LAYER 1: Deep Space Void + WARP DRIVE
  useEffect(() => {
    const canvas = bgCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const stars = Array.from({ length: 400 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.5,
      speed: Math.random() * 0.15 + 0.05,
      opacity: Math.random(),
      pulseSpeed: Math.random() * 0.02,
    }));

    let animationFrameId: number;

    const renderBg = () => {
      const levels = getAudioLevels();
      // Bass-driven boosts (gentle clamp)
      const bass = Math.min(1, levels.bass * 1.2);
      const overall = Math.min(1, levels.overall * 1.1);
      const sizeBoost = 1 + bass * 1.8; // up to ~2.8x
      const speedBoost = 1 + bass * 3.5;
      const opacityBoost = overall * 0.45;

      ctx.fillStyle = "rgba(4, 4, 12, 0.4)";
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      stars.forEach((star) => {
        // Warp Mechanics
        if (warpDirection === 'in') {
          star.x += (star.x - cx) * 0.03;
          star.y += (star.y - cy) * 0.03;
        } else if (warpDirection === 'out') {
          star.x -= (star.x - cx) * 0.03;
          star.y -= (star.y - cy) * 0.03;
        } else {
          star.y -= star.speed * speedBoost; // audio-reactive drift
        }

        star.opacity += Math.sin(Date.now() * star.pulseSpeed) * 0.01;

        // Wrap around bounds
        if (star.y < 0 || star.x < 0 || star.y > height || star.x > width || (warpDirection === 'out' && Math.abs(star.x - cx) < 2 && Math.abs(star.y - cy) < 2)) {
          star.y = warpDirection === 'out' ? Math.random() > 0.5 ? 0 : height : Math.random() * height;
          star.x = warpDirection === 'out' ? Math.random() > 0.5 ? 0 : width : Math.random() * width;
          if (warpDirection === 'none') star.y = height;
        }

        const alpha = Math.max(0.1, Math.min(1, star.opacity + opacityBoost));
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * sizeBoost, 0, Math.PI * 2);
        ctx.fill();
      });
      animationFrameId = requestAnimationFrame(renderBg);
    };
    renderBg();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [warpDirection]); // Re-bind when warp changes

  // LAYER 3: Foreground Teleportation Flash (Keep exact same logic)
  useEffect(() => {
    const canvas = fgCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    let particles: any[] = [];
    let animationFrameId: number;

    const renderFg = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;
        p.size *= 0.95; 

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.shadowBlur = 20;
        ctx.shadowColor = p.color;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
        ctx.shadowBlur = 0;
      }
      animationFrameId = requestAnimationFrame(renderFg);
    };
    renderFg();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEffect(() => {
    if (!burst || !fgCanvasRef.current) return;
    const canvas = fgCanvasRef.current;
    const { x, y, color, mass } = burst;
    const particleCount = mass * 30; 
    
    // @ts-ignore
    if (!canvas._particles) canvas._particles = [];

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 30 + 10; 
      // @ts-ignore
      canvas._particles.push({
        x, y, vx: Math.cos(angle) * velocity, vy: Math.sin(angle) * velocity,
        life: 1.0, decay: Math.random() * 0.015 + 0.005, size: Math.random() * 6 + 2, color: color,
      });
    }
    const ctx = canvas.getContext("2d");
    // @ts-ignore
    canvas.dispatchEvent(new CustomEvent("spawn", { detail: canvas._particles }));
  }, [burst]);

  useEffect(() => {
     const canvas = fgCanvasRef.current;
     if (!canvas) return;
     const handleSpawn = (e: any) => {
         // @ts-ignore
         if (canvas._updateParticles) canvas._updateParticles(e.detail);
     }
     canvas.addEventListener("spawn", handleSpawn);
     return () => canvas.removeEventListener("spawn", handleSpawn);
  }, []);

  return (
    <>
      <canvas ref={bgCanvasRef} className="absolute inset-0 z-0 block h-full w-full pointer-events-none" />
      <canvas ref={fgCanvasRef} className="fixed inset-0 z-[100] block h-full w-full pointer-events-none" />
    </>
  );
}