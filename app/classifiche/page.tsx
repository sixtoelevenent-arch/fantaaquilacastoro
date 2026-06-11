import Card from "@/components/Card";

export default function ClassifichePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#082f49",
        color: "white",
        padding: "40px",
      }}
    >
      <h1>📊 Classifiche</h1>

      <Card title="🏆 Girone A">
        <p>🥇 Argentina - 0 pt</p>
        <p>🥈 Iran - 0 pt</p>
        <p>🥉 Colombia - 0 pt</p>
        <p>4️⃣ Portogallo - 0 pt</p>
      </Card>

      <Card title="🏆 Girone B">
        <p>🥇 Francia - 0 pt</p>
        <p>🥈 Uzbekistan - 0 pt</p>
        <p>🥉 Messico - 0 pt</p>
        <p>4️⃣ Curaçao - 0 pt</p>
      </Card>

      <Card title="🏆 Girone C">
        <p>🥇 Ghana - 0 pt</p>
        <p>🥈 Turchia - 0 pt</p>
        <p>🥉 Costa d'Avorio - 0 pt</p>
        <p>4️⃣ Germania - 0 pt</p>
      </Card>
    </main>
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
  );
}