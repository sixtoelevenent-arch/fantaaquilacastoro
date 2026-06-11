import Card from "@/components/Card";

export default function AlboDOroPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#3b2f0b",
        color: "white",
        padding: "40px",
      }}
    >
      <h1>🥇 Albo d'Oro</h1>

      <Card title="🏆 Edizione 2022">
        
        <p>Sirty</p>
      </Card>

      <Card title="🏆 Edizione 2026">
        <h2>❓ Da assegnare</h2>
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