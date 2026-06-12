import BackHome from "@/components/BackHome";

export default function Semifinali() {
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
          🏅 Semifinali
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

        <div
          style={{
            background: "#1f2937",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "16px",
            padding: "30px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "3rem",
              marginBottom: "15px",
            }}
          >
            🎲
          </div>

          <h2
            style={{
              marginTop: 0,
              color: "#fde68a",
            }}
          >
            Sorteggio Integrale
          </h2>

          <p
            style={{
              color: "#e5e7eb",
              lineHeight: 1.7,
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            Le quattro squadre qualificate verranno abbinate tramite
            sorteggio integrale senza teste di serie.
          </p>
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