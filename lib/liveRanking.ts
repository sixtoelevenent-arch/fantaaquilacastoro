import { supabase } from "@/lib/supabase";

export async function buildLiveRanking(
  matchdayId: number
) {

  const { data: matches } = await supabase
    .from("matches")
    .select("*")
    .eq("matchday_id", matchdayId);

  return matches || [];
}