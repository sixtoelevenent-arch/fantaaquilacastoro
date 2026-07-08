"use client";

import { useEffect, useState } from "react";

import BackHome from "@/components/BackHome";
import Card from "@/components/Card";

import { supabase } from "@/lib/supabase";

type Player = {
  id: number;
  nome: string;
  ruolo: string;
  nazionale: string;
  prezzo: number;
  team_id: number;
};

const teams = [
  {
    id: 4,
    nome: "🇨🇴 Colombia",
    budget: 35,
  },
  {
    id: 2,
    nome: "🇬🇭 Ghana",
    budget: 14,
  },
  {
    id: 5,
    nome: "🇵🇹 Portogallo",
    budget: 9,
  },
  {
    id: 12,
    nome: "🇹🇷 Turchia",
    budget: 0,
  },
];

const roleOrder = ["P", "D", "C", "A"];

export default function RoseUfficialiPage() {
  const [loading, setLoading] = useState(true);

  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
  setLoading(true);

  const { data } = await supabase
    .from("players_backup_momento2")
    .select("*")
    .order("team_id")
    .order("ruolo")
    .order("prezzo", { ascending: false });

  setPlayers((data || []) as Player[]);

  setLoading(false);
}

  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(to bottom,#1f2937,#0f172a)",
          color: "white",
          padding: 20,
        }}
      >
        Caricamento...
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom,#1f2937,#0f172a)",
        color: "white",
        padding: 20,
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        <BackHome />

        <h1
          style={{
            textAlign: "center",
            fontSize: "clamp(2rem,6vw,3.5rem)",
            fontWeight: 800,
            marginBottom: 10,
          }}
        >
          📋 Rose Ufficiali
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#cbd5e1",
            marginBottom: 30,
          }}
        >
          Rose aggiornate al Momento 2 del mercato.
        </p>
                {teams.slice(0, 2).map((team) => {
          const squadra = players.filter(
            (p) => p.team_id === team.id
          );

          console.log(team.nome, squadra.length);

                   return (
            <Card
              key={team.id}
              title={`${team.nome} • Budget residuo: ${team.budget} mln`}
            >
              {roleOrder.map((ruolo) => (
                <div
                  key={ruolo}
                  style={{
                    marginBottom: 18,
                  }}
                >
                  <div
                    style={{
                      color: "#facc15",
                      fontWeight: 800,
                      fontSize: "1.1rem",
                      marginBottom: 8,
                    }}
                  >
                    {ruolo}
                  </div>

                  {squadra
                    .filter((p) => p.ruolo === ruolo)
                    .sort((a, b) => b.prezzo - a.prezzo)
                    .map((p) => (
                      <div
                        key={`${team.id}-${p.id}-${p.ruolo}`}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "6px 0",
                          borderBottom:
                            "1px solid rgba(255,255,255,.08)",
                        }}
                      >
                        <div>
                          <strong>{p.nome}</strong>
                          <div
                            style={{
                              color: "#94a3b8",
                              fontSize: "0.85rem",
                            }}
                          >
                            {p.nazionale}
                          </div>
                        </div>

                        <div
                          style={{
                            fontWeight: 800,
                            color: "#facc15",
                          }}
                        >
                          {p.prezzo}
                        </div>
                      </div>
                    ))}
                </div>
              ))}
            </Card>
          );
        })}
                {teams.slice(2).map((team) => {
          const squadra = players.filter(
            (p) => p.team_id === team.id
          );

          return (
            <Card
              key={team.id}
              title={`${team.nome} • Budget residuo: ${team.budget} mln`}
            >
              {roleOrder.map((ruolo) => (
                <div
                  key={ruolo}
                  style={{
                    marginBottom: 18,
                  }}
                >
                  <div
                    style={{
                      color: "#facc15",
                      fontWeight: 800,
                      fontSize: "1.1rem",
                      marginBottom: 8,
                    }}
                  >
                    {ruolo}
                  </div>

                  {squadra
                    .filter((p) => p.ruolo === ruolo)
                    .sort((a, b) => b.prezzo - a.prezzo)
                    .map((p) => (
                      <div
                        key={`${team.id}-${p.id}-${p.ruolo}`}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "6px 0",
                          borderBottom:
                            "1px solid rgba(255,255,255,.08)",
                        }}
                      >
                        <div>
                          <strong>{p.nome}</strong>
                          <div
                            style={{
                              color: "#94a3b8",
                              fontSize: "0.85rem",
                            }}
                          >
                            {p.nazionale}
                          </div>
                        </div>

                        <div
                          style={{
                            fontWeight: 800,
                            color: "#facc15",
                          }}
                        >
                          {p.prezzo}
                        </div>
                      </div>
                    ))}
                </div>
              ))}
            </Card>
          );
        })}

        <div
          style={{
            marginTop: 40,
            paddingTop: 20,
            borderTop:
              "1px solid rgba(255,255,255,0.10)",
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