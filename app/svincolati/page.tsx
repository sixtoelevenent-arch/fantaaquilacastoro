import BackHome from "@/components/BackHome";
import Card from "@/components/Card";

export default function SvincolatiPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#1f2937",
        color: "white",
        padding: "20px",
      }}
    >
      <BackHome />

      <h1
        style={{
          textAlign: "center",
          fontSize: "clamp(2rem, 6vw, 3rem)",
          marginBottom: "10px",
        }}
      >
        📑 Listone Svincolati
      </h1>

      <p
        style={{
          textAlign: "center",
          color: "#cbd5e1",
          marginBottom: "40px",
        }}
      >
        Elenco ufficiale dei calciatori disponibili sul mercato.
      </p>

      <Card title="📄 Documento Ufficiale">
        <div
          style={{
            textAlign: "center",
          }}
        >
          <a
            href="/svincolati.pdf"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              padding: "12px 20px",
              background: "#2563eb",
              color: "white",
              textDecoration: "none",
              borderRadius: "10px",
              fontWeight: "bold",
            }}
          >
            📥 Apri il PDF degli Svincolati
          </a>
        </div>
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