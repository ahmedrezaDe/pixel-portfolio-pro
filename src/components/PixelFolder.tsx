type Props = {
  color: "blue" | "red" | "yellow";
  label: string;
  hovered?: boolean;
  onClick?: () => void;
  onHover?: () => void;
  onLeave?: () => void;
};

const colorMap = {
  blue:   { fill: "var(--accent-blue)",   tab: "oklch(0.55 0.18 245)" },
  red:    { fill: "var(--accent-red)",    tab: "oklch(0.5 0.22 25)" },
  yellow: { fill: "var(--accent-yellow)", tab: "oklch(0.72 0.16 90)" },
};

export function PixelFolder({ color, label, hovered, onClick, onHover, onLeave }: Props) {
  const c = colorMap[color];
  return (
    <button
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className="group relative flex flex-col items-center gap-3 outline-none"
      aria-label={label}
    >
      <div
        className="pixelated transition-transform duration-150"
        style={{
          width: 168,
          height: 132,
          transform: hovered ? "translateY(-10px) scale(1.04)" : "translateY(0) scale(1)",
          filter: hovered ? "drop-shadow(6px 6px 0 var(--ink))" : "drop-shadow(4px 4px 0 var(--ink))",
        }}
      >
        <svg viewBox="0 0 42 33" width="168" height="132" shapeRendering="crispEdges">
          {/* tab */}
          <rect x="2" y="3" width="14" height="5" fill={c.tab} stroke="var(--ink)" strokeWidth="1" />
          {/* main body */}
          <rect x="1" y="7" width="40" height="24" fill={c.fill} stroke="var(--ink)" strokeWidth="1" />
          {/* highlight */}
          <rect x="3" y="9" width="36" height="2" fill="rgba(255,255,255,0.45)" />
          {/* shadow strip */}
          <rect x="3" y="27" width="36" height="2" fill="rgba(0,0,0,0.25)" />
          {/* label slot */}
          <rect x="14" y="14" width="14" height="6" fill="#fdfaf2" stroke="var(--ink)" strokeWidth="1" />
        </svg>
      </div>
      <span
        className="font-pixel text-[10px] uppercase tracking-wider"
        style={{ color: "var(--ink)" }}
      >
        {label}
      </span>
    </button>
  );
}
