import BackHome from "@/components/BackHome";

export default function RegolamentoPage() {
  const cardStyle = {
    background: "#1f2937",
    border: "1px solid #374151",
    borderRadius: "16px",
    padding: "20px",
    marginBottom: "20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
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
          📜 Regolamento FantAquilaCastoro 2026
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#cbd5e1",
            marginBottom: "35px",
          }}
        >
          Regolamento ufficiale del torneo.
        </p>

        <div style={cardStyle}>
          <h2
            style={{
              color: "#60a5fa",
              marginTop: 0,
            }}
          >
            🏆 Formato
          </h2>

          <p
            style={{
              color: "#e5e7eb",
              lineHeight: 1.7,
              marginBottom: 0,
            }}
          >
            Il FantAquilaCastoro 2026 è composto da 12 squadre
            partecipanti che si sfidano durante il Mondiale 2026.
          </p>
        </div>

        <div style={cardStyle}>
          <h2
            style={{
              color: "#22c55e",
              marginTop: 0,
            }}
          >
            💰 Rose
          </h2>

          <p
            style={{
              color: "#e5e7eb",
              lineHeight: 1.7,
            }}
          >
            Ogni squadra dispone di un budget iniziale pari a 500 milioni.
          </p>

          <p
            style={{
              color: "#cbd5e1",
              marginBottom: "12px",
            }}
          >
            Composizione della rosa:
          </p>

          <ul
            style={{
              lineHeight: 1.9,
              color: "#e5e7eb",
            }}
          >
            <li>🧤 3 Portieri</li>
            <li>🛡️ 8 Difensori</li>
            <li>⚙️ 8 Centrocampisti</li>
            <li>⚽ 8 Attaccanti</li>
          </ul>
        </div>

        <div style={cardStyle}>
          <h2
            style={{
              color: "#f59e0b",
              marginTop: 0,
            }}
          >
            ⚔️ Competizione
          </h2>

          <p
            style={{
              color: "#e5e7eb",
              lineHeight: 1.7,
            }}
          >
            Le 12 squadre vengono suddivise in 3 gironi da 4 squadre.
          </p>

          <p
            style={{
              color: "#e5e7eb",
              lineHeight: 1.7,
              marginBottom: 0,
            }}
          >
            Al termine della fase a gironi si disputa una fase finale ad
            eliminazione diretta per decretare il campione del
            FantAquilaCastoro 2026.
          </p>
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