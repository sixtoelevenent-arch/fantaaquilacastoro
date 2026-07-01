"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import BackHome from "@/components/BackHome";
import Link from "next/link";
import Card from "@/components/Card";

type MarketRound = {
  id: number;
  name: string;
  fifa_phase: string;
  open_date: string;
  eliminated_nationals_count: number;
  status: "pending" | "svincoli" | "buste" | "closed";

  svincoli_open_at: string | null;
  svincoli_close_at: string | null;
  first_session_close_at: string | null;
  second_session_close_at: string | null;
  extra_session_duration: number | null;
};

type EliminatedNational = {
  nazionale: string;
  round_id: number;
};

type AutomaticRelease = {
  squadra: string;
  team_id: number;
  nome: string;
  nazionale: string;
  ruolo: string;
  prezzo: number;
  prezzo_recuperato: number;
};

type OfficialAutoRelease = {
  team_id: number;
  nome: string;
  ruolo: string;
  nazionale: string;
  refund: number;
};

type FreeAgent = {
  id: number;
  display_name: string;
  player_name: string;
  nazionale: string;
  ruolo: string;
};

type Assignment = {
  squadra: string;
  nome: string;
  ruolo: string;
  prezzo: number;
};

export default function MercatoPage() {

 type OptionalRelease = {
  team_id: number;
  nome: string;
  ruolo: string;
  nazionale: string;
  prezzo_recuperato: number;
};

type RoundAssignment = {
  squadra: string;
  nome: string;
  ruolo: string;
  prezzo: number;
};

type TeamStatus = {
  team_id: number;
  squadra: string;
  budget: number;
  p_missing: number;
  d_missing: number;
  c_missing: number;
  a_missing: number;
};

type MarketBuy = {
  team_id: number;
  nome: string;
  ruolo: string;
  nazionale: string;
  prezzo: number;
};

const [marketBuys, setMarketBuys] =
  useState<MarketBuy[]>([]);

const [teamStatus, setTeamStatus] =
  useState<TeamStatus[]>([]);

const [optionalReleases, setOptionalReleases] =
  useState<OptionalRelease[]>([]);
  
  const [loading, setLoading] = useState(true);

  const [rounds, setRounds] = useState<MarketRound[]>([]);
  const [currentRound, setCurrentRound] =
    useState<MarketRound | null>(null);

  const [eliminated, setEliminated] = useState<
    EliminatedNational[]
  >([]);

  const [automaticReleases, setAutomaticReleases] =
    useState<AutomaticRelease[]>([]);

  const [freeAgents, setFreeAgents] =
    useState<FreeAgent[]>([]);

  const [assignments, setAssignments] =
    useState<Assignment[]>([]);

    type ReturnedPlayer = {
  nome: string;
  ruolo: string;
  nazionale: string;
  team_id: number;
};

const [returnedPlayers, setReturnedPlayers] =
  useState<ReturnedPlayer[]>([]);

      const [roleFilter, setRoleFilter] =
    useState<string>("ALL");

  const [search, setSearch] =
    useState("");

  const [expandedRound, setExpandedRound] =
    useState<number | null>(null);

    const [openTeam, setOpenTeam] =
  useState<number | null>(null);

    const [officialAutoReleases, setOfficialAutoReleases] =
  useState<OfficialAutoRelease[]>([]);

  useEffect(() => {
  loadPage().catch((e) => {
    console.error("LOADPAGE ERROR", e);

    setLoading(false);

      });
}, []);

  async function loadPage() {
  try {
    setLoading(true);

    const {
      data: roundsData,
      error: roundsError,
    } = await supabase
      .from("market_rounds")
      .select("*")
      .order("id");

    if (roundsError) {
      throw roundsError;
    }

    const rounds =
      (roundsData as MarketRound[]) ?? [];

    setRounds(rounds);

    const active =
      [...rounds]
        .reverse()
        .find((r) => r.status !== "pending") ??
      rounds[0] ??
      null;

    setCurrentRound(active);

    if (!active) {
      setLoading(false);
      return;
    }

    const {
      data: eliminatedData,
      error: eliminatedError,
    } = await supabase
      .from("eliminated_nationals")
      .select("*")
      .eq("round_id", active.id)
      .order("nazionale");

    if (eliminatedError)
      throw eliminatedError;

    setEliminated(eliminatedData ?? []);

    const {
      data: freeData,
      error: freeError,
    } = await supabase
      .from("free_agents")
      .select("*")
      .eq("disponibile", true)
      .order("ruolo")
      .order("display_name");

    if (freeError)
      throw freeError;

setFreeAgents(freeData ?? []);

const {
  data: releases,
  error: releasesError,
} = await supabase.rpc(
  "market_automatic_releases_view",
  {
    p_round: active.id,
  }
);


if (releasesError) {
  throw releasesError;
}

setAutomaticReleases(
  (releases as AutomaticRelease[]) ?? []
);

const { data: optionalData } =
  await supabase
    .from("market_release_players")
    .select(`
      automatic,
      market_releases!inner(
        round_id,
        team_id
      ),
      prezzo_recuperato,
players!inner(
  nome,
  ruolo,
  nazionale
)
    `);

setOptionalReleases(
  (optionalData ?? [])
    .filter(
      (r: any) =>
        r.automatic === false &&
        r.market_releases
          ?.round_id === active.id
    )
   .map((r: any) => ({
  team_id:
    r.market_releases.team_id,
  nome:
    r.players.nome,
  ruolo:
    r.players.ruolo,
  nazionale:
    r.players.nazionale,
  prezzo_recuperato:
    r.prezzo_recuperato ?? 0,
}))
);

const { data: buysData, error: buysError } =
  await supabase
    .from("market_manual_assignments")
    .select(`
      team_id,
      player_id,
      price,
      players!market_manual_assignments_player_id_fkey (
        nome,
        ruolo,
        nazionale
      )
    `);

    
    if (buysError) {
  throw buysError;
}

setMarketBuys(
  (buysData ?? []).map((r: any) => ({
    team_id: Number(r.team_id),
    prezzo: r.price,
    nome: r.players?.nome,
    ruolo: r.players?.ruolo,
    nazionale: r.players?.nazionale,
  }))
);

const {
  data: assignmentsData,
  error: assignmentsError,
} = await supabase.rpc(
  "market_assignments_view",
  {
    p_round: active.id,
  }
);

if (assignmentsError) {
  throw assignmentsError;
}

setAssignments(
  (assignmentsData as Assignment[]) ?? []
);

const {
  data: statusData,
  error: statusError,
} = await supabase
  .from("market_team_status")
  .select("*")
  .order("team_id");

if (statusError) {
  throw statusError;
}

setTeamStatus(
  (statusData as TeamStatus[]) ?? []
);

const {
  data: returnedData,
} = await supabase
  .from("returned_free_agents_view")
  .select(`
    nome,
    ruolo,
    nazionale,
    team_id
  `);

setReturnedPlayers(
  ((returnedData as ReturnedPlayer[]) ?? [])
    .sort((a, b) => {
      const order = {
        P: 1,
        D: 2,
        C: 3,
        A: 4,
      };

      const diff =
        order[a.ruolo as keyof typeof order] -
        order[b.ruolo as keyof typeof order];

      if (diff !== 0) {
        return diff;
      }

      return a.nome.localeCompare(
        b.nome,
        "it"
      );

      

    })
);

const {
  data: officialData,
  error: officialError,
} = await supabase
  .from("players")
  .select(`
    team_id,
    nome,
    ruolo,
    nazionale,
    prezzo
  `)
  .in("nazionale", [
    "Costa d'Avorio",
    "Ecuador",
    "Germania",
    "Giappone",
    "Paesi Bassi",
    "Sudafrica",
    "Svezia",
  ])
  .not("team_id", "is", null);

if (officialError) {
  throw officialError;
}

setOfficialAutoReleases(
  (officialData ?? []).map(
    (p: any) => ({
      team_id: Number(p.team_id),
      nome: p.nome,
      ruolo: p.ruolo,
      nazionale: p.nazionale,
      refund: Math.ceil(
        p.prezzo / 2
      ),
    })
  )
);

  } catch (e) {
  console.error(e);
} finally {
    setLoading(false);
  }
}

  function statusLabel(
    status?: string
  ) {
    switch (status) {
      case "svincoli":
        return "🟡 SVINCOLI APERTI";

      case "buste":
        return "🟠 BUSTE APERTE";

      case "closed":
        return "🟢 CONCLUSA";

      default:
        return "⚪ IN ATTESA";
    }
  }

   const filteredAgents =
    useMemo(() => {
      return freeAgents.filter(
        (p) => {
          const okRole =
            roleFilter ===
              "ALL" ||
            p.ruolo ===
              roleFilter;

          const okSearch =
  (
    p.display_name ||
    p.player_name ||
    ""
  )
    .toLowerCase()
    .includes(
      search.toLowerCase()
    );

          return (
            okRole &&
            okSearch
          );
        }
      );
    }, [
      freeAgents,
      roleFilter,
      search,
    ]);

  const eliminatedCount =
    eliminated.length;

   const showReturnedPlayers =
  returnedPlayers.length > 0;

    const eliminatedTeams = {
  6: "Argentina",
  7: "Germania",
  8: "Curacao",
  10: "Uzbekistan",
};

const activeTeams = [
  { teamId: 1, nome: "Iran" },
  { teamId: 2, nome: "Ghana" },
  { teamId: 3, nome: "Messico" },
  { teamId: 4, nome: "Colombia" },
  { teamId: 5, nome: "Portogallo" },
  { teamId: 11, nome: "Costa d'Avorio" },
  { teamId: 9, nome: "Francia" },
  { teamId: 12, nome: "Turchia" },
];

const teamNames: Record<number, string> = {
  1: "Iran",
  2: "Ghana",
  3: "Messico",
  4: "Colombia",
  5: "Portogallo",
  6: "Argentina",
  7: "Germania",
  8: "Curacao",
  9: "Francia",
  10: "Uzbekistan",
  11: "Costa d'Avorio",
  12: "Turchia",
};

const roleOrder = {
  P: 1,
  D: 2,
  C: 3,
  A: 4,
};

const italyNow = new Date(
  new Date().toLocaleString("en-US", {
    timeZone: "Europe/Rome",
  })
);

function getMarketStatusText() {
  if (!currentRound) return "";

  const now = new Date(
  new Date().toLocaleString(
    "en-US",
    {
      timeZone: "Europe/Rome",
    }
  )
);

  const open = currentRound.svincoli_open_at
    ? new Date(currentRound.svincoli_open_at)
    : null;

  const closeSvincoli =
    currentRound.svincoli_close_at
      ? new Date(currentRound.svincoli_close_at)
      : null;

  const first =
    currentRound.first_session_close_at
      ? new Date(currentRound.first_session_close_at)
      : null;

  const second =
    currentRound.second_session_close_at
      ? new Date(currentRound.second_session_close_at)
      : null;

  const allComplete =
    teamStatus.length > 0 &&
    teamStatus.every(
      (t) =>
        t.p_missing === 0 &&
        t.d_missing === 0 &&
        t.c_missing === 0 &&
        t.a_missing === 0
    );

  if (allComplete) {
    return "✅ ROSE COMPLETE";
  }

  if (open && now < open) {
    return `📅 Apertura svincoli • ${open.toLocaleString(
      "it-IT",
      {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }
    )}`;
  }

  if (closeSvincoli && now < closeSvincoli) {
    return `⏰ Chiusura svincoli • ore ${closeSvincoli.toLocaleTimeString(
      "it-IT",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    )}`;
  }

  if (first && now < first) {
    return `⏰ Chiusura Prima Sessione • ore ${first.toLocaleTimeString(
      "it-IT",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    )}`;
  }

  if (second && now < second) {
    return `⏰ Chiusura Seconda Sessione • ore ${second.toLocaleTimeString(
      "it-IT",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    )}`;
  }

  if (!second) return "";

  const duration =
    currentRound.extra_session_duration ??
    60;

  const diff =
    now.getTime() -
    second.getTime();

  const extra =
    Math.floor(
      diff / (duration * 60000)
    ) + 1;

  const deadline = new Date(
    second.getTime() +
      extra *
        duration *
        60000
  );

  const sessionNames = [
  "Terza",
  "Quarta",
  "Quinta",
  "Sesta",
  "Settima",
  "Ottava",
  "Nona",
  "Decima",
];

const label =
  sessionNames[extra - 1] ??
  `${extra + 2}ª`;

return `⏰ Chiusura ${label} Sessione • ore ${deadline.toLocaleTimeString(
  "it-IT",
  {
    hour: "2-digit",
    minute: "2-digit",
  }
)}`;
}

function getPhase() {
  const now = new Date(
    new Date().toLocaleString("en-US", {
      timeZone: "Europe/Rome",
    })
  );

  const open =
    currentRound?.svincoli_open_at
      ? new Date(currentRound.svincoli_open_at)
      : null;

  const close =
    currentRound?.svincoli_close_at
      ? new Date(currentRound.svincoli_close_at)
      : null;

  const first =
    currentRound?.first_session_close_at
      ? new Date(currentRound.first_session_close_at)
      : null;

  const second =
    currentRound?.second_session_close_at
      ? new Date(currentRound.second_session_close_at)
      : null;

  const allComplete = teamStatus.every(
    (t) =>
      t.p_missing === 0 &&
      t.d_missing === 0 &&
      t.c_missing === 0 &&
      t.a_missing === 0
  );

  if (allComplete) {
    return "complete";
  }

  if (open && now < open) {
    return "auto";
  }

  if (close && now < close) {
    return "optional";
  }

  if (first && now < first) {
    return "first";
  }

  if (second && now < second) {
    return "second";
  }

  return "extra";
}

function getPhaseLabel() {
  const now = new Date(
    new Date().toLocaleString("en-US", {
      timeZone: "Europe/Rome",
    })
  );

  const svincoliOpen = currentRound?.svincoli_open_at
    ? new Date(currentRound.svincoli_open_at)
    : null;

  const svincoliClose = currentRound?.svincoli_close_at
    ? new Date(currentRound.svincoli_close_at)
    : null;

  const firstClose = currentRound?.first_session_close_at
    ? new Date(currentRound.first_session_close_at)
    : null;

  const secondClose = currentRound?.second_session_close_at
    ? new Date(currentRound.second_session_close_at)
    : null;

  if (
    svincoliOpen &&
    now < svincoliOpen
  ) {
    return "🔓 SVINCOLI AUTOMATICI APERTI";
  }

  if (
    svincoliClose &&
    now < svincoliClose
  ) {
    return "🟡 SVINCOLI FACOLTATIVI APERTI";
  }

  if (
    firstClose &&
    now < firstClose
  ) {
    return "🟠 PRIMA SESSIONE APERTA";
  }

  if (
    secondClose &&
    now < secondClose
  ) {
    return "🟠 SECONDA SESSIONE APERTA";
  }

  const allComplete = teamStatus.every(
    (t) =>
      t.p_missing === 0 &&
      t.d_missing === 0 &&
      t.c_missing === 0 &&
      t.a_missing === 0
  );

  if (allComplete) {
    return "✅ ROSE COMPLETE";
  }

  const duration =
  currentRound?.extra_session_duration ?? 60;

const diff =
  now.getTime() -
  secondClose!.getTime();

const extra =
  Math.floor(
    diff / (duration * 60000)
  ) + 1;

const sessionNames = [
  "TERZA",
  "QUARTA",
  "QUINTA",
  "SESTA",
  "SETTIMA",
  "OTTAVA",
  "NONA",
  "DECIMA",
];

const label =
  sessionNames[extra - 1] ??
  `${extra + 2}ª`;

return `🟠 ${label} SESSIONE APERTA`;
}

const optionalByTeam = useMemo(() => {
  return activeTeams.map(
    ({ teamId, nome }) => {
      const status =
  teamStatus.find(
    (t) => t.team_id === teamId
  );
     
   const buys =
  marketBuys
    .filter(
  (b) =>
    b.team_id === teamId
)

.map((b) => ({
  team_id: teamId,
  nome: b.nome,
  ruolo: b.ruolo,
  nazionale: b.nazionale,
  prezzo: b.prezzo,
}));

const autoReleases =
  officialAutoReleases
    .filter(
      (p) =>
        p.team_id === teamId
    )


    .sort((a, b) => {
      const diff =
        roleOrder[
          a.ruolo as keyof typeof roleOrder
        ] -
        roleOrder[
          b.ruolo as keyof typeof roleOrder
        ];

      if (diff !== 0) {
        return diff;
      }

      return a.nome.localeCompare(
        b.nome,
        "it"
      );
    });

const players = buys;


const refundTotal =
  autoReleases.reduce(
    (sum, p) =>
      sum + p.refund,
    0
  );

const freeSlots =
  autoReleases.length;

  const pSlots =
  autoReleases.filter(
    (p) => p.ruolo === "P"
  ).length;

const dSlots =
  autoReleases.filter(
    (p) => p.ruolo === "D"
  ).length;

const cSlots =
  autoReleases.filter(
    (p) => p.ruolo === "C"
  ).length;

const aSlots =
  autoReleases.filter(
    (p) => p.ruolo === "A"
  ).length;
  
players.sort((a, b) => {
  const diff =
    roleOrder[
      a.ruolo as keyof typeof roleOrder
    ] -
    roleOrder[
      b.ruolo as keyof typeof roleOrder
    ];

  if (diff !== 0) {
    return diff;
  }

  return a.nome.localeCompare(
    b.nome,
    "it"
  );
});

   const missingText = [
  pSlots ? `${pSlots} P` : null,
  dSlots ? `${dSlots} D` : null,
  cSlots ? `${cSlots} C` : null,
  aSlots ? `${aSlots} A` : null,
]
  .filter(Boolean)
  .join(", ");

  return {
  teamId,
  squadra: nome,
  credits:
    (status?.budget ?? 0) +
    refundTotal,
  players,
  autoReleases,
  freeSlots,
  missingText,
};
    }
  );

}, [
  optionalReleases,
  automaticReleases,
  teamStatus,
  currentRound,
  marketBuys,
  officialAutoReleases,
]);

const returnedByTeam = useMemo(() => {
  return Object.entries(eliminatedTeams).map(
    ([teamId, squadra]) => [
      squadra,
      returnedPlayers.filter(
        (p) => p.team_id === Number(teamId)
      ),
    ] as [string, ReturnedPlayer[]]
  );
}, [returnedPlayers]);

      if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(to bottom, #0f172a, #020617)",
          color: "white",
          padding: 12,
        }}
      >
        <BackHome />

        <Link
  href="/mercato/apertura"
  style={{
    position: "fixed",
    top: 12,
    right: 12,
    zIndex: 100,
    background:
      "linear-gradient(135deg,#f59e0b,#d97706)",
    color: "#111827",
    padding: "10px 14px",
    borderRadius: 14,
    textDecoration: "none",
    fontWeight: 800,
    fontSize: ".9rem",
    boxShadow:
      "0 4px 12px rgba(0,0,0,.35)",
  }}
>
  📩 Apertura buste
</Link>

        <div
          style={{
            textAlign: "center",
            marginTop: 60,
            fontSize: "1.1rem",
            color: "#cbd5e1",
          }}
        >
          ⏳ Caricamento mercato...
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom, #0f172a, #020617)",
        color: "white",
        padding: 12,
      }}
    >
      <div
        style={{
          maxWidth: 1600,
          width: "100%",
          margin: "0 auto",
        }}
      >
        <BackHome />

        <h1
          style={{
            textAlign: "center",
            color: "#facc15",
            fontSize: "clamp(2rem,5vw,3rem)",
            fontWeight: 800,
            marginTop: 10,
            marginBottom: 8,
          }}
        >
          💰 MERCATO
        </h1>

        {currentRound && (
          <Card highlight>
            <div
              style={{
                textAlign: "center",
                padding: 18,
              }}
            >
        <div
  style={{
    color: "#facc15",
    fontSize: "1.5rem",
    fontWeight: 800,
    marginBottom: 6,
  }}
>
  {currentRound.name}
</div>

              <div
                style={{
                  color: "#cbd5e1",
                  marginBottom: 12,
                }}
              >
                {currentRound.fifa_phase}
              </div>

              <div
                style={{
                  marginBottom: 12,
                  fontWeight: 700,
                }}
              >
               {getPhaseLabel()}
                
                <div
  style={{
    color: "#93c5fd",
    fontWeight: 700,
    marginTop: 12,
    fontSize: ".95rem",
  }}
>
  {getMarketStatusText()}
</div>

              </div>

              <div
  style={{
    color: "#facc15",
    fontWeight: 700,
  }}
>
  Nazionali eliminate:{" "}
{eliminated.length}/
{currentRound?.eliminated_nationals_count ?? 0}
</div>
             
                  </div>
          </Card>
        )}

                {["first", "second", "extra"].includes(
  getPhase()
) && (
          <Card title="🏆 Acquisti sessione corrente">
  <div
    style={{
      display: "grid",
      gridTemplateColumns:
        "repeat(2,minmax(0,1fr))",
      gap: 8,
    }}
  >
    {activeTeams.map(
      ({ nome }) => {
        const buys =
          assignments
            .filter(
              (a) =>
                a.squadra === nome
            )
            .sort((a, b) => {
              const diff =
                roleOrder[
                  a.ruolo as keyof typeof roleOrder
                ] -
                roleOrder[
                  b.ruolo as keyof typeof roleOrder
                ];

              if (diff !== 0)
                return diff;

              return a.nome.localeCompare(
                b.nome,
                "it"
              );
            });

        return (
          <div
            key={nome}
            style={{
              border:
                "1px solid rgba(250,204,21,.35)",
              background:
                "linear-gradient(180deg,#2a2105,#171003)",
              borderRadius: 18,
              padding: 12,
            }}
          >
            <div
              style={{
                color: "#facc15",
                fontWeight: 800,
                marginBottom: 10,
              }}
            >
              {nome}
            </div>

            {buys.length === 0 ? (
              <div
                style={{
                  color: "#94a3b8",
                  fontSize: ".8rem",
                }}
              >
                Nessun acquisto
              </div>
            ) : (
              buys.map((p, i) => (
                <div
                  key={i}
                  style={{
                    padding: "6px 0",
                    borderTop:
                      "1px solid rgba(255,255,255,.06)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                    }}
                  >
                    <span>
                      {p.ruolo} {p.nome}
                    </span>

                    <span
                      style={{
                        color:
                          "#facc15",
                        fontWeight: 700,
                      }}
                    >
                      {p.prezzo} mln
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        );
      }
    )}
  </div>
</Card>
        )}

        {getPhase() === "optional" && (
          <Card>
            <div
              style={{
                textAlign: "center",
                padding: 14,
              }}
            >
              🟠 Buste aperte.

              <br />
              Inserisci i tuoi acquisti
              entro la deadline.
            </div>
          </Card>
        )}

<Card title="📋 Situazione squadre">
  <div
    style={{
      display: "grid",
      gridTemplateColumns:
  "repeat(2, minmax(0,1fr))",
alignItems: "start",
columnGap: 8,
rowGap: 8,
    }}
  >
   {optionalByTeam.map(
  ({
    teamId,
    squadra,
    credits,
    players,
    autoReleases,
    freeSlots,
    missingText,
  }) => {

    const expanded =
      openTeam === teamId;
       
        return (
          <div
  key={squadra}
  onClick={() =>
    setOpenTeam(
      expanded ? null : teamId
    )
  }
  style={{
    border:
      "1px solid rgba(34,197,94,.35)",
    background:
      "linear-gradient(180deg,#062611,#04160b)",
    borderRadius: 18,
    padding: 12,
    cursor: "pointer",
  }}
>
            <div
              style={{
                color: "#4ade80",
                fontWeight: 800,
                fontSize: ".95rem",
              }}
            >
              {squadra}
            </div>

            <div
              style={{
                color: "#bbf7d0",
                fontWeight: 700,
                marginTop: 4,
                marginBottom: 12,
                fontSize: ".85rem",
              }}
            >
              💳 {credits} mln

              <div
  style={{
    fontSize: ".72rem",
    color: "#94a3b8",
    marginTop: 2,
  }}
>
  🪑 Slot da reintegrare: {missingText || "Nessuno"}
</div>

<div
  style={{
    marginTop: 8,
    color: "#94a3b8",
    fontSize: ".72rem",
    fontWeight: 500,
  }}
>
  {expanded
    ? "▲ Tocca per chiudere"
    : "▼ Clicca per i dettagli"}
</div>

            </div>

           {expanded && (
            <div
  style={{
    color: "#94a3b8",
    fontSize: ".8rem",
  }}
>
      {autoReleases.length > 0 && (
  <div
    style={{
      marginTop: 10,
      borderTop:
        "1px solid rgba(255,255,255,.08)",
      paddingTop: 10,
    }}
  >
    <div
      style={{
        color: "#f87171",
        fontWeight: 700,
        marginBottom: 8,
      }}
    >
      🔓 Svincoli automatici 2° round
    </div>

    {autoReleases.map((p) => (
      <div
        key={`${squadra}-${p.nome}`}
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          fontSize: ".8rem",
          marginBottom: 4,
        }}
      >
        <span>
          {p.ruolo} {p.nome}
        </span>

        <span
          style={{
            color: "#facc15",
            fontWeight: 700,
          }}
        >
          +{p.refund}
        </span>
      </div>
    ))}
  </div>
)}

<div
  style={{
    marginTop: 12,
    paddingTop: 10,
    borderTop:
      "1px solid rgba(255,255,255,.08)",
  }}
>
  <div
    style={{
      color: "#93c5fd",
      fontWeight: 700,
      marginBottom: 8,
      fontSize: ".8rem",
    }}
  >
    📦 Acquisti 1° round buste
  </div>

  <div
    style={{
      color: "#94a3b8",
      fontSize: ".75rem",
      marginBottom: 8,
    }}
  >
    {players.length} giocatori
  </div>

  {players.map((p) => (
  <div
    key={`${squadra}-${p.nome}`}
    style={{
      padding: "6px 0",
      borderTop:
        "1px solid rgba(255,255,255,.05)",
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 8,
        alignItems: "center",
      }}
    >
      <div
        style={{
          fontWeight: 700,
          fontSize: ".8rem",
        }}
      >
        {p.ruolo} {p.nome}
      </div>

      <div
        style={{
          color: "#4ade80",
          fontWeight: 700,
          fontSize: ".78rem",
          whiteSpace: "nowrap",
        }}
      >
        {p.prezzo} mln
      </div>

      <div
        style={{
          color: "#94a3b8",
          fontSize: ".72rem",
        }}
      >
        {p.nazionale}
      </div>
    </div>
  </div>
))}

</div>
</div>

)}
</div>
);
    }
  )}

    {returnedByTeam.map(
  ([squadra, players]) => (
    <div
          key={squadra}
          style={{
            border:
              "1px solid rgba(239,68,68,.35)",
            background:
              "linear-gradient(180deg,#250808,#130404)",
            borderRadius: 18,
            padding: 12,
            alignSelf: "start",
            height: "fit-content",
          }}
        >
          <div
            style={{
              color:
                "#f87171",
              fontWeight: 800,
              fontSize:
                ".95rem",
              marginBottom: 10,
            }}
          >
            {squadra}
          </div>

          <div
            style={{
              color:
                "#fecaca",
              fontSize:
                ".8rem",
              marginBottom: 10,
            }}
          >
            Giocatori
            rientrati:
            {" "}
            {players.length}
          </div>

          {players.map((p) => (
            <div
              key={`${squadra}-${p.nome}`}
              style={{
                padding:
                  "6px 0",
                borderTop:
                  "1px solid rgba(255,255,255,.06)",
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  fontSize:
                    ".8rem",
                }}
              >
                {p.ruolo}{" "}
                {p.nome}
              </div>

              <div
  style={{
    color: "#94a3b8",
    fontSize: ".72rem",
  }}
>
  {currentRound?.status ===
  "buste"
    ? "Nuovo acquisto"
    : p.nazionale}
</div>
            </div>
          ))}
        </div>
      ))}
  </div>
</Card>
       
        {eliminated.length > 0 && (
          <Card title="🌍 Nazionali eliminate">
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              {eliminated.map((n) => (
                <div
                  key={n.nazionale}
                  style={{
                    padding:
                      "8px 12px",
                    background:
                      "rgba(250,204,21,0.15)",
                    border:
                      "1px solid rgba(250,204,21,0.4)",
                    borderRadius: 999,
                    fontWeight: 700,
                  }}
                >
                  {n.nazionale}
                </div>
              ))}
            </div>
          </Card>
        )}

{[
  "optional",
  "first",
  "second",
  "extra",
  "complete",
].includes(getPhase()) && (
          <Card title="📑 Lista svincolati">
            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                marginBottom: 14,
              }}
            >
              {[
                "ALL",
                "P",
                "D",
                "C",
                "A",
              ].map((r) => (
                <button
                  key={r}
                  onClick={() =>
                    setRoleFilter(r)
                  }
                  style={{
                    padding:
                      "8px 14px",
                    borderRadius: 999,
                    border: "none",
                    cursor: "pointer",
                    fontWeight: 700,
                    background:
                      roleFilter ===
                      r
                        ? "#facc15"
                        : "#334155",
                    color:
                      roleFilter ===
                      r
                        ? "#000"
                        : "#fff",
                  }}
                >
                  {r === "ALL"
                    ? "Tutti"
                    : r}
                </button>
              ))}
            </div>

            <input
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="🔍 Cerca giocatore..."
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 12,
                border: "none",
                marginBottom: 14,
              }}
            />

            <div
              style={{
                display: "flex",
                flexDirection:
                  "column",
                gap: 10,
              }}
            >
              {filteredAgents.map(
                (p) => (
                  <div
                    key={p.id}
                    style={{
                      padding: 12,
                      border:
                        "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 12,
                    }}
                  >
                    <b>
                      {p.ruolo}
                    </b>{" "}
                    {p.display_name ||
  p.player_name ||
  "-"}

                    <div
                      style={{
                        color:
                          "#94a3b8",
                      }}
                    >
                      {p.nazionale}
                    </div>
                  </div>
                )
              )}
            </div>
          </Card>
        )}

        {getPhase() === "complete" &&
  assignments.length > 0 && (
            <Card title="🏆 Risultati delle buste">
              {assignments.map(
                (a, i) => (
                  <div
                    key={i}
                    style={{
                      padding:
                        "10px 0",
                      borderBottom:
                        "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <b>
                      {a.squadra}
                    </b>

                    <div>
                      {a.ruolo} •{" "}
                      {a.nome}
                    </div>

                    <div
                      style={{
                        color:
                          "#facc15",
                      }}
                    >
                      {a.prezzo} mln
                    </div>
                  </div>
                )
              )}
            </Card>
          )}

        <Card title="🕓 Storico sessioni di mercato">
          {rounds.map((r) => (
            <div
              key={r.id}
              onClick={() =>
                setExpandedRound(
                  expandedRound ===
                    r.id
                    ? null
                    : r.id
                )
              }
              style={{
                padding: 14,
                marginBottom: 10,
                border:
                  "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12,
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                }}
              >
                {r.name}
              </div>

              <div
                style={{
                  color: "#94a3b8",
                }}
              >
                {r.fifa_phase}
              </div>

              <div
                style={{
                  marginTop: 6,
                }}
              >
                {statusLabel(
                  r.status
                )}
              </div>

              {expandedRound ===
                r.id && (
                <div
                  style={{
                    marginTop: 10,
                    color:
                      "#cbd5e1",
                  }}
                >
                  Apertura:{" "}
                  {new Date(
                    r.open_date
                  ).toLocaleDateString(
                    "it-IT"
                  )}

                  <br />

                  Nazionali da
                  eliminare:{" "}
                  {
                    r.eliminated_nationals_count
                  }
                </div>
              )}
            </div>
          ))}
        </Card>

        <div
          style={{
            marginTop: 40,
            textAlign: "center",
            color: "#94a3b8",
            fontSize: 13,
          }}
        >
          FantAquilaCastoro 2026 •
          Market Center 💰
        </div>
      </div>
    </main>
  );
}