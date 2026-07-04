import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const now = new Date().toISOString();

  const { data: rounds } = await admin
    .from("market_rounds")
    .select("*")
    .eq("status", "aperta");

  for (const round of rounds ?? []) {
    // SVINCOLI -> BUSTE
    if (
      round.session_type === "svincoli" &&
      round.release_deadline &&
      new Date(now) >=
        new Date(round.release_deadline)
    ) {
      await admin
        .from("market_releases")
        .update({
          confirmed: true,
          confirmed_at: now,
        })
        .eq("round_id", round.id)
        .eq("confirmed", false);

      const bidDeadline = new Date(
        Date.now() + 2 * 60 * 60 * 1000
      ).toISOString();

      await admin
        .from("market_rounds")
        .update({
          session_type: "buste",
          bid_deadline: bidDeadline,
        })
        .eq("id", round.id);
    }

    // BUSTE -> ELABORAZIONE
    if (
      round.session_type === "buste" &&
      round.bid_deadline &&
      new Date(now) >=
        new Date(round.bid_deadline)
    ) {
      await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/il-mio-mercato/process?roundId=${round.id}`
      );
    }
  }

  return NextResponse.json({
    ok: true,
  });
}