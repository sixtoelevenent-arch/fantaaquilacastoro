"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import LiveMatchDetails from "@/components/LiveMatchDetails";
import BackHome from "@/components/BackHome";
import Card from "@/components/Card";
import { calculateMatchLive } from "@/lib/calculateMatchLive";
import { getActiveMatchday } from "@/lib/getActiveMatchday";
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
  useState("");

const [liveData, setLiveData] = useState<
  Record<
    number,
    {
      homeFP: number;
      awayFP: number;
      homeGoals: number;
      awayGoals: number;
      isFinal: boolean;
    }
  >
>({});
    
useEffect(() => {

  loadMatches();

  const interval = setInterval(() => {
    loadMatches();
  }, 30000);

  return () => clearInterval(interval);

}, []);

  async function loadMatches() {

  const activeMatchday =
    await getActiveMatchday();

  if (!activeMatchday) {
    setMatches([]);
    return;
  }

  setMatchdayName(
    activeMatchday.nome || ""
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
    .eq("matchday_id", activeMatchday.id)
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
        background: "linear-gradient(to bottom, #450a0a, #1f0808)",
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
            textAlign: "center"
          }}
        >
          🔴 LIVE GIORNATA
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
</div>

  <div
  style={{
    textAlign: "center",
    color: "#cbd5e1",
    fontSize: "0.85rem",
    marginBottom: 18,
  }}
>
  👆 Tocca una partita per vedere formazioni, voti e sostituzioni live
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

{matches.length === 0 && (
  <Card>
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      paddingTop: 0,
      marginTop: -15,
    }}
  >
    <img
      src="/images/pasquale-banner.png"
      alt="Pasquale l'Aquila Reale"
      style={{
        width: "88%",
        maxWidth: "520px",
        borderRadius: 16,
      }}
    />
  </div>
</Card>

)}

{matches.map((match) => (

  <Card
  key={match.id}
  highlight={openMatchId === match.id}
  onClick={() =>
    setOpenMatchId(
      openMatchId === match.id
        ? null
        : match.id
    )
  }
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
            padding: "4px 10px",
      background: "#854d0e",
      borderRadius: 999,
            fontSize: "0.8rem",
      fontWeight: 700,
      
    }}
  >
       {openMatchId === match.id ? "▼" : "▶"} 🏆 GIRONE {match.gruppo}
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
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 0,
    }}
  >
    
    
    <div style={{ flex: 1 }}>
      <div
        style={{
          fontWeight: 700,
          fontSize: "1.50rem",
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
        minWidth: 100,
        textAlign: "center",
      }}
    >
      <div
  style={{
    fontSize: "2.5rem",
    fontWeight: 900,
    lineHeight: 1,
    color: liveData[match.id]?.isFinal
      ? "#22c55e"
      : "#facc15",
  }}
>
  {liveData[match.id]?.homeGoals ?? 0}
  {" - "}
  {liveData[match.id]?.awayGoals ?? 0}
</div>

<div
  style={{
    marginTop: 8,
    fontSize: "1rem",
    color: "#94a3b8",
    fontWeight: 600,
  }}
>
  {liveData[match.id]?.homeFP?.toFixed(1) ?? "0.0"}
  {" • "}
  {liveData[match.id]?.awayFP?.toFixed(1) ?? "0.0"}
</div>

    </div>

    <div style={{ flex: 1 }}>
      <div
        style={{
          fontWeight: 700,
          fontSize: "1.50rem",
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

        ))}


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