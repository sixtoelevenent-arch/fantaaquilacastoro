import BackHome from "@/components/BackHome";

export default function Quarti() {
  const matchStyle = {
    background: "#1f2937",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "14px",
    padding: "16px",
    marginBottom: "12px",
    fontWeight: "600",
    boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #78350f, #451a03)",
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
          ⚔️ Quarti di Finale
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#fde68a",
            marginBottom: "35px",
          }}
        >
          Fase Finale • Road to New York 🗽
        </p>

        <div style={matchStyle}>
          🏆 1° Girone A vs Peggiore Terza
        </div>

        <div style={matchStyle}>
          🏆 1° Girone B vs Migliore Terza
        </div>

        <div style={matchStyle}>
          🏆 1° Girone C vs Peggiore Seconda
        </div>

        <div style={matchStyle}>
          🏆 Seconda Migliore vs Seconda Peggiore
        </div>

        <div
          style={{
            marginTop: "50px",
            paddingTop: "20px",
            borderTop: "1px solid rgba(255,255,255,0.15)",
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