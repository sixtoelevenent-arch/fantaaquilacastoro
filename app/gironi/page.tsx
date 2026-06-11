import Card from "@/components/Card";

export default function GironiPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#052e16",
        color: "white",
        padding: "40px",
      }}
    >
      <h1>🏆 Gironi</h1>

      <Card title="Girone A">
        <p>🇦🇷 Argentina</p>
        <p>🇮🇷 Iran</p>
        <p>🇨🇴 Colombia</p>
        <p>🇵🇹 Portogallo</p>
      </Card>

      <Card title="Girone B">
        <p>🇫🇷 Francia</p>
        <p>🇺🇿 Uzbekistan</p>
        <p>🇲🇽 Messico</p>
        <p>🇨🇼 Curaçao</p>
      </Card>

      <Card title="Girone C">
        <p>🇬🇭 Ghana</p>
        <p>🇹🇷 Turchia</p>
        <p>🇨🇮 Costa d'Avorio</p>
        <p>🇩🇪 Germania</p>
      </Card>
    </main>
  );
}