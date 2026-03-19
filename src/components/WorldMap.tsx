import { useState, useEffect, useRef } from "react";
import { geoNaturalEarth1, geoPath, geoGraticule } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology, Objects } from "topojson-specification";
import type { FeatureCollection, Geometry } from "geojson";
import { ALL_MARKERS, OPERATIONS, UN_HQ, type MarkerType, type Marker } from "@/data/un-data";

// ─── HELPERS ─────────────────────────────────────────────────────────────────

export function markerColor(type: string): string {
  if (type === "conference") return "#8b2500";
  if (type === "office") return "#1a3a6b";
  if (type === "military") return "#2d4a22";
  return "#5c4209";
}

const W = 900;
const H = 468;

const projection = geoNaturalEarth1()
  .scale(143)
  .translate([W / 2, H / 2 + 10]);

const pathGen = geoPath().projection(projection);
const graticuleGen = geoGraticule();

function project(lon: number, lat: number): [number, number] {
  return projection([lon, lat]) ?? [0, 0];
}

// ─── GEO COORDS for markers (lon, lat) ───────────────────────────────────────

const MARKER_LONLAT: Record<string, [number, number]> = {
  dumbarton:    [-77.05, 38.9],
  yalta:        [34.15, 44.5],
  sanfrancisco: [-122.4, 37.8],
  tehran:       [51.4, 35.7],
  unhq:         [-74.0, 40.7],
  yugoslavia:   [18.4, 43.85],
  syria:        [36.3, 33.5],
};

// ─── LEGEND / FILTER ─────────────────────────────────────────────────────────

export function Legend({
  filter,
  setFilter,
}: {
  filter: MarkerType;
  setFilter: (f: MarkerType) => void;
}) {
  const items: { type: MarkerType; label: string; color: string }[] = [
    { type: "all",        label: "Все события",   color: "#5c4209" },
    { type: "conference", label: "Конференции",    color: "#8b2500" },
    { type: "office",     label: "Штаб-квартира", color: "#1a3a6b" },
    { type: "military",   label: "Операции ООН",  color: "#2d4a22" },
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
          <span style={{
            display: "inline-block", width: "8px", height: "8px", borderRadius: "50%",
            background: item.color, marginRight: "6px", verticalAlign: "middle",
          }} />
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
    conference: "#8b2500", office: "#1a3a6b", military: "#2d4a22",
  };
  const labelMap: Record<string, string> = {
    conference: "Конференция", office: "Штаб-квартира ООН", military: "Миротворческая операция",
  };

  return (
    <div className="vintage-card animate-fade-in-up" style={{ padding: "1rem", borderRadius: "2px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.5rem" }}>
        <div>
          <div className="font-display" style={{
            fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase",
            color: colorMap[marker.type], marginBottom: "2px",
          }}>
            {labelMap[marker.type]}
          </div>
          <h3 className="font-serif" style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--ink)" }}>
            {marker.name}
          </h3>
          <div style={{ fontSize: "0.8rem", color: "var(--sepia)", marginTop: "2px" }}>
            {marker.city} · {marker.year}
          </div>
        </div>
        <button onClick={onClose} style={{ fontSize: "0.75rem", opacity: 0.5, cursor: "pointer", marginTop: "2px" }}>✕</button>
      </div>
      <p style={{ marginTop: "0.75rem", fontSize: "0.875rem", lineHeight: 1.6, color: "var(--ink-light)" }}>
        {marker.description}
      </p>
    </div>
  );
}

// ─── WORLD MAP SVG ────────────────────────────────────────────────────────────

interface WorldAtlasTopo extends Topology<Objects<Record<string, unknown>>> {
  objects: {
    countries: Objects<Record<string, unknown>>["countries"];
    land: Objects<Record<string, unknown>>["land"];
  };
}

interface GeoState {
  countries: FeatureCollection<Geometry>;
  land: FeatureCollection<Geometry>;
}

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
    x: number; y: number; text: string; subtext: string;
  } | null>(null);
  const [geoState, setGeoState] = useState<GeoState | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
      .then((r) => r.json())
      .then((topo: WorldAtlasTopo) => {
        const countries = feature(topo, topo.objects.countries) as FeatureCollection<Geometry>;
        const land = feature(topo, topo.objects.land) as FeatureCollection<Geometry>;
        setGeoState({ countries, land });
      });
  }, []);

  const visibleMarkers = ALL_MARKERS.filter(
    (m: Marker) => filter === "all" || m.type === filter
  );
  const showOfficeLine = filter === "all" || filter === "military";

  const graticulePath = pathGen(graticuleGen()) ?? "";
  const spherePath = pathGen({ type: "Sphere" }) ?? "";

  return (
    <div
      ref={containerRef}
      className="map-container rounded-sm w-full"
      style={{ position: "relative", paddingBottom: "52%" }}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{
          position: "absolute", inset: 0, width: "100%", height: "100%",
          fontFamily: "'Cormorant Garamond', serif",
        }}
      >
        <defs>
          <filter id="markerShadow">
            <feDropShadow dx="1" dy="2" stdDeviation="2" floodOpacity="0.25" />
          </filter>
          <marker id="arrowGreen" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill="#2d4a22" opacity="0.85" />
          </marker>
        </defs>

        {/* Ocean sphere */}
        <path d={spherePath} fill="#c5daea" />

        {/* Graticule */}
        <path d={graticulePath} fill="none" stroke="#a0bdd0" strokeWidth="0.35" opacity="0.55" />

        {/* Countries */}
        {geoState ? (
          <>
            {geoState.countries.features.map((f, i) => {
              const d = pathGen(f);
              if (!d) return null;
              return (
                <path
                  key={i}
                  d={d}
                  fill="#c8b898"
                  stroke="#f0e6cc"
                  strokeWidth="0.5"
                />
              );
            })}
            {/* Land outline */}
            <path
              d={pathGen(geoState.land) ?? ""}
              fill="none"
              stroke="#a09070"
              strokeWidth="0.9"
              opacity="0.7"
            />
          </>
        ) : (
          /* Loading fallback: use provided image */
          <image
            href="https://cdn.poehali.dev/projects/ab58dd35-465d-4f0a-a6ae-901b12d6c4a9/bucket/a34273f6-d0ce-4751-9204-fdfbb60326e9.png"
            x="0" y="0" width={W} height={H}
            preserveAspectRatio="xMidYMid meet"
            opacity="0.9"
          />
        )}

        {/* Arrows: UN HQ → Operations */}
        {showOfficeLine && OPERATIONS.map((op) => {
          const hqLonlat = MARKER_LONLAT[UN_HQ.id];
          const opLonlat = MARKER_LONLAT[op.id];
          if (!hqLonlat || !opLonlat) return null;
          const [sx, sy] = project(...hqLonlat);
          const [ex, ey] = project(...opLonlat);
          const midX = (sx + ex) / 2;
          const midY = Math.min(sy, ey) - 38;
          const pathId = `ap_${op.id}`;

          return (
            <g key={op.id}>
              <path
                id={pathId}
                d={`M ${sx} ${sy} Q ${midX} ${midY} ${ex} ${ey}`}
                fill="none"
                stroke="#2d4a22"
                strokeWidth="1.8"
                strokeDasharray="8 4"
                markerEnd="url(#arrowGreen)"
                opacity="0.8"
                className="arrow-dash"
              />
              <text fontSize="7.5" fill="#2d4a22" opacity="0.9" fontWeight="500">
                <textPath href={`#${pathId}`} startOffset="45%" textAnchor="middle">
                  {op.year} · {op.name.split("—")[0].trim()}
                </textPath>
              </text>
            </g>
          );
        })}

        {/* Markers */}
        {visibleMarkers.map((m: Marker) => {
          const lonlat = MARKER_LONLAT[m.id];
          if (!lonlat) return null;
          const [cx, cy] = project(...lonlat);
          const color = markerColor(m.type);
          const isActive = activeMarker === m.id;

          return (
            <g
              key={m.id}
              style={{ cursor: "pointer" }}
              onClick={() => onMarkerClick(m.id)}
              onMouseEnter={() => setTooltip({
                x: (cx / W) * 100,
                y: (cy / H) * 100,
                text: m.name,
                subtext: `${m.city}, ${m.year}`,
              })}
              onMouseLeave={() => setTooltip(null)}
            >
              {isActive && (
                <circle cx={cx} cy={cy} r={16} fill={color} opacity="0.18" className="marker-pulse" />
              )}
              <circle cx={cx} cy={cy} r={isActive ? 9 : 7} fill={color} opacity="0.15" className="marker-pulse" />
              <circle
                cx={cx} cy={cy}
                r={isActive ? 8 : 6}
                fill={color}
                stroke="#f0e6cc"
                strokeWidth={isActive ? 2 : 1.5}
                filter="url(#markerShadow)"
              />
              <text x={cx + 10} y={cy - 5} fontSize="8" fill={color} fontWeight="700" opacity="0.95">
                {m.year}
              </text>
              <text x={cx + 10} y={cy + 5} fontSize="7" fill="#2c1a0e" opacity="0.8">
                {m.city.split(",")[0]}
              </text>
            </g>
          );
        })}

        {/* Compass rose */}
        <g transform="translate(858, 420)" opacity="0.55">
          <circle cx={0} cy={0} r={18} fill="rgba(240,230,204,0.5)" stroke="#8b6914" strokeWidth="0.8" />
          <path d="M0,-15 L3,-5 L0,-8 L-3,-5 Z" fill="#8b6914" />
          <path d="M0,15 L3,5 L0,8 L-3,5 Z" fill="#8b6914" opacity="0.5" />
          <path d="M-15,0 L-5,-3 L-8,0 L-5,3 Z" fill="#8b6914" opacity="0.5" />
          <path d="M15,0 L5,-3 L8,0 L5,3 Z" fill="#8b6914" opacity="0.5" />
          <text x={0} y={-20} textAnchor="middle" fontSize="9" fill="#8b6914" fontWeight="700">С</text>
          <circle cx={0} cy={0} r={2} fill="#8b6914" />
        </g>

        {/* Map title */}
        <text x="450" y="18" textAnchor="middle" fontSize="10" fill="#5c4209"
          fontWeight="500" letterSpacing="3" opacity="0.6" fontStyle="italic">
          КАРТА МИРА — ИСТОРИЯ ОРГАНИЗАЦИИ ОБЪЕДИНЁННЫХ НАЦИЙ
        </text>
      </svg>

      {/* Tooltip */}
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
