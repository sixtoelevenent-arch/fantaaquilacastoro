import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const now = new Date();

  const { data: round } = await admin
    .from("market_rounds")
    .select("*")
    .eq("id", 2)
    .single();

  if (!round) {
    return NextResponse.json({
      ok: false,
      error: "Round non trovato",
    });
  }

  //
  // 07:00 APERTURA SVINCOLI
  //

  if (
    round.status === "pending" &&
    !round.session_type &&
    round.svincoli_open_at &&
    now >= new Date(round.svincoli_open_at)
  ) {
    await admin
      .from("market_rounds")
      .update({
        status: "aperta",
        session_type: "svincoli",
      })
      .eq("id", 2);

    return NextResponse.json({
      ok: true,
      event: "svincoli_opened",
    });
  }

  //
  // 11:00 CHIUSURA SVINCOLI
  //

  if (
    round.status === "aperta" &&
    round.session_type === "svincoli" &&
    round.svincoli_close_at &&
    now >= new Date(round.svincoli_close_at)
  ) {
    await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/market/process-releases?roundId=2`
    );

    await admin
      .from("market_rounds")
      .update({
        session_type: "buste",
      })
      .eq("id", 2);

    return NextResponse.json({
      ok: true,
      event: "first_session_opened",
    });
  }

  //
  // 13:00 PRIMA ELABORAZIONE
  //

  if (
    round.status === "aperta" &&
    round.session_type === "buste" &&
    round.first_session_close_at &&
    now >= new Date(round.first_session_close_at)
  ) {
    await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/il-mio-mercato/process?roundId=2`
    );

    const { data: incomplete } =
      await admin.rpc(
        "count_incomplete_teams"
      );

    if (
      Number(incomplete) === 0
    ) {
      await admin
        .from("market_rounds")
        .update({
          status: "chiuso",
        })
        .eq("id", 2);

      return NextResponse.json({
        ok: true,
        event: "market_closed",
      });
    }

    return NextResponse.json({
      ok: true,
      event: "second_session_opened",
    });
  }

  //
  // 15:00 SECONDA ELABORAZIONE
  //

  if (
    round.status === "aperta" &&
    round.session_type === "buste" &&
    round.second_session_close_at &&
    now >= new Date(round.second_session_close_at)
  ) {
    await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/il-mio-mercato/process?roundId=2`
    );

    const { data: incomplete } =
      await admin.rpc(
        "count_incomplete_teams"
      );

    if (
      Number(incomplete) === 0
    ) {
      await admin
        .from("market_rounds")
        .update({
          status: "chiuso",
        })
        .eq("id", 2);

      return NextResponse.json({
        ok: true,
        event: "market_closed",
      });
    }

    return NextResponse.json({
      ok: true,
      event: "extra_session_opened",
    });
  }

  //
  // 16:00 CHIUSURA FINALE
  //

  if (
    round.status === "aperta" &&
    round.session_type === "buste" &&
    round.second_session_close_at
  ) {
    const finalClose =
      new Date(
        round.second_session_close_at
      );

    finalClose.setMinutes(
      finalClose.getMinutes() +
        (round.extra_session_duration ??
          60)
    );

    if (now >= finalClose) {
      await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/il-mio-mercato/process?roundId=2`
      );

      await admin
        .from("market_rounds")
        .update({
          status: "chiuso",
        })
        .eq("id", 2);

      return NextResponse.json({
        ok: true,
        event: "market_closed",
      });
    }
  }

  return NextResponse.json({
    ok: true,
    event: "nothing_to_do",
  });
}
