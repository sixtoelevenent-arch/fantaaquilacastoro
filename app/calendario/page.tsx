import Card from "@/components/Card";

export default function CalendarioPage() {
  const matchStyle = {
    background: "#0f172a",
    padding: "18px",
    borderRadius: "14px",
    marginBottom: "12px",
    textAlign: "center" as const,
    fontWeight: "bold",
    fontSize: "18px",
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#2e1065",
        color: "white",
        padding: "40px",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: "10px",
          fontSize: "3rem",
        }}
      >
        🗓️ Calendario
      </h1>

      <p
        style={{
          textAlign: "center",
          color: "#d8b4fe",
          marginBottom: "40px",
        }}
      >
        Fase a gironi • Road to New York 🗽
      </p>

      <Card title="⚽ Giornata 1">
        <div style={matchStyle}>
          🇵🇹 Portogallo
          <br />
          VS
          <br />
          🇮🇷 Iran
        </div>

        <div style={matchStyle}>
          🇦🇷 Argentina
          <br />
          VS
          <br />
          🇨🇴 Colombia
        </div>

        <div style={matchStyle}>
          🇫🇷 Francia
          <br />
          VS
          <br />
          🇺🇿 Uzbekistan
        </div>

        <div style={matchStyle}>
          🇲🇽 Messico
          <br />
          VS
          <br />
          🇨🇼 Curaçao
        </div>

        <div style={matchStyle}>
          🇬🇭 Ghana
          <br />
          VS
          <br />
          🇹🇷 Turchia
        </div>

        <div style={matchStyle}>
          🇨🇮 Costa d'Avorio
          <br />
          VS
          <br />
          🇩🇪 Germania
        </div>
      </Card>

      <Card title="⚽ Giornata 2">
        <div style={matchStyle}>
          🇨🇴 Colombia
          <br />
          VS
          <br />
          🇵🇹 Portogallo
        </div>

        <div style={matchStyle}>
          🇮🇷 Iran
          <br />
          VS
          <br />
          🇦🇷 Argentina
        </div>

        <div style={matchStyle}>
          🇨🇼 Curaçao
          <br />
          VS
          <br />
          🇫🇷 Francia
        </div>

        <div style={matchStyle}>
          🇺🇿 Uzbekistan
          <br />
          VS
          <br />
          🇲🇽 Messico
        </div>

        <div style={matchStyle}>
          🇨🇮 Costa d'Avorio
          <br />
          VS
          <br />
          🇬🇭 Ghana
        </div>

        <div style={matchStyle}>
          🇹🇷 Turchia
          <br />
          VS
          <br />
          🇩🇪 Germania
        </div>
      </Card>

      <Card title="⚽ Giornata 3">
        <div style={matchStyle}>
          🇵🇹 Portogallo
          <br />
          VS
          <br />
          🇦🇷 Argentina
        </div>

        <div style={matchStyle}>
          🇨🇴 Colombia
          <br />
          VS
          <br />
          🇮🇷 Iran
        </div>

        <div style={matchStyle}>
          🇫🇷 Francia
          <br />
          VS
          <br />
          🇲🇽 Messico
        </div>

        <div style={matchStyle}>
          🇨🇼 Curaçao
          <br />
          VS
          <br />
          🇺🇿 Uzbekistan
        </div>

        <div style={matchStyle}>
          🇩🇪 Germania
          <br />
          VS
          <br />
          🇬🇭 Ghana
        </div>

        <div style={matchStyle}>
          🇹🇷 Turchia
          <br />
          VS
          <br />
          🇨🇮 Costa d'Avorio
        </div>
      </Card>

      <div
        style={{
          marginTop: "50px",
          textAlign: "center",
          color: "#d8b4fe",
        }}
      >
        FantAquilaCastoro 2026 • Road to New York 🗽
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
</main>
  );
}