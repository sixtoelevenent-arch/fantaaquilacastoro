"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import BackHome from "@/components/BackHome";

type Bid = {
  team_id: number;
  player_id: number;
  bid: number;
  priority: number;
};

export default function EseguiSimulazionePage() {
  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  async function executeSimulation() {
  setLoading(true);
  setMessage("");
  const ok = window.confirm(
  "Eseguire la simulazione?"
);

if (!ok) {
  setLoading(false);
  return;
}

  try {
    await supabase
      .from("market_sim_assignments")
      .delete()
      .gt("id", 0);

    const {
      data: bidsData,
      error,
    } = await supabase
      .from("market_sim_bids")
      .select(`
        team_id,
        player_id,
        bid,
        priority
      `);

    if (error) {
      throw error;
    }

    const bids =
      (bidsData as Bid[]) ?? [];

    if (bids.length === 0) {
      setMessage(
        "Nessuna busta presente."
      );
      setLoading(false);
      return;
    }

    const {
      data: teamsData,
      error: teamsError,
    } = await supabase
      .from("market_sim_teams")
      .select(`
        team_id,
        budget,
        slots
      `);

    if (teamsError) {
      throw teamsError;
    }

    const teams = new Map<
      number,
      {
        budget: number;
        slots: number;
      }
    >();

    (teamsData ?? []).forEach(
      (t: any) => {
        teams.set(t.team_id, {
          budget: t.budget ?? 0,
          slots: t.slots ?? 0,
        });
      }
    );

    const grouped =
      new Map<number, Bid[]>();

    bids.forEach((b) => {
      if (
        !grouped.has(
          b.player_id
        )
      ) {
        grouped.set(
          b.player_id,
          []
        );
      }

      grouped
        .get(
          b.player_id
        )!
        .push(b);
    });

    const assignments: {
      team_id: number;
      player_id: number;
      price: number;
    }[] = [];

    grouped.forEach(
      (playerBids) => {
        playerBids.sort(
          (a, b) => {
            if (
              b.bid !==
              a.bid
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

        for (const bid of playerBids) {
          const team =
            teams.get(
              bid.team_id
            );

          if (!team) {
            continue;
          }

          if (
            team.slots <= 0
          ) {
            continue;
          }

          if (
            team.budget <
            bid.bid
          ) {
            continue;
          }

          assignments.push({
            team_id:
              bid.team_id,
            player_id:
              bid.player_id,
            price:
              bid.bid,
          });

          team.slots -= 1;
          team.budget -= bid.bid;

          break;
        }
      }
    );

    if (
      assignments.length > 0
    ) {
      const { error } =
        await supabase
          .from(
            "market_sim_assignments"
          )
          .insert(
            assignments
          );

      if (error) {
        throw error;
      }
    }
for (const [
  teamId,
  team,
] of teams.entries()) {
  await supabase
    .from("market_sim_teams")
    .update({
      budget: team.budget,
      slots: team.slots,
    })
    .eq("team_id", teamId);
}
    setMessage(
      `✅ Simulazione completata. Assegnati ${assignments.length} giocatori.`
    );
  } catch (err) {
    console.error(err);

    setMessage(
      "❌ Errore durante la simulazione."
    );
  }

  setLoading(false);
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
          maxWidth: 700,
          margin: "0 auto",
        }}
      >
        <BackHome />

        <h1
          style={{
            textAlign:
              "center",
            marginBottom: 24,
          }}
        >
          🚀 ESEGUI
          SIMULAZIONE
        </h1>

        <div
          style={{
            background:
              "#111827",
            borderRadius: 16,
            padding: 20,
            marginBottom: 20,
            textAlign:
              "center",
            color:
              "#cbd5e1",
            lineHeight: 1.6,
          }}
        >
          Verranno eliminate
          tutte le assegnazioni
          precedenti e verranno
          ricalcolati i vincitori
          delle buste simulate.
        </div>

        <button
          onClick={
            executeSimulation
          }
          disabled={loading}
          style={{
            width: "100%",
            padding: 22,
            border: "none",
            borderRadius: 16,
            background:
              loading
                ? "#475569"
                : "#dc2626",
            color: "white",
            fontWeight: 900,
            fontSize:
              "1.1rem",
            cursor:
              loading
                ? "default"
                : "pointer",
          }}
        >
          {loading
            ? "⏳ Elaborazione..."
            : "🚀 ESEGUI SIMULAZIONE"}
        </button>

        {message && (
          <div
            style={{
              background:
                "#111827",
              borderRadius: 16,
              padding: 20,
              marginTop: 20,
              textAlign:
                "center",
              color:
                "#cbd5e1",
            }}
          >
            {message}
          </div>
        )}
      </div>
    </main>
  );
}