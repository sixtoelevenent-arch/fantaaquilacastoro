export function shortName(nome?: string | null): string {
  const keep = [
    "Neymar",
    "Casemiro",
    "Pedri",
    "Rodri",
    "Raphinha",
    "Leao",
    "Endrick",
    "Ederson",
    "Alisson",
  ];

  if (!nome) return "";

  const cleanName = nome.trim();

  if (keep.includes(cleanName)) return cleanName;

  // già abbreviato (es. "J. Musiala")
  if (/^[A-Z]\.\s/.test(cleanName)) return cleanName;

  const parts = cleanName.split(/\s+/);

  if (parts.length <= 1) return cleanName;

  return `${parts[0].charAt(0)}. ${parts.slice(1).join(" ")}`;
}