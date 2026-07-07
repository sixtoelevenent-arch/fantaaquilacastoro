import BackHome from "@/components/BackHome";
import { supabase } from "@/lib/supabase";
import MatchDetails from "@/components/MatchDetails";
import Collapsible from "@/components/Collapsible";

type TeamRow = {
  id: number;
  nome: string;
  proprietario: string;
  gruppo: string;
};

type MatchRow = {
  id: number;
  matchday_id: number;
  team_home_id: number;
  team_away_id: number;
  gol_home: number | null;
  gol_away: number | null;
  fp_home: number | null;
  fp_away: number | null;
  completata: boolean;
  stato: string | null;
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

function MatchCard({
  title,
  home,
  away,
  homeLabel,
  awayLabel,
  result,
  homeFP,
  awayFP,
}: {
  title: string;
  home: string;
  away: string;
  homeLabel?: string;
  awayLabel?: string;
  result?: string;
  homeFP?: number | null;
  awayFP?: number | null;
}) {

  return (
    <div
      style={{
        background: "#1f2937",
        border: "1px solid rgba(255,255,255,0.10)",
        borderRadius: 18,
        padding: 18,
        marginBottom: 16,
      }}
    >
      <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  }}
>
  <div
    style={{
      color: "#facc15",
      fontWeight: 800,
      fontSize: "1rem",
    }}
  >
    {title}
  </div>

 <div style={{ textAlign: "right" }}>
  {result && (
    <div
      style={{
        fontWeight: 800,
        fontSize: "1rem",
      }}
    >
      {result}
    </div>
  )}

  {homeFP != null && awayFP != null && (
    <div
      style={{
        color: "#94a3b8",
        fontSize: ".8rem",
        marginTop: 2,
      }}
    >
      ⭐ {homeFP.toFixed(1)} - {awayFP.toFixed(1)}
    </div>
  )}
</div>
</div>

      <div
        style={{
          padding: 14,
          borderRadius: 12,
          background: "rgba(255,255,255,0.04)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: "1.35rem",
            fontWeight: 800,
          }}
        >
          {home}
        </div>

        <div
          style={{
            color: "#94a3b8",
            fontSize: ".85rem",
            marginTop: 4,
          }}
        >
          {homeLabel && (
  <div
    style={{
      color: "#94a3b8",
      fontSize: ".85rem",
      marginTop: 4,
    }}
  >
    {homeLabel}
  </div>
)}
        </div>
      </div>

      <div
        style={{
          textAlign: "center",
          color: "#94a3b8",
          margin: "14px 0",
          fontWeight: 700,
        }}
      >
        VS
      </div>

      <div
        style={{
          padding: 14,
          borderRadius: 12,
          background: "rgba(255,255,255,0.04)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: "1.35rem",
            fontWeight: 800,
          }}
        >
          {away}
        </div>

        <div
          style={{
            color: "#94a3b8",
            fontSize: ".85rem",
            marginTop: 4,
          }}
        >
          {awayLabel && (
  <div
    style={{
      color: "#94a3b8",
      fontSize: ".85rem",
      marginTop: 4,
    }}
  >
    {awayLabel}
  </div>
)}
        </div>
      </div>
    </div>
  );
}

export default async function FaseFinalePage() {
  const { data: teams } = await supabase
    .from("teams")
    .select("*")
    .order("gruppo");

  const { data: matches } = await supabase
  .from("matches")
  .select("*")
  .in("matchday_id", [4, 5, 6, 7, 8])
  .order("matchday_id")
  .order("id");

function getTeam(id: number) {
  return teams?.find(
    (t: TeamRow) => t.id === id
  );
}

const quartiAndata =
(matches ?? []).filter(
  (m) => m.matchday_id === 4
);

const quartiRitorno =
(matches ?? []).filter(
  (m) => m.matchday_id === 7
);

const semifinaliAndata =
(matches ?? []).filter(
  (m) => m.matchday_id === 5
);

const semifinaliRitorno =
(matches ?? []).filter(
  (m) => m.matchday_id === 8
);

const finale =
(matches ?? []).find(
  (m) => m.matchday_id === 6
);
    return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom,#1e3a8a,#172554)",
        color: "white",
        padding: 20,
      }}
    >
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
        }}
      >
        <BackHome />

        <h1
          style={{
            textAlign: "center",
            fontSize:
              "clamp(2rem,6vw,3.5rem)",
            fontWeight: 800,
            marginTop: 10,
            marginBottom: 10,
          }}
        >
          ⚔️ Fase Finale
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#bfdbfe",
            marginBottom: 35,
          }}
        >
          Road to New York 🗽
        </p>

        <h2
  style={{
    color: "#facc15",
    marginBottom: 18,
  }}
>
  🏆 Quarti di Finale
</h2>

{quartiAndata.map((andata, i) => {

  const ritorno = quartiRitorno[i];

  const golHome =
    (andata.gol_home ?? 0) + (ritorno?.gol_away ?? 0);

  const golAway =
    (andata.gol_away ?? 0) + (ritorno?.gol_home ?? 0);

  const fpHome =
    (andata.fp_home ?? 0) + (ritorno?.fp_away ?? 0);

  const fpAway =
    (andata.fp_away ?? 0) + (ritorno?.fp_home ?? 0);

  return (

    <div
      key={andata.id}
      style={{
        background:"#1f2937",
        border:"1px solid rgba(255,255,255,.10)",
        borderRadius:18,
        padding:18,
        marginBottom:18,
      }}
    >

      <h3
  style={{
    color:"#facc15",
    marginBottom:12,
    textAlign:"center",
    lineHeight:1.3,
  }}
>
  🏆 Quarto {i + 1}
  <div
  style={{
    marginTop:8,
    fontSize:"1.05rem",
    color:"white",
    fontWeight:700,
  }}
>
  {getTeam(andata.team_home_id)?.nome} vs {getTeam(andata.team_away_id)?.nome}
</div>

<div
  style={{
    marginTop:10,
    color:"#cbd5e1",
    fontSize:".95rem",
    lineHeight:1.5,
    fontWeight:600,
  }}
>
  ⚽ Aggregato: {golHome} - {golAway}
  <br />
  ⭐ Tot. FP: {fpHome.toFixed(1)} - {fpAway.toFixed(1)}
</div>
</h3>

      <Collapsible title="📋 Andata">

        <MatchCard
          title="Andata"
          home={
            getTeam(andata.team_home_id)?.nome ?? "-"
          }
          away={
            getTeam(andata.team_away_id)?.nome ?? "-"
          }
          result={`${andata.gol_home}-${andata.gol_away}`}
          homeFP={andata.fp_home}
          awayFP={andata.fp_away}
        />

        <MatchDetails
          matchId={andata.id}
        />

      </Collapsible>

      {ritorno && (

      <Collapsible title="📋 Ritorno">

        <MatchCard
          title="Ritorno"
          home={
            getTeam(ritorno.team_home_id)?.nome ?? "-"
          }
          away={
            getTeam(ritorno.team_away_id)?.nome ?? "-"
          }
          result={
            ritorno.completata
            ? `${ritorno.gol_home}-${ritorno.gol_away}`
                        : undefined
          }
          homeFP={ritorno.fp_home}
          awayFP={ritorno.fp_away}
        />

        <MatchDetails
          matchId={ritorno.id}
        />

      </Collapsible>

      )}

    </div>

  );

})}
        <Collapsible title="🥇 Semifinali">

        {semifinaliAndata.map((andata,i)=>{

const ritorno=semifinaliRitorno[i];

const golHome =
  (andata.gol_home ?? 0) + (ritorno?.gol_away ?? 0);

const golAway =
  (andata.gol_away ?? 0) + (ritorno?.gol_home ?? 0);

const fpHome =
  (andata.fp_home ?? 0) + (ritorno?.fp_away ?? 0);

const fpAway =
  (andata.fp_away ?? 0) + (ritorno?.fp_home ?? 0);

return(

<div
key={andata.id}
style={{
background:"#1f2937",
border:"1px solid rgba(255,255,255,.10)",
borderRadius:18,
padding:18,
marginBottom:18,
}}
>

<h3
  style={{
    color:"#facc15",
    marginBottom:12,
    textAlign:"center",
    lineHeight:1.3,
  }}
>
  🥇 Semifinale {i + 1}

  <div
    style={{
      marginTop:8,
      fontSize:"1.05rem",
      color:"white",
      fontWeight:700,
    }}
  >
    {getTeam(andata.team_home_id)?.nome} vs {getTeam(andata.team_away_id)?.nome}
  </div>

  <div
    style={{
      marginTop:10,
      color:"#cbd5e1",
      fontSize:".95rem",
      lineHeight:1.5,
      fontWeight:600,
    }}
  >
    ⚽ Aggregato: {golHome} - {golAway}
    <br />
    ⭐ Tot. FP: {fpHome.toFixed(1)} - {fpAway.toFixed(1)}
  </div>

</h3>

<Collapsible title="📋 Andata">

<MatchCard
title="Andata"
home={getTeam(andata.team_home_id)?.nome??"-"}
away={getTeam(andata.team_away_id)?.nome??"-"}
result={
andata.completata
?`${andata.gol_home}-${andata.gol_away}`
:undefined
}
homeFP={andata.fp_home}
awayFP={andata.fp_away}
/>

<MatchDetails matchId={andata.id}/>

</Collapsible>

{ritorno&&(

<Collapsible title="📋 Ritorno">

<MatchCard
title="Ritorno"
home={getTeam(ritorno.team_home_id)?.nome??"-"}
away={getTeam(ritorno.team_away_id)?.nome??"-"}
result={
ritorno.completata
?`${ritorno.gol_home}-${ritorno.gol_away}`
:undefined
}
homeFP={ritorno.fp_home}
awayFP={ritorno.fp_away}
/>

<MatchDetails matchId={ritorno.id}/>

</Collapsible>

)}

</div>

);

})}
       
       </Collapsible>
       
        <h2
          style={{
            color: "#facc15",
            marginTop: 40,
            marginBottom: 18,
          }}
        >
          🏆 Finale
        </h2>

        <Collapsible title="📋 Finale">

  <MatchCard
    title="MetLife Stadium • New York"
    home={
      finale
        ? getTeam(finale.team_home_id)?.nome ?? "-"
        : "Vincente Semifinale 1"
    }
    away={
      finale
        ? getTeam(finale.team_away_id)?.nome ?? "-"
        : "Vincente Semifinale 2"
    }
    result={
      finale?.completata
        ? `${finale.gol_home}-${finale.gol_away}`
        : undefined
        }
  />

  {finale && (
    <MatchDetails matchId={finale.id} />
  )}

</Collapsible>

        <div
          style={{
            marginTop: 50,
            paddingTop: 20,
            borderTop:
              "1px solid rgba(255,255,255,0.15)",
            textAlign: "center",
            color: "#94a3b8",
            fontSize: 14,
          }}
        >
          FantAquilaCastoro 2026 • Road to New York 🗽
        </div>
      </div>
    </main>
  );
}