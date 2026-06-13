import Link from "next/link";

export default function Page() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom, #020617 0%, #08122c 50%, #020617 100%)",
        color: "white",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1
        style={{
          fontSize: "2rem",
          marginBottom: "10px",
          textAlign: "center",
        }}
      >
        ⚙️ Area Admin
      </h1>

      <p
        style={{
          color: "#cbd5e1",
          marginBottom: "30px",
          textAlign: "center",
        }}
      >
        Gestione FantAquilaCastoro 2026
      </p>

      <div
        style={{
          width: "100%",
          maxWidth: "350px",
        }}
      >
        <Link
          href="/admin/formazioni"
          style={{
            display: "block",
            width: "100%",
            padding: "16px",
            borderRadius: "14px",
            textDecoration: "none",
            color: "white",
            fontWeight: 700,
            fontSize: "18px",
            marginBottom: "12px",
            textAlign: "center",
            background: "#2563eb",
          }}
        >
          ⚽ Formazioni
        </Link>

        <Link
          href="/admin/voti"
          style={{
            display: "block",
            width: "100%",
            padding: "16px",
            borderRadius: "14px",
            textDecoration: "none",
            color: "white",
            fontWeight: 700,
            fontSize: "18px",
            marginBottom: "12px",
            textAlign: "center",
            background: "#16a34a",
          }}
        >
          📥 Voti
        </Link>

        <Link
          href="/"
          style={{
            display: "block",
            width: "100%",
            padding: "16px",
            borderRadius: "14px",
            textDecoration: "none",
            color: "white",
            fontWeight: 700,
            fontSize: "18px",
            textAlign: "center",
            background: "#475569",
          }}
        >
          🏠 Torna alla Home
        </Link>
      </div>
    </main>
  );
}