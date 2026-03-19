import { useState } from "react";

// ─── DATA ───────────────────────────────────────────────────────────────────

const CONFERENCES = [
  {
    id: "dumbarton",
    type: "conference",
    name: "Думбартон-Окс",
    city: "Вашингтон, США",
    year: 1944,
    coords: { x: 18.5, y: 34 },
    description: "Предварительная конференция по созданию ООН. Участники: США, СССР, Великобритания, Китай. Разработана структура будущей организации.",
  },
  {
    id: "yalta",
    type: "conference",
    name: "Ялтинская конференция",
    city: "Ялта, СССР",
    year: 1945,
    coords: { x: 55.5, y: 29 },
    description: "Рузвельт, Черчилль и Сталин согласовали принципы голосования в Совете Безопасности ООН и созыв конференции в Сан-Франциско.",
  },
  {
    id: "sanfrancisco",
    type: "conference",
    name: "Конференция в Сан-Франциско",
    city: "Сан-Франциско, США",
    year: 1945,
    coords: { x: 11, y: 33.5 },
    description: "Главная учредительная конференция. 50 государств подписали Устав ООН 26 июня 1945 года.",
  },
  {
    id: "london",
    type: "conference",
    name: "Первая Генассамблея",
    city: "Лондон, Великобритания",
    year: 1946,
    coords: { x: 46.5, y: 24 },
    description: "Первая сессия Генеральной Ассамблеи ООН. 10 января 1946 года, Вестминстерский методистский центральный зал.",
  },
];

const UN_HQ = {
  id: "unhq",
  type: "office",
  name: "Штаб-квартира ООН",
  city: "Нью-Йорк, США",
  year: 1952,
  coords: { x: 21.5, y: 31.5 },
  description: "Главный офис ООН на берегу Ист-Ривер. Основан в 1952 году. Здесь заседают Генеральная Ассамблея, Совет Безопасности и Экономический Совет.",
};

const OPERATIONS = [
  {
    id: "yugoslavia",
    type: "military",
    name: "UNPROFOR — Югославия",
    city: "Сараево, Босния",
    year: 1992,
    coords: { x: 51.5, y: 27.5 },
    description: "Силы ООН по охране (UNPROFOR) — первая крупная миротворческая операция в Европе. 1992–1995 гг. Зоны защиты в Хорватии и Боснии.",
  },
  {
    id: "syria",
    type: "military",
    name: "УНСМИС — Сирия",
    city: "Дамаск, Сирия",
    year: 2012,
    coords: { x: 57, y: 33 },
    description: "Миссия ООН по наблюдению в Сирии (УНСМИС, 2012). Наблюдатели развёрнуты для мониторинга прекращения огня в ходе гражданской войны.",
  },
];

const TIMELINE_EVENTS = [
  { year: 1941, text: "Атлантическая хартия Рузвельта и Черчилля — первые принципы послевоенного мира" },
  { year: 1942, text: "Декларация Объединённых Наций подписана 26 государствами" },
  { year: 1944, text: "Конференция в Думбартон-Оксе — разработка структуры ООН" },
  { year: 1945, text: "Ялта: согласование принципов голосования в СБ ООН" },
  { year: 1945, text: "Сан-Франциско: подписание Устава ООН (26 июня)" },
  { year: 1945, text: "Устав вступил в силу 24 октября — День ООН" },
  { year: 1946, text: "Первая Генеральная Ассамблея в Лондоне" },
  { year: 1952, text: "Штаб-квартира ООН в Нью-Йорке официально открыта" },
  { year: 1992, text: "UNPROFOR: миротворцы ООН в Югославии" },
  { year: 2012, text: "УНСМИС: наблюдательная миссия в Сирии" },
];

const UN_FACTS = [
  { label: "Государств-членов", value: "193" },
  { label: "Сотрудников по всему миру", value: "44 000+" },
  { label: "Миротворческих операций", value: "71" },
  { label: "Официальных языков", value: "6" },
  { label: "Год основания", value: "1945" },
  { label: "Полевых миссий", value: "12" },
];

type MarkerType = "all" | "conference" | "office" | "military";
type Section = "map" | "timeline" | "facts" | "office" | "conferences" | "operations";

const ALL_MARKERS = [...CONFERENCES, UN_HQ, ...OPERATIONS];

// ─── WORLD MAP SVG ──────────────────────────────────────────────────────────

function WorldMap({
  filter,
  onMarkerClick,
  activeMarker,
}: {
  filter: MarkerType;
  onMarkerClick: (id: string) => void;
  activeMarker: string | null;
}) {
  const [tooltip, setTooltip] = useState<{
    x: number; y: number; text: string; subtext: string;
  } | null>(null);

  const visibleMarkers = ALL_MARKERS.filter(
    (m) => filter === "all" || m.type === filter
  );

  const showOfficeLine = filter === "all" || filter === "military";

  const markerColor = (type: string) => {
    if (type === "conference") return "#8b2500";
    if (type === "office") return "#1a3a6b";
    if (type === "military") return "#2d4a22";
    return "#5c4209";
  };

  return (
    <div className="map-container rounded-sm w-full" style={{ position: "relative", paddingBottom: "52%" }}>
      <svg
        viewBox="0 0 900 468"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", fontFamily: "'Cormorant Garamond', serif" }}
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
        <path d="M 155 220 L 165 235 L 155 250 L 145 240 L 140 225 Z" fill="#cfc0a0" stroke="#a89878" strokeWidth="0.6" />
        {/* South America */}
        <path d="M 165 255 L 195 245 L 230 255 L 255 275 L 265 310 L 260 350 L 240 380 L 210 400 L 185 395 L 165 375 L 150 340 L 148 305 L 155 275 Z"
          fill="#cfc0a0" stroke="#a89878" strokeWidth="0.8" />
        {/* Europe */}
        <path d="M 390 55 L 430 48 L 465 52 L 480 65 L 470 80 L 450 90 L 430 95 L 410 88 L 395 75 Z"
          fill="#cfc0a0" stroke="#a89878" strokeWidth="0.8" />
        <path d="M 420 30 L 450 25 L 465 38 L 460 55 L 440 58 L 420 50 Z" fill="#cfc0a0" stroke="#a89878" strokeWidth="0.6" />
        <path d="M 400 55 L 415 50 L 420 62 L 408 68 L 398 63 Z" fill="#cfc0a0" stroke="#a89878" strokeWidth="0.6" />
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
        <path d="M 745 75 L 760 70 L 768 85 L 758 95 L 745 90 Z" fill="#cfc0a0" stroke="#a89878" strokeWidth="0.6" />
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
        {showOfficeLine && OPERATIONS.map((op) => {
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
        {visibleMarkers.map((m) => {
          const cx = m.coords.x * 9;
          const cy = m.coords.y * 4.68;
          const color = markerColor(m.type);
          const isActive = activeMarker === m.id;

          return (
            <g
              key={m.id}
              style={{ cursor: "pointer" }}
              onClick={() => onMarkerClick(m.id)}
              onMouseEnter={() => setTooltip({ x: (cx / 900) * 100, y: (cy / 468) * 100, text: m.name, subtext: `${m.city}, ${m.year}` })}
              onMouseLeave={() => setTooltip(null)}
            >
              {isActive && <circle cx={cx} cy={cy} r={16} fill={color} opacity="0.15" className="marker-pulse" />}
              <circle cx={cx} cy={cy} r={10} fill={color} opacity="0.1" className="marker-pulse" />
              <circle cx={cx} cy={cy} r={isActive ? 8 : 6} fill={color} stroke="#f0e6cc" strokeWidth={isActive ? 2 : 1.5} filter="url(#shadow)" />
              <text x={cx + 10} y={cy - 7} fontSize="8" fill={color} fontWeight="600" opacity="0.9">{m.year}</text>
              <text x={cx + 10} y={cy + 3} fontSize="7.5" fill="#2c1a0e" opacity="0.7">{m.city.split(",")[0]}</text>
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
        <text x="450" y="21" textAnchor="middle" fontSize="10" fill="#5c4209" fontWeight="500" letterSpacing="3" opacity="0.65" fontStyle="italic">
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
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.9rem", fontWeight: 600 }}>{tooltip.text}</div>
          <div style={{ fontSize: "0.75rem", opacity: 0.75, marginTop: "2px" }}>{tooltip.subtext}</div>
        </div>
      )}
    </div>
  );
}

// ─── LEGEND / FILTER ─────────────────────────────────────────────────────────

function Legend({ filter, setFilter }: { filter: MarkerType; setFilter: (f: MarkerType) => void }) {
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
          style={filter === item.type ? { background: item.color, borderColor: item.color, color: "#f0e6cc" } : {}}
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

function MarkerDetail({ markerId, onClose }: { markerId: string | null; onClose: () => void }) {
  if (!markerId) return null;
  const marker = ALL_MARKERS.find((m) => m.id === markerId);
  if (!marker) return null;

  const colorMap: Record<string, string> = { conference: "#8b2500", office: "#1a3a6b", military: "#2d4a22" };
  const labelMap: Record<string, string> = { conference: "Конференция", office: "Штаб-квартира ООН", military: "Миротворческая операция" };

  return (
    <div className="vintage-card animate-fade-in-up" style={{ padding: "1rem", borderRadius: "2px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.5rem" }}>
        <div>
          <div className="font-display" style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: colorMap[marker.type], marginBottom: "2px" }}>
            {labelMap[marker.type]}
          </div>
          <h3 className="font-serif" style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--ink)" }}>{marker.name}</h3>
          <div style={{ fontSize: "0.8rem", color: "var(--sepia)", marginTop: "2px" }}>{marker.city} · {marker.year}</div>
        </div>
        <button onClick={onClose} style={{ fontSize: "0.75rem", opacity: 0.5, cursor: "pointer", marginTop: "2px" }}>✕</button>
      </div>
      <p style={{ marginTop: "0.75rem", fontSize: "0.875rem", lineHeight: 1.6, color: "var(--ink-light)" }}>{marker.description}</p>
    </div>
  );
}

// ─── TIMELINE ────────────────────────────────────────────────────────────────

function TimelineSection() {
  return (
    <div className="vintage-card" style={{ padding: "1.5rem", borderRadius: "2px" }}>
      <h2 className="font-serif" style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "1.25rem", color: "var(--ink)" }}>
        Хронология создания ООН
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {TIMELINE_EVENTS.map((ev, i) => (
          <div key={i} className="timeline-item animate-fade-in-up" style={{ animationDelay: `${i * 0.06}s` }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "1rem" }}>
              <span className="font-display" style={{ fontWeight: 700, fontSize: "1rem", color: "var(--sepia-dark)", minWidth: "3rem", flexShrink: 0 }}>
                {ev.year}
              </span>
              <span style={{ fontSize: "0.875rem", lineHeight: 1.6, color: "var(--ink-light)" }}>{ev.text}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── FACTS ───────────────────────────────────────────────────────────────────

function FactsSection() {
  return (
    <div className="vintage-card" style={{ padding: "1.5rem", borderRadius: "2px" }}>
      <h2 className="font-serif" style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "1.25rem", color: "var(--ink)" }}>
        ООН в цифрах
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem" }}>
        {UN_FACTS.map((fact, i) => (
          <div
            key={i}
            className="animate-fade-in-up"
            style={{
              textAlign: "center",
              padding: "1rem",
              background: "rgba(139,105,20,0.06)",
              border: "1px solid rgba(139,105,20,0.2)",
              animationDelay: `${i * 0.08}s`,
            }}
          >
            <div className="font-serif" style={{ fontSize: "2rem", fontWeight: 700, color: "var(--sepia-dark)" }}>{fact.value}</div>
            <div className="font-display" style={{ fontSize: "0.65rem", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: "4px", color: "var(--ink-light)", opacity: 0.7 }}>
              {fact.label}
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: "1.25rem", padding: "1rem", background: "rgba(26,58,107,0.06)", border: "1px solid rgba(26,58,107,0.15)" }}>
        <p style={{ fontSize: "0.875rem", lineHeight: 1.6, fontStyle: "italic", color: "var(--ink-light)" }}>
          ООН — крупнейшая международная организация мира. Бюджет на 2024 год составляет около 3,5 миллиарда долларов. Организация работает более чем в 100 странах.
        </p>
      </div>
    </div>
  );
}

// ─── OFFICE ──────────────────────────────────────────────────────────────────

function OfficeSection() {
  return (
    <div className="vintage-card" style={{ padding: "1.5rem", borderRadius: "2px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#1a3a6b", color: "#f0e6cc", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>★</div>
        <div>
          <div className="font-display" style={{ fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#1a3a6b" }}>Штаб-квартира</div>
          <h2 className="font-serif" style={{ fontSize: "1.5rem", fontWeight: 600, color: "var(--ink)" }}>Главный офис ООН, Нью-Йорк</h2>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        <div>
          <h3 className="font-serif" style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.75rem", color: "var(--sepia-dark)" }}>О здании</h3>
          <p style={{ fontSize: "0.875rem", lineHeight: 1.65, marginBottom: "0.75rem", color: "var(--ink-light)" }}>
            Комплекс зданий ООН расположен на берегу реки Ист-Ривер на Манхэттене. Строительство началось в 1948 году, открытие — в 1952 году. Главное здание Секретариата высотой 39 этажей стало символом международного сотрудничества.
          </p>
          <p style={{ fontSize: "0.875rem", lineHeight: 1.65, color: "var(--ink-light)" }}>
            Территория штаб-квартиры является международной зоной. Здесь заседают три из шести главных органов ООН: Генеральная Ассамблея, Совет Безопасности и Экономический и Социальный Совет.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {[
            ["Адрес", "405 East 42nd Street, Нью-Йорк"],
            ["Открытие", "1952 год"],
            ["Архитектор", "Оскар Нимейер, Ле Корбюзье (консультанты)"],
            ["Площадь", "72 гектара (весь комплекс)"],
            ["Гл. здание", "39 этажей, 154 м высота"],
            ["Статус", "Международная территория"],
          ].map(([label, val]) => (
            <div key={label} style={{ display: "flex", gap: "0.75rem", fontSize: "0.875rem" }}>
              <span className="font-display" style={{ fontSize: "0.65rem", letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--sepia)", flexShrink: 0, paddingTop: "2px", minWidth: "80px" }}>{label}</span>
              <span style={{ color: "var(--ink-light)" }}>{val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── CONFERENCES ─────────────────────────────────────────────────────────────

function ConferencesSection() {
  return (
    <div className="vintage-card" style={{ padding: "1.5rem", borderRadius: "2px" }}>
      <h2 className="font-serif" style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "1.25rem", color: "var(--ink)" }}>
        Конференции по созданию ООН
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {CONFERENCES.map((conf, i) => (
          <div
            key={conf.id}
            className="animate-fade-in-up"
            style={{
              padding: "1rem",
              background: "rgba(139,37,0,0.04)",
              border: "1px solid rgba(139,37,0,0.15)",
              borderLeft: "3px solid #8b2500",
              animationDelay: `${i * 0.1}s`,
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "1rem", marginBottom: "6px" }}>
              <h3 className="font-serif" style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--ink)" }}>{conf.name}</h3>
              <span className="font-display" style={{ fontSize: "1rem", fontWeight: 700, flexShrink: 0, color: "#8b2500" }}>{conf.year}</span>
            </div>
            <div className="font-display" style={{ fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--sepia)", opacity: 0.75, marginBottom: "6px" }}>{conf.city}</div>
            <p style={{ fontSize: "0.875rem", lineHeight: 1.6, color: "var(--ink-light)" }}>{conf.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── OPERATIONS ──────────────────────────────────────────────────────────────

function OperationsSection() {
  return (
    <div className="vintage-card" style={{ padding: "1.5rem", borderRadius: "2px" }}>
      <h2 className="font-serif" style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "4px", color: "var(--ink)" }}>
        Военные операции ООН
      </h2>
      <p style={{ fontSize: "0.875rem", marginBottom: "1.25rem", fontStyle: "italic", color: "var(--muted-foreground)" }}>
        На карте стрелками показаны маршруты от штаб-квартиры в Нью-Йорке до зон операций
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {OPERATIONS.map((op, i) => (
          <div
            key={op.id}
            className="animate-fade-in-up"
            style={{
              padding: "1rem",
              background: "rgba(45,74,34,0.05)",
              border: "1px solid rgba(45,74,34,0.18)",
              borderLeft: "3px solid #2d4a22",
              animationDelay: `${i * 0.1}s`,
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "1rem", marginBottom: "6px" }}>
              <h3 className="font-serif" style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--ink)" }}>{op.name}</h3>
              <span className="font-display" style={{ fontSize: "1rem", fontWeight: 700, flexShrink: 0, color: "#2d4a22" }}>{op.year}</span>
            </div>
            <div className="font-display" style={{ fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--sepia)", opacity: 0.75, marginBottom: "6px" }}>{op.city}</div>
            <p style={{ fontSize: "0.875rem", lineHeight: 1.6, color: "var(--ink-light)" }}>{op.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

export default function Index() {
  const [filter, setFilter] = useState<MarkerType>("all");
  const [activeMarker, setActiveMarker] = useState<string | null>(null);
  const [section, setSection] = useState<Section>("map");

  const handleMarkerClick = (id: string) => {
    setActiveMarker(activeMarker === id ? null : id);
  };

  const sections: { id: Section; label: string }[] = [
    { id: "map", label: "Карта" },
    { id: "timeline", label: "Хронология" },
    { id: "facts", label: "Статистика" },
    { id: "office", label: "Офис ООН" },
    { id: "conferences", label: "Конференции" },
    { id: "operations", label: "Операции" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--parchment)", color: "var(--ink)" }}>
      {/* Header */}
      <header style={{ background: "var(--ink)", borderBottom: "1px solid var(--sepia)", padding: "1rem 1.5rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div className="font-display" style={{ fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#8b6914", marginBottom: "2px", opacity: 0.9 }}>
              Интерактивный архив
            </div>
            <h1 className="font-serif" style={{ fontSize: "1.75rem", fontWeight: 600, color: "#f0e6cc" }}>
              Организация Объединённых Наций
            </h1>
            <div className="font-display" style={{ fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#f0e6cc", opacity: 0.4, marginTop: "2px" }}>
              История · Конференции · Миротворческие операции · 1941–2012
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "3rem", color: "#8b6914", opacity: 0.7 }}>🕊</div>
            <div className="font-display" style={{ fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#f0e6cc", opacity: 0.35 }}>UN · 1945</div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div style={{ background: "#ddd0aa", borderBottom: "1px solid var(--sepia)", overflowX: "auto" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex" }}>
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setSection(s.id)}
              className={`section-tab ${section === s.id ? "active" : ""}`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "1.5rem 1rem" }}>

        {section === "map" && (
          <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "0.75rem" }}>
              <Legend filter={filter} setFilter={setFilter} />
              <div style={{ fontSize: "0.75rem", fontStyle: "italic", color: "var(--sepia)", opacity: 0.75 }}>
                Нажмите на маркер для подробностей
              </div>
            </div>

            <WorldMap filter={filter} onMarkerClick={handleMarkerClick} activeMarker={activeMarker} />

            {activeMarker && (
              <MarkerDetail markerId={activeMarker} onClose={() => setActiveMarker(null)} />
            )}

            {/* Map key */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }}>
              {[
                { color: "#8b2500", label: "Конференции", desc: "Думбартон-Окс, Ялта, Сан-Франциско, Лондон" },
                { color: "#1a3a6b", label: "Штаб-квартира", desc: "Нью-Йорк — главный офис ООН с 1952 г." },
                { color: "#2d4a22", label: "Операции ООН", desc: "Югославия (1992), Сирия (2012)" },
              ].map((item) => (
                <div key={item.label} className="vintage-card" style={{ padding: "0.75rem", borderRadius: "2px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "4px" }}>
                    <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: item.color, flexShrink: 0 }} />
                    <span className="font-display" style={{ fontSize: "0.65rem", letterSpacing: "0.08em", textTransform: "uppercase", color: item.color }}>
                      {item.label}
                    </span>
                  </div>
                  <p style={{ fontSize: "0.75rem", lineHeight: 1.5, color: "var(--ink-light)", opacity: 0.75 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {section === "timeline" && <TimelineSection />}
        {section === "facts" && <FactsSection />}
        {section === "office" && <OfficeSection />}
        {section === "conferences" && <ConferencesSection />}
        {section === "operations" && <OperationsSection />}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--sepia)", marginTop: "2rem", padding: "1rem 1.5rem", textAlign: "center", opacity: 0.55 }}>
        <p className="font-display" style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--sepia-dark)" }}>
          Интерактивная историческая карта ООН · 1941–2012 · Образовательный проект
        </p>
      </footer>
    </div>
  );
}
