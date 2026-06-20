"use client";

import { useEffect, useState } from "react";

import BackHome from "@/components/BackHome";
import Card from "@/components/Card";

import { supabase } from "@/lib/supabase";
import MatchDetails from "@/components/MatchDetails";
import Collapsible from "@/components/Collapsible";

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
    background: "#0f172a",
    padding: "16px",
    borderRadius: "12px",
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
        padding: "20px",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
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
                textAlign: "center",
                fontWeight: 700,
                marginBottom: 8,
              }}
            >
              {partita.home_name}
              {" vs "}
              {partita.away_name}
            </div>

            <div
              style={{
                textAlign: "center",
                fontSize: "0.85rem",
                color: "#94a3b8",
              }}
            >
              👤 {partita.home_owner}
              {" vs "}
              {partita.away_owner}
            </div>

            {partita.completata && (
              <div
                style={{
                  marginTop: 8,
                  textAlign: "center",
                  fontWeight: 800,
                  color: "#22c55e",
                }}
              >
                {partita.gol_home}
                {" - "}
                {partita.gol_away}
              </div>
            )}
          <Collapsible title="📋 Formazioni">
  <div style={{ marginTop: 10 }}>
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