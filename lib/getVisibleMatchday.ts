import { supabase } from "@/lib/supabase";

export async function getVisibleMatchday() {
  const { data: activeMatchday } = await supabase
    .from("matchdays")
    .select("*")
    .eq("attiva", true)
    .single();

  if (!activeMatchday) return null;

  const now = new Date();

  const chiusura = activeMatchday.chiusura_formazioni
    ? new Date(activeMatchday.chiusura_formazioni)
    : null;

  const preLive =
    chiusura !== null &&
    now < chiusura;

  return {
    ...activeMatchday,
    preLive,
  };
}