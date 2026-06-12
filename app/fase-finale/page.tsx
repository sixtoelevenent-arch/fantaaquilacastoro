import BackHome from "@/components/BackHome";

export default function ClassifichePage() {
  const gironeA = [
    { squadra: "🇵🇹 Portogallo", allenatore: "Andrea A.", pt: 0, gf: 0, gs: 0, dr: 0 },
    { squadra: "🇮🇷 Iran", allenatore: "Pres", pt: 0, gf: 0, gs: 0, dr: 0 },
    { squadra: "🇦🇷 Argentina", allenatore: "Erny", pt: 0, gf: 0, gs: 0, dr: 0 },
    { squadra: "🇨🇴 Colombia", allenatore: "Luigi", pt: 0, gf: 0, gs: 0, dr: 0 },
  ];

  const gironeB = [
    { squadra: "🇫🇷 Francia", allenatore: "Sirty", pt: 0, gf: 0, gs: 0, dr: 0 },
    { squadra: "🇺🇿 Uzbekistan", allenatore: "Michel", pt: 0, gf: 0, gs: 0, dr: 0 },
    { squadra: "🇲🇽 Messico", allenatore: "Cristian", pt: 0, gf: 0, gs: 0, dr: 0 },
    { squadra: "🇨🇼 Curaçao", allenatore: "Fava", pt: 0, gf: 0, gs: 0, dr: 0 },
  ];

  const gironeC = [
    { squadra: "🇬🇭 Ghana", allenatore: "Andrea S.", pt: 0, gf: 0, gs: 0, dr: 0 },
    { squadra: "🇹🇷 Turchia", allenatore: "Bruno", pt: 0, gf: 0, gs: 0, dr: 0 },
    { squadra: "🇨🇮 Costa d'Avorio", allenatore: "Fabio", pt: 0, gf: 0, gs: 0, dr: 0 },
    { squadra: "🇩🇪 Germania", allenatore: "Martin", pt: 0, gf: 0, gs: 0, dr: 0 },
  ];

  const renderTable = (
    titolo: string,
    colore: string,
    dati: typeof gironeA
  ) => (
    <div
      style={{
        background: "#1f2937",
        borderRadius: "16px",
        padding: "18px",
        marginBottom: "24px",
        border: "1px solid rgba(255,255,255,0.1)",
        overflowX: "auto",
      }}
    >
      <h2
        style={{
          color: colore,
          marginTop: 0,
          marginBottom: "16px",
        }}
      >
        {titolo}
      </h2>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          minWidth: "700px",
        }}
      >
        <thead>
          <tr>
            <th style={thStyle}>Pos</th>
            <th style={thStyle}>Squadra</th>
            <th style={thStyle}>Allenatore</th>
            <th style={thStyleCenter}>Pt</th>
            <th style={thStyleCenter}>GF</th>
            <th style={thStyleCenter}>GS</th>
            <th style={thStyleCenter}>DR</th>
          </tr>
        </thead>

        <tbody>
          {[...dati]
            .sort((a, b) => {
              if (b.pt !== a.pt) return b.pt - a.pt;
              if (b.dr !== a.dr) return b.dr - a.dr;
              return b.gf - a.gf;
            })
            .map((team, index) => (
              <tr
                key={team.squadra}
                style={{
                  borderTop: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <td style={tdStyle}>{index + 1}</td>
                <td style={tdStyle}>{team.squadra}</td>
                <td style={tdStyle}>{team.allenatore}</td>
                <td style={tdCenter}>{team.pt}</td>
                <td style={tdCenter}>{team.gf}</td>
                <td style={tdCenter}>{team.gs}</td>
                <td style={tdCenter}>{team.dr}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #1e3a8a, #172554)",
        color: "white",
        padding: "20px",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        <BackHome />

        <h1
          style={{
            textAlign: "center",
            fontSize: "clamp(2.2rem, 6vw, 3.5rem)",
            fontWeight: "800",
            marginTop: "10px",
            marginBottom: "10px",
          }}
        >
          📊 Classifiche
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#bfdbfe",
            marginBottom: "35px",
          }}
        >
          Fase a Gironi • FantAquilaCastoro 2026
        </p>

        {renderTable("🟢 Girone A", "#22c55e", gironeA)}
        {renderTable("🔵 Girone B", "#3b82f6", gironeB)}
        {renderTable("🟠 Girone C", "#f97316", gironeC)}

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

const thStyle = {
  padding: "12px",
  textAlign: "left" as const,
  color: "#cbd5e1",
  fontWeight: "700",
};

const thStyleCenter = {
  padding: "12px",
  textAlign: "center" as const,
  color: "#cbd5e1",
  fontWeight: "700",
};

const tdStyle = {
  padding: "12px",
};

const tdCenter = {
  padding: "12px",
  textAlign: "center" as const,
};