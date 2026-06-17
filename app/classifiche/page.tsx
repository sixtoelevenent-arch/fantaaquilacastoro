import BackHome from "@/components/BackHome";
import { supabase } from "@/lib/supabase";

type TeamRow = {
  id: number;
  nome: string;
  proprietario: string;
  gruppo: string;
};

type MatchRow = {
  team_home_id: number;
  team_away_id: number;
  gol_home: number | null;
  gol_away: number | null;
  fp_home: number | null;
  fp_away: number | null;
};

type Standing = {
  id: number;
  squadra: string;
  allenatore: string;
  gruppo: string;

  pt: number;
  gf: number;
  gs: number;
  dr: number;
  fp: number;
};

export default async function ClassifichePage() {
  const { data: teams } = await supabase
    .from("teams")
    .select("*")
    .order("gruppo");

  const { data: matches } = await supabase
    .from("matches")
    .select("*");

  const standings = new Map<number, Standing>();

  (teams || []).forEach((team: TeamRow) => {
    standings.set(team.id, {
      id: team.id,
      squadra: team.nome,
      allenatore: team.proprietario,
      gruppo: team.gruppo,

      pt: 0,
      gf: 0,
      gs: 0,
      dr: 0,
      fp: 0,
    });
  });

  (matches || []).forEach((match: MatchRow) => {
    if (
      match.gol_home === null ||
      match.gol_away === null
    ) {
      return;
    }

    const home = standings.get(match.team_home_id);
    const away = standings.get(match.team_away_id);

    if (!home || !away) return;

    home.gf += match.gol_home;
    home.gs += match.gol_away;
    home.dr = home.gf - home.gs;
    home.fp += Number(match.fp_home || 0);

    away.gf += match.gol_away;
    away.gs += match.gol_home;
    away.dr = away.gf - away.gs;
    away.fp += Number(match.fp_away || 0);

    if (match.gol_home > match.gol_away) {
      home.pt += 3;
    } else if (match.gol_home < match.gol_away) {
      away.pt += 3;
    } else {
      home.pt += 1;
      away.pt += 1;
    }
  });

  const sortGirone = (a: Standing, b: Standing) => {
    if (b.pt !== a.pt) return b.pt - a.pt;
    if (b.fp !== a.fp) return b.fp - a.fp;
    if (b.dr !== a.dr) return b.dr - a.dr;
    return 0;
  };

  const gironeA = [...standings.values()]
    .filter((t) => t.gruppo === "A")
    .sort(sortGirone);

  const gironeB = [...standings.values()]
    .filter((t) => t.gruppo === "B")
    .sort(sortGirone);

  const gironeC = [...standings.values()]
    .filter((t) => t.gruppo === "C")
    .sort(sortGirone);

  const miglioriTerze = [
    gironeA[2],
    gironeB[2],
    gironeC[2],
  ]
    .filter(Boolean)
    .sort((a, b) => {
      if (b.fp !== a.fp) return b.fp - a.fp;
      if (b.pt !== a.pt) return b.pt - a.pt;
      if (b.dr !== a.dr) return b.dr - a.dr;
      return 0;
    });

  const renderTable = (
    titolo: string,
    colore: string,
    dati: Standing[]
  ) => (
    <div
      style={{
        background: "#1f2937",
        borderRadius: "16px",
        padding: "12px",
        marginBottom: "20px",
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <h2
        style={{
          color: colore,
          marginTop: 0,
          marginBottom: "12px",
        }}
      >
        {titolo}
      </h2>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          tableLayout: "fixed",
          fontSize: "12px",
        }}
      >
        <thead>
          <tr>
            <th style={thCenter}>#</th>
            <th style={thLeft}>Squadra</th>
            <th style={thCenter}>Pt</th>
            <th style={thCenter}>FP</th>
            <th style={thCenter}>GF</th>
            <th style={thCenter}>GS</th>
            <th style={thCenter}>DR</th>
          </tr>
        </thead>

        <tbody>
          {dati.map((team, index) => (
            <tr
              key={team.id}
              style={{
                background:
                  index < 2
                    ? "rgba(34,197,94,0.15)"
                    : "transparent",
              }}
            >
              <td style={tdCenter}>
                {index + 1}
              </td>

              <td style={tdLeft}>
                {team.squadra}
              </td>

              <td style={tdCenter}>{team.pt}</td>

              <td style={tdCenter}>
                {team.fp.toFixed(1)}
              </td>

              <td style={tdCenter}>{team.gf}</td>

              <td style={tdCenter}>{team.gs}</td>

              <td style={tdCenter}>{team.dr}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom,#1e3a8a,#172554)",
        color: "white",
        padding: "16px",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        <BackHome />

        <h1
          style={{
            textAlign: "center",
            marginBottom: "10px",
          }}
        >
          📊 Classifiche
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#bfdbfe",
            marginBottom: "25px",
          }}
        >
          Fase a Gironi • FantAquilaCastoro 2026
        </p>

        {renderTable(
          "🟢 Girone A",
          "#22c55e",
          gironeA
        )}

        {renderTable(
          "🔵 Girone B",
          "#3b82f6",
          gironeB
        )}

        {renderTable(
          "🟠 Girone C",
          "#f97316",
          gironeC
        )}

        <div
          style={{
            background: "#1f2937",
            borderRadius: "16px",
            padding: "12px",
            border:
              "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <h2
            style={{
              color: "#facc15",
              marginTop: 0,
            }}
          >
            🏅 Migliori Terze
          </h2>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              tableLayout: "fixed",
              fontSize: "12px",
            }}
          >
            <thead>
              <tr>
                <th style={thCenter}>Q</th>
                <th style={thLeft}>Squadra</th>
                <th style={thCenter}>FP</th>
                <th style={thCenter}>Pt</th>
                <th style={thCenter}>DR</th>
              </tr>
            </thead>

            <tbody>
              {miglioriTerze.map(
                (team, index) => (
                  <tr
                    key={team.id}
                    style={{
                      background:
                        index < 2
                          ? "rgba(34,197,94,0.15)"
                          : "transparent",
                    }}
                  >
                    <td style={tdCenter}>
                      {index < 2
                        ? "✅"
                        : "❌"}
                    </td>

                    <td style={tdLeft}>
                      {team.squadra}
                    </td>

                    <td style={tdCenter}>
                      {team.fp.toFixed(1)}
                    </td>

                    <td style={tdCenter}>
                      {team.pt}
                    </td>

                    <td style={tdCenter}>
                      {team.dr}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

const thLeft = {
  padding: "6px 4px",
  textAlign: "left" as const,
  color: "#cbd5e1",
};

const thCenter = {
  padding: "6px 2px",
  textAlign: "center" as const,
  color: "#cbd5e1",
};

const tdLeft = {
  padding: "6px 4px",
  fontSize: "12px",
};

const tdCenter = {
  padding: "6px 2px",
  textAlign: "center" as const,
  fontSize: "12px",
};