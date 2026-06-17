import { supabase } from "@/lib/supabase";

export async function getActiveMatchday() {
  const { data } = await supabase
    .from("matchdays")
    .select("*")
    .lte(
      "chiusura_formazioni",
      new Date().toISOString()
    )
    .order("ordine", {
      ascending: false,
    })
    .limit(1)
    .single();

  return data;
}