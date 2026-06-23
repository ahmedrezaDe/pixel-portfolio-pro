// Singleton Web Audio analyser wired to the portfolio's single <audio> element.
// AudioPlayer calls attachAnalyser() on mount and resumeAudioCtx() on user gesture.
// UniverseEngine reads getAudioLevels() inside its rAF loop.

let audioCtx: AudioContext | null = null;
let analyser: AnalyserNode | null = null;
let data: Uint8Array | null = null;
const sourceMap = new WeakMap<HTMLAudioElement, MediaElementAudioSourceNode>();

export function attachAnalyser(el: HTMLAudioElement): void {
  if (typeof window === "undefined") return;
  if (!audioCtx) {
    const Ctx =
      (window.AudioContext as typeof AudioContext) ||
      ((window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext);
    if (!Ctx) return;
    try {
      audioCtx = new Ctx();
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.82;
      data = new Uint8Array(analyser.frequencyBinCount);
      analyser.connect(audioCtx.destination);
    } catch {
      audioCtx = null;
      return;
    }
  }
  if (!analyser || sourceMap.has(el)) return;
  try {
    const src = audioCtx.createMediaElementSource(el);
    src.connect(analyser);
    sourceMap.set(el, src);
  } catch {
    /* element already connected — ignore */
  }
}

export function resumeAudioCtx(): void {
  if (audioCtx && audioCtx.state === "suspended") {
    void audioCtx.resume();
  }
}

export type AudioLevels = {
  bass: number;
  mid: number;
  treble: number;
  overall: number;
};

const ZERO: AudioLevels = { bass: 0, mid: 0, treble: 0, overall: 0 };

export function getAudioLevels(): AudioLevels {
  if (!analyser || !data) return ZERO;
  analyser.getByteFrequencyData(data as unknown as Uint8Array<ArrayBuffer>);
  const len = data.length;
  const bassEnd = Math.max(1, Math.floor(len * 0.1));
  const midEnd = Math.max(bassEnd + 1, Math.floor(len * 0.4));
  let bass = 0;
  let mid = 0;
  let treble = 0;
  let all = 0;
  for (let i = 0; i < len; i++) {
    const v = data[i];
    all += v;
    if (i < bassEnd) bass += v;
    else if (i < midEnd) mid += v;
    else treble += v;
  }
  return {
    bass: bass / (bassEnd * 255),
    mid: mid / ((midEnd - bassEnd) * 255),
    treble: treble / ((len - midEnd) * 255),
    overall: all / (len * 255),
  };
}
