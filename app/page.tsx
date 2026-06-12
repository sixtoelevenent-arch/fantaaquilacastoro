export default function Home() {
  const buttonStyle = {
    display: "block",
    width: "100%",
    maxWidth: "320px",
    padding: "18px",
    borderRadius: "18px",
    textDecoration: "none",
    color: "white",
    fontWeight: "bold" as const,
    fontSize: "18px",
    marginBottom: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
    textAlign: "center" as const,
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom, #020617 0%, #08122c 50%, #020617 100%)",
        color: "white",
        padding: "12px 20px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* LOGO */}
      <img
        src="/Logo.jpg"
        alt="FantAquilaCastoro 2026"
        style={{
          width: "100px",
          height: "100px",
          objectFit: "contain",
          marginTop: "0",
          marginBottom: "8px",
        }}
      />

      {/* HEADER */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(1.9rem, 7vw, 3rem)",
            lineHeight: 1.05,
            marginBottom: "8px",
            fontWeight: "800",
          }}
        >
          FantAquilaCastoro
          <br />
          2026
        </h1>

        <div
          style={{
            color: "#fbbf24",
            fontSize: "clamp(1.5rem, 5vw, 2.2rem)",
            fontWeight: "800",
            marginBottom: "6px",
          }}
        >
          Road to New York 🗽
        </div>

        <div
          style={{
            color: "#fbbf24",
            fontSize: "1rem",
            fontWeight: "600",
            marginBottom: "18px",
          }}
        >
          FIFA World Cup Fantasy Edition
        </div>

        <div
          style={{
            color: "#cbd5e1",
            marginBottom: "10px",
            fontSize: "0.95rem",
          }}
        >
          📅 11 Giugno → 19 Luglio 2026
        </div>

        <div
          style={{
            color: "#cbd5e1",
            marginBottom: "18px",
            lineHeight: 1.6,
            fontSize: "0.95rem",
          }}
        >
          ⚽ 12 Fantallenatori • 🌍 12 Nazionali
          <br />
          🏆 1 Campione
        </div>

        <div
          style={{
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.03)",
            borderRadius: "14px",
            padding: "12px",
            color: "#fbbf24",
            fontWeight: "700",
            fontSize: "1.1rem",
            maxWidth: "320px",
            margin: "0 auto",
          }}
        >
          🏆 Campione in carica: Sirty
        </div>
      </div>

      {/* MENU */}
      <div
        style={{
          width: "100%",
          maxWidth: "350px",
        }}
      >
        <a
          href="/live"
          style={{
            ...buttonStyle,
            background: "#dc2626",
            padding: "22px",
            fontSize: "22px",
            marginBottom: "22px",
            boxShadow: "0 0 20px rgba(220,38,38,0.45)",
          }}
        >
          🔴 LIVE GIORNATA
        </a>

        <a
          href="/classifiche"
          style={{
            ...buttonStyle,
            background: "#2563eb",
          }}
        >
          📊 Classifiche
        </a>

        <a
          href="/calendario"
          style={{
            ...buttonStyle,
            background: "#7c3aed",
          }}
        >
          🗓️ Calendario
        </a>

        <a
          href="/fase-finale"
          style={{
            ...buttonStyle,
            background: "#b45309",
          }}
        >
          ⚔️ Fase Finale
        </a>

        <a
          href="/rose-ufficiali.html"
          style={{
            ...buttonStyle,
            background: "#0ea5e9",
          }}
        >
          📋 Rose Ufficiali
        </a>

        <a
          href="/svincolati"
          style={{
            ...buttonStyle,
            background: "#475569",
          }}
        >
          📑 Listone Svincolati
        </a>

        <a
          href="/regolamento"
          style={{
            ...buttonStyle,
            background: "#16a34a",
          }}
        >
          📜 Regolamento
        </a>

        <a
          href="/torneo"
          style={{
            ...buttonStyle,
            background: "#1d4ed8",
          }}
        >
          ℹ️ Torneo
        </a>

        <a
          href="/albo-doro"
          style={{
            ...buttonStyle,
            background: "#ca8a04",
          }}
        >
          🏅 Albo d'Oro
        </a>
      </div>

      <div
        style={{
          marginTop: "30px",
          textAlign: "center",
          color: "#94a3b8",
          fontSize: "13px",
        }}
      >
        FantAquilaCastoro 2026 • Road to New York 🗽
      </div>
    </main>
  );
}