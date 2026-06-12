export default function Home() {
  const buttonStyle = {
    display: "block",
    width: "100%",
    maxWidth: "320px",
    padding: "14px",
    borderRadius: "12px",
    textDecoration: "none",
    color: "white",
    fontWeight: "bold",
    fontSize: "18px",
    marginBottom: "12px",
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#111827",
        color: "white",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1
        style={{
          fontSize: "clamp(2rem, 7vw, 3.5rem)",
          textAlign: "center",
          marginTop: "20px",
          marginBottom: "10px",
        }}
      >
        🏆 FantAquilaCastoro 2026
      </h1>

      <p
        style={{
          color: "#cbd5e1",
          marginBottom: "40px",
          textAlign: "center",
        }}
      >
        Mondiale Fantasy a 12 squadre
      </p>

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
          }}
        >
          🔴 Live Giornata
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
          href="/gironi"
          style={{
            ...buttonStyle,
            background: "#059669",
          }}
        >
          🏆 Gironi
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
          marginTop: "40px",
          textAlign: "center",
          color: "#94a3b8",
          fontSize: "14px",
        }}
      >
        FantAquilaCastoro 2026 • Road to New York 🗽
      </div>
    </main>
  );
}