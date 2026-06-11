import Card from "@/components/Card";

export default function LivePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#450a0a",
        color: "white",
        padding: "40px",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "#ef4444",
          fontSize: "3rem",
        }}
      >
        🔴 LIVE GIORNATA
      </h1>

      <p
        style={{
          textAlign: "center",
          color: "#fecaca",
          marginBottom: "40px",
        }}
      >
        Aggiornamenti in tempo reale
      </p>

      <Card title="🇵🇹 Portogallo vs 🇮🇷 Iran">
        <h2>0 - 0</h2>
        <p>In attesa dei voti...</p>
      </Card>

      <Card title="🇦🇷 Argentina vs 🇨🇴 Colombia">
        <h2>0 - 0</h2>
        <p>In attesa dei voti...</p>
      </Card>

      <Card title="🇫🇷 Francia vs 🇺🇿 Uzbekistan">
        <h2>0 - 0</h2>
        <p>In attesa dei voti...</p>
      </Card>

      <Card title="🇲🇽 Messico vs 🇨🇼 Curaçao">
        <h2>0 - 0</h2>
        <p>In attesa dei voti...</p>
      </Card>

      <Card title="🇬🇭 Ghana vs 🇹🇷 Turchia">
        <h2>0 - 0</h2>
        <p>In attesa dei voti...</p>
      </Card>

      <Card title="🇨🇮 Costa d'Avorio vs 🇩🇪 Germania">
        <h2>0 - 0</h2>
        <p>In attesa dei voti...</p>
      </Card>

      <div
        style={{
          marginTop: "50px",
          textAlign: "center",
          color: "#fecaca",
        }}
      >
        FantAquilaCastoro 2026 • Live Match Center
      </div>
    </main>
  );
}