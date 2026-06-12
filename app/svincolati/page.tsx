import BackHome from "@/components/BackHome";
import Card from "@/components/Card";

export default function SvincolatiPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #1f2937, #0f172a)",
        color: "white",
        padding: "20px",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <BackHome />

        <h1
          style={{
            textAlign: "center",
            fontSize: "clamp(2.2rem, 6vw, 3.5rem)",
            marginTop: "10px",
            marginBottom: "10px",
            fontWeight: "800",
          }}
        >
          📑 Listone Svincolati
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#cbd5e1",
            marginBottom: "35px",
            fontSize: "1rem",
          }}
        >
          Elenco ufficiale dei calciatori disponibili sul mercato.
        </p>

        <Card title="📄 Documento Ufficiale">
          <div
            style={{
              textAlign: "center",
              padding: "10px 0",
            }}
          >
            <p
              style={{
                color: "#cbd5e1",
                marginBottom: "24px",
                lineHeight: 1.6,
              }}
            >
              Consulta il listone completo degli svincolati del
              FantAquilaCastoro 2026.
            </p>

            <a
              href="/svincolati.pdf"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                padding: "14px 24px",
                background: "#2563eb",
                color: "white",
                textDecoration: "none",
                borderRadius: "12px",
                fontWeight: "700",
                fontSize: "1rem",
                boxShadow: "0 4px 12px rgba(37,99,235,0.35)",
                transition: "all 0.2s ease",
              }}
            >
              📥 Apri il PDF degli Svincolati
            </a>
          </div>
        </Card>

        <div
          style={{
            marginTop: "50px",
            paddingTop: "20px",
            borderTop: "1px solid #374151",
            textAlign: "center",
            color: "#94a3b8",
            fontSize: "14px",
          }}
        >
          FantAquilaCastoro 2026 • Road to New York 🗽
        </div>
      </div>
    </main>
  );
}