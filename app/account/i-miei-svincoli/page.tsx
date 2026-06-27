"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import BackHome from "@/components/BackHome";

type User = {
  id: number;
  username: string;
  team_id: number;
};

type ReleasedPlayer = {
  player_id: number;
  automatic: boolean;
  prezzo_recuperato: number;
  players: {
    nome: string;
    nazionale: string;
    ruolo: string;
  }[];
};

export default function IMieiSvincoliPage() {
  const router = useRouter();

  const [loading, setLoading] =
    useState(true);

  const [players, setPlayers] =
    useState<ReleasedPlayer[]>([]);

  useEffect(() => {
    loadPage();
  }, []);

  async function loadPage() {
    setLoading(true);

    const raw =
      localStorage.getItem(
        "fantasy_user"
      );

    if (!raw) {
      router.push("/login");
      return;
    }

    const user =
      JSON.parse(raw) as User;

    const {
      data: round,
    } = await supabase
      .from("market_rounds")
      .select("id")
      .neq("status", "closed")
      .order("id", {
        ascending: false,
      })
      .limit(1)
      .single();

    if (!round) {
      setLoading(false);
      return;
    }

    const {
      data: release,
    } = await supabase
      .from("market_releases")
      .select("id")
      .eq("round_id", round.id)
      .eq(
        "team_id",
        user.team_id
      )
      .single();

    if (!release) {
      setLoading(false);
      return;
    }

    const {
      data,
    } = await supabase
      .from(
        "market_release_players"
      )
      .select(`
        player_id,
        automatic,
        prezzo_recuperato,
        players (
          nome,
          nazionale,
          ruolo
        )
      `)
      .eq(
        "release_id",
        release.id
      );

    setPlayers(
  ((data ?? []) as unknown as ReleasedPlayer[])
);

    setLoading(false);
  }

  if (loading) {
    return (
      <main
        style={{
          minHeight:
            "100vh",
          background:
            "#020617",
          color: "white",
          display: "flex",
          justifyContent:
            "center",
          alignItems:
            "center",
        }}
      >
        ⏳ Caricamento...
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom,#020617,#0f172a)",
        color: "white",
        padding: 20,
      }}
    >
      <div
        style={{
          maxWidth: 1000,
          margin: "0 auto",
        }}
      >
        <BackHome />

        <h1
          style={{
            textAlign:
              "center",
            marginBottom: 20,
          }}
        >
          🔄 I MIEI SVINCOLI
        </h1>

        <p
          style={{
            textAlign:
              "center",
            color:
              "#cbd5e1",
            marginBottom:
              20,
          }}
        >
          Totale svincoli:{" "}
          {players.length}
        </p>

        {players.length === 0 && (
          <div
            style={{
              background:
                "#111827",
              borderRadius:
                16,
              padding: 20,
              textAlign:
                "center",
              color:
                "#94a3b8",
            }}
          >
            Nessuno svincolo
            presente.
          </div>
        )}

        <div
          style={{
            display: "flex",
            flexDirection:
              "column",
            gap: 12,
          }}
        >
          {players.map((p) => (
            <div
              key={p.player_id}
              style={{
                background:
                  "#111827",
                borderRadius:
                  16,
                padding: 16,
                border:
                  p.automatic
                    ? "1px solid rgba(250,204,21,.35)"
                    : "1px solid rgba(34,197,94,.25)",
              }}
            >
              <div
                style={{
                  display:
                    "flex",
                  justifyContent:
                    "space-between",
                  gap: 20,
                  flexWrap:
                    "wrap",
                }}
              >
                <div>
                  <div
                    style={{
                      fontWeight:
                        800,
                      fontSize:
                        "1.05rem",
                    }}
                  >
                    {p.players?.[0]?.nome ??
                      "Giocatore"}
                  </div>

                  <div
                    style={{
                      color:
                        "#94a3b8",
                      marginTop:
                        4,
                    }}
                  >
                    {
                     p.players?.[0]?.nazionale
                    }
                  </div>

                  <div
                    style={{
                      marginTop:
                        10,
                      color:
                        p.automatic
                          ? "#fde68a"
                          : "#86efac",
                      fontWeight:
                        700,
                    }}
                  >
                    {p.automatic
                      ? "🌍 Svincolo automatico"
                      : "✅ Svincolo volontario"}
                  </div>
                </div>

                <div
                  style={{
                    textAlign:
                      "right",
                  }}
                >
                  <div>
                    {
                      p.players?.[0]?.ruolo
                    }
                  </div>

                  <div
                    style={{
                      color:
                        "#4ade80",
                      fontWeight:
                        800,
                      fontSize:
                        "1.1rem",
                      marginTop:
                        8,
                    }}
                  >
                    Recupero:{" "}
                    {p.prezzo_recuperato}{" "}
                    mln
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}