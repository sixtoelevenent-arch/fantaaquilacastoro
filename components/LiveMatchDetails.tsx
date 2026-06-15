"use client";
// import { calculateTeam } from "@/lib/fantacalcio";
import { calculateTeam } from "@/lib/fantacalcio";
import { useEffect, useState } from "react";

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


export default function LiveMatchDetails({
  matchId,
  onUpdate,
}: {
  matchId: number;
  onUpdate?: (data: {
    homeFP: number;
    awayFP: number;
    homeGoals: number;
    awayGoals: number;
  }) => void;
}) {

const [loading, setLoading] = useState(true);

const [match, setMatch] = useState<MatchData | null>(null);

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
    console.log("MATCH ID", matchId);

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

console.log(homeRows?.[0]);

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
onUpdate?.({
  homeFP: homeCalc.fantapoints,
  awayFP: awayCalc.fantapoints,

  homeGoals: homeCalc.isFinal
    ? homeCalc.goals
    : homeCalc.projectedGoals,

  awayGoals: awayCalc.isFinal
    ? awayCalc.goals
    : awayCalc.projectedGoals,
});
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
  loadMatch();

  const interval = setInterval(() => {
    loadMatch();
  }, 30000);

  return () => clearInterval(interval);
}, [matchId]);

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

function roleStyle(role: string) {
  switch (role) {
    case "P":
      return {
        color: "#38bdf8",
        borderColor: "rgba(56,189,248,0.25)",
      };

    case "D":
      return {
        color: "#22c55e",
        borderColor: "rgba(34,197,94,0.25)",
      };

    case "C":
      return {
        color: "#facc15",
        borderColor: "rgba(250,204,21,0.25)",
      };

    case "A":
      return {
        color: "#ef4444",
        borderColor: "rgba(239,68,68,0.25)",
      };

    default:
      return {
        color: "#ffffff",
        borderColor: "rgba(255,255,255,0.1)",
      };
  }
}

  function renderTeam(
  title: string,
  owner: string,
  players: PlayerRow[],
  votes: number,
  bonus: number,
  fp: number
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

  let previousRole = "";
      
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
            marginBottom: 10,
          }}
        >
          {owner}
        </div>

        {titolari.map((player) => {

  const roleChanged =
    previousRole !== "" &&
    previousRole !== player.ruolo;

  previousRole = player.ruolo;

  const roleInfo = roleStyle(player.ruolo);

  return (
  <div
    key={`${player.nome}-${player.posizione}`}
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "6px 0",
      borderBottom:
        "1px solid rgba(255,255,255,0.05)",
    }}
  >

      {roleChanged && (
        <div
          style={{
            margin: "10px 0",
            borderTop: `2px solid ${roleInfo.borderColor}`,
          }}
        />
      )}

      <div
  style={{
    display: "flex",
    flex: 1,
    alignItems: "center",
  }}
>
  <span
    style={{
      width: 32,
      fontWeight: 800,
      fontSize: "1rem",
      color: roleInfo.color,
    }}
  >
    {player.ruolo}
  </span>

  <span
    style={{
      fontSize: "0.9rem",
      fontWeight: 600,
    }}
  >
    {livePlayerName(player.nome)}
  </span>
</div>
    <span
  style={{
    width: 32,
    textAlign: "center",
    color: "#94a3b8",
    fontSize: "0.9rem",
  }}
>
  {getNationalCode(player.nazionale)}
</span>

<span
  style={{
    width: 40,
    textAlign: "right",
    fontWeight: 700,
  }}
>
  {!player.hasVoteRow
    ? ""
    : player.voto === null
    ? "⏳"
    : player.sv
    ? "SV"
    : player.voto}
</span>

<span
  style={{
    width: 55,
    fontSize: "1.15rem",
    textAlign: "center",
    whiteSpace: "nowrap",
  }}
>
  {playerIcons(player)}
</span>

  </div>
);
})}

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
      background: "rgba(0,0,0,0.15)",
      padding: "6px 10px",
      borderRadius: 8,
      marginBottom: 4,
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

<div
  style={{
    marginTop: 12,
    paddingTop: 12,
    borderTop: "1px solid rgba(255,255,255,0.15)",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
    textAlign: "center",
    gap: 10,
  }}
>
  <div>
    <div
      style={{
        color: "#94a3b8",
        fontSize: "0.8rem",
      }}
    >
      Voti
    </div>

    <div
      style={{
        fontWeight: 800,
        fontSize: "1.3rem",
      }}
    >
      {votes.toFixed(1)}
    </div>
  </div>

  <div>
    <div
      style={{
        color: "#94a3b8",
        fontSize: "0.8rem",
      }}
    >
      Bonus/Malus
    </div>

    <div
      style={{
        fontWeight: 800,
        fontSize: "1.3rem",
        color: "#facc15",
      }}
    >
      {bonus.toFixed(1)}
    </div>
  </div>

  <div>
    <div
      style={{
        color: "#94a3b8",
        fontSize: "0.8rem",
      }}
    >
      Totale
    </div>

    <div
      style={{
        fontWeight: 900,
        fontSize: "1.5rem",
        color: "#22c55e",
      }}
    >
      {fp.toFixed(1)}
    </div>
  </div>
</div>

</Card>
    );
  }


if (loading) {
  return <div>Caricamento...</div>;
}

if (!match) {
  return null;
}

return (
<> 

<div

style={{
  display: "grid",
  gap: "10px",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(340px,1fr))",
}}
>

{renderTeam(

match.home_name,

match.home_owner,

homePlayers,

homeVotes,

homeBonus,

homeFP
)}

{renderTeam(

match.away_name,

match.away_owner,

awayPlayers,

awayVotes,

awayBonus,

awayFP

)}

</div>

<div style={{ marginTop: 25 }}>

        <Collapsible title="📖 Legenda">
          <div
  style={{
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
    textAlign: "center",
  }}
>
  <div>⚽ Gol</div>
  <div>🥅 Gol Subito</div>
  <div>✨ Clean Sheet</div>

  <div>🅰️ Assist</div>
  <div>🧤 Rig. Parato</div>
  <div> </div>

  <div>🟨 Giallo</div>
  <div>❌ Rig. Sbagliato</div>
  <div>🔴 Live</div>

  <div>🟥 Rosso</div>
  <div>💥 Autogol</div>
  <div>⏳ Attesa</div>  
  <div></div>
</div>
         </Collapsible>
</div>

</>
);
} 
        
