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

type Player = {
  id: number;
  nome: string;
  nazionale: string;
  ruolo: string;
  prezzo: number | null;
};

export default function RoseSimulazionePage() {
  const [loading, setLoading] =
    useState(true);

  const [teams, setTeams] =
    useState<SimTeam[]>([]);

  const [teamId, setTeamId] =
    useState<number | null>(null);

  const [players, setPlayers] =
    useState<Player[]>([]);

  useEffect(() => {
    loadPage();
  }, []);

  useEffect(() => {
    if (!teamId) return;

    loadPlayers(teamId);
  }, [teamId]);

  async function loadPage() {
    setLoading(true);

    const { data: teamsData } =
      await supabase
        .from("market_sim_teams")
        .select("*")
        .order("ordine");

    const teamsRows =
      (teamsData as SimTeam[]) ??
      [];

    setTeams(teamsRows);

    if (teamsRows.length > 0) {
      setTeamId(
        teamsRows[0].id
      );
    }

    setLoading(false);
  }

  async function loadPlayers(
    selectedTeamId: number
  ) {
    const {
      data: playersData,
    } = await supabase
      .from("market_sim_players")
      .select(`
        id,
        nome,
        nazionale,
        ruolo,
        prezzo
      `)
      .eq(
        "team_id",
        selectedTeamId
      )
      .order("ruolo")
      .order("nome");

    setPlayers(
      (playersData as Player[]) ??
        []
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
          👥 ROSE SIMULAZIONE
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
            marginBottom: 20,
          }}
        >
          Giocatori in rosa:{" "}
          {players.length}
        </p>

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
              key={p.id}
              style={{
                background:
                  "#111827",
                borderRadius:
                  16,
                padding: 16,
                border:
                  "1px solid rgba(255,255,255,.08)",
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
                    {p.nome}
                  </div>

                  <div
                    style={{
                      color:
                        "#94a3b8",
                      marginTop: 4,
                    }}
                  >
                    {
                      p.nazionale
                    }
                  </div>
                </div>

                <div
                  style={{
                    textAlign:
                      "right",
                  }}
                >
                  <div>
                    {p.ruolo}
                  </div>

                  <div
                    style={{
                      color:
                        "#facc15",
                      fontWeight:
                        800,
                      marginTop: 8,
                    }}
                  >
                    {p.prezzo ?? 0} mln
                  </div>
                </div>
              </div>
            </div>
          ))}

          {players.length ===
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
              Nessun giocatore
              presente.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}