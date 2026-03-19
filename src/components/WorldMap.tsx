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

        {/* ── NORTH AMERICA ── */}
        {/* Alaska */}
        <path d="M 62 62 L 72 55 L 85 52 L 95 57 L 100 66 L 92 72 L 80 74 L 68 70 Z" fill="#cfc0a0" stroke="#a89878" strokeWidth="0.7"/>
        {/* Greenland */}
        <path d="M 168 14 L 188 10 L 208 13 L 218 22 L 215 34 L 204 42 L 190 44 L 174 38 L 166 26 Z" fill="#d8cdb8" stroke="#a89878" strokeWidth="0.6"/>
        {/* Canada + USA */}
        <path d="M 95 57 L 115 50 L 148 48 L 178 52 L 200 58 L 218 66 L 228 78 L 234 94 L 238 112 L 235 130 L 228 148 L 218 162 L 205 174 L 192 184 L 178 194 L 165 202 L 156 214 L 148 228 L 140 236 L 130 238 L 118 234 L 106 226 L 96 214 L 85 202 L 76 188 L 70 172 L 64 154 L 60 136 L 58 118 L 60 100 L 66 80 L 74 68 L 82 63 L 92 60 Z" fill="#cfc0a0" stroke="#a89878" strokeWidth="0.8"/>
        {/* Florida peninsula */}
        <path d="M 196 196 L 202 204 L 198 214 L 192 218 L 188 210 L 190 200 Z" fill="#cfc0a0" stroke="#a89878" strokeWidth="0.5"/>
        {/* Baja California */}
        <path d="M 104 194 L 108 200 L 106 212 L 102 218 L 98 212 L 100 202 Z" fill="#cfc0a0" stroke="#a89878" strokeWidth="0.5"/>
        {/* Mexico + Central America */}
        <path d="M 140 236 L 152 240 L 162 246 L 170 252 L 172 260 L 166 266 L 158 264 L 148 256 L 138 250 L 132 242 Z" fill="#cfc0a0" stroke="#a89878" strokeWidth="0.7"/>
        {/* Cuba */}
        <path d="M 184 222 L 196 220 L 204 222 L 206 226 L 196 228 L 184 226 Z" fill="#cfc0a0" stroke="#a89878" strokeWidth="0.5"/>

        {/* ── SOUTH AMERICA ── */}
        <path d="M 172 262 L 186 256 L 202 254 L 218 258 L 232 266 L 244 278 L 252 294 L 256 312 L 254 330 L 248 348 L 238 364 L 224 378 L 208 388 L 194 392 L 180 388 L 168 376 L 158 358 L 152 338 L 150 316 L 152 296 L 158 278 L 166 268 Z" fill="#cfc0a0" stroke="#a89878" strokeWidth="0.8"/>
        {/* Cape Horn area */}
        <path d="M 180 388 L 178 398 L 182 406 L 188 404 L 190 394 Z" fill="#cfc0a0" stroke="#a89878" strokeWidth="0.5"/>

        {/* ── EUROPE ── */}
        {/* Iberian */}
        <path d="M 380 118 L 396 112 L 410 114 L 418 122 L 416 134 L 406 140 L 392 138 L 380 130 Z" fill="#cfc0a0" stroke="#a89878" strokeWidth="0.7"/>
        {/* France + Benelux */}
        <path d="M 408 96 L 424 90 L 440 90 L 450 98 L 448 110 L 438 116 L 424 116 L 412 110 Z" fill="#cfc0a0" stroke="#a89878" strokeWidth="0.7"/>
        {/* UK */}
        <path d="M 396 82 L 406 78 L 416 80 L 420 88 L 414 94 L 404 94 L 396 88 Z" fill="#cfc0a0" stroke="#a89878" strokeWidth="0.6"/>
        {/* Ireland */}
        <path d="M 386 82 L 392 80 L 394 86 L 390 90 L 385 87 Z" fill="#cfc0a0" stroke="#a89878" strokeWidth="0.5"/>
        {/* Scandinavia */}
        <path d="M 428 58 L 444 50 L 458 52 L 466 60 L 462 72 L 452 78 L 440 76 L 430 68 Z" fill="#cfc0a0" stroke="#a89878" strokeWidth="0.7"/>
        {/* Germany + Poland + Balkans */}
        <path d="M 446 96 L 468 92 L 488 96 L 498 106 L 498 118 L 490 126 L 476 128 L 460 124 L 448 116 Z" fill="#cfc0a0" stroke="#a89878" strokeWidth="0.7"/>
        {/* Italy */}
        <path d="M 448 116 L 460 118 L 466 128 L 462 140 L 456 150 L 450 156 L 444 150 L 442 138 L 444 126 Z" fill="#cfc0a0" stroke="#a89878" strokeWidth="0.6"/>
        {/* Greece */}
        <path d="M 480 130 L 490 128 L 494 136 L 490 142 L 482 140 Z" fill="#cfc0a0" stroke="#a89878" strokeWidth="0.5"/>

        {/* ── AFRICA ── */}
        <path d="M 392 142 L 416 138 L 442 140 L 462 148 L 478 158 L 494 170 L 506 186 L 514 204 L 518 224 L 516 246 L 510 268 L 500 290 L 486 308 L 468 322 L 450 330 L 432 332 L 414 326 L 398 314 L 386 296 L 376 274 L 372 252 L 372 228 L 376 204 L 382 182 L 386 162 L 388 148 Z" fill="#cfc0a0" stroke="#a89878" strokeWidth="0.8"/>
        {/* Madagascar */}
        <path d="M 524 248 L 530 242 L 536 248 L 534 264 L 528 270 L 522 264 L 522 252 Z" fill="#cfc0a0" stroke="#a89878" strokeWidth="0.5"/>

        {/* ── RUSSIA / EURASIA ── */}
        <path d="M 498 60 L 530 52 L 568 46 L 610 44 L 650 46 L 688 50 L 718 56 L 742 64 L 756 76 L 752 92 L 738 102 L 718 108 L 694 112 L 666 112 L 638 108 L 610 102 L 582 98 L 554 96 L 528 98 L 506 102 L 494 110 L 488 98 L 490 82 L 494 68 Z" fill="#cfc0a0" stroke="#a89878" strokeWidth="0.8"/>
        {/* Kamchatka */}
        <path d="M 752 72 L 764 68 L 770 76 L 768 86 L 760 90 L 752 84 Z" fill="#cfc0a0" stroke="#a89878" strokeWidth="0.5"/>

        {/* ── MIDDLE EAST ── */}
        <path d="M 494 110 L 514 106 L 534 106 L 550 110 L 562 118 L 568 130 L 566 144 L 556 154 L 540 160 L 524 160 L 508 154 L 498 144 L 492 130 L 492 118 Z" fill="#cfc0a0" stroke="#a89878" strokeWidth="0.7"/>
        {/* Arabian Peninsula */}
        <path d="M 524 160 L 540 158 L 556 156 L 568 162 L 574 176 L 572 194 L 560 208 L 546 214 L 530 212 L 518 202 L 514 186 L 516 170 Z" fill="#cfc0a0" stroke="#a89878" strokeWidth="0.7"/>

        {/* ── CENTRAL ASIA ── */}
        <path d="M 562 98 L 582 96 L 606 100 L 626 106 L 638 116 L 636 128 L 622 134 L 604 134 L 584 128 L 568 120 L 560 110 Z" fill="#cfc0a0" stroke="#a89878" strokeWidth="0.7"/>

        {/* ── SOUTH ASIA (India) ── */}
        <path d="M 606 130 L 630 126 L 650 130 L 662 142 L 664 158 L 658 176 L 648 192 L 634 204 L 618 210 L 604 206 L 594 194 L 590 178 L 592 160 L 598 144 Z" fill="#cfc0a0" stroke="#a89878" strokeWidth="0.7"/>
        {/* Sri Lanka */}
        <path d="M 636 212 L 640 208 L 644 212 L 642 218 L 636 216 Z" fill="#cfc0a0" stroke="#a89878" strokeWidth="0.4"/>

        {/* ── EAST ASIA ── */}
        {/* China */}
        <path d="M 640 100 L 664 96 L 690 96 L 710 102 L 722 114 L 720 130 L 708 142 L 690 148 L 670 148 L 650 142 L 638 130 L 636 116 Z" fill="#cfc0a0" stroke="#a89878" strokeWidth="0.7"/>
        {/* SE Asia peninsula */}
        <path d="M 680 148 L 700 152 L 712 162 L 710 178 L 700 188 L 686 188 L 676 178 L 674 164 Z" fill="#cfc0a0" stroke="#a89878" strokeWidth="0.6"/>
        {/* Japan */}
        <path d="M 740 100 L 748 96 L 756 100 L 756 110 L 748 116 L 740 112 Z" fill="#cfc0a0" stroke="#a89878" strokeWidth="0.5"/>
        <path d="M 748 90 L 754 86 L 760 90 L 758 98 L 750 98 Z" fill="#cfc0a0" stroke="#a89878" strokeWidth="0.5"/>
        {/* Korean peninsula */}
        <path d="M 722 102 L 730 100 L 736 106 L 734 116 L 726 118 L 720 112 Z" fill="#cfc0a0" stroke="#a89878" strokeWidth="0.5"/>
        {/* Taiwan */}
        <path d="M 718 150 L 722 148 L 726 152 L 724 158 L 718 156 Z" fill="#cfc0a0" stroke="#a89878" strokeWidth="0.4"/>
        {/* Borneo/Indonesia */}
        <path d="M 700 186 L 720 182 L 736 186 L 740 196 L 730 204 L 712 204 L 700 196 Z" fill="#cfc0a0" stroke="#a89878" strokeWidth="0.6"/>
        <path d="M 744 190 L 756 188 L 764 196 L 760 206 L 748 206 L 742 198 Z" fill="#cfc0a0" stroke="#a89878" strokeWidth="0.5"/>
        {/* Philippines */}
        <path d="M 728 158 L 734 154 L 740 158 L 738 168 L 730 170 L 726 164 Z" fill="#cfc0a0" stroke="#a89878" strokeWidth="0.5"/>

        {/* ── AUSTRALIA ── */}
        <path d="M 694 272 L 720 262 L 750 260 L 778 264 L 800 274 L 814 290 L 818 310 L 812 332 L 798 350 L 778 362 L 754 368 L 730 366 L 708 354 L 694 336 L 686 314 L 686 292 Z" fill="#cfc0a0" stroke="#a89878" strokeWidth="0.8"/>
        {/* Tasmania */}
        <path d="M 756 370 L 762 368 L 766 374 L 762 380 L 756 378 Z" fill="#cfc0a0" stroke="#a89878" strokeWidth="0.4"/>
        {/* New Zealand */}
        <path d="M 838 318 L 844 314 L 850 320 L 848 332 L 840 334 L 836 326 Z" fill="#cfc0a0" stroke="#a89878" strokeWidth="0.5"/>
        <path d="M 844 338 L 850 336 L 854 342 L 850 350 L 844 348 Z" fill="#cfc0a0" stroke="#a89878" strokeWidth="0.4"/>

        {/* ── ANTARCTICA (hint) ── */}
        <path d="M 0 445 Q 150 435 300 440 Q 450 445 600 440 Q 750 435 900 445 L 900 468 L 0 468 Z" fill="#ddd5c4" stroke="#a89878" strokeWidth="0.5" opacity="0.6"/>

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