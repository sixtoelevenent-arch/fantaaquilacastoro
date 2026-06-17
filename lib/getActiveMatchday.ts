import { supabase } from "@/lib/supabase";

export async function getActiveMatchday() {
  const { data, error } = await supabase
    .from("matchdays")
    .select("*")
    .eq("attiva", true)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}