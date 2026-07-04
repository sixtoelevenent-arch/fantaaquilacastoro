import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: NextRequest
) {
  const roundId = Number(
    request.nextUrl.searchParams.get(
      "roundId"
    )
  );

  if (!roundId) {
    console.log(
  "PROCESS START",
  roundId
);

    return NextResponse.json(
      {
        ok: false,
        error: "roundId mancante",
      },
      { status: 400 }
    );
  }

  const { data: round } =
  await admin
    .from("market_rounds")
   .select(`
  status,
  session_type,
  bid_deadline,
  current_bid_session,
  extra_session_duration
`)
    .eq("id", roundId)
    .single();
    
if (!round) {
  return NextResponse.json(
    {
      ok: false,
      error: "Round non trovato",
    },
    { status: 404 }
  );
}

if (
  round.status === "attesa" &&
  round.bid_deadline &&
  new Date() >=
    new Date(round.bid_deadline)
) {
  const nextDeadline =
    new Date(
      new Date(
        round.bid_deadline
      ).getTime() +
        60 * 60 * 1000
    ).toISOString();

  await admin
    .from("market_bids")
    .delete()
    .eq("round_id", roundId);

  await admin
    .from("market_releases")
    .update({
      bids_confirmed: false,
      bids_confirmed_at: null,
    })
    .eq("round_id", roundId);

  await admin
    .from("market_rounds")
    .update({
      status: "aperta",
      session_type: "buste",
      bid_deadline:
        nextDeadline,
    })
    .eq("id", roundId);

  return NextResponse.json({
    ok: true,
    reopened: true,
  });
}

if (round.status === "chiusa") {
  return NextResponse.json({
    ok: true,
    assignments: [],
    priorityTies: [],
    auctionTies: [],
    alreadyProcessed: true,
  });
}

  const { data: existing } =
    await admin
      .from("market_assignments")
      .select("id")
      .eq("round_id", roundId)
      .limit(1);

      console.log("ROUND ID", roundId);
console.log("EXISTING", existing);

 if (existing?.length) {
  return NextResponse.json({
    ok: true,
    assignments: [],
    priorityTies: [],
    auctionTies: [],
    alreadyProcessed: true,
    debug: "market already processed",
  });
}

const { data: releases } =
  await admin
    .from("market_release_players")
    .select(`
      player_id,
      market_releases_id,
      automatic,
      players!inner(
        ruolo
      ),
      market_releases!inner(
        team_id,
        round_id
      )
    `);

for (const r of releases ?? []) {
  const marketRelease = 
  Array.isArray(
  r.market_releases
)
  ? r.market_releases[0]
  : r.market_releases;
  if (
    marketRelease.round_id !==
    roundId
  ) {
    continue;
  }

  const teamId =
    marketRelease.team_id;

  const playerId =
    r.player_id;

    const { data: releasedPlayer } =
  await admin
    .from("players")
    .update({
      team_id: null,
    })
    .eq("id", playerId)
    .eq("team_id", teamId)
    .select("id")
    .single();

if (releasedPlayer) {
  await admin
    .from("free_agents")
    .update({
      disponibile: true,
      blocked_team_id:
        r.automatic
          ? null
          : teamId,
      is_optional_release:
        !r.automatic,
      released_by_team_id:
        teamId,
    })
    .eq(
      "players_id",
      playerId
    );
}

}

  const { data: bids } =
    await admin
      .from("market_bids")
      .select("*")
      .eq("round_id", roundId);

      console.log(
  "BIDS",
  bids?.length
);

  const { data: freeAgents } =
  await admin
    .from("free_agents")
    .select(`
      players_id,
      player_name,
      display_name,
      nazionale,
      ruolo,
      quotazione,
      blocked_team_id,
      disponibile
    `)
    .eq("disponibile", true);

      console.log(
  "FREE AGENTS",
  freeAgents?.length
);

  const { data: budgets } =
    await admin
      .from("market_budgets")
      .select(`
        team_id,
        total_budget
      `);

  const { data: teams } =
  await admin
    .from("fantasy_users")
    .select(`
      username,
      team_id
    `);

    function teamName(
  teamId: number
) {
  return (
    teams?.find(
      (t: any) =>
        t.team_id === teamId
    )?.username ?? "-"
  );
}

const released = [...
  (releases ?? [])];

     const remainingSlots =
  new Map<number, number>();

teams?.forEach((t: any) => {
  remainingSlots.set(
    t.team_id,
    0
  );
});


(released ?? []).forEach(
  (r: any) => {
    const marketRelease = 
  Array.isArray(
  r.market_releases
)
  ? r.market_releases[0]
  : r.market_releases;
  
    if (
      marketRelease.round_id !== roundId
    ) {
      return;
    }

    const teamId =
      marketRelease.team_id;

    remainingSlots.set(
      teamId,
      (
        remainingSlots.get(
          teamId
        ) ?? 0
      ) + 1
    );
  }
);

const roleSlots =
  new Map<
    number,
    {
      P: number;
      D: number;
      C: number;
      A: number;
    }
  >();

teams?.forEach((t: any) => {
  roleSlots.set(
    t.team_id,
    {
      P: 0,
      D: 0,
      C: 0,
      A: 0,
    }
  );
});

(released ?? []).forEach(
  (r: any) => {
    const marketRelease = 
  Array.isArray(
  r.market_releases
)
  ? r.market_releases[0]
  : r.market_releases;
  
    if (
      marketRelease.round_id !== roundId
    ) {
      return;
    }

    const teamId =
      marketRelease.team_id;

    const ruolo =
      r.players.ruolo;

    const slots =
      roleSlots.get(teamId);

    if (slots) {
      slots[
        ruolo as keyof typeof slots
      ]++;
    }
  }
);

console.log(
  "released",
  JSON.stringify(
    released,
    null,
    2
  )
);

released?.forEach((r: any) => {
  console.log(
    "TEAM",
    r.market_releases.team_id,
    "PLAYER",
    r.player_id,
    "PLAYERS",
    JSON.stringify(r.players)
  );
});

console.log(
  "remainingSlots",
  Object.fromEntries(
    remainingSlots
  )
);

console.log(
  "TEAM14 SLOTS",
  remainingSlots.get(14)
);

console.log(
  "TEAM14 ROLE SLOTS",
  roleSlots.get(14)
);

console.log(
  "roleSlots",
  Object.fromEntries(
    roleSlots
  )
);

  const budgetsMap =
    new Map<number, number>();

    const debug: any = {};

  budgets?.forEach((b: any) => {
    budgetsMap.set(
      b.team_id,
      b.total_budget
    );
  });

  debug.remainingSlots =
  Object.fromEntries(
    remainingSlots
  );

debug.roleSlots =
  Object.fromEntries(
    roleSlots
  );

debug.budgets =
  Object.fromEntries(
    budgetsMap
  );

console.log(
  "BUDGETS FROM DB",
  budgets
);

console.log(
  "BUDGETS MAP",
  Object.fromEntries(
    budgetsMap
  )
);

    const assignments: any[] = [];
  const priorityTies: any[] = [];
  const auctionTies: any[] = [];
  
   for (const player of
    freeAgents ?? []) {

    const playerBids =
      (bids ?? []).filter(
        (b: any) =>
          b.player_id === player.players_id
      );
      

  console.log(
  "PLAYER",
  player.player_name,
  player.players_id,
  "BIDS",
  playerBids.length
);

if (playerBids.length > 0) {
  console.log(
    "MATCH",
    player.players_id,
    player.player_name,
    playerBids
  );
}

    if (
      playerBids.length === 0
    ) {
      continue;
    }

    const availableBids =
  playerBids.filter(
    (b: any) => {
      const budget =
        budgetsMap.get(
          b.team_id
        ) ?? 0;

      const slots =
        remainingSlots.get(
          b.team_id
        ) ?? 0;

      const role =
        player.ruolo as
          keyof {
            P: number;
            D: number;
            C: number;
            A: number;
          };

      const roleRemaining =
        roleSlots
          .get(b.team_id)
          ?.[role] ?? 0;

      if (!debug.filters) {
        debug.filters = [];
      }

      debug.filters.push({
        player:
          player.player_name,
        team: b.team_id,
        budget,
        slots,
        role,
        roleRemaining,
        bid: b.bid,
      });

      return (
  budget >= b.bid &&
  slots > 0 &&
  roleRemaining > 0 &&
  player.blocked_team_id !==
    b.team_id
);
    }
  );

if (availableBids.length === 0) {
  console.log(
    "NO AVAILABLE",
    player.players_id,
    player.player_name,
    playerBids
  );

  continue;
}

availableBids.sort((a, b) => {
  if (b.bid !== a.bid) {
    return b.bid - a.bid;
  }

  return a.priority - b.priority;
});

console.log(
  "AVAILABLE",
  player.player_name,
  availableBids.map((x) => ({
    team: x.team_id,
    bid: x.bid,
    priority: x.priority,
  }))
);

   const bestBid =
      availableBids[0].bid;

    const contenders =
      availableBids.filter(
        (b: any) =>
          b.bid === bestBid
      );

    let winner: any =
      undefined;

    if (
      contenders.length === 1
    ) {
      winner =
        contenders[0];
    } else {
      contenders.sort(
        (a: any, b: any) =>
          a.priority -
          b.priority
      );

      const bestPriority =
        contenders[0]
          .priority;

      const samePriority =
        contenders.filter(
          (b: any) =>
            b.priority ===
            bestPriority
        );

      if (
        samePriority.length ===
        1
      ) {
        winner =
          samePriority[0];

        priorityTies.push({
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
                (x: any) =>
                  x.team_id !==
                  winner.team_id
              )
              .map(
                (x: any) =>
                  teamName(
                    x.team_id
                  )
              )
              .join(", "),
        });
      } else {
        auctionTies.push({
  player_name:
    player.display_name ??
    player.player_name,
  bid: bestBid,
  teams: samePriority.map(
    (x: any) =>
      teamName(x.team_id)
  ),
});

winner =
  samePriority[
    Math.floor(
      Math.random() *
      samePriority.length
    )
  ];
      }
    }

    const currentBudget =
      budgetsMap.get(
        winner.team_id
      ) ?? 0;

    budgetsMap.set(
      winner.team_id,
      currentBudget -
        winner.bid
    );

    const slotToConsume =
      released.find(
        (r: any) => {
          const marketRelease =
            Array.isArray(
              r.market_releases
            )
              ? r.market_releases[0]
              : r.market_releases;

          return (
            marketRelease?.round_id ===
              roundId &&
            marketRelease?.team_id ===
              winner.team_id &&
            r.players.ruolo ===
              player.ruolo
          );
        }
      );

    if (slotToConsume) {
      remainingSlots.set(
        winner.team_id,
        Math.max(
          (
            remainingSlots.get(
              winner.team_id
            ) ?? 0
          ) - 1,
          0
        )
      );

      const slots =
        roleSlots.get(
          winner.team_id
        );

      if (slots) {
        const ruolo =
          player.ruolo as keyof typeof slots;

        slots[ruolo] = Math.max(
          slots[ruolo] - 1,
          0
        );
      }
    }

const playerId = player.players_id;

const {
  error: updatePlayerError,
} = await admin
  .from("players")
  .update({
    team_id: winner.team_id,
    prezzo: winner.bid,
  })
  .eq("id", playerId);

  const { data: updatedPlayer } =
  await admin
    .from("players")
    .select(`
      id,
      nome,
      team_id,
      prezzo
    `)
    .eq("id", playerId)
    .single();

console.log(
  "UPDATED PLAYER",
  updatedPlayer
);

if (updatePlayerError) {
  console.error(
    "UPDATE PLAYER ERROR",
    updatePlayerError
  );
}

   const {
  error: freeAgentError,
} = await admin
  .from("free_agents")
  .update({
    disponibile: false,
  })
  .eq(
    "players_id",
    player.players_id
  );

  const { data: faCheck } =
  await admin
    .from("free_agents")
    .select(`
      id,
      player_name,
      disponibile
    `)
    .eq(
      "player_name",
      player.player_name
    );

console.log(
  "FREE AGENT UPDATED",
  faCheck
);

if (freeAgentError) {
  console.error(
    "FREE AGENT ERROR",
    freeAgentError
  );
}

const {
  error: budgetError,
} = await admin
  .from("market_budgets")
  .update({
    total_budget:
      budgetsMap.get(
        winner.team_id
      ),
  })
  .eq(
    "team_id",
    winner.team_id
  );

if (budgetError) {
  console.error(
    "BUDGET ERROR",
    budgetError
  );
}

    const {
  error: assignmentError,
} = await admin
  .from("market_assignments")
  .insert({
    round_id: roundId,
    player_id: playerId,
    team_id: winner.team_id,
    price: winner.bid,
  });

if (assignmentError) {
  console.error(
    "ASSIGNMENT ERROR",
    assignmentError
  );
} else {
  
  if (slotToConsume) {
    await admin
      .from("market_release_players")
      .delete()
      .eq(
        "player_id",
        slotToConsume.player_id
      )
      .eq(
        "market_releases_id",
        slotToConsume.market_releases_id
      );

   const index =
  released.findIndex((r: any) => {
    const marketRelease = Array.isArray(r.market_releases)
      ? r.market_releases[0]
      : r.market_releases;

    return (
      r.player_id === slotToConsume.player_id &&
      marketRelease.team_id === winner.team_id
    );
  });

    if (index >= 0) {
      released.splice(index, 1);
    }
  }

   assignments.push({
  player_id: playerId,
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
}

  assignments.sort(
    (a, b) =>
      b.bid - a.bid
  );

const {
  data: statusRows,
} = await admin
  .from("market_team_status")
  .select(`
    p_missing,
    d_missing,
    c_missing,
    a_missing
  `);

const missingPlayers =
  (statusRows ?? []).reduce(
    (sum: number, t: any) =>
      sum +
      Number(t.p_missing) +
      Number(t.d_missing) +
      Number(t.c_missing) +
      Number(t.a_missing),
    0
  );

  if (missingPlayers === 0) {
await admin
  .from("market_rounds")
  .update({
    status: "chiusa",
    session_type: null,
  })
  .eq("id", roundId);
} else {
  const nextSession =
    (round.current_bid_session ?? 1) + 1;

  const nextStart = new Date();

  nextStart.setMinutes(0);
  nextStart.setSeconds(0);
  nextStart.setMilliseconds(0);
  nextStart.setHours(
    nextStart.getHours() + 1
  );

  await admin
    .from("market_rounds")
    .update({
      status: "attesa",
      session_type: null,
      bid_deadline:
        nextStart.toISOString(),
      current_bid_session:
        nextSession,
    })
    .eq("id", roundId);
}

  return NextResponse.json({
  ok: true,
  assignments,
  priorityTies,
  auctionTies,
  debug,
});
}