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
  completata: boolean;
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

export const dynamic = "force-dynamic";
export const revalidate = 0;

function MatchCard({
  title,
  home,
  away,
  homeLabel,
  awayLabel,
}: {
  title: string;
  home: string;
  away: string;
  homeLabel?: string;
  awayLabel?: string;
}) {

  return (
    <div
      style={{
        background: "#1f2937",
        border: "1px solid rgba(255,255,255,0.10)",
        borderRadius: 18,
        padding: 18,
        marginBottom: 16,
      }}
    >
      <div
        style={{
          color: "#facc15",
          fontWeight: 800,
          marginBottom: 16,
          fontSize: "1rem",
        }}
      >
        {title}
      </div>

      <div
        style={{
          padding: 14,
          borderRadius: 12,
          background: "rgba(255,255,255,0.04)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: "1.35rem",
            fontWeight: 800,
          }}
        >
          {home}
        </div>

        <div
          style={{
            color: "#94a3b8",
            fontSize: ".85rem",
            marginTop: 4,
          }}
        >
          {homeLabel && (
  <div
    style={{
      color: "#94a3b8",
      fontSize: ".85rem",
      marginTop: 4,
    }}
  >
    {homeLabel}
  </div>
)}
        </div>
      </div>

      <div
        style={{
          textAlign: "center",
          color: "#94a3b8",
          margin: "14px 0",
          fontWeight: 700,
        }}
      >
        VS
      </div>

      <div
        style={{
          padding: 14,
          borderRadius: 12,
          background: "rgba(255,255,255,0.04)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: "1.35rem",
            fontWeight: 800,
          }}
        >
          {away}
        </div>

        <div
          style={{
            color: "#94a3b8",
            fontSize: ".85rem",
            marginTop: 4,
          }}
        >
          {awayLabel && (
  <div
    style={{
      color: "#94a3b8",
      fontSize: ".85rem",
      marginTop: 4,
    }}
  >
    {awayLabel}
  </div>
)}
        </div>
      </div>
    </div>
  );
}

export default async function FaseFinalePage() {
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
    const home = standings.get(
      match.team_home_id
    );

    const away = standings.get(
      match.team_away_id
    );

    if (!home || !away) return;

    home.gf += match.gol_home ?? 0;
    home.gs += match.gol_away ?? 0;

    away.gf += match.gol_away ?? 0;
    away.gs += match.gol_home ?? 0;

    home.dr = home.gf - home.gs;
    away.dr = away.gf - away.gs;

    home.fp += Number(match.fp_home || 0);
    away.fp += Number(match.fp_away || 0);

    if (
      (match.gol_home ?? 0) >
      (match.gol_away ?? 0)
    ) {
      home.pt += 3;
    } else if (
      (match.gol_home ?? 0) <
      (match.gol_away ?? 0)
    ) {
      away.pt += 3;
    } else {
      home.pt += 1;
      away.pt += 1;
    }
  });

  const sortGirone = (
    a: Standing,
    b: Standing
  ) => {
    if (b.pt !== a.pt)
      return b.pt - a.pt;

    if (b.fp !== a.fp)
      return b.fp - a.fp;

    if (b.dr !== a.dr)
      return b.dr - a.dr;

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

  const prime = [
    gironeA[0],
    gironeB[0],
    gironeC[0],
  ].filter(Boolean);

  const seconde = [
    gironeA[1],
    gironeB[1],
    gironeC[1],
  ]
    .filter(Boolean)
    .sort(sortGirone);

  const terze = [
    gironeA[2],
    gironeB[2],
    gironeC[2],
  ]
    .filter(Boolean)
    .sort(sortGirone);

  const primaA =
    prime.find((t) => t.gruppo === "A")
      ?.squadra ?? "1° Girone A";

  const primaB =
    prime.find((t) => t.gruppo === "B")
      ?.squadra ?? "1° Girone B";

  const primaC =
    prime.find((t) => t.gruppo === "C")
      ?.squadra ?? "1° Girone C";

  const miglioreTerza =
    terze[0]?.squadra ??
    "Migliore terza";

  const peggioreTerza =
    terze[2]?.squadra ??
    "Peggiore terza";

  const miglioreSeconda =
    seconde[0]?.squadra ??
    "Seconda migliore";

  const peggioreSeconda =
    seconde[2]?.squadra ??
    "Peggiore seconda";

  const secondaRimanente =
    seconde[1]?.squadra ??
    "Seconda rimanente";

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom,#1e3a8a,#172554)",
        color: "white",
        padding: 20,
      }}
    >
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
        }}
      >
        <BackHome />

        <h1
          style={{
            textAlign: "center",
            fontSize:
              "clamp(2rem,6vw,3.5rem)",
            fontWeight: 800,
            marginTop: 10,
            marginBottom: 10,
          }}
        >
          ⚔️ Fase Finale
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#bfdbfe",
            marginBottom: 35,
          }}
        >
          Road to New York 🗽
        </p>

        <h2
          style={{
            color: "#facc15",
            marginBottom: 18,
          }}
        >
          🏆 Quarti di Finale
        </h2>

        <MatchCard
  title="Quarto 1"
  home={primaA}
  away={peggioreTerza}
  homeLabel="1ª classificata Girone A"
  awayLabel="Peggiore terza classificata"
/>

<MatchCard
  title="Quarto 2"
  home={primaB}
  away={miglioreTerza}
  homeLabel="1ª classificata Girone B"
  awayLabel="Migliore terza classificata"
/>

<MatchCard
  title="Quarto 3"
  home={primaC}
  away={peggioreSeconda}
  homeLabel="1ª classificata Girone C"
  awayLabel="Peggiore seconda classificata"
/>

<MatchCard
  title="Quarto 4"
  home={miglioreSeconda}
  away={secondaRimanente}
  homeLabel="Migliore seconda classificata"
  awayLabel="Seconda classificata rimanente"
/>
        <h2
          style={{
            color: "#facc15",
            marginTop: 40,
            marginBottom: 18,
          }}
        >
          🥇 Semifinali
        </h2>

        <MatchCard
          title="Semifinale 1"
          home="Vincente Quarto 1"
          away="Vincente Quarto 4"
        />

        <MatchCard
          title="Semifinale 2"
          home="Vincente Quarto 2"
          away="Vincente Quarto 3"
        />

        <h2
          style={{
            color: "#facc15",
            marginTop: 40,
            marginBottom: 18,
          }}
        >
          🏆 Finale"
        </h2>

        <MatchCard
          title="MetLife Stadium • New York"
          home="Vincente Semifinale 1"
          away="Vincente Semifinale 2"
        />

        <div
          style={{
            marginTop: 50,
            paddingTop: 20,
            borderTop:
              "1px solid rgba(255,255,255,0.15)",
            textAlign: "center",
            color: "#94a3b8",
            fontSize: 14,
          }}
        >
          FantAquilaCastoro 2026 • Road to New York 🗽
        </div>
      </div>
    </main>
  );
}