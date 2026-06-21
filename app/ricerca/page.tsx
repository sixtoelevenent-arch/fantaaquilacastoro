"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import BackHome from "@/components/BackHome";

type Player = {
  id: number;
  nome: string;
  ruolo: string;
  nazionale: string;
  prezzo: number;
  team_id: number | null;
};

type Team = {
  id: number;
  nome: string;
  proprietario: string;
};

export default function Page() {
  const params = useSearchParams();

  const query = params.get("q") || "";

  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlayers();
  }, [query]);

  async function loadPlayers() {
    setLoading(true);

    const { data } = await supabase
      .from("players")
      .select("*")
      .ilike("nome", `%${query}%`)
      .order("nome");

    const results = [];

    for (const player of data || []) {
      let team = null;

      if (player.team_id) {
        const { data: teamData } = await supabase
          .from("teams")
          .select("nome,proprietario")
          .eq("id", player.team_id)
          .single();

        team = teamData;
      }

      results.push({
        ...player,
        team,
      });
    }

    setPlayers(results);
    setLoading(false);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom,#111827,#0f172a)",
        color: "white",
        padding: 20,
      }}
    >
      <BackHome />

      <h1
        style={{
          textAlign: "center",
          marginBottom: 25,
        }}
      >
        🔍 Ricerca Giocatori
      </h1>

      {loading && <p>Caricamento...</p>}

      {!loading &&
        players.map((player) => (
          <div
            key={player.id}
            style={{
              background: "#1f2937",
              borderRadius: 14,
              padding: 16,
              marginBottom: 12,
            }}
          >
            <div
              style={{
                fontSize: "1.1rem",
                fontWeight: 800,
              }}
            >
              {player.ruolo} {player.nome}
            </div>

            <div
              style={{
                marginTop: 6,
                color: "#cbd5e1",
              }}
            >
              🏳️ {player.nazionale}
            </div>

            {player.team_id ? (
              <>
                <div style={{ marginTop: 8 }}>
                  💰 {player.prezzo} crediti
                </div>

                <div style={{ marginTop: 8 }}>
                  🏆 {player.team?.nome}
                </div>

                <div>
                  👤 {player.team?.proprietario}
                </div>
              </>
            ) : (
              <div style={{ marginTop: 8 }}>
                🏆 Svincolato
              </div>
            )}
          </div>
        ))}
    </main>
  );
}