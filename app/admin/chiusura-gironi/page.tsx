"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import BackHome from "@/components/BackHome";

type Standing = {
  id: number;
  pt: number;
  gf: number;
  gs: number;
  dr: number;
  fp: number;
  gruppo: string;
};

export default function ChiusuraGironiPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function chiudiGironi() {
    try {
      setLoading(true);
      setMessage("");

      const { data: teams, error: teamsError } =
        await supabase
          .from("teams")
          .select("*");

      if (teamsError) throw teamsError;

      const { data: matches, error: matchesError } =
        await supabase
          .from("matches")
          .select("*");

      if (matchesError) throw matchesError;

      const standings =
        new Map<number, Standing>();

      (teams ?? []).forEach((t: any) => {
        standings.set(t.id, {
          id: t.id,
          gruppo: t.gruppo,
          pt: 0,
          gf: 0,
          gs: 0,
          dr: 0,
          fp: 0,
        });
      });

      (matches ?? []).forEach((m: any) => {
        const home =
          standings.get(m.team_home_id);

        const away =
          standings.get(m.team_away_id);

        if (!home || !away) {
          return;
        }

        home.gf += m.gol_home ?? 0;
        home.gs += m.gol_away ?? 0;
        home.fp += Number(
          m.fp_home ?? 0
        );

        away.gf += m.gol_away ?? 0;
        away.gs += m.gol_home ?? 0;
        away.fp += Number(
          m.fp_away ?? 0
        );

        home.dr =
          home.gf - home.gs;

        away.dr =
          away.gf - away.gs;

        if (
          (m.gol_home ?? 0) >
          (m.gol_away ?? 0)
        ) {
          home.pt += 3;
        } else if (
          (m.gol_home ?? 0) <
          (m.gol_away ?? 0)
        ) {
          away.pt += 3;
        } else {
          home.pt += 1;
          away.pt += 1;
        }
      });

      const sortGirone = (
        a: Standing,
        b: Standing
      ) => {
        if (b.pt !== a.pt)
          return b.pt - a.pt;

        if (b.fp !== a.fp)
          return b.fp - a.fp;

        if (b.dr !== a.dr)
          return b.dr - a.dr;

        return 0;
      };

      const gironeA =
        [...standings.values()]
          .filter(
            (t) => t.gruppo === "A"
          )
          .sort(sortGirone);

      const gironeB =
        [...standings.values()]
          .filter(
            (t) => t.gruppo === "B"
          )
          .sort(sortGirone);

      const gironeC =
        [...standings.values()]
          .filter(
            (t) => t.gruppo === "C"
          )
          .sort(sortGirone);

      const prime = [
        gironeA[0],
        gironeB[0],
        gironeC[0],
      ].filter(Boolean);

      const seconde = [
        gironeA[1],
        gironeB[1],
        gironeC[1],
      ].filter(Boolean);

      const miglioriTerze = [
        gironeA[2],
        gironeB[2],
        gironeC[2],
      ]
        .filter(Boolean)
        .sort(sortGirone);

      const terzeQualificate =
        miglioriTerze.slice(0, 2);

      await supabase
        .from("market_budgets")
        .update({
          group_bonus: 0,
        })
        .gt("team_id", 0);

      if (prime.length) {
        await supabase
          .from("market_budgets")
          .update({
            group_bonus: 100,
          })
          .in(
            "team_id",
            prime.map(
              (t: any) => t.id
            )
          );
      }

      if (seconde.length) {
        await supabase
          .from("market_budgets")
          .update({
            group_bonus: 50,
          })
          .in(
            "team_id",
            seconde.map(
              (t: any) => t.id
            )
          );
      }

      if (
        terzeQualificate.length
      ) {
        await supabase
          .from("market_budgets")
          .update({
            group_bonus: 20,
          })
          .in(
            "team_id",
            terzeQualificate.map(
              (t: any) => t.id
            )
          );
      }

      const { data: budgets } =
        await supabase
          .from("market_budgets")
          .select("*");

      for (const b of budgets ?? []) {
        await supabase
          .from("market_budgets")
          .update({
            total_budget:
              b.leftover_budget +
              b.group_bonus +
              b.automatic_refunds +
              b.manual_refunds,
          })
          .eq(
            "team_id",
            b.team_id
          );
      }

      setMessage(
        "✅ Gironi chiusi e bonus assegnati."
      );
    } catch (e) {
      console.error(e);
      setMessage(
        "❌ Errore durante la chiusura."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom,#0f172a,#020617)",
        color: "white",
        padding: 16,
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
            textAlign: "center",
            color: "#facc15",
            marginTop: 20,
          }}
        >
          🔒 Chiusura Gironi
        </h1>

        <div
          style={{
            background:
              "rgba(255,255,255,0.05)",
            border:
              "1px solid rgba(255,255,255,0.1)",
            borderRadius: 20,
            padding: 20,
            marginTop: 24,
          }}
        >
          <p
            style={{
              color: "#cbd5e1",
              lineHeight: 1.6,
            }}
          >
            Questa operazione:
            <br />
            • assegna +100 mln alle
            prime classificate
            <br />
            • assegna +50 mln alle
            seconde classificate
            <br />
            • assegna +20 mln alle due
            migliori terze
            <br />
            • ricalcola i budget di
            mercato
          </p>

          <button
            onClick={chiudiGironi}
            disabled={loading}
            style={{
              width: "100%",
              marginTop: 20,
              padding: "14px",
              border: "none",
              borderRadius: 14,
              background:
                loading
                  ? "#64748b"
                  : "#facc15",
              color: "#000",
              fontWeight: 800,
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            {loading
              ? "⏳ Elaborazione..."
              : "🏆 Chiudi Gironi"}
          </button>

          {message && (
            <div
              style={{
                marginTop: 16,
                textAlign: "center",
                fontWeight: 700,
              }}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}