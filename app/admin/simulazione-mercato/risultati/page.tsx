"use client";

import {
  useEffect,
  useState,
} from "react";
import { supabase } from "@/lib/supabase";
import BackHome from "@/components/BackHome";

type SimTeam = {
  id: number;
  nome: string;
};

type Assignment = {
  player_id: number;
  price: number;
  players: {
    nome: string;
    nazionale: string;
    ruolo: string;
  }[];
};

export default function RisultatiSimulazionePage() {
  const [loading, setLoading] =
    useState(true);

  const [teams, setTeams] =
    useState<SimTeam[]>([]);

  const [teamId, setTeamId] =
    useState<number | null>(null);

  const [assignments, setAssignments] =
    useState<Assignment[]>([]);

  useEffect(() => {
    loadTeams();
  }, []);

  useEffect(() => {
    if (teamId) {
      loadAssignments(teamId);
    }
  }, [teamId]);

  async function loadTeams() {
    setLoading(true);

    const {
      data: teamsData,
    } = await supabase
      .from("market_sim_teams")
      .select("*")
      .order("ordine");

    const rows =
      (teamsData as SimTeam[]) ??
      [];

    setTeams(rows);

    if (rows.length > 0) {
      setTeamId(rows[0].id);
    }

    setLoading(false);
  }

  async function loadAssignments(
    selectedTeamId: number
  ) {
    const { data } =
      await supabase
        .from(
          "market_sim_assignments"
        )
        .select(`
          player_id,
          price,
          players (
            nome,
            nazionale,
            ruolo
          )
        `)
        .eq(
          "team_id",
          selectedTeamId
        )
        .order("price", {
          ascending: false,
        });

    setAssignments(
      ((data ?? []) as unknown as Assignment[])
    );
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
          🏆 RISULTATI
          SIMULAZIONE
        </h1>

        <select
          value={teamId ?? ""}
          onChange={(e) =>
            setTeamId(
              Number(
                e.target.value
              )
            )
          }
          style={{
            width: "100%",
            padding: 14,
            borderRadius: 14,
            border: "none",
            marginBottom: 20,
          }}
        >
          {teams.map((t) => (
            <option
              key={t.id}
              value={t.id}
            >
              {t.nome}
            </option>
          ))}
        </select>

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
                key={a.player_id}
                style={{
                  background:
                    "#111827",
                  borderRadius:
                    16,
                  padding: 16,
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
                      {a.players?.[0]
                        ?.nome ??
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
                        a.players?.[0]
                          ?.nazionale
                      }
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
                      ✅
                      Acquistato
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
                        a.players?.[0]
                          ?.ruolo
                      }
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