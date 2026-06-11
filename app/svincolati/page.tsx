import Card from "@/components/Card";

export default function SvincolatiPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#1f2937",
        color: "white",
        padding: "40px",
      }}
    >
      <h1>📑 Listone Svincolati</h1>

      <Card title="📄 Documento Ufficiale">
        <a
          href="/svincolati.pdf"
          target="_blank"
          style={{ color: "#60a5fa" }}
        >
          Apri il PDF degli svincolati
        </a>
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