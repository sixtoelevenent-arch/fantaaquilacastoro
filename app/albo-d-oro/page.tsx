import BackHome from "@/components/BackHome";
import Card from "@/components/Card";

export default function AlboDOroPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #3b2f0b, #1f1704)",
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
          🥇 Albo d'Oro
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#fde68a",
            marginBottom: "35px",
          }}
        >
          I campioni della storia del FantaMundial
        </p>

        <Card title="🏆 Edizione 2022">
          <div
            style={{
              textAlign: "center",
              padding: "15px 0",
            }}
          >
            <div
              style={{
                fontSize: "3rem",
                marginBottom: "10px",
              }}
            >
              🥇
            </div>

            <h2
              style={{
                margin: 0,
                fontSize: "2rem",
                color: "#facc15",
              }}
            >
              Sirty
            </h2>

            <p
              style={{
                color: "#94a3b8",
                marginTop: "10px",
                marginBottom: 0,
              }}
            >
              Campione in carica dell'Albo d'Oro
            </p>
          </div>
        </Card>

        <Card title="🏆 Edizione 2026">
          <div
            style={{
              textAlign: "center",
              padding: "15px 0",
            }}
          >
            <div
              style={{
                fontSize: "3rem",
                marginBottom: "10px",
              }}
            >
              ❓
            </div>

            <h2
              style={{
                margin: 0,
                fontSize: "2rem",
              }}
            >
              Da assegnare
            </h2>

            <p
              style={{
                color: "#94a3b8",
                marginTop: "10px",
                marginBottom: 0,
              }}
            >
              Il prossimo campione sarà incoronato a New York
            </p>
          </div>
        </Card>

        <div
          style={{
            marginTop: "50px",
            paddingTop: "20px",
            borderTop: "1px solid rgba(255,255,255,0.15)",
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