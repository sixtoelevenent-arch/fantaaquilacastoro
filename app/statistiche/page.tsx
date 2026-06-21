"use client";

import { useEffect, useMemo, useState } from "react";

import BackHome from "@/components/BackHome";
import Card from "@/components/Card";
import Collapsible from "@/components/Collapsible";

import { supabase } from "@/lib/supabase";
import React from "react";

type Player = {
  id: number;
  nome: string;
  ruolo: string;
  nazionale: string;
  prezzo: number;
  team_id: number;
  national_team: string | null;
  fantapiu3_name: string | null;
  fantapiu3_code: string | null;
};

type Team = {
  id: number;
  nome: string;
  proprietario: string;
  gruppo: string;
};

type Vote = {
  id: number;
  matchday_id: number;
  player_id: number;

  voto: number | null;

  gol: number;
  assist: number;

  ammonizione: boolean;
  espulsione: boolean;

  autogol: number;
  rigori_parati: number;
  rigori_sbagliati: number;

  sv: boolean;

  gol_subiti: number;
  clean_sheet: boolean;
};

type PlayerStats = {
  player: Player;
  teamName: string;

  media: number | null;
  fantamedia: number | null;

  gol: number;
  assist: number;

  cleanSheet: number;

  presenze: number;

  votesByDay: Record<number, number | null>;
};

const MATCHDAY_LABELS: Record<number, string> = {
  1: "G1",
  2: "G2",
  3: "G3",
  4: "QA",
  5: "SA",
  6: "F",
  7: "QR",
  8: "SR",
};

export default function StatistichePage() {
  const [loading, setLoading] = useState(true);

  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);

  const [search, setSearch] = useState("");
const [teamFilter, setTeamFilter] = useState("Tutte");
const [roleFilter, setRoleFilter] = useState("Tutti");

const [sortField, setSortField] = useState("nome");
const [sortDirection, setSortDirection] =
  useState<"asc" | "desc">("asc");
  const [selectedPlayerId, setSelectedPlayerId] =
    useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);

    const { data: playersData } = await supabase
      .from("players")
      .select("*")
      .order("nome");

    const { data: teamsData } = await supabase
      .from("teams")
      .select("*");

    const { data: votesData } = await supabase
      .from("player_votes")
      .select("*");

    setPlayers((playersData || []) as Player[]);
    setTeams((teamsData || []) as Team[]);
    setVotes((votesData || []) as Vote[]);

    setLoading(false);
  }

  const playerStats = useMemo(() => {
    const teamMap = new Map<number, Team>();

    teams.forEach((t) => {
      teamMap.set(t.id, t);
    });

    const votesByPlayer = new Map<number, Vote[]>();

    votes.forEach((vote) => {
      if (!votesByPlayer.has(vote.player_id)) {
        votesByPlayer.set(vote.player_id, []);
      }

      votesByPlayer.get(vote.player_id)!.push(vote);
    });

    const stats: PlayerStats[] = players.map((player) => {
      const playerVotes =
        votesByPlayer.get(player.id) || [];

      const validVotes = playerVotes.filter(
        (v) =>
          v.voto !== null &&
          !v.sv
      );

      let media: number | null = null;

      if (validVotes.length > 0) {
        media =
          validVotes.reduce(
            (sum, v) => sum + (v.voto || 0),
            0
          ) / validVotes.length;
      }

      const fantasyScores = validVotes.map((v) => {
        return (
          (v.voto || 0) +
          v.gol * 3 +
          v.assist +
          v.rigori_parati * 3 -
          (v.ammonizione ? 0.5 : 0) -
          (v.espulsione ? 1 : 0) -
          v.autogol * 2 -
          v.rigori_sbagliati * 3
        );
      });

      let fantamedia: number | null = null;

      if (fantasyScores.length > 0) {
        fantamedia =
          fantasyScores.reduce(
            (a, b) => a + b,
            0
          ) / fantasyScores.length;
      }

      const votesByDay: Record<
        number,
        number | null
      > = {};

      playerVotes.forEach((v) => {
        votesByDay[v.matchday_id] = v.voto;
      });

      return {
        player,
        teamName:
          teamMap.get(player.team_id)?.nome || "",

        media,
        fantamedia,

        gol: playerVotes.reduce(
          (s, v) => s + (v.gol || 0),
          0
        ),

        assist: playerVotes.reduce(
          (s, v) => s + (v.assist || 0),
          0
        ),

        cleanSheet: playerVotes.reduce(
          (s, v) =>
            s + (v.clean_sheet ? 1 : 0),
          0
        ),

        presenze: validVotes.length,

        votesByDay,
      };
    });

    return stats;
  }, [players, teams, votes]);
  const filteredPlayers = useMemo(() => {
  let rows = [...playerStats];

  rows = rows.filter((p) =>
    formatFullName(p.player.nome)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (teamFilter !== "Tutte") {
    rows = rows.filter(
      (p) => p.teamName === teamFilter
    );
  }

  if (roleFilter !== "Tutti") {
    rows = rows.filter(
      (p) => p.player.ruolo === roleFilter
    );
  }

  rows.sort((a, b) => {
    let result = 0;

    switch (sortField) {
      case "squadra":
        result = a.teamName.localeCompare(
          b.teamName
        );
        break;

      case "ruolo":
        result = a.player.ruolo.localeCompare(
          b.player.ruolo
        );
        break;

      case "media":
        result =
          (a.media || 0) -
          (b.media || 0);
        break;

      case "fantamedia":
        result =
          (a.fantamedia || 0) -
          (b.fantamedia || 0);
        break;

      case "gol":
        result = a.gol - b.gol;
        break;

      case "assist":
        result =
          a.assist - b.assist;
        break;

      default:
        result =
          a.player.nome.localeCompare(
            b.player.nome
          );
    }

    return sortDirection === "asc"
      ? result
      : -result;
  });

  return rows;
}, [
  playerStats,
  search,
  teamFilter,
  roleFilter,
  sortField,
  sortDirection,
]);

  const teamNames = [
  "Tutte",
  ...Array.from(
    new Set(
      playerStats.map((p) => p.teamName)
    )
  ).sort(),
];

const roles = [
  "Tutti",
  "P",
  "D",
  "C",
  "A",
];

  const topFantamedia = useMemo(() => {
    return [...playerStats]
      .filter((p) => p.fantamedia !== null)
      .sort(
        (a, b) =>
          (b.fantamedia || 0) -
          (a.fantamedia || 0)
      )
      .slice(0, 10);
  }, [playerStats]);

  const topMedia = useMemo(() => {
    return [...playerStats]
      .filter((p) => p.media !== null)
      .sort(
        (a, b) =>
          (b.media || 0) -
          (a.media || 0)
      )
      .slice(0, 10);
  }, [playerStats]);

  const topGol = useMemo(() => {
    return [...playerStats]
      .filter((p) => p.gol > 0)
      .sort(
        (a, b) =>
          b.gol - a.gol
      )
      .slice(0, 10);
  }, [playerStats]);

  const topAssist = useMemo(() => {
    return [...playerStats]
      .filter((p) => p.assist > 0)
      .sort(
        (a, b) =>
          b.assist - a.assist
      )
      .slice(0, 10);
  }, [playerStats]);

  const topPortieri = useMemo(() => {
    return [...playerStats]
      .filter(
        (p) =>
          p.player.ruolo === "P" &&
          p.cleanSheet > 0
      )
      .sort(
        (a, b) =>
          b.cleanSheet - a.cleanSheet
      )
      .slice(0, 10);
  }, [playerStats]);

  const flop10 = useMemo(() => {
    return [...playerStats]
      .filter((p) => p.fantamedia !== null)
      .sort(
        (a, b) =>
          (a.fantamedia || 0) -
          (b.fantamedia || 0)
      )
      .slice(0, 10);
  }, [playerStats]);

  function handleSort(field: string) {
  if (sortField === field) {
    setSortDirection(
      sortDirection === "asc"
        ? "desc"
        : "asc"
    );
  } else {
    setSortField(field);
    setSortDirection("asc");
  }
}

function formatFullName(nome: string) {
  return nome
    .trim()
    .split(/\s+/)
    .map(
      (p) =>
        p.charAt(0).toUpperCase() +
        p.slice(1).toLowerCase()
    )
    .join(" ");
}

const selectedPlayer =
  selectedPlayerId === null
    ? null
    : playerStats.find(
        (p) =>
          p.player.id ===
          selectedPlayerId
      );

  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(to bottom,#2e1065,#1e1b4b)",
          color: "white",
          padding: 12,
        }}
      >
        Caricamento...
      </main>
    );
  }

  const statGridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(320px,1fr))",
    gap: "12px",
  };

  const tableStyle: React.CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "0.9rem",
  };

  const thStyle: React.CSSProperties = {
    padding: "8px",
    borderBottom:
      "1px solid rgba(255,255,255,0.12)",
    textAlign: "left",
    color: "#facc15",
  };

  const tdStyle: React.CSSProperties = {
    padding: "8px",
    borderBottom:
      "1px solid rgba(255,255,255,0.06)",
  };
  return (
  <main
    style={{
      minHeight: "100vh",
      background:
        "linear-gradient(to bottom,#2e1065,#1e1b4b)",
      color: "white",
      padding: "8px",
    }}
  >
    <div
      style={{
        maxWidth: "1400px",
        margin: "0 auto",
      }}
    >
      <BackHome />

      <h1
        style={{
          textAlign: "center",
          fontSize: "clamp(2rem,6vw,3.5rem)",
          fontWeight: 800,
          marginBottom: 20,
        }}
      >
        📊 Statistiche
      </h1>

      <div style={statGridStyle}>
        <Card title="⭐ Top Fantamedia">
          <table style={tableStyle}>
            <tbody>
              {topFantamedia.map((p, i) => (
                <tr key={p.player.id}>
                  <td style={tdStyle}>{i + 1}</td>
                  <td style={tdStyle}>
                    {formatFullName(p.player.nome)}
                  </td>
                  <td style={tdStyle}>
                    {p.teamName}
                  </td>
                  <td style={tdStyle}>
                    {p.fantamedia?.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card title="⚽ Top Marcatori">
          <table style={tableStyle}>
            <tbody>
              {topGol.map((p, i) => (
                <tr key={p.player.id}>
                  <td style={tdStyle}>{i + 1}</td>
                  <td style={tdStyle}>
                    {formatFullName(p.player.nome)}
                  </td>
                  <td style={tdStyle}>
                    {p.teamName}
                  </td>
                  <td style={tdStyle}>
                    {p.gol}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card title="🅰️ Top Assist">
          <table style={tableStyle}>
            <tbody>
              {topAssist.map((p, i) => (
                <tr key={p.player.id}>
                  <td style={tdStyle}>{i + 1}</td>
                  <td style={tdStyle}>
                    {formatFullName(p.player.nome)}
                  </td>
                  <td style={tdStyle}>
                    {p.teamName}
                  </td>
                  <td style={tdStyle}>
                    {p.assist}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card title="🎯 Top Media Voto">
          <table style={tableStyle}>
            <tbody>
              {topMedia.map((p, i) => (
                <tr key={p.player.id}>
                  <td style={tdStyle}>{i + 1}</td>
                  <td style={tdStyle}>
                    {formatFullName(p.player.nome)}
                  </td>
                  <td style={tdStyle}>
                    {p.teamName}
                  </td>
                  <td style={tdStyle}>
                    {p.media?.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card title="🧤 Top Portieri">
          <table style={tableStyle}>
            <tbody>
              {topPortieri.map((p, i) => (
                <tr key={p.player.id}>
                  <td style={tdStyle}>{i + 1}</td>
                  <td style={tdStyle}>
                    {formatFullName(p.player.nome)}
                  </td>
                  <td style={tdStyle}>
                    {p.teamName}
                  </td>
                  <td style={tdStyle}>
                    {p.cleanSheet}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card title="💣 Flop 10">
          <table style={tableStyle}>
            <tbody>
              {flop10.map((p, i) => (
                <tr key={p.player.id}>
                  <td style={tdStyle}>{i + 1}</td>
                  <td style={tdStyle}>
                    {formatFullName(p.player.nome)}
                  </td>
                  <td style={tdStyle}>
                    {p.teamName}
                  </td>
                  <td style={tdStyle}>
                    {p.fantamedia?.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      <Collapsible
        title="📋 Archivio Giocatori"
        defaultOpen
      >
        <div style={{ padding: 12 }}>
          <input
            value={search}
            
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Cerca giocatore..."
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: 12,
              border: "none",
              marginBottom: 12,
            }}
          />

          <div
  style={{
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    marginBottom: 12,
  }}
>
  <select
  value={teamFilter}
  onChange={(e) =>
    setTeamFilter(e.target.value)
  }
  style={{
    padding: "8px",
    borderRadius: 8,
  }}
>
  <option value="Tutte">
    Squadra
  </option>

  {teamNames
    .filter((t) => t !== "Tutte")
    .map((t) => (
      <option key={t} value={t}>
        {t}
      </option>
    ))}
</select>

  <select
  value={roleFilter}
  onChange={(e) =>
    setRoleFilter(e.target.value)
  }
  style={{
    padding: "8px",
    borderRadius: 8,
  }}
>
  <option value="Tutti">
    Ruolo
  </option>

  {roles
    .filter((r) => r !== "Tutti")
    .map((r) => (
      <option key={r} value={r}>
        {r}
      </option>
    ))}
</select>
</div>

          <div
            style={{
              overflowX: "auto",
            }}
          >
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th
  style={{ ...thStyle, cursor: "pointer" }}
  onClick={() => handleSort("nome")}
>
  Giocatore
</th>

<th
  style={{ ...thStyle, cursor: "pointer" }}
  onClick={() => handleSort("squadra")}
>
  Squadra
</th>

<th
  style={{ ...thStyle, cursor: "pointer" }}
  onClick={() => handleSort("ruolo")}
>
  Ruolo
</th>

<th
  style={{ ...thStyle, cursor: "pointer" }}
  onClick={() => handleSort("media")}
>
  Media
</th>

<th
  style={{ ...thStyle, cursor: "pointer" }}
  onClick={() => handleSort("fantamedia")}
>
  F.Media
</th>

<th
  style={{ ...thStyle, cursor: "pointer" }}
  onClick={() => handleSort("gol")}
>
  Gol
</th>

<th
  style={{ ...thStyle, cursor: "pointer" }}
  onClick={() => handleSort("assist")}
>
  Assist
</th>
                </tr>
              </thead>

              <tbody>
                {filteredPlayers.map((p) => (
                  <tr
                    key={p.player.id}
                    onClick={() =>
  setSelectedPlayerId(
    selectedPlayerId === p.player.id
      ? null
      : p.player.id
  )
}
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    <td style={tdStyle}>
                      {formatFullName(p.player.nome)}
                    </td>

                    <td style={tdStyle}>
                      {p.teamName}
                    </td>

                    <td style={tdStyle}>
                      {p.player.ruolo}
                    </td>

                    <td style={tdStyle}>
                      {p.media
                        ? p.media.toFixed(2)
                        : "-"}
                    </td>

                    <td style={tdStyle}>
                      {p.fantamedia
                        ? p.fantamedia.toFixed(
                            2
                          )
                        : "-"}
                    </td>

                    <td style={tdStyle}>
                      {p.gol}
                    </td>

                    <td style={tdStyle}>
                      {p.assist}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Collapsible>

      {selectedPlayer && (
        <Collapsible
          title={`📅 ${formatFullName(selectedPlayer.player.nome)}`}
          defaultOpen
        >
          <div
            style={{
              padding: 12,
              overflowX: "auto",
            }}
          >
            <table style={tableStyle}>
              <thead>
                <tr>
                  {Object.entries(
                    MATCHDAY_LABELS
                  ).map(([id, label]) => (
                    <th
                      key={id}
                      style={thStyle}
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                <tr>
                  {Object.keys(
                    MATCHDAY_LABELS
                  ).map((id) => (
                    <td
                      key={id}
                      style={tdStyle}
                    >
                      {selectedPlayer
                        .votesByDay[
                        Number(id)
                      ] ?? "-"}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </Collapsible>
      )}
    </div>
  </main>
);
}