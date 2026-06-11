export default function Home() {
  return (
    <main style={{ padding: 40, textAlign: "center" }}>
      <h1>🏆 FantAquilaCastoro 2026</h1>

      <p>Mondiale Fantasy a 12 squadre</p>

      <div style={{ marginTop: "30px" }}>
        <a
          href="/rose"
          style={{
            display: "inline-block",
            padding: "12px 20px",
            background: "#2563eb",
            color: "white",
            textDecoration: "none",
            borderRadius: "8px",
            margin: "5px",
          }}
        >
          📋 Rose Squadre
        </a>

        <a
          href="/rose-ufficiali.html"
          style={{
            display: "inline-block",
            padding: "12px 20px",
            background: "#16a34a",
            color: "white",
            textDecoration: "none",
            borderRadius: "8px",
            margin: "5px",
          }}
        >
          🌍 Rose Ufficiali Complete
        </a>

        <a
          href="/regolamento"
          style={{
            display: "inline-block",
            padding: "12px 20px",
            background: "#ea580c",
            color: "white",
            textDecoration: "none",
            borderRadius: "8px",
            margin: "5px",
          }}
        >
          📜 Regolamento
        </a>
        <a
  href="/regolamento.pdf"
  target="_blank"
  style={{
    display: "inline-block",
    padding: "12px 20px",
    background: "#ea580c",
    color: "white",
    textDecoration: "none",
    borderRadius: "8px",
    margin: "5px",
  }}
>
  📜 Regolamento
</a>
      </div>
    </main>
  );
}