export function calcBonusMalus(player: any) {
  let bonus = 0;

  bonus += (player.gol || 0) * 3;
  bonus += (player.assist || 0) * 1;

  bonus += (player.rigori_parati || 0) * 3;
  bonus -= (player.rigori_sbagliati || 0) * 3;

  bonus -= (player.autogol || 0) * 2;

  if (player.ammonizione) bonus -= 0.5;
  if (player.espulsione) bonus -= 1;

  if (player.ruolo === "P") {
    bonus -= player.gol_subiti || 0;

    if ((player.gol_subiti || 0) === 0) {
      bonus += 1;
    }
  }

  return bonus;
}
export function calcPlayerScore(
  vote: any,
  ruolo: string
) {

  if (!vote) {
    return null;
  }

  if (vote.sv) {

    const hasBonus =
      (vote.gol || 0) > 0 ||
      (vote.assist || 0) > 0 ||
      (vote.rigori_parati || 0) > 0 ||
      (vote.rigori_sbagliati || 0) > 0 ||
      (vote.autogol || 0) > 0 ||
      vote.ammonizione ||
      vote.espulsione ||
      (vote.gol_subiti || 0) > 0;

    if (!hasBonus) {
      return {
        sv: true,
        voto: null,
        bonus: 0,
        totale: null,
      };
    }

    const bonus = calcBonusMalus({
      ...vote,
      ruolo,
    });

    return {
      sv: false,
      voto: 6,
      bonus,
      totale: 6 + bonus,
    };
  }

  if (vote.voto === null || vote.voto === undefined) {
    return {
      sv: false,
      voto: null,
      bonus: calcBonusMalus({
        ...vote,
        ruolo,
      }),
      totale: null,
    };
  }

  const votoBase = Number(vote.voto);

  const bonus = calcBonusMalus({
    ...vote,
    ruolo,
  });

  return {
    sv: false,
    voto: votoBase,
    bonus,
    totale: votoBase + bonus,
  };
}

export function fantasyGoals(fp: number) {
  if (fp < 66) return 0;

  return Math.floor((fp - 66) / 4) + 1;
}
export function calculateTeam(
  titolari: any[],
  panchina: any[],
  votesMap: Map<number, any>,
  allFinished: boolean
) {
  let votesTotal = 0;
  let bonusTotal = 0;
  let liveBonusWithoutVote = 0;

  let substitutions = 0;

  const usedBench = new Set<number>();

  const processedPlayers = [];

  for (const starter of titolari) {
    const vote = votesMap.get(starter.player_id);

    const result = calcPlayerScore(
      vote,
      starter.ruolo
    );

    console.log(
  starter.nome,
  {
    voto: vote?.voto,
    sv: vote?.sv,
    result
  }
);

    // voto normale
    if (
      result &&
      !result.sv &&
      result.totale !== null
    ) {
      votesTotal += result.voto;
      bonusTotal += result.bonus;

      processedPlayers.push({
        ...starter,
        ...result,
      });

      continue;
    }

    const starterIsSv =
  result?.sv === true ||
  (
    starter.hasVoteRow &&
    starter.voto === null &&
    starter.sv !== true &&
    starter.nationalFinalized
  ) ||
  (
    !starter.hasVoteRow &&
    starter.nationalFinalized
  );

  if (
  starter.nome === "DANI OLMO" ||
  starter.nome === "D. Svensson"
) {

}

if (!starterIsSv) {

  
  if (
    result &&
    result.voto === null &&
    result.bonus !== 0
  ) {
    liveBonusWithoutVote += result.bonus;
  }

  processedPlayers.push({
    ...starter,
    ...result,
  });

  continue;
}

    // giornata finita → cerca sostituto
    let replacement = null;

    for (const bench of panchina) {
      if (usedBench.has(bench.player_id))
        continue;

      if (bench.ruolo !== starter.ruolo)
        continue;

      const benchVote = votesMap.get(
        bench.player_id
      );

      const benchResult = calcPlayerScore(
        benchVote,
        bench.ruolo
      );

      if (!benchResult) {
  continue;
}

if (benchResult.sv) {
  continue;
}

replacement = {
  player: bench,
  result: benchResult,
};

break;

    }

    if (
      replacement &&
      substitutions < 5
    ) {
      usedBench.add(
        replacement.player.player_id
      );

      substitutions++;

      if (replacement.result.voto !== null) {
  votesTotal += replacement.result.voto;
}

bonusTotal += replacement.result.bonus;

      processedPlayers.push({
  ...starter,

  sv: true,

  replacedBy:
    replacement.player.player_id,

  replacementPlayer: {
    ...replacement.player,
    ...replacement.result,
  },
});

      continue;
    }

    // nessun sostituto

votesTotal += 0;

processedPlayers.push({
  ...starter,
  sv: true,
  voto: 0,
  bonus: 0,
  totale: 0,
});
  }
const completedSlots =
  processedPlayers.filter((p) => {

    if (p.replacementPlayer) {
      return true;
    }

    if (p.voto !== null && p.voto !== undefined) {
      return true;
    }

    if (p.sv && p.voto === 0) {
      return true;
    }

    return false;

  }).length;

  const fantapoints =
  votesTotal +
  bonusTotal +
  liveBonusWithoutVote;

let projectedFP = 0;

for (const player of processedPlayers) {

  console.log(
    "PROJ PLAYER",
    player.nome,
    "SV:",
    player.sv,
    "REPL:",
    player.replacementPlayer?.nome
  );
  
  if (player.replacementPlayer) {

  const repl = player.replacementPlayer;

  if (
    repl.voto !== null &&
    repl.voto !== undefined
  ) {
    projectedFP += repl.voto;
  } else {
    projectedFP += 6;
  }

  projectedFP += repl.bonus || 0;

  continue;
}

if (player.sv) {
  continue;
}

if (
  player.voto !== null &&
  player.voto !== undefined
) {
  projectedFP += player.voto;
} else {
  projectedFP += 6;
}

projectedFP += player.bonus || 0;

}

const projectedGoals =
  fantasyGoals(projectedFP);

console.log("CALC TEAM", {
  votesTotal,
  bonusTotal,
  fantapoints,
});

  console.log("PROIEZIONE", {
  fantapoints,
  projectedFP,
  projectedGoals,
});

return {
  players: processedPlayers,

  substitutions,

  votesTotal:
    Math.round(votesTotal * 10) / 10,

  bonusTotal:
  Math.round(
    (bonusTotal + liveBonusWithoutVote) * 10
  ) / 10,

  fantapoints:
    Math.round(fantapoints * 10) / 10,

  goals: fantasyGoals(fantapoints),

  projectedGoals,

  isFinal:
  completedSlots >= 11,
};

}
export function allMatchesFinished(
  nationalStatuses: string[]
) {
  return nationalStatuses.every(
    (s) =>
      s === "FINISHED" ||
      s === "FT" ||
      s === "AET" ||
      s === "PEN"
  );
}