import BackHome from "@/components/BackHome";
import { rose } from "@/data/rose";

export default async function TeamPage({
  params,
}: {
  params: Promise<{ team: string }>;
}) {
  const { team } = await params;

  const squadra = rose[team as keyof typeof rose];

  if (!squadra) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "linear-gradient(to bottom, #111827, #0f172a)",
          color: "white",
          padding: "40px 20px",
          textAlign: "center",
        }}
      >
        <h1>❌ Squadra non trovata</h1>
      </main>
    );
  }

  const sectionStyle = {
    background: "#1f2937",
    border: "1px solid #374151",
    borderRadius: "16px",
    padding: "20px",
    marginBottom: "20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
  };

  const listStyle = {
    listStyle: "none" as const,
    padding: 0,
    margin: 0,
  };

  const playerStyle = {
    padding: "8px 0",
    borderBottom: "1px solid #374151",
    color: "#e5e7eb",
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
            fontSize: "clamp(2rem, 6vw, 3.2rem)",
            marginTop: "10px",
            marginBottom: "10px",
            fontWeight: "800",
          }}
        >
          {team}
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#cbd5e1",
            marginBottom: "35px",
            fontSize: "1.1rem",
          }}
        >
          🌍 {squadra.nazione}
        </p>

        <div style={sectionStyle}>
          <h2 style={{ color: "#60a5fa", marginTop: 0 }}>
            🧤 Portieri ({squadra.portieri.length})
          </h2>

          <ul style={listStyle}>
            {squadra.portieri.map((p) => (
              <li key={p} style={playerStyle}>
                {p}
              </li>
            ))}
          </ul>
        </div>

        <div style={sectionStyle}>
          <h2 style={{ color: "#22c55e", marginTop: 0 }}>
            🛡️ Difensori ({squadra.difensori.length})
          </h2>

          <ul style={listStyle}>
            {squadra.difensori.map((d) => (
              <li key={d} style={playerStyle}>
                {d}
              </li>
            ))}
          </ul>
        </div>

        <div style={sectionStyle}>
          <h2 style={{ color: "#f59e0b", marginTop: 0 }}>
            ⚙️ Centrocampisti ({squadra.centrocampisti.length})
          </h2>

          <ul style={listStyle}>
            {squadra.centrocampisti.map((c) => (
              <li key={c} style={playerStyle}>
                {c}
              </li>
            ))}
          </ul>
        </div>

        <div style={sectionStyle}>
          <h2 style={{ color: "#ef4444", marginTop: 0 }}>
            ⚽ Attaccanti ({squadra.attaccanti.length})
          </h2>

          <ul style={listStyle}>
            {squadra.attaccanti.map((a) => (
              <li key={a} style={playerStyle}>
                {a}
              </li>
            ))}
          </ul>
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