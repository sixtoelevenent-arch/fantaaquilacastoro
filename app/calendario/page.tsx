import Card from "@/components/Card";

export default function CalendarioPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#2e1065",
        color: "white",
        padding: "40px",
      }}
    >
      <h1>🗓️ Calendario</h1>

      <Card title="⚽ Giornata 1">
        <p>🇵🇹 Portogallo vs 🇮🇷 Iran</p>
        <p>🇦🇷 Argentina vs 🇨🇴 Colombia</p>
        <p>🇫🇷 Francia vs 🇺🇿 Uzbekistan</p>
        <p>🇲🇽 Messico vs 🇨🇼 Curaçao</p>
        <p>🇬🇭 Ghana vs 🇹🇷 Turchia</p>
        <p>🇨🇮 Costa d'Avorio vs 🇩🇪 Germania</p>
      </Card>

      <Card title="⚽ Giornata 2">
        <p>Vai alla pagina dedicata</p>
      </Card>

      <Card title="⚽ Giornata 3">
        <p>Vai alla pagina dedicata</p>
      </Card>
    </main>
  );
}