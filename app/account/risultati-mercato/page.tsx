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

type Assignment = {
  player_id: number;
  price: number;
  created_at: string;
  players: {
    nome: string;
    nazionale: string;
    ruolo: string;
  }[];
};

export default function RisultatiMercatoPage() {
  const router = useRouter();

  const [loading, setLoading] =
    useState(true);

  const [assignments, setAssignments] =
    useState<Assignment[]>([]);

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

    const { data } =
      await supabase
        .from(
          "market_assignments"
        )
        .select(`
          player_id,
          price,
          created_at,
          players (
            nome,
            nazionale,
            ruolo
          )
        `)
        .eq(
          "team_id",
          user.team_id
        )
        .order(
          "created_at",
          {
            ascending: false,
          }
        );

    setAssignments(
  (data ?? []).map((r: any) => ({
    player_id: r.player_id,
    price: r.price,
    created_at: r.created_at,
    players: Array.isArray(r.players)
      ? r.players
      : r.players
      ? [r.players]
      : [],
  }))
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
          🏆 RISULTATI MERCATO
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
          Acquisti effettuati:{" "}
          {assignments.length}
        </p>

        {assignments.length ===
          0 && (
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
            Nessun acquisto
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
          {assignments.map(
            (a) => (
              <div
                key={`${a.player_id}-${a.created_at}`}
                style={{
                  background:
                    "#111827",
                  borderRadius:
                    16,
                  padding:
                    16,
                  border:
                    "1px solid rgba(34,197,94,.25)",
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
                      {a.players?.[0]?.nome ?? "Giocatore"}
                    </div>

                    <div
                      style={{
                        color:
                          "#94a3b8",
                        marginTop:
                          4,
                      }}
                    >
                      {a.players?.[0]?.nazionale}
                    </div>

                    <div
                      style={{
                        color:
                          "#86efac",
                        marginTop:
                          10,
                        fontWeight:
                          700,
                      }}
                    >
                      ✅ Acquistato
                    </div>
                  </div>

                  <div
                    style={{
                      textAlign:
                        "right",
                    }}
                  >
                    <div>
                      {a.players?.[0]?.ruolo}
                    </div>

                    <div
                      style={{
                        color:
                          "#facc15",
                        fontWeight:
                          800,
                        fontSize:
                          "1.1rem",
                        marginTop:
                          8,
                      }}
                    >
                      {a.price} mln
                    </div>

                    <div
                      style={{
                        color:
                          "#94a3b8",
                        marginTop:
                          6,
                        fontSize:
                          ".85rem",
                      }}
                    >
                      {new Date(
                        a.created_at
                      ).toLocaleString(
                        "it-IT"
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </main>
  );
}