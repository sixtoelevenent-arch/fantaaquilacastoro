"use client";

import {
  useEffect,
  useMemo,
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
};

type Bid = {
  player_id: number;
  bid: number;
  priority: number;
};

export default function SimulaBustePage() {
  const [loading, setLoading] =
    useState(true);

  const [teams, setTeams] =
    useState<SimTeam[]>([]);

  const [teamId, setTeamId] =
    useState<number | null>(null);

  const [players, setPlayers] =
    useState<Player[]>([]);

  const [bids, setBids] =
    useState<Bid[]>([]);

  const [search, setSearch] =
    useState("");

  const [roleFilter, setRoleFilter] =
    useState("ALL");

  useEffect(() => {
    loadPage();
  }, []);

  useEffect(() => {
    if (teamId) {
      loadBids(teamId);
    }
  }, [teamId]);

  async function loadPage() {
    setLoading(true);

    const {
      data: teamsData,
    } = await supabase
      .from("market_sim_teams")
      .select("*")
      .order("ordine");

    const teamsRows =
      (teamsData as SimTeam[]) ??
      [];

    setTeams(teamsRows);

    if (teamsRows.length > 0) {
      setTeamId(teamsRows[0].id);
    }

    const {
      data: playersData,
    } = await supabase
      .from("players")
      .select(`
        id,
        nome,
        nazionale,
        ruolo
      `)
      .order("ruolo")
      .order("nome");

    setPlayers(
      (playersData as Player[]) ??
        []
    );

    setLoading(false);
  }

  async function loadBids(
    selectedTeamId: number
  ) {
    const { data } =
      await supabase
        .from("market_sim_bids")
        .select(`
          player_id,
          bid,
          priority
        `)
        .eq(
          "team_id",
          selectedTeamId
        );

    setBids(
      (data as Bid[]) ?? []
    );
  }

  function getBid(
    playerId: number
  ) {
    return bids.find(
      (b) =>
        b.player_id === playerId
    );
  }

  async function updateBid(
    playerId: number,
    bidValue: number,
    priorityValue: number
  ) {
    if (!teamId) return;

    const existing =
      getBid(playerId);

    if (
      bidValue <= 0 &&
      priorityValue <= 0
    ) {
      if (existing) {
        await supabase
          .from(
            "market_sim_bids"
          )
          .delete()
          .eq(
            "team_id",
            teamId
          )
          .eq(
            "player_id",
            playerId
          );

        setBids((prev) =>
          prev.filter(
            (b) =>
              b.player_id !==
              playerId
          )
        );
      }

      return;
    }

    if (existing) {
      await supabase
        .from(
          "market_sim_bids"
        )
        .update({
          bid: bidValue,
          priority:
            priorityValue,
        })
        .eq(
          "team_id",
          teamId
        )
        .eq(
          "player_id",
          playerId
        );

      setBids((prev) =>
        prev.map((b) =>
          b.player_id === playerId
            ? {
                ...b,
                bid:
                  bidValue,
                priority:
                  priorityValue,
              }
            : b
        )
      );

      return;
    }

    await supabase
      .from(
        "market_sim_bids"
      )
      .insert({
        team_id: teamId,
        player_id: playerId,
        bid: bidValue,
        priority:
          priorityValue,
      });

    setBids((prev) => [
      ...prev,
      {
        player_id:
          playerId,
        bid: bidValue,
        priority:
          priorityValue,
      },
    ]);
  }

  const filteredPlayers =
    useMemo(() => {
      let rows = [
        ...players,
      ];

      if (search) {
        rows = rows.filter(
          (p) =>
            p.nome
              .toLowerCase()
              .includes(
                search.toLowerCase()
              )
        );
      }

      if (
        roleFilter !== "ALL"
      ) {
        rows = rows.filter(
          (p) =>
            p.ruolo ===
            roleFilter
        );
      }

      return rows;
    }, [
      players,
      search,
      roleFilter,
    ]);

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
          maxWidth: 1100,
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
          💰 SIMULA BUSTE
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

        <input
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          placeholder="🔍 Cerca giocatore..."
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 12,
            border: "none",
            marginBottom: 16,
          }}
        />

        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            marginBottom: 20,
          }}
        >
          {[
            "ALL",
            "P",
            "D",
            "C",
            "A",
          ].map((r) => (
            <button
              key={r}
              onClick={() =>
                setRoleFilter(r)
              }
              style={{
                padding:
                  "8px 14px",
                borderRadius:
                  999,
                border: "none",
                cursor:
                  "pointer",
                fontWeight: 700,
                background:
                  roleFilter === r
                    ? "#facc15"
                    : "#334155",
                color:
                  roleFilter === r
                    ? "#000"
                    : "#fff",
              }}
            >
              {r === "ALL"
                ? "Tutti"
                : r}
            </button>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection:
              "column",
            gap: 12,
          }}
        >
          {filteredPlayers.map(
            (p) => {
              const bid =
                getBid(p.id);

              return (
                <div
                  key={p.id}
                  style={{
                    background:
                      "#111827",
                    borderRadius:
                      16,
                    padding: 16,
                  }}
                >
                  <div
                    style={{
                      fontWeight:
                        800,
                    }}
                  >
                    {p.nome}
                  </div>

                  <div
                    style={{
                      color:
                        "#94a3b8",
                      marginTop:
                        4,
                    }}
                  >
                    {p.nazionale}
                    {" • "}
                    {p.ruolo}
                  </div>

                  <div
                    style={{
                      display:
                        "flex",
                      gap: 12,
                      marginTop:
                        14,
                      flexWrap:
                        "wrap",
                    }}
                  >
                    <input
                      type="number"
                      defaultValue={
                        bid?.bid ??
                        ""
                      }
                      placeholder="Offerta"
                      onBlur={(
                        e
                      ) =>
                        updateBid(
                          p.id,
                          Number(
                            e
                              .target
                              .value
                          ) ||
                            0,
                          bid?.priority ??
                            0
                        )
                      }
                      style={{
                        flex: 1,
                        minWidth:
                          120,
                        padding:
                          12,
                        borderRadius:
                          12,
                        border:
                          "none",
                      }}
                    />

                    <input
                      type="number"
                      defaultValue={
                        bid?.priority ??
                        ""
                      }
                      placeholder="Priorità"
                      onBlur={(
                        e
                      ) =>
                        updateBid(
                          p.id,
                          bid?.bid ??
                            0,
                          Number(
                            e
                              .target
                              .value
                          ) ||
                            0
                        )
                      }
                      style={{
                        width: 140,
                        padding:
                          12,
                        borderRadius:
                          12,
                        border:
                          "none",
                      }}
                    />
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>
    </main>
  );
}