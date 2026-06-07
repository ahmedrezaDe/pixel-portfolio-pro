type Props = { size?: number; walking?: boolean; facing?: "left" | "right" };

// 16x20 pixel avatar — simple chibi/hero
export function PixelAvatar({ size = 64, walking = false, facing = "right" }: Props) {
  const px = size / 16;
  const S = "var(--ink)";
  const SKIN = "#f4c89a";
  const HAIR = "#1a1a1a";
  const SHIRT = "var(--accent-purple)";
  const PANTS = "#1f2937";
  const SHOE = "#0a0a0a";
  const EYE = "#0a0a0a";

  // grid: rows of strings (16 wide, 20 tall). '.' = empty, letters map below
  const grid = [
    "................",
    "....HHHHHHHH....",
    "...HHHHHHHHHH...",
    "..HHKKKKKKKKHH..",
    "..HKSSSSSSSSKH..",
    "..HKSEESSEESKH..",  // eyes
    "..HKSSSSSSSSKH..",
    "..HKSSMMMMSSKH..",  // mouth
    "...KKSSSSSSKK...",
    "....TTTTTTTT....",
    "...TTTTTTTTTT...",
    "..TTTTSSSSTTTT..",
    "..TTTTSSSSTTTT..",
    "..TTTTTTTTTTTT..",
    "...TTTTTTTTTT...",
    "....PPPP.PPPP...",
    "....PPPP.PPPP...",
    "....PPPP.PPPP...",
    "...BBBB...BBBB..",
    "..BBBBB...BBBBB.",
  ];

  const colorMap: Record<string, string> = {
    H: HAIR, K: HAIR, S: SKIN, E: EYE, M: "#7a1f1f",
    T: SHIRT, P: PANTS, B: SHOE,
  };

  return (
    <div
      className="pixelated"
      style={{
        width: size,
        height: size * (20/16),
        position: "relative",
        transform: facing === "left" ? "scaleX(-1)" : undefined,
        animation: walking ? "walk-bob 0.4s steps(2) infinite" : undefined,
      }}
      aria-hidden
    >
      {grid.map((row, y) =>
        row.split("").map((ch, x) => {
          if (ch === ".") return null;
          const bg = colorMap[ch] ?? S;
          return (
            <div
              key={`${x}-${y}`}
              style={{
                position: "absolute",
                left: x * px,
                top: y * px,
                width: px,
                height: px,
                background: bg,
              }}
            />
          );
        })
      )}
    </div>
  );
}
