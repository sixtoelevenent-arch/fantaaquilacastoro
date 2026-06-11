export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#111",
        color: "white",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <h1>🏆 FantAquilaCastoro 2026</h1>

      <p>Mondiale Fantasy a 12 squadre</p>

      <div style={{ marginTop: "30px" }}>
        <a
          href="/rose-ufficiali.html"
          style={{
            padding: "12px 20px",
            background: "#2563eb",
            color: "white",
            textDecoration: "none",
            borderRadius: "8px",
            fontWeight: "bold",
          }}
        >
          📋 Rose Ufficiali
        </a>
      </div>
    </main>
  );
}