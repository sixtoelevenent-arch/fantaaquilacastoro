import { NextResponse } from "next/server";
import { importVotes } from "@/lib/importVotes";

export async function POST(req: Request) {
  
    try {
    const result =
      await importVotes();

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error:
          err?.message ||
          "Errore import",
      },
      {
        status: 500,
      }
    );
  }
}