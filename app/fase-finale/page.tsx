import Card from "@/components/Card";

export default function FaseFinalePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#78350f",
        color: "white",
        padding: "40px",
      }}
    >
      <h1>⚔️ Fase Finale</h1>

      <Card title="🏆 Quarti di Finale">
        <p>1° Girone A vs Peggiore Terza</p>
        <p>1° Girone B vs Migliore Terza</p>
        <p>1° Girone C vs Peggiore Seconda</p>
        <p>Seconda Migliore vs Seconda Peggiore</p>
      </Card>

      <Card title="🎲 Semifinali">
        <p>Sorteggio integrale</p>
      </Card>

      <Card title="🗽 Finale">
        <p>MetLife Stadium</p>
        <p>19 Luglio 2026</p>
      </Card>
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