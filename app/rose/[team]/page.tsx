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
<ul style={{ marginBottom: "30px" }}>
  {squadra.portieri.map((p) => (
    <li key={p} style={{ marginBottom: "8px" }}>
      {p}
    </li>
  ))}
</ul>

<h2>Difensori</h2>
<ul style={{ marginBottom: "30px" }}>
  {squadra.difensori.map((d) => (
    <li key={d} style={{ marginBottom: "8px" }}>
      {d}
    </li>
  ))}
</ul>

<h2>Centrocampisti</h2>
<ul style={{ marginBottom: "30px" }}>
  {squadra.centrocampisti.map((c) => (
    <li key={c} style={{ marginBottom: "8px" }}>
      {c}
    </li>
  ))}
</ul>

<h2>Attaccanti</h2>
<ul style={{ marginBottom: "30px" }}>
  {squadra.attaccanti.map((a) => (
    <li key={a} style={{ marginBottom: "8px" }}>
      {a}
    </li>
  ))}
</ul>

        <div
  style={{
    marginTop: "50px",
    textAlign: "center",
    color: "#94a3b8",
    fontSize: "14px",
  }}
>
  FantAquilaCastoro 2026 • Road to New York 🗽
</div>
</main>
  );
}