export default function LivePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0b1020",
        color: "white",
        padding: "30px",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "#ef4444",
        }}
      >
        🔴 LIVE GIORNATA
      </h1>

      <p
        style={{
          textAlign: "center",
          color: "#94a3b8",
          marginBottom: "40px",
        }}
      >
        Aggiornamenti in tempo reale
      </p>

      <div
        style={{
          background: "#1e293b",
          borderRadius: "16px",
          padding: "20px",
          marginBottom: "20px",
        }}
      >
        <h2>🇵🇹 Portogallo vs 🇮🇷 Iran</h2>

        <h3>0 - 0</h3>

        <p>In attesa dei voti...</p>
      </div>

      <div
        style={{
          background: "#1e293b",
          borderRadius: "16px",
          padding: "20px",
        }}
      >
        <h2>🇦🇷 Argentina vs 🇨🇴 Colombia</h2>

        <h3>0 - 0</h3>

        <p>In attesa dei voti...</p>
      </div>
    </main>
  );
}