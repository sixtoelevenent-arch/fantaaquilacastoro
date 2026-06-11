export default function GironiPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#07111f",
        color: "white",
        padding: "40px",
      }}
    >
      <h1>🏆 Gironi</h1>

      <div style={{
        display: "flex",
        gap: "20px",
        flexWrap: "wrap",
      }}>

        <div style={{
          background: "#1e3a8a",
          padding: "20px",
          borderRadius: "16px",
          width: "250px",
        }}>
          <h2>Girone A</h2>
          <p>🇦🇷 Argentina</p>
          <p>🇮🇷 Iran</p>
          <p>🇨🇴 Colombia</p>
          <p>🇵🇹 Portogallo</p>
        </div>

        <div style={{
          background: "#166534",
          padding: "20px",
          borderRadius: "16px",
          width: "250px",
        }}>
          <h2>Girone B</h2>
          <p>🇫🇷 Francia</p>
          <p>🇺🇿 Uzbekistan</p>
          <p>🇲🇽 Messico</p>
          <p>🇨🇼 Curaçao</p>
        </div>

        <div style={{
          background: "#7c3aed",
          padding: "20px",
          borderRadius: "16px",
          width: "250px",
        }}>
          <h2>Girone C</h2>
          <p>🇬🇭 Ghana</p>
          <p>🇹🇷 Turchia</p>
          <p>🇨🇮 Costa d'Avorio</p>
          <p>🇩🇪 Germania</p>
        </div>

      </div>
    </main>
  );
}