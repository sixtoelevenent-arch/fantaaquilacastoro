import BackHome from "@/components/BackHome";

export default function Giornata1() {
  const sectionStyle = {
    background: "#1f2937",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "16px",
    padding: "20px",
    marginBottom: "20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
  };

  const matchStyle = {
    background: "#0f172a",
    borderRadius: "12px",
    padding: "18px",
    marginBottom: "12px",
    textAlign: "center" as const,
  };

  const coachStyle = {
    fontSize: "0.85rem",
    color: "#94a3b8",
    marginTop: "4px",
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
          ⚽ Giornata 1
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#d8b4fe",
            marginBottom: "35px",
          }}
        >
          Fase a Gironi • Prima Giornata
        </p>

        <div style={sectionStyle}>
          <h2 style={{ color: "#22c55e", marginTop: 0 }}>🟢 Girone A</h2>

          <div style={matchStyle}>
            <div>
              🇵🇹 Portogallo
              <div style={coachStyle}>Andrea A.</div>
            </div>

            <div style={{ margin: "12px 0", fontWeight: "700" }}>VS</div>

            <div>
              🇮🇷 Iran
              <div style={coachStyle}>Pres</div>
            </div>
          </div>

          <div style={matchStyle}>
            <div>
              🇦🇷 Argentina
              <div style={coachStyle}>Erny</div>
            </div>

            <div style={{ margin: "12px 0", fontWeight: "700" }}>VS</div>

            <div>
              🇨🇴 Colombia
              <div style={coachStyle}>Luigi</div>
            </div>
          </div>
        </div>

        <div style={sectionStyle}>
          <h2 style={{ color: "#3b82f6", marginTop: 0 }}>🔵 Girone B</h2>

          <div style={matchStyle}>
            <div>
              🇫🇷 Francia
              <div style={coachStyle}>Sirty</div>
            </div>

            <div style={{ margin: "12px 0", fontWeight: "700" }}>VS</div>

            <div>
              🇺🇿 Uzbekistan
              <div style={coachStyle}>Michel</div>
            </div>
          </div>

          <div style={matchStyle}>
            <div>
              🇲🇽 Messico
              <div style={coachStyle}>Cristian</div>
            </div>

            <div style={{ margin: "12px 0", fontWeight: "700" }}>VS</div>

            <div>
              🇨🇼 Curaçao
              <div style={coachStyle}>Fava</div>
            </div>
          </div>
        </div>

        <div style={sectionStyle}>
          <h2 style={{ color: "#f97316", marginTop: 0 }}>🟠 Girone C</h2>

          <div style={matchStyle}>
            <div>
              🇬🇭 Ghana
              <div style={coachStyle}>Andrea S.</div>
            </div>

            <div style={{ margin: "12px 0", fontWeight: "700" }}>VS</div>

            <div>
              🇹🇷 Turchia
              <div style={coachStyle}>Bruno</div>
            </div>
          </div>

          <div style={matchStyle}>
            <div>
              🇨🇮 Costa d'Avorio
              <div style={coachStyle}>Fabio</div>
            </div>

            <div style={{ margin: "12px 0", fontWeight: "700" }}>VS</div>

            <div>
              🇩🇪 Germania
              <div style={coachStyle}>Martin</div>
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