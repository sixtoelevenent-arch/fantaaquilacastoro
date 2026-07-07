import { importVotes } from "@/lib/importVotes";

export async function POST() {
  try {
    const result = await importVotes();

    return Response.json({
      success: true,
      ...result,
    });
  } catch (error: any) {

    console.error("IMPORT VOTES ERROR:");
    console.error(error);
    console.error(error?.stack);

    return Response.json({
      success: false,
      error: error?.message,
      stack: error?.stack,
    });
  }
}