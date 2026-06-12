import BackHome from "@/components/BackHome";
import { calendario } from "@/data/calendario";

export default function Giornata2() {
  const giornata = calendario[1];

  const matchStyle = {
    background: "#1f2937",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "14px",
    padding: "16px",
    marginBottom: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #2e1065, #1e1b4b)",
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
            fontWeight: "800",
            marginTop: "10px",
            marginBottom: "10px",
          }}
        >
          ⚽ Giornata 2
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#d8b4fe",
            marginBottom: "35px",
          }}
        >
          Fase a Gironi • Seconda Giornata
        </p>

        {giornata.partite.map((partita, index) => (
          <div key={index} style={matchStyle}>
            <div
              style={{
                textAlign: "center",
                fontWeight: "700",
                marginBottom: "8px",
              }}
            >
              {partita.casa} vs {partita.trasferta}
            </div>

            <div
              style={{
                textAlign: "center",
                fontSize: "0.85rem",
                color: "#94a3b8",
              }}
            >
              👤 {partita.coachCasa} vs {partita.coachTrasferta}
            </div>
          </div>
        ))}

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