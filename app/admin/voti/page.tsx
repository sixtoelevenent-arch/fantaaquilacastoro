import Link from "next/link";

export default function AdminVotiPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom, #020617 0%, #08122c 50%, #020617 100%)",
        color: "white",
        padding: "20px",
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
        }}
      >
        <Link
          href="/admin"
          style={{
            display: "inline-block",
            marginBottom: "20px",
            color: "#93c5fd",
            textDecoration: "none",
          }}
        >
          ← Torna Admin
        </Link>

        <h1
          style={{
            fontSize: "2rem",
            marginBottom: "10px",
          }}
        >
          📥 Gestione Voti
        </h1>

        <p
          style={{
            color: "#cbd5e1",
            marginBottom: "30px",
          }}
        >
          Importazione e gestione voti Mondiale 2026
        </p>

        <div
          style={{
            background: "#1e293b",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "20px",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              marginBottom: "20px",
            }}
          >
            Giornata 1
          </h2>

          <button
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: "12px",
              border: "none",
              background: "#dc2626",
              color: "white",
              fontWeight: 700,
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            📥 Importa Voti
          </button>

          <p
            style={{
              marginTop: "16px",
              color: "#94a3b8",
              fontSize: "14px",
            }}
          >
            Nessuna importazione eseguita.
          </p>
        </div>
      </div>
    </main>
  );
}