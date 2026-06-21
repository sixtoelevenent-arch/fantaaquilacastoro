"use client";
// import { calculateTeam } from "@/lib/fantacalcio";
import Link from "next/link";
import { calculateTeam } from "@/lib/fantacalcio";
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

  voto?: number | null;

  sv?: boolean;
  hasVoteRow?: boolean;
};

export default function LiveMatchPage() {
const params = useParams();

const [loading, setLoading] = useState(true);

const [match, setMatch] = useState<MatchData | null>(null);

const [otherMatches, setOtherMatches] = useState<any[]>([]);

const [homePlayers, setHomePlayers] = useState<PlayerRow[]>([]);
const [awayPlayers, setAwayPlayers] = useState<PlayerRow[]>([]);

const [homeVotes, setHomeVotes] = useState(0);

const [homeBonus, setHomeBonus] = useState(0);

const [homeFP, setHomeFP] = useState(0);

const [homeGoals, setHomeGoals] = useState(0);

const [awayVotes, setAwayVotes] = useState(0);

const [awayBonus, setAwayBonus] = useState(0);

const [awayFP, setAwayFP] = useState(0);

const [awayGoals, setAwayGoals] = useState(0);

const [homeProjectedGoals, setHomeProjectedGoals] =
  useState(0);

const [awayProjectedGoals, setAwayProjectedGoals] =
  useState(0);

  const [homeIsFinal, setHomeIsFinal] =
  useState(false);

const [awayIsFinal, setAwayIsFinal] =
  useState(false);


    async function loadMatch() {
    const matchId = Number(params.id);

    const { data: matchData, error: matchError } = await supabase
  .from("matches")
  .select("*")
  .eq("id", matchId)
  .single();

  // alert (ops!)
if (!matchData) {
  setLoading(false);
  return;
}

const { data: allMatches } = await supabase
  .from("matches")
  .select(`
    *,
    home:team_home_id(nome),
    away:team_away_id(nome)
  `)
  .eq("matchday_id", matchData.matchday_id)
  .order("id");

setOtherMatches(
  (allMatches || []).filter(
    (m) => m.id !== matchId
  )
);

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

    const { data: homeRows } = await supabase
  .from("formation_players")
  .select(`
    player_id,
    titolare,
    posizione,
    ordine_panchina,
    players!formation_players_player_id_fkey (
      nome,
      ruolo,
      nazionale
    )
  `)
  .eq("formation_id", homeFormation?.id);

  const { data: awayRows } = await supabase
  .from("formation_players")
  .select(`
    player_id,
    titolare,
    posizione,
    ordine_panchina,
    players!formation_players_player_id_fkey (
      nome,
      ruolo,
      nazionale
    )
  `)
  .eq("formation_id", awayFormation?.id);

    const { data: votes } = await supabase
  .from("player_votes")
  .select("*")
  .eq("matchday_id", matchData.matchday_id);

  const votesMap = new Map();

  
(votes || []).forEach((v) => {
  votesMap.set(v.player_id, v);
});

const normalize = (rows: any[]) =>
  (rows || []).map((r) => {

    const voteData = votesMap.get(r.player_id);

    return {

      player_id: r.player_id,

      nome: r.players?.nome ?? "",
      ruolo: r.players?.ruolo ?? "",
      nazionale: r.players?.nazionale ?? "",

      titolare: r.titolare,
      posizione: r.posizione,
      ordine_panchina: r.ordine_panchina,

      hasVoteRow: !!voteData,

      voto: voteData?.voto ?? null,
      sv: voteData?.sv ?? null,

      gol: voteData?.gol ?? 0,
      assist: voteData?.assist ?? 0,

      ammonizione:
        voteData?.ammonizione ?? false,

      espulsione:
        voteData?.espulsione ?? false,

      autogol:
        voteData?.autogol ?? 0,

      rigori_parati:
        voteData?.rigori_parati ?? 0,

      rigori_sbagliati:
        voteData?.rigori_sbagliati ?? 0,

      gol_subiti:
        voteData?.gol_subiti ?? 0,

      clean_sheet:
        voteData?.clean_sheet ?? false,
    };
  });

const homePlayersNorm = normalize(homeRows || []);
const awayPlayersNorm = normalize(awayRows || []);

const homeCalc = calculateTeam(
  homePlayersNorm.filter((p) => p.titolare),
  homePlayersNorm.filter((p) => !p.titolare),
  votesMap,
  false
);

const awayCalc = calculateTeam(
  awayPlayersNorm.filter((p) => p.titolare),
  awayPlayersNorm.filter((p) => !p.titolare),
  votesMap,
  false
);

setHomePlayers([
  ...homeCalc.players,
  ...homePlayersNorm.filter((p) => !p.titolare),
]);

setAwayPlayers([
  ...awayCalc.players,
  ...awayPlayersNorm.filter((p) => !p.titolare),
]);

setHomeVotes(homeCalc.votesTotal);
setHomeBonus(homeCalc.bonusTotal);
setHomeFP(homeCalc.fantapoints);
setHomeGoals(homeCalc.goals);
setHomeProjectedGoals(
  homeCalc.projectedGoals
);
setHomeIsFinal(homeCalc.isFinal)

setAwayVotes(awayCalc.votesTotal);
setAwayBonus(awayCalc.bonusTotal);
setAwayFP(awayCalc.fantapoints);
setAwayGoals(awayCalc.goals);
setAwayProjectedGoals(
  awayCalc.projectedGoals
);
setAwayIsFinal(awayCalc.isFinal);

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

function playerIcons(player: any) {
  let icons = "";

  icons += "⚽".repeat(player.gol || 0);
  icons += "🅰️".repeat(player.assist || 0);

  if (player.ammonizione) icons += "🟨";
  if (player.espulsione) icons += "🟥";

  icons += "🧤".repeat(player.rigori_parati || 0);
  icons += "❌".repeat(player.rigori_sbagliati || 0);

  icons += "🥅".repeat(player.gol_subiti || 0);
  icons += "💥".repeat(player.autogol || 0);

  if (
    player.ruolo === "P" &&
    player.clean_sheet
  ) {
    icons += "✨";
  }

  return icons;
}

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
      borderBottom: "1px solid rgba(255,255,255,0.06)",
    }}
  >

    <span>
      {player.ruolo} {livePlayerName(player.nome)}
    </span>

    <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: 8,
    minWidth: 70,
    justifyContent: "flex-end",
  }}

    >
      <span>{getNationalCode(player.nazionale)}</span>

  <strong>
  {!player.hasVoteRow
    ? ""
    : player.voto === null
      ? `⏳ ${playerIcons(player)}`
      : player.sv
        ? `SV ${playerIcons(player)}`
        : `${player.voto} ${playerIcons(player)}`}
</strong>


  </div>

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
                gap: 20,
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

<h1
  style={{
    textAlign: "center",
    color: "#ef4444",
    fontSize: "clamp(2.3rem, 7vw, 4rem)",
    fontWeight: "800",
    marginTop: "10px",
    marginBottom: "20px",
  }}
>
  🔴 LIVE GIORNATA
</h1>

<div
  style={{
    textAlign: "center",
    marginBottom: 30,
  }}
>
        <Card>
  <div
    style={{
      textAlign: "center",
      padding: "10px 0",
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "15px",
        gap: "10px",
      }}
    >
      <div style={{ flex: 1 }}>
        <div>{match.home_name}</div>

        <div
          style={{
            fontSize: "0.85rem",
            color: "#94a3b8",
            marginTop: "4px",
          }}
        >
          👤 {match.home_owner}
        </div>
      </div>

      <div
        style={{
          fontSize: "1.8rem",
          fontWeight: "800",
          minWidth: "90px",
        }}
      >
        <span
          style={{
            color: homeIsFinal
              ? "#22c55e"
              : "#facc15",
          }}
        >
          {homeIsFinal
            ? homeGoals
            : homeProjectedGoals}
        </span>

        {" - "}

        <span
          style={{
            color: awayIsFinal
              ? "#22c55e"
              : "#facc15",
          }}
        >
          {awayIsFinal
            ? awayGoals
            : awayProjectedGoals}
        </span>
      </div>

      <div style={{ flex: 1 }}>
        <div>{match.away_name}</div>

        <div
          style={{
            fontSize: "0.85rem",
            color: "#94a3b8",
            marginTop: "4px",
          }}
        >
          👤 {match.away_owner}
        </div>
      </div>
    </div>

    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "15px",
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
            fontWeight: "800",
          }}
        >
          {homeFP.toFixed(1)}
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
            fontWeight: "800",
          }}
        >
          {awayFP.toFixed(1)}
        </div>
      </div>
    </div>
  </div>
</Card>

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

<Card>
  <h2
    style={{
      textAlign: "center",
      marginTop: 0,
      marginBottom: 20,
    }}
  >
    🏆 Altre Partite
  </h2>

  {otherMatches.map((m) => (
    <Link
      key={m.id}
      href={`/live/${m.id}`}
      style={{
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 0",
          borderBottom:
            "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <span>{m.home?.nome}</span>

        <strong>
          {m.gol_home ?? 0} - {m.gol_away ?? 0}
        </strong>

        <span>{m.away?.nome}</span>
      </div>
    </Link>
  ))}
</Card>

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