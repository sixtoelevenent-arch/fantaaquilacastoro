import BackHome from "@/components/BackHome";

export default function TorneoPage() {
  const cardStyle = {
    background: "#1f2937",
    border: "1px solid #374151",
    borderRadius: "16px",
    padding: "20px",
    marginTop: "24px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
  };

  const itemStyle = {
    margin: "10px 0",
    fontSize: "1.05rem",
    lineHeight: 1.6,
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #111827, #0f172a)",
        color: "white",
        padding: "20px",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <BackHome />

        <h1
          style={{
            textAlign: "center",
            fontSize: "clamp(2.2rem, 6vw, 3.5rem)",
            marginTop: "10px",
            marginBottom: "10px",
            fontWeight: "800",
          }}
        >
          🏆 FantAquilaCastoro 2026
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#94a3b8",
            fontSize: "1rem",
            marginBottom: "32px",
          }}
        >
          Road to New York 🗽
        </p>

        <div style={cardStyle}>
          <h2
            style={{
              color: "#60a5fa",
              marginTop: 0,
              marginBottom: "16px",
            }}
          >
            📋 Formato del Torneo
          </h2>

          <p style={itemStyle}>⚽ 12 Squadre Partecipanti</p>
          <p style={itemStyle}>🏅 3 Gironi da 4 Squadre</p>
          <p style={itemStyle}>🎟️ 8 Qualificate alla Fase Finale</p>
        </div>

        <div style={cardStyle}>
          <h2
            style={{
              color: "#fbbf24",
              marginTop: 0,
              marginBottom: "16px",
            }}
          >
            ⚔️ Fase Finale
          </h2>

          <p style={itemStyle}>🏆 Quarti di Finale</p>
          <p style={itemStyle}>🎲 Semifinali con Sorteggio Integrale</p>
          <p style={itemStyle}>👑 Finale</p>
        </div>

        <div style={cardStyle}>
          <h2
            style={{
              color: "#34d399",
              marginTop: 0,
              marginBottom: "16px",
            }}
          >
            🗽 Finale
          </h2>

          <p style={itemStyle}>🏟️ MetLife Stadium</p>
          <p style={itemStyle}>📅 19 Luglio 2026</p>
        </div>

        <div
          style={{
            marginTop: "50px",
            paddingTop: "20px",
            borderTop: "1px solid #374151",
            textAlign: "center",
            color: "#94a3b8",
            fontSize: "14px",
          }}
        >
          FantAquilaCastoro 2026 • Road to New York 🗽
        </div>
      </div>
    </main>
  );
}