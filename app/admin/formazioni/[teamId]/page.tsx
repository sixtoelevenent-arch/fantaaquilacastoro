"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Team = {
  id: number;
  nome: string;
  proprietario: string;
};

type Player = {
  id: number;
  nome: string;
  ruolo: string;
};

type Matchday = {
  id: number;
  nome: string;
};

const MODULI = [
  "3-4-3",
  "3-5-2",
  "4-3-3",
  "4-4-2",
  "4-5-1",
  "5-3-2",
  "5-4-1",
];

export default function TeamFormationPage() {
  const params = useParams();

  const [team, setTeam] = useState<Team | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [matchdays, setMatchdays] = useState<Matchday[]>([]);

  const [selectedMatchday, setSelectedMatchday] = useState("");
  const [selectedModule, setSelectedModule] = useState("4-3-3");

  useEffect(() => {
    if (params?.teamId) {
      loadData();
    }
  }, [params]);

  async function loadData() {
    const teamId = Number(params.teamId);

    const { data: teamData } = await supabase
      .from("teams")
      .select("id,nome,proprietario")
      .eq("id", teamId)
      .single();

    const { data: playersData } = await supabase
      .from("players")
      .select("id,nome,ruolo")
      .eq("team_id", teamId)
      .order("nome");

    const { data: matchdaysData } = await supabase
      .from("matchdays")
      .select("id,nome")
      .order("id");

    setTeam(teamData);
    setPlayers(playersData || []);
    setMatchdays(matchdaysData || []);

    if (matchdaysData?.length) {
      setSelectedMatchday(String(matchdaysData[0].id));
    }
  }

  const portieri = players.filter((p) => p.ruolo === "P");
  const difensori = players.filter((p) => p.ruolo === "D");
  const centrocampisti = players.filter((p) => p.ruolo === "C");
  const attaccanti = players.filter((p) => p.ruolo === "A");

  function renderRuolo(
    titolo: string,
    lista: Player[]
  ) {
    return (
      <div
        style={{
          background: "#1f2937",
          borderRadius: "12px",
          padding: "16px",
          marginBottom: "15px",
        }}
      >
        <h3 style={{ marginBottom: "12px" }}>
          {titolo} ({lista.length})
        </h3>

        {lista.map((player) => (
          <div
            key={player.id}
            style={{
              padding: "8px 0",
              borderBottom: "1px solid #374151",
            }}
          >
            {player.nome}
          </div>
        ))}
      </div>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom, #020617 0%, #08122c 50%, #020617 100%)",
        color: "white",
        padding: "20px",
      }}
    >
      {team && (
        <>
          <h1
            style={{
              textAlign: "center",
              marginBottom: "5px",
            }}
          >
            {team.nome}
          </h1>

          <p
            style={{
              textAlign: "center",
              color: "#cbd5e1",
              marginBottom: "30px",
            }}
          >
            {team.proprietario}
          </p>
        </>
      )}

      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
        }}
      >
        <label>Giornata</label>

        <select
          value={selectedMatchday}
          onChange={(e) => setSelectedMatchday(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "6px",
            marginBottom: "20px",
            borderRadius: "10px",
          }}
        >
          {matchdays.map((m) => (
            <option key={m.id} value={m.id}>
              {m.nome}
            </option>
          ))}
        </select>

        <label>Modulo</label>

        <select
          value={selectedModule}
          onChange={(e) => setSelectedModule(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "6px",
            marginBottom: "25px",
            borderRadius: "10px",
          }}
        >
          {MODULI.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>

        {renderRuolo("PORTIERI", portieri)}
        {renderRuolo("DIFENSORI", difensori)}
        {renderRuolo("CENTROCAMPISTI", centrocampisti)}
        {renderRuolo("ATTACCANTI", attaccanti)}
      </div>
    </main>
  );
}