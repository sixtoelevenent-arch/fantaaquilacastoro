export default function AlboDOroPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #3b2f0b, #111827)",
        color: "white",
        padding: "40px",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontSize: "3rem",
          color: "#fbbf24",
        }}
      >
        🥇 Albo d'Oro
      </h1>

      <p
        style={{
          color: "#d1d5db",
          marginBottom: "40px",
        }}
      >
        Storia del FantAquilaCastoro
      </p>

      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          background: "#1f2937",
          padding: "25px",
          borderRadius: "20px",
        }}
      >
        <h2>🏆 Edizione 2022</h2>

        <p
          style={{
            fontSize: "1.5rem",
            color: "#fbbf24",
            fontWeight: "bold",
          }}
        >
          Sirty
        </p>

        <p>Campione FantaCammello 2022</p>
      </div>

      <div
        style={{
          maxWidth: "600px",
          margin: "20px auto",
          background: "#1f2937",
          padding: "25px",
          borderRadius: "20px",
        }}
      >
        <h2>🏆 Edizione 2026</h2>

        <p
          style={{
            fontSize: "1.5rem",
            color: "#9ca3af",
          }}
        >
          ❓ Da assegnare
        </p>
      </div>
    </main>
  );
}