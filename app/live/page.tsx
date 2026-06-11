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
      <h1>🔴 LIVE GIORNATA</h1>

      <Card title="🇵🇹 Portogallo vs 🇮🇷 Iran">
        <h2>0 - 0</h2>
        <p>In attesa dell'inizio della giornata.</p>
      </Card>

      <Card title="🇦🇷 Argentina vs 🇨🇴 Colombia">
        <h2>0 - 0</h2>
        <p>In attesa dell'inizio della giornata.</p>
      </Card>
    </main>
  );
}