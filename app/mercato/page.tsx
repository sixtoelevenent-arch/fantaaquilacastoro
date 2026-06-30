"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import BackHome from "@/components/BackHome";
import Link from "next/link";
import Card from "@/components/Card";

type MarketRound = {
  id: number;
  name: string;
  fifa_phase: string;
  open_date: string;
  eliminated_nationals_count: number;
  status: "pending" | "svincoli" | "buste" | "closed";
};

type EliminatedNational = {
  nazionale: string;
  round_id: number;
};

type AutomaticRelease = {
  squadra: string;
  team_id: number;
  nome: string;
  nazionale: string;
  ruolo: string;
  prezzo: number;
  prezzo_recuperato: number;
};

type FreeAgent = {
  id: number;
  display_name: string;
  player_name: string;
  nazionale: string;
  ruolo: string;
};

type Assignment = {
  squadra: string;
  nome: string;
  ruolo: string;
  prezzo: number;
};

export default function MercatoPage() {

 type OptionalRelease = {
  team_id: number;
  nome: string;
  ruolo: string;
  nazionale: string;
  prezzo_recuperato: number;
};

type RoundAssignment = {
  squadra: string;
  nome: string;
  ruolo: string;
  prezzo: number;
};

type TeamStatus = {
  team_id: number;
  squadra: string;
  budget: number;
  p_missing: number;
  d_missing: number;
  c_missing: number;
  a_missing: number;
};

type MarketBuy = {
  team_id: number;
  nome: string;
  ruolo: string;
  nazionale: string;
  prezzo: number;
};

const [marketBuys, setMarketBuys] =
  useState<MarketBuy[]>([]);

const [teamStatus, setTeamStatus] =
  useState<TeamStatus[]>([]);

const [optionalReleases, setOptionalReleases] =
  useState<OptionalRelease[]>([]);
  
  const [loading, setLoading] = useState(true);

  const [rounds, setRounds] = useState<MarketRound[]>([]);
  const [currentRound, setCurrentRound] =
    useState<MarketRound | null>(null);

  const [eliminated, setEliminated] = useState<
    EliminatedNational[]
  >([]);

  const [automaticReleases, setAutomaticReleases] =
    useState<AutomaticRelease[]>([]);

  const [freeAgents, setFreeAgents] =
    useState<FreeAgent[]>([]);

  const [assignments, setAssignments] =
    useState<Assignment[]>([]);

    type ReturnedPlayer = {
  nome: string;
  ruolo: string;
  nazionale: string;
  team_id: number;
};

const [returnedPlayers, setReturnedPlayers] =
  useState<ReturnedPlayer[]>([]);

      const [roleFilter, setRoleFilter] =
    useState<string>("ALL");

  const [search, setSearch] =
    useState("");

  const [expandedRound, setExpandedRound] =
    useState<number | null>(null);

  useEffect(() => {
  loadPage().catch((e) => {
    console.error("LOADPAGE ERROR", e);

    setLoading(false);

      });
}, []);

  async function loadPage() {
  try {
    setLoading(true);

    const {
      data: roundsData,
      error: roundsError,
    } = await supabase
      .from("market_rounds")
      .select("*")
      .order("id");

    if (roundsError) {
      throw roundsError;
    }

    const rounds =
      (roundsData as MarketRound[]) ?? [];

    setRounds(rounds);

    const active =
      [...rounds]
        .reverse()
        .find((r) => r.status !== "pending") ??
      rounds[0] ??
      null;

    setCurrentRound(active);

    if (!active) {
      setLoading(false);
      return;
    }

    const {
      data: eliminatedData,
      error: eliminatedError,
    } = await supabase
      .from("eliminated_nationals")
      .select("*")
      .eq("round_id", active.id)
      .order("nazionale");

    if (eliminatedError)
      throw eliminatedError;

    setEliminated(eliminatedData ?? []);

    const {
      data: freeData,
      error: freeError,
    } = await supabase
      .from("free_agents")
      .select("*")
      .eq("disponibile", true)
      .order("ruolo")
      .order("display_name");

    if (freeError)
      throw freeError;

setFreeAgents(freeData ?? []);

const {
  data: releases,
  error: releasesError,
} = await supabase.rpc(
  "market_automatic_releases_view",
  {
    p_round: active.id,
  }
);


if (releasesError) {
  throw releasesError;
}

setAutomaticReleases(
  (releases as AutomaticRelease[]) ?? []
);

const { data: optionalData } =
  await supabase
    .from("market_release_players")
    .select(`
      automatic,
      market_releases!inner(
        round_id,
        team_id
      ),
      prezzo_recuperato,
players!inner(
  nome,
  ruolo,
  nazionale
)
    `);

setOptionalReleases(
  (optionalData ?? [])
    .filter(
      (r: any) =>
        r.automatic === false &&
        r.market_releases
          ?.round_id === active.id
    )
   .map((r: any) => ({
  team_id:
    r.market_releases.team_id,
  nome:
    r.players.nome,
  ruolo:
    r.players.ruolo,
  nazionale:
    r.players.nazionale,
  prezzo_recuperato:
    r.prezzo_recuperato ?? 0,
}))
);

const { data: buysData, error: buysError } =
  await supabase
    .from("market_manual_assignments")
    .select(`
      team_id,
      player_id,
      price,
      players!market_manual_assignments_player_id_fkey (
        nome,
        ruolo,
        nazionale
      )
    `);

console.log("BUYS ERROR", buysError);
console.log("BUYS DATA", buysData);
    
    if (buysError) {
  throw buysError;
}

setMarketBuys(
  (buysData ?? []).map((r: any) => ({
    team_id: Number(r.team_id),
    prezzo: r.price,
    nome: r.players?.nome,
    ruolo: r.players?.ruolo,
    nazionale: r.players?.nazionale,
  }))
);

const {
  data: assignmentsData,
  error: assignmentsError,
} = await supabase.rpc(
  "market_assignments_view",
  {
    p_round: active.id,
  }
);

if (assignmentsError) {
  throw assignmentsError;
}

setAssignments(
  (assignmentsData as Assignment[]) ?? []
);

const {
  data: statusData,
  error: statusError,
} = await supabase
  .from("market_team_status")
  .select("*")
  .order("team_id");

if (statusError) {
  throw statusError;
}

setTeamStatus(
  (statusData as TeamStatus[]) ?? []
);

const {
  data: returnedData,
} = await supabase
  .from("returned_free_agents_view")
  .select(`
    nome,
    ruolo,
    nazionale,
    team_id
  `);

setReturnedPlayers(
  ((returnedData as ReturnedPlayer[]) ?? [])
    .sort((a, b) => {
      const order = {
        P: 1,
        D: 2,
        C: 3,
        A: 4,
      };

      const diff =
        order[a.ruolo as keyof typeof order] -
        order[b.ruolo as keyof typeof order];

      if (diff !== 0) {
        return diff;
      }

      return a.nome.localeCompare(
        b.nome,
        "it"
      );
    })
);

  } catch (e) {
  console.error(e);
} finally {
    setLoading(false);
  }
}

  function statusLabel(
    status?: string
  ) {
    switch (status) {
      case "svincoli":
        return "🟡 SVINCOLI APERTI";

      case "buste":
        return "🟠 BUSTE APERTE";

      case "closed":
        return "🟢 CONCLUSA";

      default:
        return "⚪ IN ATTESA";
    }
  }

   const filteredAgents =
    useMemo(() => {
      return freeAgents.filter(
        (p) => {
          const okRole =
            roleFilter ===
              "ALL" ||
            p.ruolo ===
              roleFilter;

          const okSearch =
  (
    p.display_name ||
    p.player_name ||
    ""
  )
    .toLowerCase()
    .includes(
      search.toLowerCase()
    );

          return (
            okRole &&
            okSearch
          );
        }
      );
    }, [
      freeAgents,
      roleFilter,
      search,
    ]);

  const eliminatedCount =
    eliminated.length;

   const showReturnedPlayers =
  returnedPlayers.length > 0;

    const eliminatedTeams = {
  6: "Argentina",
  7: "Germania",
  8: "Curacao",
  10: "Uzbekistan",
};

const activeTeams = [
  { teamId: 1, nome: "Iran" },
  { teamId: 2, nome: "Ghana" },
  { teamId: 3, nome: "Messico" },
  { teamId: 4, nome: "Colombia" },
  { teamId: 5, nome: "Portogallo" },
  { teamId: 11, nome: "Costa d'Avorio" },
  { teamId: 9, nome: "Francia" },
  { teamId: 12, nome: "Turchia" },
];

const teamNames: Record<number, string> = {
  1: "Iran",
  2: "Ghana",
  3: "Messico",
  4: "Colombia",
  5: "Portogallo",
  6: "Argentina",
  7: "Germania",
  8: "Curacao",
  9: "Francia",
  10: "Uzbekistan",
  11: "Costa d'Avorio",
  12: "Turchia",
};

const roleOrder = {
  P: 1,
  D: 2,
  C: 3,
  A: 4,
};

const optionalByTeam = useMemo(() => {
  return activeTeams.map(
    ({ teamId, nome }) => {
      const status =
  teamStatus.find(
    (t) => t.team_id === teamId
  );
     
  console.log(
  "TEAM",
  teamId,
  nome,
  marketBuys
);

  const buys =
  marketBuys
    .filter(
  (b) =>
    b.team_id === teamId
)

.map((b) => ({
  team_id: teamId,
  nome: b.nome,
  ruolo: b.ruolo,
  nazionale: b.nazionale,
  prezzo: b.prezzo,
}));

const players = buys;

players.sort((a, b) => {
  const diff =
    roleOrder[
      a.ruolo as keyof typeof roleOrder
    ] -
    roleOrder[
      b.ruolo as keyof typeof roleOrder
    ];

  if (diff !== 0) {
    return diff;
  }

  return a.nome.localeCompare(
    b.nome,
    "it"
  );
});

   const missingText = [
  status?.p_missing
    ? `${status.p_missing} P`
    : null,
  status?.d_missing
    ? `${status.d_missing} D`
    : null,
  status?.c_missing
    ? `${status.c_missing} C`
    : null,
  status?.a_missing
    ? `${status.a_missing} A`
    : null,
]
  .filter(Boolean)
  .join(", ");
  
  return {
  teamId,
  squadra: nome,
  credits:
  status?.budget ?? 0,
  players,
  missingText,
};
    }
  );

}, [
  optionalReleases,
  automaticReleases,
  teamStatus,
  currentRound,
  marketBuys,
]);

const returnedByTeam = useMemo(() => {
  return Object.entries(eliminatedTeams).map(
    ([teamId, squadra]) => [
      squadra,
      returnedPlayers.filter(
        (p) => p.team_id === Number(teamId)
      ),
    ] as [string, ReturnedPlayer[]]
  );
}, [returnedPlayers]);

      if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(to bottom, #0f172a, #020617)",
          color: "white",
          padding: 12,
        }}
      >
        <BackHome />

        <Link
  href="/mercato/apertura"
  style={{
    position: "fixed",
    top: 12,
    right: 12,
    zIndex: 100,
    background:
      "linear-gradient(135deg,#f59e0b,#d97706)",
    color: "#111827",
    padding: "10px 14px",
    borderRadius: 14,
    textDecoration: "none",
    fontWeight: 800,
    fontSize: ".9rem",
    boxShadow:
      "0 4px 12px rgba(0,0,0,.35)",
  }}
>
  📩 Apertura buste
</Link>

        <div
          style={{
            textAlign: "center",
            marginTop: 60,
            fontSize: "1.1rem",
            color: "#cbd5e1",
          }}
        >
          ⏳ Caricamento mercato...
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom, #0f172a, #020617)",
        color: "white",
        padding: 12,
      }}
    >
      <div
        style={{
          maxWidth: 1600,
          width: "100%",
          margin: "0 auto",
        }}
      >
        <BackHome />

        <h1
          style={{
            textAlign: "center",
            color: "#facc15",
            fontSize: "clamp(2rem,5vw,3rem)",
            fontWeight: 800,
            marginTop: 10,
            marginBottom: 8,
          }}
        >
          💰 MERCATO
        </h1>

        {currentRound && (
          <Card highlight>
            <div
              style={{
                textAlign: "center",
                padding: 18,
              }}
            >
              <div
  style={{
    color: "#facc15",
    fontSize: "1.5rem",
    fontWeight: 800,
    marginBottom: 6,
  }}
>
  {currentRound.id === 2
    ? "1ª Finestra di Mercato"
    : currentRound.name}
</div>

              <div
                style={{
                  color: "#cbd5e1",
                  marginBottom: 12,
                }}
              >
                {currentRound.fifa_phase}
              </div>

              <div
                style={{
                  marginBottom: 12,
                  fontWeight: 700,
                }}
              >
                {statusLabel(
                  currentRound.status
                )}
              </div>

              <div
                style={{
                  color: "#facc15",
                  fontWeight: 700,
                }}
              >
                Nazionali eliminate:16/16
              </div>
             
                  </div>
          </Card>
        )}

                {currentRound?.status === "svincoli" && (
          <Card title="🏆 Acquisti sessione corrente">
  <div
    style={{
      display: "grid",
      gridTemplateColumns:
        "repeat(2,minmax(0,1fr))",
      gap: 8,
    }}
  >
    {activeTeams.map(
      ({ nome }) => {
        const buys =
          assignments
            .filter(
              (a) =>
                a.squadra === nome
            )
            .sort((a, b) => {
              const diff =
                roleOrder[
                  a.ruolo as keyof typeof roleOrder
                ] -
                roleOrder[
                  b.ruolo as keyof typeof roleOrder
                ];

              if (diff !== 0)
                return diff;

              return a.nome.localeCompare(
                b.nome,
                "it"
              );
            });

        return (
          <div
            key={nome}
            style={{
              border:
                "1px solid rgba(250,204,21,.35)",
              background:
                "linear-gradient(180deg,#2a2105,#171003)",
              borderRadius: 18,
              padding: 12,
            }}
          >
            <div
              style={{
                color: "#facc15",
                fontWeight: 800,
                marginBottom: 10,
              }}
            >
              {nome}
            </div>

            {buys.length === 0 ? (
              <div
                style={{
                  color: "#94a3b8",
                  fontSize: ".8rem",
                }}
              >
                Nessun acquisto
              </div>
            ) : (
              buys.map((p, i) => (
                <div
                  key={i}
                  style={{
                    padding: "6px 0",
                    borderTop:
                      "1px solid rgba(255,255,255,.06)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                    }}
                  >
                    <span>
                      {p.ruolo} {p.nome}
                    </span>

                    <span
                      style={{
                        color:
                          "#facc15",
                        fontWeight: 700,
                      }}
                    >
                      {p.prezzo} mln
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        );
      }
    )}
  </div>
</Card>
        )}

        {currentRound?.status === "buste" && (
          <Card>
            <div
              style={{
                textAlign: "center",
                padding: 14,
              }}
            >
              🟠 Buste aperte.

              <br />
              Inserisci i tuoi acquisti
              entro la deadline.
            </div>
          </Card>
        )}

<Card title="📋 Situazione squadre">
  <div
    style={{
      display: "grid",
      gridTemplateColumns:
  "repeat(2, minmax(0,1fr))",
columnGap: 8,
rowGap: 8,
    }}
  >
    {optionalByTeam.map(
  ({
  squadra,
  credits,
  players,
  missingText,
}) => {
       
        return (
          <div
            key={squadra}
            style={{
              border:
                "1px solid rgba(34,197,94,.35)",
              background:
                "linear-gradient(180deg,#062611,#04160b)",
              borderRadius: 18,
              padding: 12,
            }}
          >
            <div
              style={{
                color: "#4ade80",
                fontWeight: 800,
                fontSize: ".95rem",
              }}
            >
              {squadra}
            </div>

            <div
              style={{
                color: "#bbf7d0",
                fontWeight: 700,
                marginTop: 4,
                marginBottom: 12,
                fontSize: ".85rem",
              }}
            >
              💳 {credits} mln

<div
  style={{
    fontSize: ".72rem",
    color: "#94a3b8",
    marginTop: 2,
    fontWeight: 500,
  }}
>
  {missingText
    ? `Mancanti: ${missingText}`
    : "Rosa completa"}
</div>
            </div>

           <div
  style={{
    color: "#94a3b8",
    fontSize: ".8rem",
  }}
>
  {players.length === 0
    ? "Acquisti secondo round buste"
    : `${players.length} giocatori`}
</div>

{players.map((p) => (
  <div
    key={`${squadra}-${p.nome}`}
    style={{
      padding: "6px 0",
      borderTop:
        "1px solid rgba(255,255,255,.06)",
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 10,
        alignItems: "center",
      }}
    >
      <div
        style={{
          fontWeight: 700,
          fontSize: ".8rem",
        }}
      >
        {p.ruolo} {p.nome}
      </div>

      <div
        style={{
          color: "#4ade80",
          fontWeight: 700,
          fontSize: ".78rem",
          whiteSpace: "nowrap",
        }}
      >
       {p.prezzo} mln
      </div>

      <div
        style={{
          color: "#94a3b8",
          fontSize: ".72rem",
        }}
      >
        {p.nazionale}
      </div>
    </div>
  </div>
))}

        </div>
      );}
)}

{returnedByTeam.map(
  ([squadra, players]) => (
    <div
          key={squadra}
          style={{
            border:
              "1px solid rgba(239,68,68,.35)",
            background:
              "linear-gradient(180deg,#250808,#130404)",
            borderRadius: 18,
            padding: 12,
          }}
        >
          <div
            style={{
              color:
                "#f87171",
              fontWeight: 800,
              fontSize:
                ".95rem",
              marginBottom: 10,
            }}
          >
            {squadra}
          </div>

          <div
            style={{
              color:
                "#fecaca",
              fontSize:
                ".8rem",
              marginBottom: 10,
            }}
          >
            Giocatori
            rientrati:
            {" "}
            {players.length}
          </div>

          {players.map((p) => (
            <div
              key={`${squadra}-${p.nome}`}
              style={{
                padding:
                  "6px 0",
                borderTop:
                  "1px solid rgba(255,255,255,.06)",
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  fontSize:
                    ".8rem",
                }}
              >
                {p.ruolo}{" "}
                {p.nome}
              </div>

              <div
  style={{
    color: "#94a3b8",
    fontSize: ".72rem",
  }}
>
  {currentRound?.status ===
  "buste"
    ? "Nuovo acquisto"
    : p.nazionale}
</div>
            </div>
          ))}
        </div>
      ))}
  </div>
</Card>
       
        {eliminated.length > 0 && (
          <Card title="🌍 Nazionali eliminate">
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              {eliminated.map((n) => (
                <div
                  key={n.nazionale}
                  style={{
                    padding:
                      "8px 12px",
                    background:
                      "rgba(250,204,21,0.15)",
                    border:
                      "1px solid rgba(250,204,21,0.4)",
                    borderRadius: 999,
                    fontWeight: 700,
                  }}
                >
                  {n.nazionale}
                </div>
              ))}
            </div>
          </Card>
        )}

                {(currentRound?.status ===
          "buste" ||
          currentRound?.status ===
            "closed") && (
          <Card title="📑 Lista svincolati">
            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                marginBottom: 14,
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
                    borderRadius: 999,
                    border: "none",
                    cursor: "pointer",
                    fontWeight: 700,
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
                marginBottom: 14,
              }}
            />

            <div
              style={{
                display: "flex",
                flexDirection:
                  "column",
                gap: 10,
              }}
            >
              {filteredAgents.map(
                (p) => (
                  <div
                    key={p.id}
                    style={{
                      padding: 12,
                      border:
                        "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 12,
                    }}
                  >
                    <b>
                      {p.ruolo}
                    </b>{" "}
                    {p.display_name ||
  p.player_name ||
  "-"}

                    <div
                      style={{
                        color:
                          "#94a3b8",
                      }}
                    >
                      {p.nazionale}
                    </div>
                  </div>
                )
              )}
            </div>
          </Card>
        )}

        {currentRound?.status ===
          "closed" &&
          assignments.length > 0 && (
            <Card title="🏆 Risultati delle buste">
              {assignments.map(
                (a, i) => (
                  <div
                    key={i}
                    style={{
                      padding:
                        "10px 0",
                      borderBottom:
                        "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <b>
                      {a.squadra}
                    </b>

                    <div>
                      {a.ruolo} •{" "}
                      {a.nome}
                    </div>

                    <div
                      style={{
                        color:
                          "#facc15",
                      }}
                    >
                      {a.prezzo} mln
                    </div>
                  </div>
                )
              )}
            </Card>
          )}

        <Card title="🕓 Storico sessioni di mercato">
          {rounds.map((r) => (
            <div
              key={r.id}
              onClick={() =>
                setExpandedRound(
                  expandedRound ===
                    r.id
                    ? null
                    : r.id
                )
              }
              style={{
                padding: 14,
                marginBottom: 10,
                border:
                  "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12,
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                }}
              >
                {r.name}
              </div>

              <div
                style={{
                  color: "#94a3b8",
                }}
              >
                {r.fifa_phase}
              </div>

              <div
                style={{
                  marginTop: 6,
                }}
              >
                {statusLabel(
                  r.status
                )}
              </div>

              {expandedRound ===
                r.id && (
                <div
                  style={{
                    marginTop: 10,
                    color:
                      "#cbd5e1",
                  }}
                >
                  Apertura:{" "}
                  {new Date(
                    r.open_date
                  ).toLocaleDateString(
                    "it-IT"
                  )}

                  <br />

                  Nazionali da
                  eliminare:{" "}
                  {
                    r.eliminated_nationals_count
                  }
                </div>
              )}
            </div>
          ))}
        </Card>

        <div
          style={{
            marginTop: 40,
            textAlign: "center",
            color: "#94a3b8",
            fontSize: 13,
          }}
        >
          FantAquilaCastoro 2026 •
          Market Center 💰
        </div>
      </div>
    </main>
  );
}