import { CONFERENCES, OPERATIONS, TIMELINE_EVENTS, UN_FACTS } from "@/data/un-data";

// ─── TIMELINE ────────────────────────────────────────────────────────────────

export function TimelineSection() {
  return (
    <div className="vintage-card" style={{ padding: "1.5rem", borderRadius: "2px" }}>
      <h2 className="font-serif" style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "1.25rem", color: "var(--ink)" }}>
        Хронология создания ООН
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {TIMELINE_EVENTS.map((ev, i) => (
          <div key={i} className="timeline-item animate-fade-in-up" style={{ animationDelay: `${i * 0.06}s` }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "1rem" }}>
              <span
                className="font-display"
                style={{ fontWeight: 700, fontSize: "1rem", color: "var(--sepia-dark)", minWidth: "3rem", flexShrink: 0 }}
              >
                {ev.year}
              </span>
              <span style={{ fontSize: "0.875rem", lineHeight: 1.6, color: "var(--ink-light)" }}>
                {ev.text}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── FACTS ───────────────────────────────────────────────────────────────────

export function FactsSection() {
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
            <div className="font-serif" style={{ fontSize: "2rem", fontWeight: 700, color: "var(--sepia-dark)" }}>
              {fact.value}
            </div>
            <div
              className="font-display"
              style={{
                fontSize: "0.65rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginTop: "4px",
                color: "var(--ink-light)",
                opacity: 0.7,
              }}
            >
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

export function OfficeSection() {
  return (
    <div className="vintage-card" style={{ padding: "1.5rem", borderRadius: "2px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "#1a3a6b",
            color: "#f0e6cc",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.2rem",
          }}
        >
          ★
        </div>
        <div>
          <div
            className="font-display"
            style={{ fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#1a3a6b" }}
          >
            Штаб-квартира
          </div>
          <h2 className="font-serif" style={{ fontSize: "1.5rem", fontWeight: 600, color: "var(--ink)" }}>
            Главный офис ООН, Нью-Йорк
          </h2>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        <div>
          <h3 className="font-serif" style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.75rem", color: "var(--sepia-dark)" }}>
            О здании
          </h3>
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
              <span
                className="font-display"
                style={{
                  fontSize: "0.65rem",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  color: "var(--sepia)",
                  flexShrink: 0,
                  paddingTop: "2px",
                  minWidth: "80px",
                }}
              >
                {label}
              </span>
              <span style={{ color: "var(--ink-light)" }}>{val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── CONFERENCES ─────────────────────────────────────────────────────────────

export function ConferencesSection() {
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
              <h3 className="font-serif" style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--ink)" }}>
                {conf.name}
              </h3>
              <span className="font-display" style={{ fontSize: "1rem", fontWeight: 700, flexShrink: 0, color: "#8b2500" }}>
                {conf.year}
              </span>
            </div>
            <div
              className="font-display"
              style={{
                fontSize: "0.65rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--sepia)",
                opacity: 0.75,
                marginBottom: "6px",
              }}
            >
              {conf.city}
            </div>
            <p style={{ fontSize: "0.875rem", lineHeight: 1.6, color: "var(--ink-light)" }}>
              {conf.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── OPERATIONS ──────────────────────────────────────────────────────────────

export function OperationsSection() {
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
              <h3 className="font-serif" style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--ink)" }}>
                {op.name}
              </h3>
              <span className="font-display" style={{ fontSize: "1rem", fontWeight: 700, flexShrink: 0, color: "#2d4a22" }}>
                {op.year}
              </span>
            </div>
            <div
              className="font-display"
              style={{
                fontSize: "0.65rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--sepia)",
                opacity: 0.75,
                marginBottom: "6px",
              }}
            >
              {op.city}
            </div>
            <p style={{ fontSize: "0.875rem", lineHeight: 1.6, color: "var(--ink-light)" }}>
              {op.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
