export function fantasyGoals(fp: number) {
  if (fp < 66) return 0;

  return Math.floor((fp - 66) / 4) + 1;
}