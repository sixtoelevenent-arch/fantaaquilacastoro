import BackHome from "@/components/BackHome";
import { quarti } from "@/data/fase-finale";

export default function Quarti() {
  const matchStyle = {
    background: "#1f2937",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "14px",
    padding: "16px",
    marginBottom: "12px",
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
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <BackHome />

        <h1
          style={{
            textAlign: "center",
            fontSize: "clamp(2.2rem, 6vw, 3.5rem)",
            fontWeight: "800",
          }}
        >
          ⚔️ Quarti di Finale
        </h1>

        {quarti.map((quarto, index) => (
          <div key={index} style={matchStyle}>
            <strong>{quarto.etichetta}</strong>
            <br />
            {quarto.partita}
          </div>
        ))}

        <div
          style={{
            marginTop: "50px",
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