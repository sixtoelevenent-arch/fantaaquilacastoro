export default function Home() {
  const buttonStyle = {
    display: "block",
    width: "340px",
    padding: "16px",
    borderRadius: "14px",
    textDecoration: "none",
    color: "white",
    fontWeight: "bold",
    fontSize: "18px",
    textAlign: "center" as const,
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "60px",
        paddingLeft: "20px",
        paddingRight: "20px",
        paddingBottom: "60px",
      }}
    >
      <h1
        style={{
          fontSize: "3rem",
          marginBottom: "10px",
          textAlign: "center",
        }}
      >
        🏆 FantAquilaCastoro 2026
      </h1>

      <p
        style={{
          fontSize: "1.4rem",
          fontWeight: "bold",
          color: "#fbbf24",
          marginTop: 0,
          marginBottom: "8px",
          letterSpacing: "1px",
        }}
      >
        Road to New York 🗽
      </p>

      <p
        style={{
          color: "#cbd5e1",
          marginBottom: "6px",
        }}
      >
        11 Giugno → 19 Luglio 2026
      </p>

      <p
        style={{
          color: "#94a3b8",
          marginBottom: "6px",
        }}
      >
        ⚽ 12 Fantallenatori • 🌍 12 Nazionali • 🏆 1 Campione
      </p>

      <p
        style={{
          color: "#fbbf24",
          marginBottom: "40px",
          fontWeight: "bold",
        }}
      >
        Campione in carica: Sirty
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
      >
        <a
          href="/live"
          style={{
            ...buttonStyle,
            background: "#dc2626",
            fontSize: "20px",
            boxShadow: "0 0 20px rgba(220,38,38,0.5)",
          }}
        >
          🔴 LIVE GIORNATA
        </a>

        <a
          href="/rose-ufficiali.html"
          style={{
            ...buttonStyle,
            background: "#2563eb",
          }}
        >
          📋 Rose
        </a>

        <a
          href="/gironi"
          style={{
            ...buttonStyle,
            background: "#16a34a",
          }}
        >
          🏆 Gironi
        </a>

        <a
          href="/calendario"
          style={{
            ...buttonStyle,
            background: "#9333ea",
          }}
        >
          🗓️ Calendario
        </a>

        <a
          href="/classifiche"
          style={{
            ...buttonStyle,
            background: "#0891b2",
          }}
        >
          📊 Classifiche
        </a>

        <a
          href="/fase-finale"
          style={{
            ...buttonStyle,
            background: "#ea580c",
          }}
        >
          ⚔️ Fase Finale
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
          href="/regolamento.pdf"
          target="_blank"
          style={{
            ...buttonStyle,
            background: "#ca8a04",
          }}
        >
          📜 Regolamento
        </a>

        <a
          href="/albo-d-oro"
          style={{
            ...buttonStyle,
            background: "#b45309",
          }}
        >
          🥇 Albo d'Oro
        </a>
      </div>

      <div
        style={{
          marginTop: "50px",
          color: "#64748b",
          fontSize: "14px",
          textAlign: "center",
        }}
      >
        FantAquilaCastoro • World Cup Edition 2026
      </div>
    </main>
  );
}