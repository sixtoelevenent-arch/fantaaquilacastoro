import { rose } from "@/data/rose";

export default async function TeamPage({
  params,
}: {
  params: Promise<{ team: string }>;
}) {
  const { team } = await params;

  const squadra = rose[team as keyof typeof rose];

  if (!squadra) {
    return (
      <main style={{ padding: 40 }}>
        <h1>Squadra non trovata</h1>
      </main>
    );
  }

  return (
    <main style={{ padding: 40 }}>
      <h1>
        {team} - {squadra.nazione}
      </h1>

      <h2>Portieri</h2>
      <ul>
        {squadra.portieri.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>

      <h2>Attaccanti</h2>
      <ul>
        {squadra.attaccanti.map((a) => (
          <li key={a}>{a}</li>
        ))}
      </ul>
    </main>
  );
}