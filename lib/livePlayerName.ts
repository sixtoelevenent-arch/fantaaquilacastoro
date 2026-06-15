export function livePlayerName(nome: string): string {
  if (!nome) return "";

  const parts = nome
    .trim()
    .split(/\s+/)
    .map(
      (p) =>
        p.charAt(0).toUpperCase() +
        p.slice(1).toLowerCase()
    );

  if (parts.length === 1) {
    return parts[0];
  }

  const firstName = parts[0];
  const surname = parts.slice(1).join(" ");

  return `${firstName.charAt(0)}. ${surname}`;
}