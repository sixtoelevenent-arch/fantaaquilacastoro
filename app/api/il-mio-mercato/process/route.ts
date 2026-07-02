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

  const { data: existing } =
    await admin
      .from("market_assignments")
      .select("id")
      .eq("round_id", roundId)
      .limit(1);

  if (existing?.length) {
    return NextResponse.json({
      ok: true,
      assignments: [],
      priorityTies: [],
      auctionTies: [],
      alreadyProcessed: true,
    });
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
      .select("*")
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

const { data: released } =
  await admin
    .from("market_release_players")
    .select(`
      player_id,
      players!inner(
        ruolo
      ),
      market_releases!inner(
        team_id,
        round_id
      )
    `);

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
    if (
      r.market_releases
        .round_id !== roundId
    ) {
      return;
    }

    const teamId =
      r.market_releases.team_id;

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
    if (
      r.market_releases
        .round_id !== roundId
    ) {
      return;
    }

    const teamId =
      r.market_releases.team_id;

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

console.log(
  "remainingSlots",
  Object.fromEntries(
    remainingSlots
  )
);

console.log(
  "roleSlots",
  Object.fromEntries(
    roleSlots
  )
);

  const budgetsMap =
    new Map<number, number>();

  budgets?.forEach((b: any) => {
    budgetsMap.set(
      b.team_id,
      b.total_budget
    );
  });

    const assignments: any[] = [];
  const priorityTies: any[] = [];
  const auctionTies: any[] = [];

  for (const player of
    freeAgents ?? []) {

    const playerBids =
      (bids ?? []).filter(
        (b: any) =>
          b.player_id ===
          player.id
      );

      console.log(
  "PLAYER",
  player.player_name,
  player.id,
  "BIDS",
  playerBids.length
);

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

          return budget >= b.bid;       
        }
      );

    if (
      availableBids.length ===
      0
    ) {
      continue;
    }

    availableBids.sort(
      (a: any, b: any) => {
        if (b.bid !== a.bid) {
          return (
            b.bid - a.bid
          );
        }

        return (
          a.priority -
          b.priority
        );
      }
    );

    console.log(
  "AVAILABLE",
  player.player_name,
  availableBids.map(
    (x: any) => ({
      team: x.team_id,
      bid: x.bid,
      priority: x.priority,
    })
  )
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
          teams:
            samePriority.map(
              (x: any) =>
                teamName(
                  x.team_id
                )
            ),
        });

        continue;
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

    remainingSlots.set(
      winner.team_id,
      Math.max(
        (remainingSlots.get(
          winner.team_id
        ) ?? 0) - 1,
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

    let playerId =
      player.players_id;

    if (!playerId) {
      const {
        data: created,
      } = await admin
        .from("players")
        .insert({
          nome:
            player.display_name ??
            player.player_name,
          ruolo:
            player.ruolo,
          nazionale:
            player.nazionale,
          prezzo:
            winner.bid,
          team_id:
            winner.team_id,
          fantapiu3_name:
            player.player_name,
        })
        .select("id")
        .single();

      playerId =
        created?.id;

      if (playerId) {
        await admin
          .from(
            "free_agents"
          )
          .update({
            players_id:
              playerId,
          })
          .eq(
            "id",
            player.id
          );
      }
    } else {
      await admin
        .from("players")
        .update({
          team_id:
            winner.team_id,
          prezzo:
            winner.bid,
        })
        .eq(
          "id",
          playerId
        );
    }

    if (!playerId) {
      continue;
    }

    await admin
      .from("free_agents")
      .update({
        disponibile: false,
      })
      .eq(
        "id",
        player.id
      );

    await admin
      .from(
        "market_budgets"
      )
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

    await admin
      .from(
        "market_assignments"
      )
      .insert({
        round_id:
          roundId,
        player_id:
          playerId,
        team_id:
          winner.team_id,
        price:
          winner.bid,
      });

    assignments.push({
      player_id:
        player.id,
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

  await admin
    .from("market_rounds")
    .update({
      status: "chiuso",
    })
    .eq("id", roundId);

  assignments.sort(
    (a, b) =>
      b.bid - a.bid
  );

  return NextResponse.json({
    ok: true,
    assignments,
    priorityTies,
    auctionTies,
  });
}