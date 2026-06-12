import BackHome from "@/components/BackHome";

export default function Finale() {
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
          🏆 Finale
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#fde68a",
            marginBottom: "35px",
          }}
        >
          Road to New York 🗽
        </p>

        <div
          style={{
            background: "#1f2937",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "16px",
            padding: "30px",
            textAlign: "center",
            boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
          }}
        >
          <div
            style={{
              fontSize: "4rem",
              marginBottom: "15px",
            }}
          >
            🏆
          </div>

          <h2
            style={{
              marginTop: 0,
              marginBottom: "15px",
              color: "#fde68a",
              fontSize: "1.8rem",
            }}
          >
            🗽 MetLife Stadium
          </h2>

          <p
            style={{
              fontSize: "1.1rem",
              color: "#e5e7eb",
              marginBottom: "25px",
            }}
          >
            📅 19 Luglio 2026
          </p>

          <div
            style={{
              background: "rgba(255,255,255,0.05)",
              borderRadius: "12px",
              padding: "20px",
            }}
          >
            <div
              style={{
                fontSize: "1.2rem",
                fontWeight: "700",
                marginBottom: "10px",
              }}
            >
              Finalista 1
            </div>

            <div
              style={{
                color: "#94a3b8",
                marginBottom: "20px",
              }}
            >
              Da definire
            </div>

            <div
              style={{
                fontSize: "1.5rem",
                fontWeight: "800",
                marginBottom: "20px",
                color: "#fde68a",
              }}
            >
              VS
            </div>

            <div
              style={{
                fontSize: "1.2rem",
                fontWeight: "700",
                marginBottom: "10px",
              }}
            >
              Finalista 2
            </div>

            <div
              style={{
                color: "#94a3b8",
              }}
            >
              Da definire
            </div>
          </div>
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