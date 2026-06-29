"use client";

import {
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import { supabase } from "@/lib/supabase";
import BackHome from "@/components/BackHome";
import Card from "@/components/Card";

type MarketRound = {
  id: number;
  name: string;
  status: string;
  release_deadline: string | null;
  bid_deadline: string | null;
};

type Bid = {
  id: number;
  team_id: number;
  player_id: number;
  bid: number;
  priority: number;
};

type Team = {
  id: number;
  username: string;
  team_id: number;
};

type TeamBudget = {
  team_id: number;
  total_budget: number;
};

type TeamNeeds = {
  team_id: number;
  ruolo: string;
  giocatori: number;
};

type AssignmentResult = {
  player_id: number;
  player_name: string;
  display_name: string;
  ruolo: string;
  team_id: number;
  squadra: string;
  bid: number;
  priority: number;
};

type PriorityTie = {
  player_name: string;
  bid: number;
  winner: string;
  loser: string;
};

type AuctionTie = {
  player_name: string;
  bid: number;
  teams: string[];
};

type FreeAgent = {
  id: number;
  players_id: number | null;
  player_name: string;
  display_name: string | null;
  ruolo: string;
  nazionale: string;
  quotazione: number;
};

export default function MercatoPage() {
  const [loading, setLoading] =
    useState(true);

  const [currentRound, setCurrentRound] =
    useState<MarketRound | null>(null);

  const [freeAgents, setFreeAgents] =
    useState<FreeAgent[]>([]);

  const [bids, setBids] =
    useState<Bid[]>([]);

  const [teams, setTeams] =
    useState<Team[]>([]);

  const [budgets, setBudgets] =
  useState<TeamBudget[]>([]);

  const [needs, setNeeds] =
    useState<TeamNeeds[]>([]);

  const [assignments, setAssignments] =
    useState<AssignmentResult[]>([]);

  const [priorityTies, setPriorityTies] =
    useState<PriorityTie[]>([]);

  const [auctionTies, setAuctionTies] =
    useState<AuctionTie[]>([]);

  const [revealed, setRevealed] =
    useState<AssignmentResult[]>([]);

  const [marketOpened, setMarketOpened] =
    useState(false);

const openingRef =
  useRef(false);

  const OPEN_TIME =
  new Date(
    "2026-06-28T18:31:00+02:00"
  );

  const [now, setNow] =
    useState(new Date());

  useEffect(() => {
    const timer =
      setInterval(() => {
        setNow(new Date());
      }, 1000);

    return () =>
      clearInterval(timer);
  }, []);

  const secondsToOpen =
    Math.max(
      0,
      Math.floor(
        (OPEN_TIME.getTime() -
          now.getTime()) /
          1000
      )
    );

  const minutes =
    Math.floor(
      secondsToOpen / 60
    );

  const seconds =
    secondsToOpen % 60;

  useEffect(() => {
    loadPage();
  }, []);

  useEffect(() => {
  if (
    secondsToOpen === 0 &&
    !marketOpened &&
    bids.length > 0 &&
    freeAgents.length > 0 &&
    budgets.length > 0
  ) {
    openBuste();
  }
}, [
  secondsToOpen,
  marketOpened,
  bids,
  freeAgents,
  budgets,
]);

  async function loadPage() {
    setLoading(true);

    const { data: round } =
      await supabase
        .from("market_rounds")
        .select("*")
        .eq("status", "buste")
        .maybeSingle();

    setCurrentRound(
      round as MarketRound
    );

    const { data: agents } =
      await supabase
        .from("free_agents")
        .select("*")
        .eq(
          "disponibile",
          true
        )
        .order("ruolo")
        .order(
          "display_name"
        );

    setFreeAgents(
      (agents ??
        []) as FreeAgent[]
    );

    const { data: bidsData } =
      await supabase
        .from("market_bids")
        .select("*")
        .eq(
          "round_id",
          round?.id
        );

    setBids(
      (bidsData ??
        []) as Bid[]
    );

    const { data: users } =
      await supabase
        .from(
          "fantasy_users"
        )
        .select(`
          id,
          username,
          team_id
        `);

    setTeams(
      (users ??
        []) as Team[]
    );

    const { data: budgetRows } =
      await supabase
        .from(
          "market_budgets"
        )
        .select(`
          team_id,
          total_budget
        `);

    setBudgets(
      (budgetRows ??
        []) as TeamBudget[]
    );

   const { data: roleRows } =
  await supabase
    .from("team_role_counts_view")
    .select("*");

    setNeeds(
      (roleRows ??
        []) as TeamNeeds[]
    );

    setLoading(false);
  
  }
  function teamName(teamId: number) {
  return (
    teams.find(
      (t) =>
        t.team_id === teamId
    )?.username ?? "-"
  );
}

async function openBuste() {
  if (openingRef.current)
    return;

  openingRef.current = true;
  setMarketOpened(true);

  const assignmentsTmp:
    AssignmentResult[] = [];

  const priorityTmp:
    PriorityTie[] = [];

  const auctionTmp:
    AuctionTie[] = [];

  const budgetsMap =
    new Map<
      number,
      number
    >();

  budgets.forEach((b) => {
    budgetsMap.set(
      b.team_id,
      b.total_budget
    );
  });

  for (const player of freeAgents) {
    const playerBids =
      bids.filter(
        (b) =>
          b.player_id ===
          player.id
      );
const availableBids =
  playerBids.filter(
    (b) =>
      (budgetsMap.get(
        b.team_id
      ) ?? 0) >= b.bid
  );

if (
  availableBids.length === 0
)
  continue;

    if (
      playerBids.length === 0
    )
      continue;

    availableBids.sort(
      (a, b) => {
        if (
          b.bid !== a.bid
        ) {
          return (
            b.bid -
            a.bid
          );
        }

        return (
          a.priority -
          b.priority
        );
      }
    );

    const bestBid =
  availableBids[0].bid;

    const contenders =
  availableBids.filter(
        (b) =>
          b.bid ===
          bestBid
      );

    let winner:
      | Bid
      | undefined;

    if (
      contenders.length ===
      1
    ) {
      winner =
        contenders[0];
    } else {
      contenders.sort(
        (a, b) =>
          a.priority -
          b.priority
      );

      const bestPriority =
        contenders[0]
          .priority;

      const samePriority =
        contenders.filter(
          (b) =>
            b.priority ===
            bestPriority
        );

      if (
        samePriority.length ===
        1
      ) {
        winner =
          samePriority[0];

        priorityTmp.push({
          player_name:
            player.display_name ??
            player.player_name,
          bid: bestBid,
          winner:
            teamName(
              winner.team_id
            ),
          loser:
            contenders
              .filter(
                (x) =>
                  x.team_id !==
                  winner
                    ?.team_id
              )
              .map((x) =>
                teamName(
                  x.team_id
                )
              )
              .join(", "),
        });
      } else {
        const alive =
          samePriority.filter(
            (t) =>
              (budgetsMap.get(
                t.team_id
              ) ?? 0) >
              0
          );

        if (
          alive.length >
          1
        ) {
          auctionTmp.push({
            player_name:
              player.display_name ??
              player.player_name,
            bid: bestBid,
            teams:
              alive.map(
                (x) =>
                  teamName(
                    x.team_id
                  )
              ),
          });

          continue;
        }

        winner =
          samePriority[
            Math.floor(
              Math.random() *
                samePriority.length
            )
          ];
      }
    }

    if (!winner)
      continue;

    const currentBudget =
      budgetsMap.get(
        winner.team_id
      ) ?? 0;

    budgetsMap.set(
      winner.team_id,
      Math.max(
        currentBudget -
          winner.bid,
        0
      )
    );

    assignmentsTmp.push({
      player_id:
        player.id,
      player_name:
        player.player_name,
      display_name:
        player.display_name ??
        player.player_name,
      ruolo:
        player.ruolo,
      team_id:
        winner.team_id,
      squadra:
        teamName(
          winner.team_id
        ),
      bid:
        winner.bid,
      priority:
        winner.priority,
    });
  }

  assignmentsTmp.sort(
    (a, b) =>
      b.bid - a.bid
  );

  setAssignments(
    assignmentsTmp
  );
console.log("ASSEGNAZIONI", assignmentsTmp);
console.log("BUSTE", bids);
console.log("SVINCOLATI", freeAgents);

  setPriorityTies(
    priorityTmp
  );

  setAuctionTies(
    auctionTmp
  );

  for (const a of assignmentsTmp) {
  const freeAgent =
    freeAgents.find(
      (x) =>
        x.id === a.player_id
    );

  if (!freeAgent)
    continue;

  const playerId =
    freeAgent.players_id;

  let player;

if (freeAgent.players_id) {
  const { data } =
    await supabase
      .from("players")
      .select("id,nome")
      .eq(
        "id",
        freeAgent.players_id
      )
      .maybeSingle();

  player = data;
} else {
  const { data } =
    await supabase
      .from("players")
      .insert({
        nome:
          freeAgent.display_name ??
          freeAgent.player_name,
        ruolo:
          freeAgent.ruolo,
        nazionale:
          freeAgent.nazionale,
        prezzo: a.bid,
        team_id:
          a.team_id,
        fantapiu3_name:
          freeAgent.player_name,
      })
      .select("id,nome")
      .single();

  player = data;

  if (player) {
    await supabase
      .from("free_agents")
      .update({
        players_id:
          player.id,
      })
      .eq(
        "id",
        freeAgent.id
      );
  }
}

if (!player) {
  console.error(
    "Impossibile creare/trovare giocatore",
    freeAgent
  );
  continue;
}

  await supabase
    .from("players")
    .update({
      team_id: a.team_id,
    })
    .eq("id", player.id);

    await supabase
      .from(
        "free_agents"
      )
      .update({
        disponibile:
          false,
      })
      .eq(
        "id",
        freeAgent.id
      );

    const newBudget =
  budgetsMap.get(
    a.team_id
  ) ?? 0;

await supabase
  .from("market_budgets")
  .update({
    total_budget:
      newBudget,
  })
  .eq(
    "team_id",
    a.team_id
  );
      
  await supabase
      .from(
        "market_assignments"
      )
      .insert({
        round:
          currentRound?.id,
        round_id:
          currentRound?.id,
        player_id:
          player.id,
        team_id:
          a.team_id,
        price:
          a.bid,
      });
  }

 setRevealed(assignmentsTmp);

  await loadPage();
}
return (
  <main
    style={{
      minHeight: "100vh",
      background:
        "linear-gradient(to bottom,#0f172a,#020617)",
      color: "white",
      padding: 12,
    }}
  >
    <div
      style={{
        maxWidth: 1600,
        margin: "0 auto",
      }}
    >
      <BackHome />

      <h1
        style={{
          textAlign: "center",
          color: "#facc15",
          fontSize:
            "clamp(2rem,5vw,3rem)",
          fontWeight: 800,
          marginTop: 10,
          marginBottom: 20,
        }}
      >
        💰 MERCATO
      </h1>

      {!marketOpened ? (
        <Card highlight>
          <div
            style={{
              textAlign: "center",
              padding: 30,
            }}
          >
            <div
              style={{
                fontSize: "2rem",
                fontWeight: 800,
                color: "#facc15",
                marginBottom: 20,
              }}
            >
              🟠 APERTURA BUSTE
            </div>

            <div
              style={{
                fontSize: "3rem",
                fontWeight: 900,
                color: "#ffffff",
              }}
            >
              {String(
                minutes
              ).padStart(2, "0")}
              :
              {String(
                seconds
              ).padStart(2, "0")}
            </div>

            <div
              style={{
                marginTop: 20,
                color: "#cbd5e1",
              }}
            >
              Le buste si apriranno
              automaticamente alle
              ore 18:30.
            </div>
          </div>
        </Card>
      ) : (
        <>
          <Card highlight>
            <div
              style={{
                textAlign: "center",
                padding: 22,
              }}
            >
              <div
                style={{
                  fontSize: "2rem",
                  color: "#facc15",
                  fontWeight: 900,
                }}
              >
                🎉 BUSTE APERTE
              </div>

              <div
                style={{
                  marginTop: 12,
                  color: "#cbd5e1",
                }}
              >
                Le assegnazioni
                vengono mostrate
                automaticamente ogni
                5 secondi.
              </div>
            </div>
          </Card>

          {revealed.length >
            0 && (
            <Card title="🏆 Assegnazioni">
              {revealed.map(
                (a) => (
                  <div
                    key={`${a.team_id}-${a.player_id}`}
                    style={{
                      padding:
                        "14px 0",
                      borderBottom:
                        "1px solid rgba(255,255,255,.08)",
                    }}
                  >
                    <div
                      style={{
                        display:
                          "flex",
                        justifyContent:
                          "space-between",
                        gap: 10,
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
                          {a.ruolo} •{" "}
                          {
                            a.display_name
                          }
                        </div>

                        <div
                          style={{
                            color:
                              "#94a3b8",
                          }}
                        >
                          {
                            a.squadra
                          }
                        </div>
                      </div>

                      <div
                        style={{
                          color:
                            "#facc15",
                          fontWeight:
                            800,
                          fontSize:
                            "1.2rem",
                        }}
                      >
                        {a.bid} mln
                      </div>
                    </div>
                  </div>
                )
              )}
            </Card>
          )}

          {priorityTies.length >
            0 && (
            <Card title="⚖️ Parità risolte per priorità">
              {priorityTies.map(
                (
                  p,
                  i
                ) => (
                  <div
                    key={i}
                    style={{
                      padding:
                        "12px 0",
                      borderBottom:
                        "1px solid rgba(255,255,255,.08)",
                    }}
                  >
                    <div
                      style={{
                        fontWeight:
                          700,
                      }}
                    >
                      {
                        p.player_name
                      }
                    </div>

                    <div
                      style={{
                        color:
                          "#cbd5e1",
                        marginTop: 6,
                      }}
                    >
                      Offerta:
                      {" "}
                      {p.bid}
                      mln
                    </div>

                    <div
                      style={{
                        color:
                          "#4ade80",
                        marginTop: 6,
                      }}
                    >
                      Assegnato a{" "}
                      {
                        p.winner
                      }
                    </div>

                    <div
                      style={{
                        color:
                          "#94a3b8",
                      }}
                    >
                      Precede:{" "}
                      {
                        p.loser
                      }
                    </div>
                  </div>
                )
              )}
            </Card>
          )}

          {auctionTies.length >
            0 && (
            <Card title="🔥 Spareggi">
              {auctionTies.map(
                (
                  a,
                  i
                ) => (
                  <div
                    key={i}
                    style={{
                      padding:
                        "12px 0",
                      borderBottom:
                        "1px solid rgba(255,255,255,.08)",
                    }}
                  >
                    <div
                      style={{
                        fontWeight:
                          700,
                      }}
                    >
                      {
                        a.player_name
                      }
                    </div>

                    <div
                      style={{
                        color:
                          "#cbd5e1",
                        marginTop: 6,
                      }}
                    >
                      Squadre:
                      {" "}
                      {a.teams.join(
                        ", "
                      )}
                    </div>

                    <div
                      style={{
                        color:
                          "#fde68a",
                        marginTop: 6,
                      }}
                    >
                      Si procederà
                      ad asta.
                    </div>
                  </div>
                )
              )}
            </Card>
          )}

          <Card title="💳 Budget residui">
            <div
              style={{
                display:
                  "grid",
                gridTemplateColumns:
                  "repeat(2,minmax(0,1fr))",
                gap: 10,
              }}
            >
              {budgets.map(
                (b) => (
                  <div
                    key={
                      b.team_id
                    }
                    style={{
                      background:
                        "rgba(255,255,255,.04)",
                      border:
                        "1px solid rgba(255,255,255,.08)",
                      borderRadius: 14,
                      padding: 14,
                    }}
                  >
                    <div
                      style={{
                        fontWeight:
                          700,
                      }}
                    >
                      {teamName(
                        b.team_id
                      )}
                    </div>

                    <div
                      style={{
                        color:
                          "#facc15",
                        marginTop: 8,
                        fontWeight:
                          800,
                      }}
                    >
                      {
                        b.total_budget
                      }{" "}
                      mln
                    </div>
                  </div>
                )
              )}
            </div>
          </Card>

          <Card title="👥 Ruoli mancanti">
            <div
              style={{
                display:
                  "grid",
                gridTemplateColumns:
                  "repeat(2,minmax(0,1fr))",
                gap: 10,
              }}
            >
              {needs.map(
                (
                  n,
                  i
                ) => (
                  <div
                    key={i}
                    style={{
                      background:
                        "rgba(255,255,255,.04)",
                      border:
                        "1px solid rgba(255,255,255,.08)",
                      borderRadius: 14,
                      padding: 14,
                    }}
                  >
                    <div
                      style={{
                        fontWeight:
                          700,
                      }}
                    >
                      {teamName(
                        n.team_id
                      )}
                    </div>

                    <div
                      style={{
                        color:
                          "#cbd5e1",
                        marginTop: 8,
                      }}
                    >
                      {n.giocatori}{" "}
                      {n.ruolo}
                    </div>
                  </div>
                )
              )}
            </div>
          </Card>

          <Card title="📑 Tutte le buste">
            <div
              style={{
                display:
                  "grid",
                gridTemplateColumns:
                  "repeat(2,minmax(0,1fr))",
                gap: 14,
              }}
            >
              {teams
                .filter(
                  (t) =>
                    bids.some(
                      (
                        b
                      ) =>
                        b.team_id ===
                        t.team_id
                    )
                )
                .map(
                  (t) => {
                    const rows =
                      bids
                        .filter(
                          (
                            b
                          ) =>
                            b.team_id ===
                            t.team_id
                        )
                        .sort(
                          (
                            a,
                            b
                          ) =>
                            a.priority -
                            b.priority
                        );

                    return (
                      <div
                        key={
                          t.team_id
                        }
                        style={{
                          background:
                            "rgba(255,255,255,.04)",
                          border:
                            "1px solid rgba(255,255,255,.08)",
                          borderRadius: 16,
                          padding: 16,
                        }}
                      >
                        <div
                          style={{
                            color:
                              "#facc15",
                            fontWeight:
                              800,
                            marginBottom: 12,
                          }}
                        >
                          {
                            t.username
                          }
                        </div>

                        {rows.map(
                          (
                            r
                          ) => {
                            const p =
                              freeAgents.find(
                                (
                                  x
                                ) =>
                                  x.id ===
                                  r.player_id
                              );

                            return (
                              <div
                                key={
                                  r.id
                                }
                                style={{
                                  padding:
                                    "8px 0",
                                  borderTop:
                                    "1px solid rgba(255,255,255,.06)",
                                }}
                              >
                                <div>
                                  {r.priority}
                                  ° •{" "}
                                  {
                                    p?.ruolo
                                  }{" "}
                                  •{" "}
                                  {p?.display_name ??
                                    p?.player_name}
                                </div>

                                <div
                                  style={{
                                    color:
                                      "#facc15",
                                    fontWeight:
                                      700,
                                  }}
                                >
                                  {
                                    r.bid
                                  }{" "}
                                  mln
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    );
                  }
                )}
            </div>
          </Card>
        </>
      )}
    </div>
  </main>
);
}