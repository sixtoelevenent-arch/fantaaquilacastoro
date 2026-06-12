import BackHome from "@/components/BackHome";
import Card from "@/components/Card";
import { calendario } from "@/data/calendario";

export default function CalendarioPage() {
  const matchStyle = {
    background: "#0f172a",
    padding: "16px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.08)",
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
            marginTop: "10px",
            marginBottom: "10px",
            fontWeight: "800",
          }}
        >
          🗓️ Calendario
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#d8b4fe",
            marginBottom: "35px",
          }}
        >
          Fase a Gironi • Road to New York 🗽
        </p>

        {calendario.map((giornata) => (
          <Card key={giornata.titolo} title={giornata.titolo}>
            <div
              style={{
                display: "grid",
                gap: "12px",
              }}
            >
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
            </div>
          </Card>
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