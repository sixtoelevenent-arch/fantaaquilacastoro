"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import BackHome from "@/components/BackHome";
import Card from "@/components/Card";
import Collapsible from "@/components/Collapsible";

import { supabase } from "@/lib/supabase";
import { getNationalCode } from "@/lib/nationalCodes";
import { livePlayerName } from "@/lib/livePlayerName";

type MatchData = {
  id: number;
  gol_home: number | null;
  gol_away: number | null;
  fp_home: number | null;
  fp_away: number | null;

  home_name: string;
  away_name: string;

  home_owner: string;
  away_owner: string;

  team_home_id: number;
  team_away_id: number;
};

type PlayerRow = {
  nome: string;
  ruolo: string;
  nazionale: string;

  titolare: boolean;
  posizione: number | null;
  ordine_panchina: number | null;
};

export default function LiveMatchPage() {
  const params = useParams();

  const [loading, setLoading] = useState(true);

  const [match, setMatch] = useState<MatchData | null>(null);

  const [homePlayers, setHomePlayers] = useState<PlayerRow[]>([]);
  const [awayPlayers, setAwayPlayers] = useState<PlayerRow[]>([]);

  async function loadMatch() {
    const matchId = Number(params.id);
    console.log("MATCH ID", matchId);

    const { data: matchData, error: matchError } = await supabase
  .from("matches")
  .select("*")
  .eq("id", matchId)
  .single();

alert(
  JSON.stringify(
    {
      matchId,
      matchData,
      matchError,
    },
    null,
    2
  )
);

if (!matchData) {
  setLoading(false);
  return;
}

    const { data: homeTeam } = await supabase
      .from("teams")
      .select("id,nome,proprietario")
      .eq("id", matchData.team_home_id)
      .single();

    const { data: awayTeam } = await supabase
      .from("teams")
      .select("id,nome,proprietario")
      .eq("id", matchData.team_away_id)
      .single();

    const { data: homeFormation } = await supabase
      .from("formations")
      .select("id")
      .eq("team_id", matchData.team_home_id)
      .eq("matchday_id", matchData.matchday_id)
      .single();

    const { data: awayFormation } = await supabase
  .from("formations")
  .select("id")
  .eq("team_id", matchData.team_away_id)
  .eq("matchday_id", matchData.matchday_id)
  .single();

console.log("HOME FORMATION", homeFormation);
console.log("AWAY FORMATION", awayFormation);

    const { data: homeRows } = await supabase
  .from("formation_players")
  .select(`
    titolare,
    posizione,
    ordine_panchina,
    players (
      nome,
      ruolo,
      nazionale
    )
  `)
  .eq("formation_id", homeFormation?.id);

const { data: awayRows } = await supabase
  .from("formation_players")
  .select(`
    titolare,
    posizione,
    ordine_panchina,
    players (
      nome,
      ruolo,
      nazionale
    )
  `)
  .eq("formation_id", awayFormation?.id);

console.log("HOME ROWS", homeRows);
console.log("AWAY ROWS", awayRows);
      
console.log("AWAY ROWS", awayRows);
    console.log("HOME ROWS RAW", homeRows);
console.log("AWAY ROWS RAW", awayRows);

const normalize = (rows: any[]) =>
  (rows || []).map((r) => ({
    nome: r.players?.nome ?? "",
    ruolo: r.players?.ruolo ?? "",
    nazionale: r.players?.nazionale ?? "",

    titolare: r.titolare,
    posizione: r.posizione,
    ordine_panchina: r.ordine_panchina,
  }));

    setHomePlayers(normalize(homeRows || []));
    setAwayPlayers(normalize(awayRows || []));

    setMatch({
      id: matchData.id,

      gol_home: matchData.gol_home,
      gol_away: matchData.gol_away,

      fp_home: matchData.fp_home,
      fp_away: matchData.fp_away,

      team_home_id: matchData.team_home_id,
      team_away_id: matchData.team_away_id,

      home_name: homeTeam?.nome || "",
      away_name: awayTeam?.nome || "",

      home_owner: homeTeam?.proprietario || "",
      away_owner: awayTeam?.proprietario || "",
    });

    setLoading(false);
  }

  useEffect(() => {
    if (params?.id) {
      loadMatch();
    }
  }, [params]);

  function renderTeam(
    title: string,
    owner: string,
    players: PlayerRow[]
  ) {
    const titolari = players
      .filter((p) => p.titolare)
      .sort(
        (a, b) =>
          (a.posizione || 0) -
          (b.posizione || 0)
      );

    const panchina = players
      .filter((p) => !p.titolare)
      .sort(
        (a, b) =>
          (a.ordine_panchina || 0) -
          (b.ordine_panchina || 0)
      );

    return (
      <Card>
        <h2
          style={{
            marginTop: 0,
            textAlign: "center",
          }}
        >
          {title}
        </h2>

        <div
          style={{
            textAlign: "center",
            color: "#94a3b8",
            marginBottom: 20,
          }}
        >
          {owner}
        </div>

        {titolari.map((player) => (
          <div
            key={`${player.nome}-${player.posizione}`}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "7px 0",
              borderBottom:
                "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <span>
              {player.ruolo}{" "}
              {livePlayerName(player.nome)}
            </span>

            <strong>
              {getNationalCode(player.nazionale)}
            </strong>
          </div>
        ))}

        <Collapsible
          title={`📋 Panchina (${panchina.length})`}
        >
          {panchina.map((player, index) => (
            <div
              key={`${player.nome}-${index}`}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "6px 0",
              }}
            >
              <span>
                {index + 1}. {player.ruolo}{" "}
                {livePlayerName(player.nome)}
              </span>

              <strong>
                {getNationalCode(player.nazionale)}
              </strong>
            </div>
          ))}
        </Collapsible>
      </Card>
    );
  }

  if (loading) {
    return (
      <main style={{ padding: 20 }}>
        Caricamento...
      </main>
    );
  }

  if (!match) {
  return (
    <main style={{ padding: 20, color: "white" }}>
      <pre>
        {JSON.stringify(
          {
            params,
            homePlayers: homePlayers.length,
            awayPlayers: awayPlayers.length,
          },
          null,
          2
        )}
      </pre>
    </main>
  );
}

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "20px",
        background:
          "linear-gradient(to bottom, #020617 0%, #08122c 50%, #020617 100%)",
        color: "white",
      }}
    >
      <BackHome />

      <div
        style={{
          textAlign: "center",
          marginBottom: 30,
        }}
      >
        <h1>🔴 LIVE GIORNATA</h1>

        <h2>
          {match.home_name}{" "}
          {match.gol_home ?? 0}
          {" - "}
          {match.gol_away ?? 0}{" "}
          {match.away_name}
        </h2>

        <div
          style={{
            color: "#94a3b8",
            marginBottom: 10,
          }}
        >
          {match.home_owner} • {match.away_owner}
        </div>

        <div
          style={{
            fontWeight: 700,
          }}
        >
          FP {(match.fp_home ?? 0).toFixed(1)}
          {" - "}
          {(match.fp_away ?? 0).toFixed(1)}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gap: "20px",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(340px,1fr))",
        }}
      >
        {renderTeam(
          match.home_name,
          match.home_owner,
          homePlayers
        )}

        {renderTeam(
          match.away_name,
          match.away_owner,
          awayPlayers
        )}
      </div>

      <div style={{ marginTop: 25 }}>
        <Collapsible title="📖 Legenda">
          <div>🔴 Partita in corso</div>
          <div>⏳ Voti non ancora importati</div>

          <br />

          <div>⚽ Gol</div>
          <div>🅰️ Assist</div>
          <div>🟨 Ammonizione</div>
          <div>🟥 Espulsione</div>
          <div>🧤 Rigore parato</div>
          <div>❌ Rigore sbagliato</div>
          <div>🥅 Gol subito</div>
          <div>💥 Autogol</div>
          <div>✨ Clean Sheet</div>
        </Collapsible>
      </div>
    </main>
  );
}