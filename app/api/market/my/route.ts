import { NextRequest, NextResponse }
from "next/server";

export async function GET(
  request: NextRequest
) {
  const roundId =
    Number(
      request.nextUrl.searchParams.get(
        "roundId"
      )
    );

  return NextResponse.json({
    ok: true,
    roundId,
  });
}