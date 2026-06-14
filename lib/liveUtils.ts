export function resultColor(
  homeFp: number,
  awayFp: number,
  completed: boolean
) {
  if (homeFp === 0 && awayFp === 0) {
    return "#ef4444";
  }

  if (completed) {
    return "#22c55e";
  }

  return "#facc15";
}

export function buildIcons(vote: any) {
  let icons = "";

  if (vote?.gol > 0) icons += "⚽".repeat(vote.gol);
  if (vote?.assist > 0) icons += "🅰️".repeat(vote.assist);

  if (vote?.ammonizione) icons += "🟨";
  if (vote?.espulsione) icons += "🟥";

  if (vote?.rigori_parati > 0)
    icons += "🧤".repeat(vote.rigori_parati);

  if (vote?.rigori_sbagliati > 0)
    icons += "❌".repeat(vote.rigori_sbagliati);

  if (vote?.autogol > 0)
    icons += "💥".repeat(vote.autogol);

  if (vote?.gol_subiti < 0)
    icons += "🥅".repeat(Math.abs(vote.gol_subiti));

  if (
    vote?.gol_subiti === 0 &&
    vote?.ruolo === "P"
  ) {
    icons += "✨";
  }

  return icons;
}