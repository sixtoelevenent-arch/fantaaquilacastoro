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
  matchday_id: number;

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
  player_id?: number;

  nome: string;
  ruolo: string;
  nazionale: string;

  titolare: boolean;

  posizione: number | null;
  ordine_panchina: number | null;

  voto?: number | null;

  sv?: boolean;

  hasVoteRow?: boolean;

  nationalExists?: boolean;
  nationalFinalized?: boolean;

  replacementPlayer?: PlayerRow;
  replacedBy?: number;

  gol?: number;
  assist?: number;
  ammonizione?: boolean;
  espulsione?: boolean;
  autogol?: number;
  rigori_parati?: number;
  rigori_sbagliati?: number;
  gol_subiti?: number;
  clean_sheet?: boolean;
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
  isFinal: boolean;
  homeFinal: boolean;
  awayFinal: boolean;
}) => void;

}) {

const [loading, setLoading] = useState(true);

const [match, setMatch] = useState<MatchData | null>(null);

const [homePlayers, setHomePlayers] = useState<PlayerRow[]>([]);
const [awayPlayers, setAwayPlayers] = useState<PlayerRow[]>([]);

const [homeVotes, setHomeVotes] = useState(0);

const [homeBonus, setHomeBonus] = useState(0);

const [homeFP, setHomeFP] = useState(0);

const [awayVotes, setAwayVotes] = useState(0);

const [awayBonus, setAwayBonus] = useState(0);

const [awayFP, setAwayFP] = useState(0);

const [homeUpdatedAt, setHomeUpdatedAt] =
  useState("");

const [awayUpdatedAt, setAwayUpdatedAt] =
  useState("");

    async function loadMatch() {
   
    const { data: matchData } = await supabase
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

  const { data: homeCreated } = await supabase
  .from("formation_players")
  .select("created_at")
  .eq("formation_id", homeFormation?.id)
  .order("created_at", { ascending: false })
  .limit(1);

const { data: awayCreated } = await supabase
  .from("formation_players")
  .select("created_at")
  .eq("formation_id", awayFormation?.id)
  .order("created_at", { ascending: false })
  .limit(1);

  setHomeUpdatedAt(
  homeCreated?.[0]?.created_at || ""
);

setAwayUpdatedAt(
  awayCreated?.[0]?.created_at || ""
);

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
  .eq("formation_id", homeFormation?.id)
  .order("titolare", { ascending: false })
  .order("posizione", { ascending: true })
  .order("ordine_panchina", { ascending: true });

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
  .eq("formation_id", awayFormation?.id)
  .order("titolare", { ascending: false })
  .order("posizione", { ascending: true })
  .order("ordine_panchina", { ascending: true });

    const { data: votes } = await supabase
  .from("player_votes")
  .select("*")
  .eq("matchday_id", matchData.matchday_id);

const playerIds = (votes || []).map(
  (v: any) => v.player_id
);

const { data: loadedPlayers } =
  await supabase
    .from("players")
    .select("id,nazionale")
    .in("id", playerIds);
 
  const votesMap = new Map();

(votes || []).forEach((v: any) => {
  votesMap.set(v.player_id, v);
});

const nationalExists = new Set<string>();
const nationalFinalized = new Set<string>();

(votes || []).forEach((v: any) => {
  const player = (loadedPlayers || []).find(
    (p: any) => p.id === v.player_id
  );

  const nation = player?.nazionale
    ?.trim()
    ?.toUpperCase();

  if (!nation) return;

  nationalExists.add(nation);

  if (
    v.voto !== null ||
    v.sv === true
  ) {
    nationalFinalized.add(nation);
  }
});

const normalize = (rows: any[]) =>
  (rows || []).map((r) => {

    const voteData = votesMap.get(r.player_id);

    const nation =
  (r.players?.nazionale || "")
    .trim()
    .toUpperCase();

const exists =
  nationalExists.has(nation);

const finalized =
  nationalFinalized.has(nation);

      return {

      player_id: r.player_id,

      nome: r.players?.nome ?? "",
      ruolo: r.players?.ruolo ?? "",
      nazionale: r.players?.nazionale ?? "",

      titolare: r.titolare,
      posizione: r.posizione,
      ordine_panchina: r.ordine_panchina,

      hasVoteRow: !!voteData,

      nationalExists: exists,
nationalFinalized: finalized,

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
  homePlayersNorm
    .filter((p) => p.titolare)
    .sort((a, b) => (a.posizione || 99) - (b.posizione || 99)),

  homePlayersNorm
    .filter((p) => !p.titolare)
    .sort(
      (a, b) =>
        (a.ordine_panchina || 999) -
        (b.ordine_panchina || 999)
    ),

  votesMap,
  false
);

const awayCalc = calculateTeam(
  awayPlayersNorm
    .filter((p) => p.titolare)
    .sort((a, b) => (a.posizione || 99) - (b.posizione || 99)),

  awayPlayersNorm
    .filter((p) => !p.titolare)
    .sort(
      (a, b) =>
        (a.ordine_panchina || 999) -
        (b.ordine_panchina || 999)
    ),

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

setAwayVotes(awayCalc.votesTotal);
setAwayBonus(awayCalc.bonusTotal);
setAwayFP(awayCalc.fantapoints);

const finalHomeGoals = homeCalc.isFinal
  ? homeCalc.goals
  : homeCalc.projectedGoals;

const finalAwayGoals = awayCalc.isFinal
  ? awayCalc.goals
  : awayCalc.projectedGoals;

const finalCompleted =
  homeCalc.isFinal &&
  awayCalc.isFinal;


/*
await supabase
  .from("live_matches")
  .update({
    fp_home: homeCalc.fantapoints,
    fp_away: awayCalc.fantapoints,

    gol_home: homeCalc.isFinal
      ? homeCalc.goals
      : homeCalc.projectedGoals,

    gol_away: homeCalc.isFinal
      ? awayCalc.goals
      : awayCalc.projectedGoals,

    completata:
      homeCalc.isFinal &&
      awayCalc.isFinal,

    live_updated_at:
      new Date().toISOString(),
  })
  .eq("id", matchId);
*/

if (onUpdate) {
  onUpdate({
    homeFP: homeCalc.fantapoints,
    awayFP: awayCalc.fantapoints,

    homeGoals: finalHomeGoals,
    awayGoals: finalAwayGoals,

    homeFinal: homeCalc.isFinal,
    awayFinal: awayCalc.isFinal,

    isFinal: finalCompleted,
  });
}

    setMatch({
  id: matchData.id,
  matchday_id: matchData.matchday_id,

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
  fp: number,
  updatedAt: string
)
 {

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
        
 <div
  style={{
    minWidth: 0,
    width: "100%",
    flex: 1,
  }}
>

  <Card highlight={false}>
        
        {titolari.map((player) => {

    const roleInfo = roleStyle(player.ruolo);
  
  const replacementRoleInfo =
  player.replacementPlayer
    ? roleStyle(player.replacementPlayer.ruolo)
    : roleInfo;

    return (
  <div
    key={`${player.nome}-${player.posizione}`}
  >
    <div
  style={{
    display: "flex",
    alignItems: "flex-start",
    padding: "4px 4px",
    borderBottom:
      "1px solid rgba(255,255,255,0.05)",
  }}
>
  <span
  style={{
    width: 18,
    fontWeight: 800,
    fontSize: "1rem",
    color: roleInfo.color,
    flexShrink: 0,
    marginRight: 4,
  }}
>
    {player.ruolo}
  </span>

<div
  style={{
    flex: 1,
    minWidth: 0,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  }}
>
  <div
    style={{
      flex: 1,
      minWidth: 0,
    }}
  >
    <div
      style={{
        fontSize: "0.95rem",
fontWeight: 700,
whiteSpace: "nowrap",
overflow: "hidden",
textOverflow: "ellipsis",
      }}
    >
      {livePlayerName(player.nome)}
    </div>

    <div
  style={{
    marginTop: 2,
    fontSize: "0.85rem",
    color: "#94a3b8",
    display: "flex",
    alignItems: "center",
  }}
>
  <span>
    {getNationalCode(player.nazionale)}
  </span>

  <span
    style={{
      marginLeft: "auto",
      paddingRight: 0,
    }}
  >
    {playerIcons(player)}
  </span>
</div>

  </div>

  <div
  style={{
    width: 42,
    textAlign: "center",
    fontWeight: 800,
    fontSize: "0.95rem",
    flexShrink: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }}
>

    {!player.hasVoteRow
      ? player.nationalFinalized
        ? "SV"
        : player.nationalExists
        ? "⏳"
        : ""
      : player.sv
      ? "SV"
      : player.voto === null
      ? "⏳"
      : player.voto}
  </div>
</div>
</div>
      {player.replacementPlayer && (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      paddingBottom: 8,
    }}
  >
    <div
  style={{
    width: 18,
    marginRight: 4,
    flexShrink: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }}
>
  <span
    style={{
      color: replacementRoleInfo.color,
      fontWeight: 900,
      fontSize: "1rem",
      lineHeight: 1,
    }}
  >
    ↪
  </span>
</div>

    <div
      style={{
        flex: 1,
        minWidth: 0,
      }}
    >
      <div
  style={{
    fontSize: "0.95rem",
    fontWeight: 700,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  }}
>
  {livePlayerName(
    player.replacementPlayer.nome
  )}
</div>

      <div
        style={{
          marginTop: 2,
          fontSize: "0.85rem",
          color: "#94a3b8",
          display: "flex",
          alignItems: "center",
        }}
      >
        <span>
          {getNationalCode(
            player.replacementPlayer.nazionale
          )}
        </span>

        <span
          style={{
            marginLeft: "auto",
fontSize: "0.90rem",
letterSpacing: "2px",
          }}
        >
          {playerIcons(
            player.replacementPlayer
          )}
        </span>
      </div>
    </div>

    <div
  style={{
    width: 42,
    fontSize: "1rem",
    fontWeight: 800,
    flexShrink: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }}
>
  
      {!player.replacementPlayer.hasVoteRow
        ? player.replacementPlayer.nationalFinalized
          ? "SV"
          : player.replacementPlayer.nationalExists
          ? "⏳"
          : ""
        : player.replacementPlayer.sv
        ? "SV"
        : player.replacementPlayer.voto === null
        ? "⏳"
        : player.replacementPlayer.voto}
    </div>
  </div>
)}


  </div>

);

})}

        <Collapsible
  title={`📋 Panchina (${panchina.length})`}
>
  <div
    style={{
      marginLeft: 0,
      marginRight: 0,
    }}
  >
    {panchina.map((player, index) => (
    <div
  key={`${player.nome}-${index}`}
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    padding: "1px 0",
    fontSize: "0.84rem",
    color: "#cbd5e1",
    whiteSpace: "nowrap",
  }}
>
      <span
  style={{
    color: "#94a3b8",
    marginRight: 4,
  }}
>
  {index + 1}.
</span>

      <span
  style={{
    fontWeight: 800,
    color: roleStyle(player.ruolo).color,
    marginRight: 4,
  }}
>
  {player.ruolo}
</span>

      <div
  style={{
    display: "flex",
    alignItems: "center",
    flex: 1,
    minWidth: 0,
  }}
>
  <span
    style={{
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    }}
  >
    {livePlayerName(player.nome)}
  </span>

  <span
    style={{
      marginLeft: "auto",
      color: "#94a3b8",
      flexShrink: 0,
    }}
  >
    {getNationalCode(player.nazionale)}
  </span>
</div>

    </div>
  ))}
  </div>
</Collapsible>

{updatedAt && (
  <div
    style={{
      textAlign: "center",
      color: "#94a3b8",
      fontSize: "0.72rem",
      marginTop: 8,
      marginBottom: 8,
    }}
  >
    🕒 Ultimo inserimento

    <div
      style={{
        marginTop: 2,
      }}
    >
      {new Date(updatedAt)
        .toLocaleString("it-IT")}
    </div>

    {match?.matchday_id === 2 &&
      new Date(updatedAt) >=
        new Date("2026-06-18T18:00:00Z") && (
      <div
        style={{
          marginTop: 2,
          color: "#facc15",
          fontWeight: 700,
        }}
      >
        Inserita da admin
      </div>
    )}
  </div>
)}

<div
  style={{
    marginTop: "auto",
    paddingTop: 10,
    borderTop: "1px solid rgba(255,255,255,0.15)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexShrink: 0,
  }}
>
  
  <div
    style={{
      width: "50%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 0,
      fontSize: "0.95rem",
      fontWeight: 700,
    }}
  >
    <div>
      Voti {votes.toFixed(1)}
    </div>

    <div
      style={{
        color: "#facc15",
      }}
    >
      B {bonus >= 0 ? "+" : ""}
      {bonus.toFixed(1)}
    </div>
  </div>

  <div
    style={{
      minWidth: 78,
      height: 58,
      borderRadius: 14,
      background:
        "rgba(34,197,94,0.12)",
      border:
        "1px solid rgba(34,197,94,0.35)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#22c55e",
      fontWeight: 900,
      fontSize: "1.4rem",
    }}
  >
    {fp.toFixed(1)}
  </div>
</div>
  
  </Card>
</div>
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
    gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)",
    gap: 8,
    width: "100%",
    boxSizing: "border-box",
  }}
>

{renderTeam(
  match.home_name,
  match.home_owner,
  homePlayers,
  homeVotes,
  homeBonus,
  homeFP,
  homeUpdatedAt
)}

{renderTeam(
  match.away_name,
  match.away_owner,
  awayPlayers,
  awayVotes,
  awayBonus,
  awayFP,
  awayUpdatedAt
)}

</div>

<div style={{ marginTop: 25 }}>

        <Collapsible title="📖 Legenda">
          <div
  style={{
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 0,
    width: "100%",
    boxSizing: "border-box",
  }}
>
  
  <div>⚽ Gol</div>
  <div>✨ Clean Sheet</div>
  <div>🅰️ Assist</div>
  <div>🧤 Rig. Parato</div>
  <div>🟨 Giallo</div>
  <div>❌ Rig. Sbagliato</div>
  <div>🟥 Rosso</div>
  <div></div>
  <div>🥅 Gol Subito</div>
  <div>🔴 Live</div>
  <div>💥 Autogol</div>
  <div>⏳ Attesa</div>
 
    
  <div></div>
</div>
         </Collapsible>
</div>

</>
);
} 
        
