import { useEffect, useState } from 'react';

export function useOrganicDrift() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let frame: number;
    const animate = () => {
      const time = Date.now() * 0.001;
      // Fluid, organic oscillation
      const x = Math.sin(time * 0.5) * 15 + Math.cos(time * 0.2) * 10;
      const y = Math.cos(time * 0.3) * 15 + Math.sin(time * 0.4) * 10;
      setOffset({ x, y });
      frame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, []);

  return offset;
}