"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import BackHome from "@/components/BackHome";

export default function ResetPage() {
  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  async function resetSimulation() {
    setLoading(true);
    setMessage("");

    try {
      await supabase
        .from("market_sim_assignments")
        .delete()
        .gt("id", 0);

      await supabase
        .from("market_sim_bids")
        .delete()
        .gt("id", 0);

      const {
        data: defaults,
        error,
      } = await supabase
        .from(
          "market_sim_team_defaults"
        )
        .select("*");

      if (error) {
        throw error;
      }

      for (const row of defaults ?? []) {
        await supabase
          .from("market_sim_teams")
          .upsert({
            team_id:
              row.team_id,
            budget:
              row.budget,
            slots:
              row.slots,
          });
      }

      setMessage(
        "✅ Simulazione ripristinata."
      );
    } catch (err) {
      console.error(err);

      setMessage(
        "❌ Errore durante il reset."
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
          ♻️ RESET SIMULAZIONE
        </h1>

        <div
          style={{
            background:
              "#111827",
            borderRadius: 16,
            padding: 20,
            textAlign:
              "center",
            color:
              "#cbd5e1",
            marginBottom: 20,
          }}
        >
          Verranno eliminati:
          <br />
          • tutte le buste
          <br />
          • tutte le assegnazioni
          <br />
          • budget e svincoli
          saranno riportati ai
          valori iniziali.
        </div>

        <button
          onClick={
            resetSimulation
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
          }}
        >
          {loading
            ? "⏳ Elaborazione..."
            : "♻️ RESETTA TUTTO"}
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