import BackHome from "@/components/BackHome";
import { finale } from "@/data/fase-finale";

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
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <BackHome />

        <h1
          style={{
            textAlign: "center",
            fontSize: "clamp(2.2rem, 6vw, 3.5rem)",
            fontWeight: "800",
          }}
        >
          🏆 Finale
        </h1>

        <div
          style={{
            background: "#1f2937",
            padding: "24px",
            borderRadius: "16px",
            textAlign: "center",
          }}
        >
          <h2>{finale.stadio}</h2>

          <p>{finale.data}</p>

          <p>{finale.partita}</p>
        </div>

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