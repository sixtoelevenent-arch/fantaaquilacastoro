import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      "https://v3.football.api-sports.io/fixtures?league=1&season=2026",
      {
        headers: {
          "x-apisports-key": process.env.API_FOOTBALL_KEY!,
        },
        cache: "no-store",
      }
    );

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: String(error),
      },
      { status: 500 }
    );
  }
}