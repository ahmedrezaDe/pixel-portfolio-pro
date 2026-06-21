// Tiny chiptune SFX synth via Web Audio. No assets required.

let ctx: AudioContext | null = null;
function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = (window.AudioContext || (window as any).webkitAudioContext) as
      | typeof AudioContext
      | undefined;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

type Note = { f: number; t: number; d: number; type?: OscillatorType; gain?: number };

function play(notes: Note[], muted: boolean) {
  if (muted) return;
  const ac = getCtx();
  if (!ac) return;
  const now = ac.currentTime;
  for (const n of notes) {
    const osc = ac.createOscillator();
    const g = ac.createGain();
    osc.type = n.type ?? "square";
    osc.frequency.setValueAtTime(n.f, now + n.t);
    const peak = (n.gain ?? 0.06);
    g.gain.setValueAtTime(0.0001, now + n.t);
    g.gain.exponentialRampToValueAtTime(peak, now + n.t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, now + n.t + n.d);
    osc.connect(g).connect(ac.destination);
    osc.start(now + n.t);
    osc.stop(now + n.t + n.d + 0.02);
  }
}

export const sfx = {
  blip: (m: boolean) => play([{ f: 660, t: 0, d: 0.06 }], m),
  click: (m: boolean) =>
    play(
      [
        { f: 880, t: 0, d: 0.05 },
        { f: 1320, t: 0.04, d: 0.07 },
      ],
      m,
    ),
  hover: (m: boolean) => play([{ f: 520, t: 0, d: 0.04, gain: 0.04 }], m),
  open: (m: boolean) =>
    play(
      [
        { f: 392, t: 0.0, d: 0.09 },
        { f: 523, t: 0.08, d: 0.09 },
        { f: 659, t: 0.16, d: 0.09 },
        { f: 880, t: 0.24, d: 0.18, type: "triangle" },
      ],
      m,
    ),
  levelUp: (m: boolean) =>
    play(
      [
        { f: 523, t: 0, d: 0.1 },
        { f: 659, t: 0.1, d: 0.1 },
        { f: 784, t: 0.2, d: 0.1 },
        { f: 1046, t: 0.3, d: 0.18 },
        { f: 1318, t: 0.5, d: 0.28, type: "triangle", gain: 0.08 },
      ],
      m,
    ),
  type: (m: boolean) => play([{ f: 1100, t: 0, d: 0.02, gain: 0.03 }], m),
  error: (m: boolean) =>
    play(
      [
        { f: 220, t: 0, d: 0.12, type: "sawtooth" },
        { f: 165, t: 0.12, d: 0.18, type: "sawtooth" },
      ],
      m,
    ),
};
