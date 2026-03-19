import { useState } from "react";
import { type MarkerType, type Section } from "@/data/un-data";
import { WorldMap, Legend, MarkerDetail } from "@/components/WorldMap";
import {
  TimelineSection,
  FactsSection,
  OfficeSection,
  ConferencesSection,
  OperationsSection,
} from "@/components/InfoSections";

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
            <div
              className="font-display"
              style={{ fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#8b6914", marginBottom: "2px", opacity: 0.9 }}
            >
              Интерактивный архив
            </div>
            <h1 className="font-serif" style={{ fontSize: "1.75rem", fontWeight: 600, color: "#f0e6cc" }}>
              Организация Объединённых Наций
            </h1>
            <div
              className="font-display"
              style={{ fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#f0e6cc", opacity: 0.4, marginTop: "2px" }}
            >
              История · Конференции · Миротворческие операции · 1941–2012
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "3rem", color: "#8b6914", opacity: 0.7 }}>🕊</div>
            <div
              className="font-display"
              style={{ fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#f0e6cc", opacity: 0.35 }}
            >
              UN · 1945
            </div>
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
                    <span
                      className="font-display"
                      style={{ fontSize: "0.65rem", letterSpacing: "0.08em", textTransform: "uppercase", color: item.color }}
                    >
                      {item.label}
                    </span>
                  </div>
                  <p style={{ fontSize: "0.75rem", lineHeight: 1.5, color: "var(--ink-light)", opacity: 0.75 }}>
                    {item.desc}
                  </p>
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
