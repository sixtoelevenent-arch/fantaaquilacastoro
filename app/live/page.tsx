"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import LiveMatchDetails from "@/components/LiveMatchDetails";
import BackHome from "@/components/BackHome";
import Card from "@/components/Card";
import { calculateMatchLive } from "@/lib/calculateMatchLive";
import { getVisibleMatchday } from "@/lib/getVisibleMatchday";
export default function LivePage() {
  const [openMatchId, setOpenMatchId] =
  useState<number | null>(null);

  
  const [matches, setMatches] = useState<any[]>([]);
  
  const [modules, setModules] = useState<
  Record<
    number,
    {
      home: string;
      away: string;
    }
  >
>({});

  const [matchdayName, setMatchdayName] =
  useState<string | null>(null);

  const [preLive, setPreLive] =
  useState(false);

const [countdown, setCountdown] =
  useState("");

const [liveData, setLiveData] = useState<
  Record<
    number,
    {
  homeFP: number;
  awayFP: number;

  homeGoals: number;
  awayGoals: number;

  homeFinal: boolean;
  awayFinal: boolean;

  isFinal: boolean;
}
  >
>({});

const giornataTerminata =
  matches.length > 0 &&
  Object.values(liveData).length > 0 &&
  Object.values(liveData).every(
    (m) => m.isFinal
  );

  const bannerImages: Record<string, string> = {
  "Giornata 1": "/images/pasquale-banner.png",
  "Giornata 2": "/images/banner-g2.png",
  "Giornata 3": "/images/banner-g3.png",
  "Quarti Andata": "/images/banner-qf1.png",
  "Quarti Ritorno": "/images/banner-qf2.png",
  "Semifinali Andata": "/images/banner-sf1.png",
  "Semifinali Ritorno": "/images/banner-sf2.png",
  "Finale": "/images/banner-finale.png",
};

const currentBanner =
  matchdayName
    ? bannerImages[matchdayName] ||
      "/images/pasquale-banner.png"
    : null;

useEffect(() => {

  loadMatches();

  const interval = setInterval(() => {
    loadMatches();
  }, 30000);

  return () => clearInterval(interval);

}, []);

useEffect(() => {
  if (!preLive) return;

  let interval: NodeJS.Timeout;

  const startCountdown = async () => {
    const { data } = await supabase
      .from("matchdays")
      .select("chiusura_formazioni")
      .eq("nome", matchdayName)
      .single();

    if (!data?.chiusura_formazioni) return;

    interval = setInterval(() => {
      const diff =
        new Date(data.chiusura_formazioni).getTime() -
        Date.now();

      if (diff <= 0) {
  setPreLive(false);
  setCountdown("00:00:00");
  return;
}

      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);

      setCountdown(
        `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
      );
    }, 1000);
  };

  startCountdown();

  return () => {
    if (interval) clearInterval(interval);
  };
}, [preLive, matchdayName]);

  async function loadMatches() {

  const activeMatchday =
  await getVisibleMatchday();

  if (!activeMatchday) {
    setMatches([]);
    return;
  }

  let matchdaysToLoad = [activeMatchday.id];

if (activeMatchday.id === 7) {
  matchdaysToLoad = [4, 7];
}

if (activeMatchday.id === 8) {
  matchdaysToLoad = [5, 8];
}

  setMatchdayName(
    activeMatchday.nome || ""
  );

  setPreLive(
  activeMatchday.preLive || false
);

  const { data } = await supabase
    .from("matches")
    .select(`
      *,
      home:team_home_id (
        id,
        nome,
        proprietario
      ),
      away:team_away_id (
        id,
        nome,
        proprietario
      )
    `)
    .in("matchday_id", matchdaysToLoad)
    .order("id");

  const live: any = {};

for (const match of data || []) {

  const result =
    await calculateMatchLive(match.id);

  if (result) {
    live[match.id] = result;
  }
}

setLiveData(live);

setMatches(data || []);

const newModules: Record<
  number,
  {
    home: string;
    away: string;
  }
> = {};

for (const match of data || []) {

  const { data: homeFormation } =
    await supabase
      .from("formations")
      .select("modulo")
      .eq("team_id", match.team_home_id)
      .eq("matchday_id", match.matchday_id)
      .single();

  const { data: awayFormation } =
    await supabase
      .from("formations")
      .select("modulo")
      .eq("team_id", match.team_away_id)
      .eq("matchday_id", match.matchday_id)
      .single();

  newModules[match.id] = {
    home: homeFormation?.modulo || "-",
    away: awayFormation?.modulo || "-",
  };
}

setModules(newModules);

  }
  

return (
    <main
      style={{
        minHeight: "100vh",
        background:
  matchdayName?.includes("Quarti") ||
  matchdayName?.includes("Semifinali") ||
  matchdayName === "Finale"
    ? "linear-gradient(to bottom,#1e3a8a,#172554)"
    : "linear-gradient(to bottom,#450a0a,#1f0808)",
        color: "white",
        padding: "12px",
      }}
    >
      <div
  style={{
    maxWidth: "1600px",
    width: "100%",
    margin: "0 auto",
  }}
>
        <BackHome />

        <h1
  style={{
    color: "#ef4444",
    fontSize: "clamp(2rem, 5vw, 3.2rem)",
    fontWeight: "800",
    marginTop: "10px",
    marginBottom: "10px",
    textAlign: "center",
  }}
>
  {
    matchdayName?.includes("Quarti") ||
    matchdayName?.includes("Semifinali") ||
    matchdayName === "Finale"
      ? "🔴 LIVE FASE FINALE"
      : "🔴 LIVE GIORNATA"
  }
</h1>


  <div
  style={{
    textAlign: "center",
    color: "#facc15",
    fontWeight: 800,
    fontSize: "1.1rem",
    marginBottom: 8,
  }}
>
  ⚽ {matchdayName}

  {
  (matchdayName?.includes("Quarti") ||
    matchdayName?.includes("Semifinali") ||
    matchdayName === "Finale") && (
    <div
      style={{
        color: "#94a3b8",
        fontSize: ".9rem",
        marginTop: 4,
      }}
    >
      Road to New York 🗽
    </div>
  )
}
  {matchdayName === "Quarti Andata" && (
    <div
      style={{
        color: "#fde68a",
        marginTop: 6,
        fontSize: ".9rem",
        fontWeight: 700,
      }}
    >
      🏆 QUARTI DI FINALE • ANDATA
    </div>
  )}

  {matchdayName === "Quarti Ritorno" && (
    <div
      style={{
        color: "#fde68a",
        marginTop: 6,
        fontSize: ".9rem",
        fontWeight: 700,
      }}
    >
      🏆 QUARTI DI FINALE • RITORNO
    </div>
  )}

  {matchdayName === "Semifinali Andata" && (
    <div
      style={{
        color: "#fde68a",
        marginTop: 6,
        fontSize: ".9rem",
        fontWeight: 700,
      }}
    >
      🥇 SEMIFINALI • ANDATA
    </div>
  )}

  {matchdayName === "Semifinali Ritorno" && (
    <div
      style={{
        color: "#fde68a",
        marginTop: 6,
        fontSize: ".9rem",
        fontWeight: 700,
      }}
    >
      🥇 SEMIFINALI • RITORNO
    </div>
  )}

  {matchdayName === "Finale" && (
    <div
      style={{
        color: "#fde68a",
        marginTop: 6,
        fontSize: ".9rem",
        fontWeight: 700,
      }}
    >
      🏆 FINALE
    </div>
  )}
</div>


        <p
          style={{
            textAlign: "center",
            color: "#fecaca",
            marginBottom: "12px",
            fontSize: "1.05rem",
          }}
        >
          Aggiornamenti in tempo reale
        </p>

        <div
          style={{
            textAlign: "center",
            marginBottom: "35px",
          }}
        >
 {preLive && countdown !== "00:00:00" ? (

  <div
    style={{
      textAlign: "center",
    }}
  >
    <div
      style={{
        color: "#facc15",
        fontWeight: 800,
        fontSize: "1rem",
        marginBottom: 6,
      }}
    >
      ⏳ Chiusura inserimento formazioni
    </div>

    <div
      style={{
        fontSize: "2rem",
        fontWeight: 900,
        color: "#22c55e",
      }}
    >
      {countdown}
    </div>
  </div>

) : giornataTerminata ? (

  <div
    style={{
      display: "flex",
      justifyContent: "center",
    }}
  >
    <span
      style={{
        padding: "8px 18px",
        background: "#166534",
        borderRadius: 999,
        color: "white",
        fontWeight: 700,
      }}
    >
      ✅ Giornata terminata
    </span>
  </div>

) : (

  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: 8,
    }}
  >
    <span
      style={{
        padding: "8px 14px",
        background: "#7f1d1d",
        borderRadius: 999,
        color: "#fecaca",
        fontSize: "0.9rem",
        fontWeight: 600,
      }}
    >
      ⏱️ Giornata in corso
    </span>

    <span
      style={{
        padding: "8px 10px",
        background: "#dc2626",
        borderRadius: 999,
        color: "white",
        fontSize: "0.8rem",
        fontWeight: 700,
      }}
    >
      LIVE
    </span>
  </div>

)}

<div
  style={{
    display: "flex",
    justifyContent: "center",
    gap: 18,
    marginTop: 10,
    fontSize: "0.8rem",
    color: "#fecaca",
  }}
>
  <span>
    <span style={{ color: "#facc15" }}>●</span> Gol previsti
  </span>

  <span>
    <span style={{ color: "#22c55e" }}>●</span> Gol finali
  </span>
</div>
          
        </div>   {/* chiusura del blocco LIVE */}

{matches.length === 0 && currentBanner && (
  <Card highlight={false}>
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      paddingTop: 0,
      marginTop: -15,
    }}
  >
    <img
      src={currentBanner}
      alt="Pasquale l'Aquila Reale"
      style={{
        width: "85%",
        maxWidth: "520px",
        borderRadius: 16,
      }}
    />
  </div>
</Card>

)}

{matches.map((match, index) => {
let aggGoalsHome = liveData[match.id]?.homeGoals ?? 0;
let aggGoalsAway = liveData[match.id]?.awayGoals ?? 0;

let aggFPHome = liveData[match.id]?.homeFP ?? 0;
let aggFPAway = liveData[match.id]?.awayFP ?? 0;

if (matchdayName === "Quarti Ritorno") {

  const andata = matches.find(
    (m) =>
      m.matchday_id === 4 &&
      m.team_home_id === match.team_away_id &&
      m.team_away_id === match.team_home_id
  );

  if (andata && liveData[andata.id]) {
    aggGoalsHome =
      liveData[andata.id].awayGoals +
      liveData[match.id].homeGoals;

    aggGoalsAway =
      liveData[andata.id].homeGoals +
      liveData[match.id].awayGoals;

    aggFPHome =
      liveData[andata.id].awayFP +
      liveData[match.id].homeFP;

    aggFPAway =
      liveData[andata.id].homeFP +
      liveData[match.id].awayFP;
  }
}

if (matchdayName === "Semifinali Ritorno") {

  const andata = matches.find(
    (m) =>
      m.matchday_id === 5 &&
      m.team_home_id === match.team_away_id &&
      m.team_away_id === match.team_home_id
  );

  if (andata && liveData[andata.id]) {
    aggGoalsHome =
      liveData[andata.id].awayGoals +
      liveData[match.id].homeGoals;

    aggGoalsAway =
      liveData[andata.id].homeGoals +
      liveData[match.id].awayGoals;

    aggFPHome =
      liveData[andata.id].awayFP +
      liveData[match.id].homeFP;

    aggFPAway =
      liveData[andata.id].homeFP +
      liveData[match.id].awayFP;
  }
}
  return (
    <Card

  key={match.id}

  highlight={openMatchId === match.id}

  onClick={() => {
   setOpenMatchId(
    openMatchId === match.id
      ? null
      : match.id
  );
}}
>

  <div
    style={{
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  }}
>
  
    <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  }}
>
  <div
  style={{
    padding: "4px 14px",
    background: "#854d0e",
    borderRadius: 999,
    fontSize: "0.8rem",
    fontWeight: 700,
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    whiteSpace: "nowrap",
  }}
>
       {matchdayName === "Quarti Andata"
  ? "▼"
  : openMatchId === match.id
  ? "▼"
  : "▶"}{" "}
{
  matchdayName === "Quarti Andata" ||
  matchdayName === "Quarti Ritorno"
    ? `🏆 QUARTO ${index + 1}`
    : matchdayName === "Semifinali Andata" ||
      matchdayName === "Semifinali Ritorno"
    ? `🥇 SEMIFINALE ${index + 1}`
    : matchdayName === "Finale"
    ? "🏆 FINALE"
    : `🏆 GIRONE ${match.gruppo}`
}
  </div>
</div>
</div>
          <div
  style={{
    textAlign: "center",
    padding: "4px 0",
  }}
>
        <div
  style={{
    display: "grid",
    gridTemplateColumns: "1fr auto 1fr",
    alignItems: "center",
    gap: 12,
    marginBottom: 0,
  }}
>    
    
    <div
  style={{
    textAlign: "center",
    minWidth: 0,
  }}
>

<div 
  style={{
  fontWeight: 700,
  fontSize: "1.50rem",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
}}
>
     {match.home?.nome}
     </div>

<div
  style={{
    color: "#facc15",
    fontWeight: 800,
    fontSize: "0.95rem",
    marginBottom: 4,
  }}
>
  {modules[match.id]?.home}
</div>

      <div
        style={{
          color: "#94a3b8",
          fontSize: "0.8rem",
        }}
      >
        {match.home?.proprietario}
      </div>
    </div>

    <div
  style={{
    padding: "0 10px",
    textAlign: "center",
  }}
>
      
      {(matchdayName === "Quarti Ritorno" ||
  matchdayName === "Semifinali Ritorno") && (

  <div
    style={{
      marginBottom: 8,
      textAlign: "center",
      color: "#cbd5e1",
      fontSize: ".82rem",
      fontWeight: 700,
      lineHeight: 1.4,
    }}
  >
    ⚽ Agg. {aggGoalsHome} - {aggGoalsAway}
    <br />
    ⭐ {aggFPHome.toFixed(1)} - {aggFPAway.toFixed(1)}
  </div>

)}

<div
  style={{
    fontSize: "2.5rem",
    fontWeight: 900,
    lineHeight: 1,
  }}
>
  <span
  style={{
    color: liveData[match.id]?.homeFinal
      ? "#22c55e"
      : "#facc15",
  }}
>
  {liveData[match.id]?.homeGoals ?? 0}
</span>

  {" - "}

  <span
  style={{
    color: liveData[match.id]?.awayFinal
      ? "#22c55e"
      : "#facc15",
  }}
>
  {liveData[match.id]?.awayGoals ?? 0}
</span>
</div>

    </div>

    <div
  style={{
    textAlign: "center",
    minWidth: 0,
  }}
>
      <div
        style={{
  fontWeight: 700,
  fontSize: "1.50rem",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
}}
      >
        {match.away?.nome}
      </div>

<div
  style={{
    color: "#facc15",
    fontWeight: 800,
    fontSize: "0.95rem",
    marginBottom: 4,
  }}
>
  {modules[match.id]?.away}
</div>

      <div
        style={{
          color: "#94a3b8",
          fontSize: "0.8rem",
        }}
      >
        {match.away?.proprietario}
      </div>
    </div>
  </div>

</div>
                        
 {openMatchId === match.id && (
  <div
    style={{ marginTop: 15 }}
    onClick={(e) => e.stopPropagation()}
  >
    <LiveMatchDetails
      matchId={match.id}
      onUpdate={(data) =>
        setLiveData((prev) => ({
          ...prev,
          [match.id]: data,
        }))
      }
    />
  </div>
)}

</Card>
);
})}


        <div
          style={{
            marginTop: "50px",
            paddingTop: "20px",
            borderTop: "1px solid rgba(254,202,202,0.2)",
            textAlign: "center",
            color: "#fecaca",
            fontSize: "14px",
          }}
        >
          FantAquilaCastoro 2026 • Live Match Center 🔴
        </div>
      </div>
    </main>
  );
}