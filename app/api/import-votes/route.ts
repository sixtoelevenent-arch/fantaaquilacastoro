
import { importVotes } from "@/lib/importVotes";

export async function GET() {
  try {
    const result = await importVotes();

    return Response.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    return Response.json({
      success: false,
      error: error.message,
    });
  }
}