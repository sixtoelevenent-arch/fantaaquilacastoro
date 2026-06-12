import BackHome from "@/components/BackHome";
import Card from "@/components/Card";

export default function CalendarioPage() {
  const coachStyle = {
    fontSize: "0.85rem",
    color: "#94a3b8",
    marginTop: "4px",
    fontWeight: "500",
  };

  const giornate = [
    {
      titolo: "⚽ Giornata 1",
      partite: [
        {
          casa: "🇵🇹 Portogallo",
          coachCasa: "Andrea A.",
          trasferta: "🇮🇷 Iran",
          coachTrasferta: "Pres",
        },
        {
          casa: "🇦🇷 Argentina",
          coachCasa: "Erny",
          trasferta: "🇨🇴 Colombia",
          coachTrasferta: "Luigi",
        },
        {
          casa: "🇫🇷 Francia",
          coachCasa: "Sirty",
          trasferta: "🇺🇿 Uzbekistan",
          coachTrasferta: "Michel",
        },
        {
          casa: "🇲🇽 Messico",
          coachCasa: "Cristian",
          trasferta: "🇨🇼 Curaçao",
          coachTrasferta: "Fava",
        },
        {
          casa: "🇬🇭 Ghana",
          coachCasa: "Andrea S.",
          trasferta: "🇹🇷 Turchia",
          coachTrasferta: "Bruno",
        },
        {
          casa: "🇨🇮 Costa d'Avorio",
          coachCasa: "Fabio",
          trasferta: "🇩🇪 Germania",
          coachTrasferta: "Martin",
        },
      ],
    },
    {
      titolo: "⚽ Giornata 2",
      partite: [
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
      ],
    },
    {
      titolo: "⚽ Giornata 3",
      partite: [
        {
          casa: "🇵🇹 Portogallo",
          coachCasa: "Andrea A.",
          trasferta: "🇦🇷 Argentina",
          coachTrasferta: "Erny",
        },
        {
          casa: "🇨🇴 Colombia",
          coachCasa: "Luigi",
          trasferta: "🇮🇷 Iran",
          coachTrasferta: "Pres",
        },
        {
          casa: "🇫🇷 Francia",
          coachCasa: "Sirty",
          trasferta: "🇲🇽 Messico",
          coachTrasferta: "Cristian",
        },
        {
          casa: "🇨🇼 Curaçao",
          coachCasa: "Fava",
          trasferta: "🇺🇿 Uzbekistan",
          coachTrasferta: "Michel",
        },
        {
          casa: "🇩🇪 Germania",
          coachCasa: "Martin",
          trasferta: "🇬🇭 Ghana",
          coachTrasferta: "Andrea S.",
        },
        {
          casa: "🇹🇷 Turchia",
          coachCasa: "Bruno",
          trasferta: "🇨🇮 Costa d'Avorio",
          coachTrasferta: "Fabio",
        },
      ],
    },
  ];

  const matchStyle = {
    background: "#0f172a",
    padding: "18px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.08)",
    textAlign: "center" as const,
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
          🗓️ Calendario
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#d8b4fe",
            marginBottom: "35px",
          }}
        >
          Fase a Gironi • Road to New York 🗽
        </p>

        {giornate.map((giornata) => (
          <Card key={giornata.titolo} title={giornata.titolo}>
            <div
              style={{
                display: "grid",
                gap: "12px",
              }}
            >
              {giornata.partite.map((partita, index) => (
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
            </div>
          </Card>
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