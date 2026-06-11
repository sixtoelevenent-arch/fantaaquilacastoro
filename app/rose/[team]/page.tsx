export default async function TeamPage({
  params,
}: {
  params: Promise<{ team: string }>;
}) {
  const { team } = await params;

  if (team === "Sirty") {
    return (
      <main style={{ padding: 40 }}>
        <h1>🇫🇷 Sirty - Francia</h1>

        <h2>Portieri</h2>
        <ul>
          <li>Fernando Muslera (Uruguay) - 1</li>
          <li>G. Kobel (Svizzera) - 6</li>
          <li>Sergio Rochet (Uruguay) - 2</li>
        </ul>

        <h2>Attaccanti</h2>
        <ul>
          <li>Erling Haaland (Norvegia) - 97</li>
          <li>Mohamed Salah (Egitto) - 8</li>
          <li>Viktor Gyökeres (Svezia) - 8</li>
        </ul>
      </main>
    );
  }

  return (
    <main style={{ padding: 40 }}>
      <h1>{decodeURIComponent(team)}</h1>

      <p>Rosa non ancora caricata.</p>
    </main>
  );
}