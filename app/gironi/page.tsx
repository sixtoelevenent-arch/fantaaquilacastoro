export default function CalendarioPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#081229",
        color: "white",
        padding: "40px",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          fontSize: "3rem",
          marginBottom: "10px",
        }}
      >
        🗓️ Calendario Ufficiale
      </h1>

      <p
        style={{
          textAlign: "center",
          color: "#93c5fd",
          marginBottom: "40px",
        }}
      >
        Fase a gironi e tabellone finale
      </p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "25px",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            background: "#1e3a8a",
            padding: "25px",
            borderRadius: "18px",
            width: "260px",
          }}
        >
          <h2>🏆 Girone A</h2>

          <p>🇦🇷 Argentina</p>
          <p>🇮🇷 Iran</p>
          <p>🇨🇴 Colombia</p>
          <p>🇵🇹 Portogallo</p>
        </div>

        <div
          style={{
            background: "#166534",
            padding: "25px",
            borderRadius: "18px",
            width: "260px",
          }}
        >
          <h2>🏆 Girone B</h2>

          <p>🇺🇿 Uzbekistan</p>
          <p>🇫🇷 Francia</p>
          <p>🇲🇽 Messico</p>
          <p>🇨🇼 Curaçao</p>
        </div>

        <div
          style={{
            background: "#7c3aed",
            padding: "25px",
            borderRadius: "18px",
            width: "260px",
          }}
        >
          <h2>🏆 Girone C</h2>

          <p>🇨🇮 Costa d'Avorio</p>
          <p>🇹🇷 Turchia</p>
          <p>🇬🇭 Ghana</p>
          <p>🇩🇪 Germania</p>
        </div>
      </div>

      <div
        style={{
          marginTop: "50px",
          background: "#f59e0b",
          color: "#111",
          padding: "25px",
          borderRadius: "18px",
          maxWidth: "900px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <h2>⚔️ Fase Finale</h2>

        <p>1° Girone A vs Peggiore Terza</p>

        <p>1° Girone B vs Migliore Terza</p>

        <p>1° Girone C vs Peggiore Seconda</p>

        <p>Seconda Migliore vs Seconda Peggiore</p>

        <hr />

        <h3>🏅 Semifinali</h3>

        <p>Sorteggio integrale</p>
      </div>
    </main>
  );
}