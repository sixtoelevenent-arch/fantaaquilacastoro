export default function SvincolatiPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        padding: "40px",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontSize: "3rem",
          marginBottom: "10px",
        }}
      >
        📑 Listone Svincolati
      </h1>

      <p
        style={{
          color: "#cbd5e1",
          marginBottom: "40px",
        }}
      >
        Elenco completo dei giocatori disponibili
      </p>

      <a
        href="/svincolati.pdf"
        target="_blank"
        style={{
          display: "inline-block",
          padding: "16px 24px",
          background: "#16a34a",
          color: "white",
          textDecoration: "none",
          borderRadius: "12px",
          fontWeight: "bold",
          fontSize: "18px",
        }}
      >
        📄 Apri il PDF degli Svincolati
      </a>
    </main>
  );
}