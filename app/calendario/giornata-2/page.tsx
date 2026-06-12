import BackHome from "@/components/BackHome";

export default function Giornata2() {
  const matchStyle = {
    background: "#1f2937",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "14px",
    padding: "18px",
    marginBottom: "12px",
    textAlign: "center" as const,
    boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
  };

  const coachStyle = {
    fontSize: "0.85rem",
    color: "#94a3b8",
    marginTop: "4px",
  };

  const partite = [
    {
      casa: "🇨🇴 Colombia",
      coachCasa: "Luigi",
      trasferta: "🇵🇹 Portogallo",
      coachTrasferta: "Andrea A.",
    },
    {
      casa: "🇮🇷 Iran",
      coachCasa: "Pres",
      trasferta: "🇦🇷 Argentina",
      coachTrasferta: "Erny",
    },
    {
      casa: "🇨🇼 Curaçao",
      coachCasa: "Fava",
      trasferta: "🇫🇷 Francia",
      coachTrasferta: "Sirty",
    },
    {
      casa: "🇺🇿 Uzbekistan",
      coachCasa: "Michel",
      trasferta: "🇲🇽 Messico",
      coachTrasferta: "Cristian",
    },
    {
      casa: "🇨🇮 Costa d'Avorio",
      coachCasa: "Fabio",
      trasferta: "🇬🇭 Ghana",
      coachTrasferta: "Andrea S.",
    },
    {
      casa: "🇹🇷 Turchia",
      coachCasa: "Bruno",
      trasferta: "🇩🇪 Germania",
      coachTrasferta: "Martin",
    },
  ];

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
          ⚽ Giornata 2
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#d8b4fe",
            marginBottom: "35px",
          }}
        >
          Fase a Gironi • Seconda Giornata
        </p>

        {partite.map((partita, index) => (
          <div key={index} style={matchStyle}>
            <div>
              {partita.casa}
              <div style={coachStyle}>{partita.coachCasa}</div>
            </div>

            <div
              style={{
                margin: "12px 0",
                fontWeight: "700",
              }}
            >
              VS
            </div>

            <div>
              {partita.trasferta}
              <div style={coachStyle}>{partita.coachTrasferta}</div>
            </div>
          </div>
        ))}

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