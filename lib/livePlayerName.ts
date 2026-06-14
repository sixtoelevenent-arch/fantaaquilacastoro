const MAX_LIVE_NAME_LENGTH = 18;

const KEEP_FULL = [
  "Neymar",
  "Pedri",
  "Rodri",
  "Casemiro",
  "Leao",
  "Raphinha",
  "Endrick",
  "Alisson",
  "Ederson",
];

export function livePlayerName(nome: string): string {
  if (!nome) return "";

  if (KEEP_FULL.includes(nome)) {
    return nome;
  }

  // Già abbreviato (es. F. Wirtz)
  if (/^[A-Z]\.\s/.test(nome)) {
    return nome;
  }

  // Nome corto: lascialo invariato
  if (nome.length <= MAX_LIVE_NAME_LENGTH) {
    return nome;
  }

  const parts = nome.trim().split(/\s+/);

  if (parts.length === 1) {
    return nome;
  }

  const surname = parts[parts.length - 1];

  const initials = parts
    .slice(0, parts.length - 1)
    .map((p) => `${p.charAt(0)}.`)
    .join(" ");

  return `${initials} ${surname}`;
}