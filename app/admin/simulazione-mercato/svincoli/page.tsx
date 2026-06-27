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
  prezzo: number | null;
};

export default function SimulaSvincoliPage() {
  const [loading, setLoading] =
    useState(true);

  const [teams, setTeams] =
    useState<SimTeam[]>([]);

  const [teamId, setTeamId] =
    useState<number | null>(null);

  const [players, setPlayers] =
    useState<Player[]>([]);

  const [selectedIds, setSelectedIds] =
    useState<number[]>([]);

  const [search, setSearch] =
    useState("");

  const [roleFilter, setRoleFilter] =
    useState("ALL");

  useEffect(() => {
    loadPage();
  }, []);

  useEffect(() => {
  if (!teamId) return;

  loadPlayers(teamId);
  loadReleases(teamId);
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
  const firstTeamId =
    teamsRows[0].id;

  setTeamId(firstTeamId);

  await loadPlayers(
    firstTeamId
  );

   await loadReleases(
    firstTeamId
  );
  
}

        setLoading(false);
  }

  async function loadReleases(
    selectedTeamId: number
  ) {
    const { data } =
      await supabase
        .from(
          "market_sim_releases"
        )
        .select("player_id")
        .eq(
          "team_id",
          selectedTeamId
        );

    setSelectedIds(
      (data ?? []).map(
        (r: any) => r.player_id
      )
    );
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

  async function toggleRelease(
    playerId: number
  ) {
    if (!teamId) return;

    const selected =
      selectedIds.includes(
        playerId
      );

    if (selected) {
      await supabase
        .from(
          "market_sim_releases"
        )
        .delete()
        .eq("team_id", teamId)
        .eq(
          "player_id",
          playerId
        );

      setSelectedIds((prev) =>
        prev.filter(
          (id) => id !== playerId
        )
      );

      return;
    }

    await supabase
      .from(
        "market_sim_releases"
      )
      .insert({
        team_id: teamId,
        player_id: playerId,
      });

    setSelectedIds((prev) => [
      ...prev,
      playerId,
    ]);
  }

  const filteredPlayers =
    useMemo(() => {
      let rows = [...players];

      if (search) {
        rows = rows.filter((p) =>
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
            p.ruolo === roleFilter
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
          🔄 SIMULA SVINCOLI
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

        <p
          style={{
            textAlign:
              "center",
            color:
              "#cbd5e1",
            marginBottom: 20,
          }}
        >
          Svincoli selezionati:{" "}
          {selectedIds.length}
        </p>

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
              const selected =
                selectedIds.includes(
                  p.id
                );

              return (
                <div
                  key={p.id}
                  style={{
                    background:
                      "#111827",
                    borderRadius:
                      16,
                    padding: 16,
                    border:
                      selected
                        ? "1px solid rgba(34,197,94,.35)"
                        : "1px solid rgba(255,255,255,.08)",
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
                          marginTop:
                            4,
                        }}
                      >
                        {(p.nazionale ?? "")
  .substring(0, 3)
  .toUpperCase()}
                      </div>

                      <label
                        style={{
                          display:
                            "flex",
                          alignItems:
                            "center",
                          gap: 8,
                          marginTop:
                            12,
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={
                            selected
                          }
                          onChange={() =>
                            toggleRelease(
                              p.id
                            )
                          }
                        />

                        {selected
                          ? "✅ Da svincolare"
                          : "⬜ Svincola"}
                      </label>
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
                          fontSize:
                            "1.1rem",
                          marginTop:
                            8,
                        }}
                      >
                        {p.prezzo ??
                          0}{" "}
                        mln
                      </div>
                    </div>
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