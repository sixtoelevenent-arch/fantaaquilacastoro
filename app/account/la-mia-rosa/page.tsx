"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import BackHome from "@/components/BackHome";

type User = {
  id: number;
  username: string;
  team_id: number;
};

type Player = {
  id: number;
  nome: string;
  nazionale: string;
  ruolo: string;
  prezzo: number | null;
};

export default function LaMiaRosaPage() {
  const router = useRouter();

  const [loading, setLoading] =
    useState(true);

  const [players, setPlayers] =
    useState<Player[]>([]);

  const [automaticIds, setAutomaticIds] =
    useState<number[]>([]);

  const [search, setSearch] =
    useState("");

  const [roleFilter, setRoleFilter] =
    useState("ALL");

  useEffect(() => {
    loadPage();
  }, []);

  async function loadPage() {
    setLoading(true);

    const raw =
      localStorage.getItem(
        "fantasy_user"
      );

    if (!raw) {
      router.push("/login");
      return;
    }

    const user =
      JSON.parse(raw) as User;

    const {
      data: squad,
    } = await supabase
      .from("players")
      .select(`
        id,
        nome,
        nazionale,
        ruolo,
        prezzo
      `)
      .eq(
        "team_id",
        user.team_id
      )
      .order("ruolo")
      .order("nome");

    setPlayers(
      (squad as Player[]) ?? []
    );

    const {
      data: automaticRows,
    } = await supabase
      .from(
        "market_release_players"
      )
      .select(`
        player_id,
        automatic,
        market_releases!inner(
          team_id
        )
      `)
      .eq("automatic", true)
      .eq(
        "market_releases.team_id",
        user.team_id
      );

    setAutomaticIds(
      (automaticRows ?? []).map(
        (r: any) =>
          r.player_id
      )
    );

    setLoading(false);
  }

  const filteredPlayers =
    useMemo(() => {
      let rows = [
        ...players,
      ];

      if (search) {
        rows = rows.filter(
          (p) =>
            p.nome
              .toLowerCase()
              .includes(
                search.toLowerCase()
              )
        );
      }

      if (
        roleFilter !== "ALL"
      ) {
        rows = rows.filter(
          (p) =>
            p.ruolo ===
            roleFilter
        );
      }

      return rows;
    }, [
      players,
      search,
      roleFilter,
    ]);

  if (loading) {
    return (
      <main
        style={{
          minHeight:
            "100vh",
          background:
            "#020617",
          color: "white",
          display: "flex",
          justifyContent:
            "center",
          alignItems:
            "center",
        }}
      >
        ⏳ Caricamento...
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom,#020617,#0f172a)",
        color: "white",
        padding: 20,
      }}
    >
      <div
        style={{
          maxWidth: 1000,
          margin: "0 auto",
        }}
      >
        <BackHome />

        <h1
          style={{
            textAlign:
              "center",
            marginBottom: 20,
          }}
        >
          📋 LA MIA ROSA
        </h1>

        <p
          style={{
            textAlign:
              "center",
            color:
              "#cbd5e1",
            marginBottom:
              20,
          }}
        >
          Giocatori in rosa:{" "}
          {players.length}
        </p>

        <input
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          placeholder="🔍 Cerca giocatore..."
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 12,
            border: "none",
            marginBottom: 16,
          }}
        />

        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            marginBottom: 20,
          }}
        >
          {[
            "ALL",
            "P",
            "D",
            "C",
            "A",
          ].map((r) => (
            <button
              key={r}
              onClick={() =>
                setRoleFilter(r)
              }
              style={{
                padding:
                  "8px 14px",
                borderRadius:
                  999,
                border: "none",
                cursor:
                  "pointer",
                fontWeight:
                  700,
                background:
                  roleFilter ===
                  r
                    ? "#facc15"
                    : "#334155",
                color:
                  roleFilter ===
                  r
                    ? "#000"
                    : "#fff",
              }}
            >
              {r === "ALL"
                ? "Tutti"
                : r}
            </button>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection:
              "column",
            gap: 12,
          }}
        >
          {filteredPlayers.map(
            (p) => {
              const automatic =
                automaticIds.includes(
                  p.id
                );

              return (
                <div
                  key={p.id}
                  style={{
                    background:
                      "#111827",
                    borderRadius:
                      16,
                    padding:
                      16,
                    border:
                      automatic
                        ? "1px solid rgba(250,204,21,.35)"
                        : "1px solid rgba(255,255,255,.08)",
                  }}
                >
                  <div
                    style={{
                      display:
                        "flex",
                      justifyContent:
                        "space-between",
                      gap: 20,
                      flexWrap:
                        "wrap",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontWeight:
                            800,
                          fontSize:
                            "1.05rem",
                        }}
                      >
                        {p.nome}
                      </div>

                      <div
                        style={{
                          color:
                            "#94a3b8",
                          marginTop:
                            4,
                        }}
                      >
                        {p.nazionale}
                      </div>

                      {automatic && (
                        <div
                          style={{
                            color:
                              "#fde68a",
                            marginTop:
                              10,
                            fontSize:
                              ".9rem",
                          }}
                        >
                          🌍
                          Già
                          svincolato
                          automaticamente
                        </div>
                      )}
                    </div>

                    <div
                      style={{
                        textAlign:
                          "right",
                      }}
                    >
                      <div>
                        {p.ruolo}
                      </div>

                      <div
                        style={{
                          color:
                            "#facc15",
                          fontWeight:
                            800,
                          fontSize:
                            "1.1rem",
                          marginTop:
                            8,
                        }}
                      >
                        {p.prezzo ??
                          0}{" "}
                        mln
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
          )}

          {filteredPlayers.length ===
            0 && (
            <div
              style={{
                background:
                  "#111827",
                borderRadius:
                  16,
                padding: 20,
                textAlign:
                  "center",
                color:
                  "#94a3b8",
              }}
            >
              Nessun giocatore
              trovato.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}