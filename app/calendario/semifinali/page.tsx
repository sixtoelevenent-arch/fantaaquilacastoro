import BackHome from "@/components/BackHome";
import { semifinali } from "@/data/fase-finale";

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
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <BackHome />

        <h1
          style={{
            textAlign: "center",
            fontSize: "clamp(2.2rem, 6vw, 3.5rem)",
            fontWeight: "800",
          }}
        >
          🏅 Semifinali
        </h1>

        {semifinali.map((semi, index) => (
          <div
            key={index}
            style={{
              background: "#1f2937",
              padding: "16px",
              borderRadius: "14px",
              marginBottom: "12px",
            }}
          >
            {semi.partita}
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