export default function Home() {
  const buttonStyle = {
    display: "block",
    width: "320px",
    padding: "16px",
    borderRadius: "14px",
    textDecoration: "none",
    color: "white",
    fontWeight: "bold",
    fontSize: "18px",
    textAlign: "center" as const,
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "60px",
        paddingLeft: "20px",
        paddingRight: "20px",
      }}
    >
      <h1
        style={{
          fontSize: "3rem",
          marginBottom: "10px",
          textAlign: "center",
        }}
      >
        🏆 FantAquilaCastoro 2026
      </h1>

      <p
        style={{
          fontSize: "1.3rem",
          fontWeight: "bold",
          color: "#fbbf24",
          marginTop: 0,
          marginBottom: "8px",
          letterSpacing: "1px",
        }}
      >
        Road to New York 🗽
      </p>

      <p
        style={{
          color: "#cbd5e1",
          marginBottom: "40px",
          textAlign: "center",
        }}
      >
        USA 🇺🇸 • Canada 🇨🇦 • Messico 🇲🇽
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
        }}
      >
          <a
          href="/rose-ufficiali.html"
          style={{
            ...buttonStyle,
            background: "#16a34a",
          }}
        >
          🌍 Rose Ufficiali Complete
        </a>

        <a
          href="/calendario"
          style={{
            ...buttonStyle,
            background: "#9333ea",
          }}
        >
          🗓️ Calendario
        </a>

        <a
          href="/regolamento.pdf"
          target="_blank"
          style={{
            ...buttonStyle,
            background: "#ea580c",
          }}
        >
          📜 Regolamento
        </a>
      </div>

      <div
        style={{
          marginTop: "50px",
          textAlign: "center",
          color: "#94a3b8",
          fontSize: "14px",
        }}
      >
        FantAquilaCastoro • World Cup Edition 2026
      </div>
    </main>
  );
}