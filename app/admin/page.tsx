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
        justifyContent: "center",
      }}
    >
      <h1
        style={{
          fontSize: "2.2rem",
          marginBottom: "10px",
          textAlign: "center",
        }}
      >
        ⚙️ Area Admin
      </h1>

      <p
        style={{
          color: "#cbd5e1",
          marginBottom: "35px",
          textAlign: "center",
          fontSize: "18px",
        }}
      >
        Gestione FantAquilaCastoro 2026
      </p>

      <div
        style={{
          width: "100%",
          maxWidth: "320px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <Link
          href="/admin/formazioni"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            padding: "16px",
            borderRadius: "14px",
            textDecoration: "none",
            color: "white",
            fontWeight: 700,
            fontSize: "18px",
            background: "#2563eb",
          }}
        >
          ⚽ Formazioni
        </Link>

        <Link
          href="/admin/giornate"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            padding: "16px",
            borderRadius: "14px",
            textDecoration: "none",
            color: "white",
            fontWeight: 700,
            fontSize: "18px",
            background: "#f59e0b",
          }}
        >
          📅 Gestione Giornate
        </Link>

        <Link
          href="/admin/voti"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            padding: "16px",
            borderRadius: "14px",
            textDecoration: "none",
            color: "white",
            fontWeight: 700,
            fontSize: "18px",
            background: "#16a34a",
          }}
        >
          📥 Gestione Voti
        </Link>

        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            padding: "16px",
            borderRadius: "14px",
            textDecoration: "none",
            color: "white",
            fontWeight: 700,
            fontSize: "18px",
            background: "#475569",
          }}
        >
          🏠 Torna alla Home
        </Link>
      </div>
    </main>
  );
}