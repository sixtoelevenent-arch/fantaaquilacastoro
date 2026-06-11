export default function CalendarioPage() {
  const card = {
    background: "#1e293b",
    padding: "20px",
    borderRadius: "16px",
    textDecoration: "none",
    color: "white",
    display: "block",
    marginBottom: "15px",
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#081229",
        color: "white",
        padding: "40px",
      }}
    >
      <h1>🗓️ Calendario FantAquilaCastoro 2026</h1>

      <a href="/calendario/giornata-1" style={card}>
        ⚽ Giornata 1
      </a>

      <a href="/calendario/giornata-2" style={card}>
        ⚽ Giornata 2
      </a>

      <a href="/calendario/giornata-3" style={card}>
        ⚽ Giornata 3
      </a>

      <a href="/calendario/quarti" style={card}>
        ⚔️ Quarti di Finale
      </a>

      <a href="/calendario/semifinali" style={card}>
        🏅 Semifinali
      </a>

      <a href="/calendario/finale" style={card}>
        🏆 Finale
      </a>
    </main>
  );
}