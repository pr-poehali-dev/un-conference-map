import { useState } from "react";
import { ALL_MARKERS, OPERATIONS, UN_HQ, type MarkerType, type Marker } from "@/data/un-data";

// ─── HELPERS ─────────────────────────────────────────────────────────────────

export function markerColor(type: string): string {
  if (type === "conference") return "#8b2500";
  if (type === "office") return "#1a3a6b";
  if (type === "military") return "#2d4a22";
  return "#5c4209";
}

// ─── LEGEND / FILTER ─────────────────────────────────────────────────────────

export function Legend({
  filter,
  setFilter,
}: {
  filter: MarkerType;
  setFilter: (f: MarkerType) => void;
}) {
  const items: { type: MarkerType; label: string; color: string }[] = [
    { type: "all", label: "Все события", color: "#5c4209" },
    { type: "conference", label: "Конференции", color: "#8b2500" },
    { type: "office", label: "Штаб-квартира", color: "#1a3a6b" },
    { type: "military", label: "Операции ООН", color: "#2d4a22" },
  ];

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
      {items.map((item) => (
        <button
          key={item.type}
          onClick={() => setFilter(item.type)}
          className={`filter-btn ${filter === item.type ? "active" : ""}`}
          style={
            filter === item.type
              ? { background: item.color, borderColor: item.color, color: "#f0e6cc" }
              : {}
          }
        >
          <span
            style={{
              display: "inline-block",
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: item.color,
              marginRight: "6px",
              verticalAlign: "middle",
            }}
          />
          {item.label}
        </button>
      ))}
    </div>
  );
}

// ─── MARKER DETAIL ────────────────────────────────────────────────────────────

export function MarkerDetail({
  markerId,
  onClose,
}: {
  markerId: string | null;
  onClose: () => void;
}) {
  if (!markerId) return null;
  const marker = ALL_MARKERS.find((m: Marker) => m.id === markerId);
  if (!marker) return null;

  const colorMap: Record<string, string> = {
    conference: "#8b2500",
    office: "#1a3a6b",
    military: "#2d4a22",
  };
  const labelMap: Record<string, string> = {
    conference: "Конференция",
    office: "Штаб-квартира ООН",
    military: "Миротворческая операция",
  };

  return (
    <div className="vintage-card animate-fade-in-up" style={{ padding: "1rem", borderRadius: "2px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.5rem" }}>
        <div>
          <div
            className="font-display"
            style={{
              fontSize: "0.65rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: colorMap[marker.type],
              marginBottom: "2px",
            }}
          >
            {labelMap[marker.type]}
          </div>
          <h3 className="font-serif" style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--ink)" }}>
            {marker.name}
          </h3>
          <div style={{ fontSize: "0.8rem", color: "var(--sepia)", marginTop: "2px" }}>
            {marker.city} · {marker.year}
          </div>
        </div>
        <button onClick={onClose} style={{ fontSize: "0.75rem", opacity: 0.5, cursor: "pointer", marginTop: "2px" }}>
          ✕
        </button>
      </div>
      <p style={{ marginTop: "0.75rem", fontSize: "0.875rem", lineHeight: 1.6, color: "var(--ink-light)" }}>
        {marker.description}
      </p>
    </div>
  );
}

// ─── WORLD MAP SVG ────────────────────────────────────────────────────────────

export function WorldMap({
  filter,
  onMarkerClick,
  activeMarker,
}: {
  filter: MarkerType;
  onMarkerClick: (id: string) => void;
  activeMarker: string | null;
}) {
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    text: string;
    subtext: string;
  } | null>(null);

  const visibleMarkers = ALL_MARKERS.filter(
    (m: Marker) => filter === "all" || m.type === filter
  );

  const showOfficeLine = filter === "all" || filter === "military";

  return (
    <div className="map-container rounded-sm w-full" style={{ position: "relative", paddingBottom: "52%" }}>
      <svg
        viewBox="0 0 900 468"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          fontFamily: "'Cormorant Garamond', serif",
        }}
      >
        <defs>
          <pattern id="oceanLines" width="20" height="20" patternUnits="userSpaceOnUse">
            <line x1="0" y1="10" x2="20" y2="10" stroke="#9ab8d0" strokeWidth="0.3" opacity="0.5" />
          </pattern>
          <filter id="shadow">
            <feDropShadow dx="1" dy="2" stdDeviation="2" floodOpacity="0.2" />
          </filter>
          <marker id="arrowGreen" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill="#2d4a22" opacity="0.85" />
          </marker>
        </defs>

        {/* Ocean */}
        <rect width="900" height="468" fill="#b8d4e8" />
        <rect width="900" height="468" fill="url(#oceanLines)" opacity="0.6" />

        {/* North America */}
        <path d="M 30 60 L 80 50 L 130 55 L 175 65 L 200 80 L 220 100 L 230 130 L 220 160 L 200 185 L 175 200 L 155 220 L 130 250 L 110 240 L 90 220 L 75 195 L 60 175 L 45 150 L 35 120 L 28 90 Z"
          fill="#cfc0a0" stroke="#a89878" strokeWidth="0.8" />
        <path d="M 95 20 L 130 15 L 155 25 L 160 40 L 145 50 L 120 48 L 100 38 Z"
          fill="#d4c8b0" stroke="#a89878" strokeWidth="0.6" />
        <path d="M 155 220 L 165 235 L 155 250 L 145 240 L 140 225 Z"
          fill="#cfc0a0" stroke="#a89878" strokeWidth="0.6" />
        {/* South America */}
        <path d="M 165 255 L 195 245 L 230 255 L 255 275 L 265 310 L 260 350 L 240 380 L 210 400 L 185 395 L 165 375 L 150 340 L 148 305 L 155 275 Z"
          fill="#cfc0a0" stroke="#a89878" strokeWidth="0.8" />
        {/* Europe */}
        <path d="M 390 55 L 430 48 L 465 52 L 480 65 L 470 80 L 450 90 L 430 95 L 410 88 L 395 75 Z"
          fill="#cfc0a0" stroke="#a89878" strokeWidth="0.8" />
        <path d="M 420 30 L 450 25 L 465 38 L 460 55 L 440 58 L 420 50 Z"
          fill="#cfc0a0" stroke="#a89878" strokeWidth="0.6" />
        <path d="M 400 55 L 415 50 L 420 62 L 408 68 L 398 63 Z"
          fill="#cfc0a0" stroke="#a89878" strokeWidth="0.6" />
        {/* Africa */}
        <path d="M 400 130 L 450 118 L 500 125 L 520 150 L 525 190 L 515 240 L 495 285 L 465 315 L 435 325 L 405 318 L 380 295 L 368 260 L 365 220 L 370 180 L 380 155 Z"
          fill="#cfc0a0" stroke="#a89878" strokeWidth="0.8" />
        {/* Russia */}
        <path d="M 475 35 L 560 28 L 650 32 L 710 40 L 750 52 L 750 80 L 720 90 L 680 95 L 640 88 L 590 82 L 540 78 L 500 72 L 475 65 Z"
          fill="#cfc0a0" stroke="#a89878" strokeWidth="0.8" />
        {/* Middle East */}
        <path d="M 495 110 L 540 105 L 570 115 L 575 140 L 555 155 L 525 158 L 498 145 L 490 128 Z"
          fill="#cfc0a0" stroke="#a89878" strokeWidth="0.8" />
        {/* India */}
        <path d="M 580 130 L 620 125 L 640 145 L 635 185 L 615 215 L 595 220 L 575 200 L 568 170 L 570 148 Z"
          fill="#cfc0a0" stroke="#a89878" strokeWidth="0.8" />
        {/* China/SE Asia */}
        <path d="M 640 65 L 710 62 L 750 72 L 760 95 L 740 115 L 700 125 L 670 120 L 645 105 L 635 85 Z"
          fill="#cfc0a0" stroke="#a89878" strokeWidth="0.8" />
        <path d="M 745 75 L 760 70 L 768 85 L 758 95 L 745 90 Z"
          fill="#cfc0a0" stroke="#a89878" strokeWidth="0.6" />
        {/* Australia */}
        <path d="M 680 290 L 740 278 L 790 285 L 810 310 L 805 345 L 780 365 L 745 370 L 710 360 L 688 335 L 678 308 Z"
          fill="#cfc0a0" stroke="#a89878" strokeWidth="0.8" />

        {/* Grid lines */}
        {[100, 200, 300, 400].map((y) => (
          <line key={`hy${y}`} x1="0" y1={y} x2="900" y2={y} stroke="#9ab8d0" strokeWidth="0.4" opacity="0.5" />
        ))}
        {[150, 300, 450, 600, 750].map((x) => (
          <line key={`vx${x}`} x1={x} y1="0" x2={x} y2="468" stroke="#9ab8d0" strokeWidth="0.4" opacity="0.5" />
        ))}
        <line x1="0" y1={234} x2="900" y2={234} stroke="#9ab8d0" strokeWidth="0.8" strokeDasharray="6 4" opacity="0.6" />
        <text x="8" y={231} fill="#5a7a90" fontSize="8" fontStyle="italic" opacity="0.8">экватор</text>

        {/* Arrows: UN HQ → Operations */}
        {showOfficeLine &&
          OPERATIONS.map((op) => {
            const startX = UN_HQ.coords.x * 9;
            const startY = UN_HQ.coords.y * 4.68;
            const endX = op.coords.x * 9;
            const endY = op.coords.y * 4.68;
            const midX = (startX + endX) / 2;
            const midY = Math.min(startY, endY) - 45;
            const pathId = `ap_${op.id}`;

            return (
              <g key={op.id}>
                <path
                  id={pathId}
                  d={`M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`}
                  fill="none"
                  stroke="#2d4a22"
                  strokeWidth="1.8"
                  strokeDasharray="8 4"
                  markerEnd="url(#arrowGreen)"
                  opacity="0.75"
                  className="arrow-dash"
                />
                <text fontSize="7.5" fill="#2d4a22" opacity="0.8" fontWeight="500">
                  <textPath href={`#${pathId}`} startOffset="45%" textAnchor="middle">
                    {op.year} · {op.name.split("—")[0].trim()}
                  </textPath>
                </text>
              </g>
            );
          })}

        {/* Markers */}
        {visibleMarkers.map((m: Marker) => {
          const cx = m.coords.x * 9;
          const cy = m.coords.y * 4.68;
          const color = markerColor(m.type);
          const isActive = activeMarker === m.id;

          return (
            <g
              key={m.id}
              style={{ cursor: "pointer" }}
              onClick={() => onMarkerClick(m.id)}
              onMouseEnter={() =>
                setTooltip({
                  x: (cx / 900) * 100,
                  y: (cy / 468) * 100,
                  text: m.name,
                  subtext: `${m.city}, ${m.year}`,
                })
              }
              onMouseLeave={() => setTooltip(null)}
            >
              {isActive && (
                <circle cx={cx} cy={cy} r={16} fill={color} opacity="0.15" className="marker-pulse" />
              )}
              <circle cx={cx} cy={cy} r={10} fill={color} opacity="0.1" className="marker-pulse" />
              <circle
                cx={cx}
                cy={cy}
                r={isActive ? 8 : 6}
                fill={color}
                stroke="#f0e6cc"
                strokeWidth={isActive ? 2 : 1.5}
                filter="url(#shadow)"
              />
              <text x={cx + 10} y={cy - 7} fontSize="8" fill={color} fontWeight="600" opacity="0.9">
                {m.year}
              </text>
              <text x={cx + 10} y={cy + 3} fontSize="7.5" fill="#2c1a0e" opacity="0.7">
                {m.city.split(",")[0]}
              </text>
            </g>
          );
        })}

        {/* Compass */}
        <g transform="translate(858, 418)" opacity="0.5">
          <circle cx={0} cy={0} r={18} fill="none" stroke="#8b6914" strokeWidth="0.8" />
          <path d="M0,-15 L3,-5 L0,-8 L-3,-5 Z" fill="#8b6914" />
          <path d="M0,15 L3,5 L0,8 L-3,5 Z" fill="#8b6914" opacity="0.5" />
          <path d="M-15,0 L-5,-3 L-8,0 L-5,3 Z" fill="#8b6914" opacity="0.5" />
          <path d="M15,0 L5,-3 L8,0 L5,3 Z" fill="#8b6914" opacity="0.5" />
          <text x={0} y={-20} textAnchor="middle" fontSize="9" fill="#8b6914" fontWeight="600">С</text>
          <circle cx={0} cy={0} r={2} fill="#8b6914" />
        </g>

        {/* Map title */}
        <text
          x="450"
          y="21"
          textAnchor="middle"
          fontSize="10"
          fill="#5c4209"
          fontWeight="500"
          letterSpacing="3"
          opacity="0.65"
          fontStyle="italic"
        >
          КАРТА МИРА — ИСТОРИЯ ОРГАНИЗАЦИИ ОБЪЕДИНЁННЫХ НАЦИЙ
        </text>
      </svg>

      {/* HTML Tooltip */}
      {tooltip && (
        <div
          className="map-tooltip animate-fade-in"
          style={{
            position: "absolute",
            left: `calc(${tooltip.x}% + 14px)`,
            top: `calc(${tooltip.y}% - 8px)`,
            zIndex: 50,
            pointerEvents: "none",
          }}
        >
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.9rem", fontWeight: 600 }}>
            {tooltip.text}
          </div>
          <div style={{ fontSize: "0.75rem", opacity: 0.75, marginTop: "2px" }}>
            {tooltip.subtext}
          </div>
        </div>
      )}
    </div>
  );
}
