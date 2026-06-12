import BackHome from "@/components/BackHome";
import Card from "@/components/Card";
import { liveMatches } from "@/data/live";

export default function LivePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #450a0a, #1f0808)",
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
            color: "#ef4444",
            fontSize: "clamp(2.3rem, 7vw, 4rem)",
            fontWeight: "800",
            marginTop: "10px",
            marginBottom: "10px",
          }}
        >
          🔴 LIVE GIORNATA
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#fecaca",
            marginBottom: "12px",
            fontSize: "1.05rem",
          }}
        >
          Aggiornamenti in tempo reale
        </p>

        <div
          style={{
            textAlign: "center",
            marginBottom: "35px",
          }}
        >
          <span
            style={{
              display: "inline-block",
              padding: "8px 14px",
              background: "#7f1d1d",
              borderRadius: "999px",
              color: "#fecaca",
              fontSize: "0.9rem",
              fontWeight: "600",
            }}
          >
            ⏱️ Giornata in corso
          </span>
        </div>

        {liveMatches.map((match, index) => (
          <Card
            key={index}
            title={`${match.casa} vs ${match.trasferta}`}
          >
            <div
              style={{
                textAlign: "center",
                padding: "10px 0",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "15px",
                  gap: "10px",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div>{match.casa}</div>

                  <div
                    style={{
                      fontSize: "0.85rem",
                      color: "#94a3b8",
                      marginTop: "4px",
                    }}
                  >
                    👤 {match.coachCasa}
                  </div>
                </div>

                <div
                  style={{
                    fontSize: "1.8rem",
                    fontWeight: "800",
                    minWidth: "90px",
                  }}
                >
                  {match.golCasa} - {match.golTrasferta}
                </div>

                <div style={{ flex: 1 }}>
                  <div>{match.trasferta}</div>

                  <div
                    style={{
                      fontSize: "0.85rem",
                      color: "#94a3b8",
                      marginTop: "4px",
                    }}
                  >
                    👤 {match.coachTrasferta}
                  </div>
                </div>
              </div>

              <p
                style={{
                  color: "#cbd5e1",
                  margin: 0,
                }}
              >
                In attesa dei voti...
              </p>
            </div>
          </Card>
        ))}

        <div
          style={{
            marginTop: "50px",
            paddingTop: "20px",
            borderTop: "1px solid rgba(254,202,202,0.2)",
            textAlign: "center",
            color: "#fecaca",
            fontSize: "14px",
          }}
        >
          FantAquilaCastoro 2026 • Live Match Center 🔴
        </div>
      </div>
    </main>
  );
}