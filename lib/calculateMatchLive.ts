import { supabase } from "@/lib/supabase";
import { calculateTeam } from "@/lib/fantacalcio";

export async function calculateMatchLive(
  matchId: number
) {

const nationalExists = new Set<string>();
const nationalFinalized = new Set<string>();  
  const { data: matchData } = await supabase
    .from("matches")
    .select("*")
    .eq("id", matchId)
    .single();

  if (!matchData) {
    return null;
  }

  const { data: homeFormation } = await supabase
    .from("formations")
    .select("id")
    .eq("team_id", matchData.team_home_id)
    .eq("matchday_id", matchData.matchday_id)
    .single();

  const { data: awayFormation } = await supabase
    .from("formations")
    .select("id")
    .eq("team_id", matchData.team_away_id)
    .eq("matchday_id", matchData.matchday_id)
    .single();

  const { data: homeRows } = await supabase
    .from("formation_players")
    .select(`
      player_id,
      titolare,
      posizione,
      ordine_panchina,
      players!formation_players_player_id_fkey (
        nome,
        ruolo,
        nazionale
      )
    `)
    .eq("formation_id", homeFormation?.id);

  const { data: awayRows } = await supabase
    .from("formation_players")
    .select(`
      player_id,
      titolare,
      posizione,
      ordine_panchina,
      players!formation_players_player_id_fkey (
        nome,
        ruolo,
        nazionale
      )
    `)
    .eq("formation_id", awayFormation?.id);

  const { data: votes } = await supabase
    .from("player_votes")
    .select("*")
    .eq("matchday_id", matchData.matchday_id);

  const votesMap = new Map();

  (votes || []).forEach((v) => {
    votesMap.set(v.player_id, v);
  });

  const normalize = (rows: any[]) =>
    (rows || []).map((r) => {

      const voteData =
        votesMap.get(r.player_id);

      return {

        player_id: r.player_id,

        nome: r.players?.nome ?? "",
        ruolo: r.players?.ruolo ?? "",
        nazionale: r.players?.nazionale ?? "",

        titolare: r.titolare,
        posizione: r.posizione,
        ordine_panchina: r.ordine_panchina,

        hasVoteRow: !!voteData,

        voto: voteData?.voto ?? null,
        sv: voteData?.sv ?? null,

        gol: voteData?.gol ?? 0,
        assist: voteData?.assist ?? 0,

        ammonizione:
          voteData?.ammonizione ?? false,

        espulsione:
          voteData?.espulsione ?? false,

        autogol:
          voteData?.autogol ?? 0,

        rigori_parati:
          voteData?.rigori_parati ?? 0,

        rigori_sbagliati:
          voteData?.rigori_sbagliati ?? 0,

        gol_subiti:
          voteData?.gol_subiti ?? 0,

        clean_sheet:
          voteData?.clean_sheet ?? false,

                };

    });

  const homePlayers =
    normalize(homeRows || []);

  const awayPlayers =
    normalize(awayRows || []);

  const homeCalc = calculateTeam(
    homePlayers.filter((p) => p.titolare),
    homePlayers.filter((p) => !p.titolare),
    votesMap,
    false
  );

  const awayCalc = calculateTeam(
    awayPlayers.filter((p) => p.titolare),
    awayPlayers.filter((p) => !p.titolare),
    votesMap,
    false
  );

  return {

    homeFP:
      homeCalc.fantapoints,

    awayFP:
      awayCalc.fantapoints,

    homeGoals:
      homeCalc.projectedGoals,

    awayGoals:
      awayCalc.projectedGoals,
  };
}