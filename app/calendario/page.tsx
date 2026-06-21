"use client";

import { useEffect, useState } from "react";

import BackHome from "@/components/BackHome";
import Card from "@/components/Card";

import { supabase } from "@/lib/supabase";
import MatchDetails from "@/components/MatchDetails";
import Collapsible from "@/components/Collapsible";

<div
  style={{
    fontSize: "3rem",
  }}
>
  TEST
</div>

type MatchRow = {
  id: number;
  matchday_id: number;

  gol_home: number | null;
  gol_away: number | null;

  fp_home: number | null;
  fp_away: number | null;

  completata: boolean;

  home_name: string;
  away_name: string;

  home_owner: string;
  away_owner: string;

  home_group: string;
  away_group: string;
};

export default function CalendarioPage() {

  const [matches, setMatches] = useState<MatchRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMatches();
  }, []);

  async function loadMatches() {

    const { data: matchesData } = await supabase
      .from("matches")
      .select("*")
      .order("matchday_id")
      .order("id");

    if (!matchesData) {
      setLoading(false);
      return;
    }

    const teamIds = [
      ...new Set(
        matchesData.flatMap((m) => [
          m.team_home_id,
          m.team_away_id,
        ])
      ),
    ];

    const { data: teams } = await supabase
      .from("teams")
      .select("*")
      .in("id", teamIds);

    const teamMap = new Map();

    (teams || []).forEach((t) => {
      teamMap.set(t.id, t);
    });

    const rows: MatchRow[] = matchesData.map((m) => ({
      id: m.id,

      matchday_id: m.matchday_id,

      gol_home: m.gol_home,
      gol_away: m.gol_away,

      fp_home: m.fp_home,
      fp_away: m.fp_away,

      completata: m.completata,

      home_name:
        teamMap.get(m.team_home_id)?.nome || "",

      away_name:
        teamMap.get(m.team_away_id)?.nome || "",

      home_owner:
  teamMap.get(m.team_home_id)?.proprietario || "",

away_owner:
  teamMap.get(m.team_away_id)?.proprietario || "",

home_group:
  teamMap.get(m.team_home_id)?.gruppo || "",

away_group:
  teamMap.get(m.team_away_id)?.gruppo || "",

    }));

    setMatches(rows);
    setLoading(false);
  }

  const groupedMatches = matches.reduce(
    (acc: any, match) => {

      if (!acc[match.matchday_id]) {
        acc[match.matchday_id] = [];
      }

      acc[match.matchday_id].push(match);

      return acc;
    },
    {}
  );

  const matchStyle = {
  background: "#081225",
  padding: "6px 0px",
  borderRadius: "16px",
  border: "1px solid rgba(255,255,255,0.08)",
};

  if (loading) {
    return <div>Caricamento...</div>;
  }

  return (

    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #2e1065, #1e1b4b)",
        color: "white",
        padding: "8px",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          width: "100%",
          margin: "0 auto",
        }}
      >
        <BackHome />

        <h1
          style={{
            textAlign: "center",
            fontSize: "clamp(2.2rem, 6vw, 3.5rem)",
            marginTop: "10px",
            marginBottom: "10px",
            fontWeight: "800",
          }}
        >
          🗓️ Calendario
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#d8b4fe",
            marginBottom: "35px",
          }}
        >
          Fase a Gironi • Road to New York 🗽
        </p>

       {Object.entries(groupedMatches).map(
  ([giornata, partite]: any) => (

    <Card
      key={giornata}
      title={`⚽ Giornata ${giornata}`}
    >

      <div
        style={{
          display: "grid",
          gap: "12px",
        }}
      >

        {partite.map((partita: MatchRow) => (

          <div
            key={partita.id}
            style={matchStyle}
          >

            <div
  style={{
    marginTop: 6,
    marginBottom: 10,
  }}
>
  <div
    style={{
      textAlign: "center",
      fontSize: "0.85rem",
      color: "#c4b5fd",
      fontWeight: 800,
      letterSpacing: "2px",
      marginBottom: 12,
    }}
  >
    GIRONE {partita.home_group}
  </div>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "1fr auto 1fr",
      alignItems: "center",
    }}
  >
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: "3rem" }}>
              </div>

      <div
        style={{
          fontSize: "1.8rem",
          fontWeight: 800,
        }}
      >
        {partita.home_name}
      </div>

      <div
        style={{
          color: "#94a3b8",
          marginTop: 4,
        }}
      >
        👤 {partita.home_owner}
      </div>
    </div>

    <div
      style={{
        padding: "0 18px",
        fontSize: "3rem",
        fontWeight: 900,
        color: "#16a34a",
      }}
    >
      {partita.gol_home} - {partita.gol_away}
    </div>

    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: "3rem" }}>
             </div>

      <div
        style={{
          fontSize: "1.8rem",
          fontWeight: 800,
        }}
      >
        {partita.away_name}
      </div>

      <div
        style={{
          color: "#94a3b8",
          marginTop: 4,
        }}
      >
        👤 {partita.away_owner}
      </div>
    </div>
  </div>
</div>

             <Collapsible title="📋 Formazioni">
  <div
    style={{
      marginTop: 8,
      width: "100%",
    }}
  >
    <MatchDetails matchId={partita.id} />
  </div>
</Collapsible>


          </div>

        ))}

      </div>

    </Card>
  )
)}

        <div
          style={{
            marginTop: "50px",
            paddingTop: "20px",
            borderTop: "1px solid rgba(255,255,255,0.15)",
            textAlign: "center",
            color: "#94a3b8",
            fontSize: "14px",
          }}
        >
          FantAquilaCastoro 2026 • Road to New York 🗽
        </div>
      </div>
    </main>
  );
}