import Link from "next/link";
import BackHome from "@/components/BackHome";
import Card from "@/components/Card";
import { supabase } from "@/lib/supabase";

async function getData() {
  const { data: matchday } = await supabase
    .from("matchdays")
    .select("*")
    .eq("attiva", true)
    .single();

  if (!matchday) {
    return {
      matchday: null,
      matches: [],
    };
  }

  const { data: matches } = await supabase
    .from("matches")
    .select(`
      *,
      home:team_home_id (
        id,
        nome,
        proprietario
      ),
      away:team_away_id (
        id,
        nome,
        proprietario
      )
    `)
    .eq("matchday_id", matchday.id)
    .order("id");

  return {
    matchday,
    matches: matches || [],
  };
}

export default async function LivePage() {
  const { matchday, matches } = await getData();

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "24px",
        background:
          "radial-gradient(circle at top, #3b0000 0%, #120000 35%, #050816 100%)",
        color: "white",
      }}
    >
      <BackHome />

      <div
        style={{
          textAlign: "center",
          marginBottom: "36px",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "3rem",
            fontWeight: 900,
            color: "#ff4d4d",
          }}
        >
          🔴 LIVE GIORNATA
        </h1>

        <p
          style={{
            marginTop: "12px",
            fontSize: "1.25rem",
            color: "#e5e7eb",
          }}
        >
          Aggiornamenti in tempo reale
        </p>

        {matchday && (
          <div
            style={{
              display: "inline-block",
              marginTop: "12px",
              padding: "10px 20px",
              borderRadius: "999px",
              background: "#7f1d1d",
              color: "#fff",
              fontWeight: 700,
            }}
          >
            ⏱️ {matchday.nome}
          </div>
        )}
      </div>

      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        {matches.length === 0 && (
          <Card>
            <div
              style={{
                textAlign: "center",
                fontSize: "1.2rem",
              }}
            >
              Nessuna partita trovata.
            </div>
          </Card>
        )}

        {matches.map((match: any) => (
          <Link
            key={match.id}
            href={`/live/${match.id}`}
            style={{
              textDecoration: "none",
            }}
          >
            <Card>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "18px",
                }}
              >
                <div
                  style={{
                    fontSize: "1.7rem",
                    fontWeight: 800,
                    color: "#fff",
                  }}
                >
                  {match.home?.nome}
                </div>

                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: 900,
                    color: "#facc15",
                  }}
                >
                  {match.gol_home ?? 0} - {match.gol_away ?? 0}
                </div>

                <div
                  style={{
                    fontSize: "1.7rem",
                    fontWeight: 800,
                    color: "#fff",
                  }}
                >
                  {match.away?.nome}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "16px",
                  color: "#93c5fd",
                  fontWeight: 600,
                }}
              >
                <span>👤 {match.home?.proprietario}</span>
                <span>👤 {match.away?.proprietario}</span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "18px",
                }}
              >
                <div>
                  <div
                    style={{
                      color: "#9ca3af",
                      fontSize: "0.9rem",
                    }}
                  >
                    Fantapunti
                  </div>

                  <div
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: 800,
                    }}
                  >
                    {match.fp_home ?? 0}
                  </div>
                </div>

                <div
                  style={{
                    color: "#d1d5db",
                    fontWeight: 700,
                  }}
                >
                  →
                </div>

                <div
                  style={{
                    textAlign: "right",
                  }}
                >
                  <div
                    style={{
                      color: "#9ca3af",
                      fontSize: "0.9rem",
                    }}
                  >
                    Fantapunti
                  </div>

                  <div
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: 800,
                    }}
                  >
                    {match.fp_away ?? 0}
                  </div>
                </div>
              </div>

              <div
                style={{
                  textAlign: "center",
                  color: "#fbbf24",
                  fontWeight: 700,
                  fontSize: "1rem",
                }}
              >
                ⏳ Voti non ancora importati
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}