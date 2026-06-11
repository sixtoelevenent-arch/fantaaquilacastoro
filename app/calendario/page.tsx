export default function CalendarioPage() {
  return (
    <main style={{ padding: 40 }}>
      <h1>🏆 FantAquilaCastoro 2026</h1>

      <h2>Gironi</h2>

      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          marginTop: "20px",
        }}
      >
        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: "10px",
            padding: "20px",
            minWidth: "220px",
          }}
        >
          <h3>Girone A</h3>
          <p>🇦🇷 Argentina</p>
          <p>🇮🇷 Iran</p>
          <p>🇨🇴 Colombia</p>
          <p>🇵🇹 Portogallo</p>
        </div>

        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: "10px",
            padding: "20px",
            minWidth: "220px",
          }}
        >
          <h3>Girone B</h3>
          <p>🇺🇿 Uzbekistan</p>
          <p>🇫🇷 Francia</p>
          <p>🇲🇽 Messico</p>
          <p>🇨🇼 Curaçao</p>
        </div>

        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: "10px",
            padding: "20px",
            minWidth: "220px",
          }}
        >
          <h3>Girone C</h3>
          <p>🇨🇮 Costa d'Avorio</p>
          <p>🇹🇷 Turchia</p>
          <p>🇬🇭 Ghana</p>
          <p>🇩🇪 Germania</p>
        </div>
      </div>

      <h2 style={{ marginTop: "40px" }}>⚔️ Fase Finale</h2>

      <p>1° Girone A vs Peggiore Terza</p>
      <p>1° Girone B vs Migliore Terza</p>
      <p>1° Girone C vs Peggiore Seconda</p>
      <p>Seconda Migliore vs Seconda Peggiore</p>

      <h3 style={{ marginTop: "30px" }}>🏅 Semifinali</h3>
      <p>Sorteggio</p>
    </main>
  );
}