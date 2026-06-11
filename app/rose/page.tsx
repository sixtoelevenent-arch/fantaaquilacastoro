const squadre = [
  "Pres",
  "Andrea S.",
  "Cristian",
  "Luigi",
  "Andrea A.",
  "Erny",
  "Martin",
  "Fava",
  "Sirty",
  "Michel",
  "Fabio",
  "Bruno",
];

export default function RosePage() {
  return (
    <main style={{ padding: 40 }}>
      <h1>🏆 Rose FantAquilaCastoro 2026</h1>

      <ul>
        {squadre.map((squadra) => (
          <li key={squadra}>
            <a href={`/rose/${encodeURIComponent(squadra)}`}>
              {squadra}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}