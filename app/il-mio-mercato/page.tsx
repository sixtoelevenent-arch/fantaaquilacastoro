"use client";

export const dynamic =
  "force-dynamic";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import BackHome from "@/components/BackHome";

type MarketRound = {
  id: number;
  status: string;
  session_type: string;
  release_deadline: string | null;
  bid_deadline: string | null;
};

type User = {
  id: number;
  username: string;
  team_id: number;
};

type Player = {
  id: number;
  nome: string;
  nazionale: string;
  ruolo: string;
  prezzo: number | null;
};

export default function IlMioMercatoPage() {
  const router = useRouter();

  const ELIMINATED_USERS = [
  "erny",
  "fava",
  "martin",
  "michel",
];

  const [, forceTick] = useState(0);

  const [loading, setLoading] = useState(true);

  const [user, setUser] =
    useState<User | null>(null);

  const [round, setRound] =
    useState<MarketRound | null>(null);
   
  const releasePhase =
  round?.status === "aperta" &&
  round?.session_type === "svincoli";

const bidPhase =
  round?.status === "aperta" &&
  round?.session_type === "buste";

const marketClosed =
  round?.status === "chiusa";

const [confirmed, setConfirmed] =
  useState(false);
 
 function formatCountdown(
  date: string | null
) {
  if (!date) {
    return "00:00:00";
  }

  const diff =
    new Date(date).getTime() -
    Date.now();

  if (diff <= 0) {
    return "00:00:00";
  }

  const hours = Math.floor(
    diff / 3600000
  );

  const minutes = Math.floor(
    (diff % 3600000) / 60000
  );

  const seconds = Math.floor(
    (diff % 60000) / 1000
  );

  return `${String(hours).padStart(
    2,
    "0"
  )}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(
    2,
    "0"
  )}`;
}

function nationCode(name: string) {
  const map: Record<string, string> = {
    "Germania": "GER",
    "Svezia": "SWE",
    "Paesi Bassi": "NED",
    "Costa d'Avorio": "CIV",
    "Francia": "FRA",
    "Spagna": "ESP",
    "Portogallo": "POR",
    "Inghilterra": "ENG",
    "Brasile": "BRA",
    "Argentina": "ARG",
    "Italia": "ITA",
    "Belgio": "BEL",
    "Croazia": "CRO",
    "Danimarca": "DEN",
    "Norvegia": "NOR",
    "Marocco": "MAR",
    "Messico": "MEX",
    "Stati Uniti": "USA",
    "Canada": "CAN",
    "Giappone": "JPN",
    "Corea del Sud": "KOR",
    "Uruguay": "URU",
    "Colombia": "COL",
    "Iran": "IRN",
    "Turchia": "TUR",
    "Uzbekistan": "UZB",
    "Ghana": "GHA",
    "Senegal": "SEN",
    "Svizzera": "SUI",
    "Serbia": "SRB",
    "Polonia": "POL",
    "Austria": "AUT",
    "Repubblica Ceca": "CZE",
    "Scozia": "SCO",
    "Tunisia": "TUN",
    "Panama": "PAN",
    "Nuova Zelanda": "NZL",
    "Arabia Saudita": "KSA",
    "Qatar": "QAT",
    "Iraq": "IRQ",
    "Giordania": "JOR",
    "Haiti": "HAI",
    "Curacao": "CUW",
  };

  return map[name] ?? name;
}

  const [myPlayers, setMyPlayers] =
    useState<Player[]>([]);

    const [freeAgents, setFreeAgents] =
  useState<Player[]>([]);

    const [leftoverBudget, setLeftoverBudget] =
  useState(0);

  const [teamStatus, setTeamStatus] =
  useState<{
    p_missing: number;
    d_missing: number;
    c_missing: number;
    a_missing: number;
  } | null>(null);

  const [automaticIds, setAutomaticIds] =
    useState<number[]>([]);

     const [selectedIds, setSelectedIds] =
    useState<number[]>([]);

    const [saving, setSaving] =
  useState(false);

const [confirming, setConfirming] =
  useState(false);

  const [offersConfirmed, setOffersConfirmed] =
  useState(false);

const [confirmingOffers, setConfirmingOffers] =
  useState(false);

  const [search, setSearch] =
    useState("");

  const [roleFilter, setRoleFilter] =
    useState("ALL");
const [agentSearch, setAgentSearch] =
  useState("");

const [agentRoleFilter, setAgentRoleFilter] =
  useState("ALL");

  const [openRoles, setOpenRoles] =
  useState({
    P: false,
    D: false,
    C: false,
    A: false,
  });

  const [selectedAgents, setSelectedAgents] =
  useState<number[]>([]);

  const [agentOffers, setAgentOffers] =
  useState<Record<number, string>>({});

  type TeamConfirmation = {
  username: string;
  confirmed: boolean;
};

const [teamConfirmations, setTeamConfirmations] =
  useState<TeamConfirmation[]>([]);

const visibleConfirmations =
  teamConfirmations.filter(
    (t) =>
      !ELIMINATED_USERS.includes(
        t.username.toLowerCase()
      )
  );

const confirmedCount =
  visibleConfirmations.filter(
    (t) => t.confirmed
  ).length;

    useEffect(() => {
  if (typeof window !== "undefined") {
    loadPage();
  }
}, []);

  useEffect(() => {
  const timer = setInterval(() => {
    forceTick((v) => v + 1);
  }, 1000);

  return () => clearInterval(timer);
}, []);

    async function loadPage() {
  if (typeof window === "undefined") {
    return;
  }

  setLoading(true);

  const raw =
    localStorage.getItem(
      "fantasy_user"
    );

    if (!raw) {
      router.push("/login");
      return;
    }

    const u =
      JSON.parse(raw) as User;

      setUser(u);

  const { data: roundData } = await supabase
  .from("market_rounds")
  .select("*")
  .neq("status", "chiusa")
  .order("id")
  .limit(1)
  .maybeSingle();

if (!roundData) {
  setLoading(false);
  return;
}

const currentRound =
  roundData as MarketRound;

setRound(currentRound);

console.log("roundData", roundData);
console.log("currentRound", currentRound);

const nextRoundId = currentRound.id;

    if (currentRound) {

  const { data: releases } =
  await supabase
    .from("market_releases")
    .select(`
      team_id,
      confirmed
    `)
    .eq("round_id", currentRound.id);

const { data: users } =
  await supabase
    .from("fantasy_users")
    .select(`
      username,
      team_id
    `);

  const confirmations =
  (users ?? []).map((u: any) => ({
    username: u.username,
    confirmed:
      (releases ?? []).some(
        (r: any) =>
          Number(r.team_id) ===
            Number(u.team_id) &&
          r.confirmed === true
      ),
  }));

  setTeamConfirmations(
    confirmations
  );
}

    const {
      data: squad,
    } = await supabase
      .from("players")
      .select(`
  id,
  nome,
  nazionale,
  ruolo,
  prezzo
`)
      .eq(
        "team_id",
        u.team_id
      )
      .order("ruolo")
.order("nome");

    const squadRows =
      (squad as Player[]) ?? [];

           setMyPlayers(squadRows);

           const { data: agents } = await supabase
  .from("market_available_players")
  .select("*");

setFreeAgents(
  (agents ?? []).map((p: any) => ({
    id: p.id,
    nome: p.display_name,
    nazionale: p.nazionale,
    ruolo: p.ruolo,
    prezzo: p.quotazione,
  }))
);

const { data: budget } =
  await supabase
    .from("market_budgets")
    .select("total_budget")
    .eq("team_id", u.team_id)
    .maybeSingle();

setLeftoverBudget(
  budget?.total_budget ?? 0
);

const { data: status } =
  await supabase
    .from("market_team_status")
    .select(`
      p_missing,
      d_missing,
      c_missing,
      a_missing
    `)
    .eq("team_id", u.team_id)
    .maybeSingle();

  setTeamStatus(status);
  setConfirmed(false);
  setOffersConfirmed(false);
  setSelectedIds([]);
  setAutomaticIds([]);
  setSelectedAgents([]);
  setAgentOffers({});

  const {
    data: release,
    error: releaseError,
  } = await supabase
  .from("market_releases")
  .select(`
    id,
    confirmed,
    bids_confirmed
  `)
  .eq("round_id", currentRound.id)
  .eq("team_id", u.team_id)
  .maybeSingle();

if (releaseError) {
  console.error(releaseError);
}

  if (release) {
  setConfirmed(

    release.confirmed ?? false
  );

setOffersConfirmed(
  currentRound.session_type === "buste" &&
  (release.bids_confirmed ?? false)
);
} else {
  setOffersConfirmed(false);
  }
  let releasedRows: any[] = [];

if (release) {
  const {
    data: playersReleased,
    error: playersReleasedError,
  } = await supabase
    .from("market_release_players")
    .select(`
      player_id,
      automatic
    `)
    .eq(
      "release_id",
      release.id
    );

  if (playersReleasedError) {
    console.error(
      playersReleasedError
    );
  }

  releasedRows =
    playersReleased ?? [];
}

setSelectedIds(
  releasedRows.map(
    (r) => r.player_id
  )
);

const { data: bids } =
  await supabase
    .from("market_bids")
    .select(`
      player_id,
      bid,
      priority
    `)
    .eq("team_id", u.team_id)
    .eq("round_id", currentRound.id)
    .order("priority");

if (bids) {
  setSelectedAgents(
  bids.map((b) => b.player_id)
);

  const offers: Record<number, string> = {};

  bids.forEach((b) => {
    offers[b.player_id] = String(b.bid);
  });

  setAgentOffers(offers);
}

const {
    data: auto,
    error: autoError,
  } = await supabase.rpc(
    "market_automatic_releases_view",
    {
      p_round: nextRoundId,
    }
  );

  if (autoError) {
    console.error(autoError);
  }

  const ids = (auto ?? [])
  .filter(
    (r: any) =>
      Number(r.team_id) === Number(u.team_id)
  )
  .map((r: any) => r.player_id);

setAutomaticIds(ids);

setLoading(false);
}

  async function toggleRelease(
    playerId: number
  ) {

  if (
  !user ||
  !round ||
  !releasePhase ||
  confirmed
) {
  return;
}

    const selected =
      selectedIds.includes(
        playerId
      );

    if (selected) {
      const {
  data: release,
} = await supabase
  .from("market_releases")
  .select("id")
  .eq("round_id", round.id)
  .eq("team_id", user.team_id)
  .maybeSingle();

if (release) {
  await supabase
    .from(
      "market_release_players"
    )
    .delete()
    .eq(
      "release_id",
      release.id
    )
    .eq(
      "player_id",
      playerId
    );
}

  setSelectedIds(
  (prev) =>
    prev.filter(
      (id) =>
        id !== playerId
    )
);

alert(
  "Giocatore rimosso dagli svincoli."
);

    } else {
  if (
    round.status !== "aperta" ||
    round.session_type !== "svincoli"
  ) {
    return;
  }

  let releaseId: number | null = null;

  const {
  data: release,
} = await supabase
  .from("market_releases")
  .select("id")
  .eq("round_id", round.id)
  .eq("team_id", user.team_id)
  .maybeSingle();

  if (release) {
    releaseId = release.id;
  } else {
    const {
      data: created,
    } = await supabase
      .from("market_releases")
      .insert({
        round_id: round.id,
        team_id: user.team_id,
      })
      .select("id")
      .single();

    if (!created) return;

    releaseId = created.id;
  }

  await supabase
    .from(
      "market_release_players"
    )
    .insert({
      release_id: releaseId,
      player_id: playerId,
      prezzo_recuperato: 0,
      automatic: false,
    });

  setSelectedIds(
    (prev) => [
      ...prev,
      playerId,
    ]
  );

  alert(
  "Giocatore aggiunto agli svincoli."
);
}
  }

  async function toggleAgent(
  playerId: number
) {
  if (offersConfirmed) return;

  const selected =
    selectedAgents.includes(playerId);

  if (selected) {
  const nextIds =
    selectedAgents.filter(
      (id) => id !== playerId
    );

  if (user && round) {
    await supabase
      .from("market_bids")
      .delete()
      .eq("team_id", user.team_id)
      .eq("player_id", playerId)
      .eq("round_id", round.id);

    await Promise.all(
      nextIds.map(
        (id, index) =>
          supabase
            .from("market_bids")
            .update({
              priority:
                index + 1,
            })
            .eq(
              "team_id",
              user.team_id
            )
            .eq(
              "player_id",
              id
            )
            .eq(
              "round_id",
              round.id
            )
      )
    );
  }

  setSelectedAgents(nextIds);

  setAgentOffers((prev) => {
    const next = { ...prev };
    delete next[playerId];
    return next;
  });

  return;
}

  if (
  selectedAgents.length >=
  playersToBuy
) {
  alert(
    `Puoi selezionare al massimo ${playersToBuy} giocatori.`
  );
  return;
}
const player = freeAgents.find(
  (p) => p.id === playerId
);

if (!player) return;

const selectedRoleCount =
  selectedFreeAgents.filter(
    (p) => p.ruolo === player.ruolo
  ).length;

const role =
  player.ruolo as keyof typeof releasedByRole;

const maxForRole =
  releasedByRole[role];

if (selectedRoleCount >= maxForRole) {
  alert(
    `Hai già selezionato tutti i ${player.ruolo} richiesti.`
  );
  return;
}


const nextIds = [
  ...selectedAgents,
  playerId,
];

setSelectedAgents(nextIds);

setAgentOffers((prev) => ({
  ...prev,
  [playerId]: "1",
}));

if (user && round) {
  await supabase
    .from("market_bids")
    .upsert({
      team_id: user.team_id,
      player_id: playerId,
      bid: 1,
      priority: nextIds.length,
      round_id: round.id,
    });
}
}

  async function saveDraft() {
  if (
    !user ||
    !round ||
    confirmed
  ) {
    return;
  }

  setSaving(true);

  const { data: release } =
    await supabase
      .from("market_releases")
      .select("id")
      .eq("round_id", round.id)
      .eq("team_id", user.team_id)
      .maybeSingle();

  if (release) {
    await supabase
      .from("market_releases")
      .update({
        draft_saved: true,
      })
      .eq("id", release.id);
  }

  setSaving(false);

  alert(
    "Bozza svincoli salvata."
  );
}

async function confirmReleases() {
  if (!user || !round) return;

  const ok = window.confirm(
    "Confermi definitivamente gli svincoli?"
  );

  if (!ok) return;

  setConfirming(true);

 const { data: release } =
  await supabase
    .from("market_releases")
    .select("id")
    .eq("round_id", round.id)
    .eq("team_id", user.team_id)
    .maybeSingle();

  if (!release) {
    alert(
      "Seleziona almeno uno svincolo."
    );

    setConfirming(false);
    return;
  }

    await supabase
    .from("market_releases")
    .update({
      confirmed: true,
      confirmed_at:
        new Date().toISOString(),
    })
    .eq("id", release.id);

  setConfirming(false);
setConfirmed(true);

const activeTeams =
  teamConfirmations.filter(
    (t) =>
      !ELIMINATED_USERS.includes(
        t.username.toLowerCase()
      )
  ).length;

const { count } = await supabase
  .from("market_releases")
  .select("*", {
    count: "exact",
    head: true,
  })
  .eq("round_id", round.id)
  .eq("confirmed", true);

if (count === activeTeams) {
  const { data: budgets } =
    await supabase
      .from("market_budgets")
      .select("*");

  for (const b of budgets ?? []) {
    await supabase
      .from("market_budgets")
      .update({
        total_budget:
          (b.leftover_budget ?? 0) +
          (b.group_bonus ?? 0) +
          (b.automatic_refunds ?? 0) +
          (b.manual_refunds ?? 0),
      })
      .eq("team_id", b.team_id);
  }

  await supabase
    .from("market_rounds")
    .update({
      status: "aperta",
      session_type: "buste",
    })
    .eq("id", round.id);

  await loadPage();
}

alert(
  "Svincoli confermati."
);

await loadPage();
}

async function confirmOffers() {
  if (!user || !round) return;

  if (
    selectedAgents.length !==
    playersToBuy
  ) {
    alert(
      `Devi selezionare ${playersToBuy} giocatori.`
    );
    return;
  }

  if (
    remainingCredits <
    minimumReserve
  ) {
    alert(
      "Crediti insufficienti."
    );
    return;
  }

  const ok = window.confirm(
    "Confermi definitivamente le buste?"
  );

  if (!ok) return;

  setConfirmingOffers(true);

  let releaseId: number;

const { data: release } =
  await supabase
    .from("market_releases")
    .select("id")
    .eq("round_id", round.id)
    .eq("team_id", user.team_id)
    .maybeSingle();

if (release) {
  releaseId = release.id;
} else {
  if (
    round.status !== "aperta" ||
    round.session_type !== "buste"
  ) {
    setConfirmingOffers(false);
    return;
  }

  const { data: created } =
    await supabase
      .from("market_releases")
      .insert({
        round_id: round.id,
        team_id: user.team_id,
      })
      .select("id")
      .single();

  if (!created) {
    setConfirmingOffers(false);
    return;
  }

  releaseId = created.id;
}

await supabase
  .from("market_releases")
  .update({
    bids_confirmed: true,
    bids_confirmed_at:
      new Date().toISOString(),
  })
  .eq("id", releaseId);

setOffersConfirmed(true);

const activeTeams =
  teamConfirmations.filter(
    (t) =>
      !ELIMINATED_USERS.includes(
        t.username.toLowerCase()
      )
  ).length;

const { count } = await supabase
  .from("market_releases")
  .select("*", {
    count: "exact",
    head: true,
  })
  .eq("round_id", round.id)
  .eq("bids_confirmed", true);

if (count === activeTeams) {
  await fetch(
    `/api/il-mio-mercato/process?roundId=${round.id}`
  );
}

setConfirmingOffers(false);

alert("Buste confermate.");

await loadPage();
}


 const releasedPlayers = useMemo(
  () =>
    myPlayers.filter((p) =>
      selectedIds.includes(p.id)
    ),
  [myPlayers, selectedIds]
);

const manualRefund = useMemo(
  () =>
    releasedPlayers
      .filter(
        (p) =>
          !automaticIds.includes(p.id)
      )
      .reduce(
        (sum, p) =>
          sum +
          Math.ceil(
            (p.prezzo ?? 0) / 2
          ),
        0
      ),
  [
    releasedPlayers,
    automaticIds,
  ]
);

const totalRefund = useMemo(
  () =>
    releasedPlayers.reduce(
      (sum, p) =>
        sum +
        Math.ceil(
          (p.prezzo ?? 0) / 2
        ),
      0
    ),
  [releasedPlayers]
);

const availableCredits =
  leftoverBudget +
  manualRefund;

const spentOffers = Object.values(
  agentOffers
).reduce(
  (sum, value) =>
    sum + (Number(value) || 0),
  0
);

const remainingCredits = Math.max(
  availableCredits - spentOffers,
  0
);

const playersToBuy =
  bidPhase
    ? (teamStatus?.p_missing ?? 0) +
      (teamStatus?.d_missing ?? 0) +
      (teamStatus?.c_missing ?? 0) +
      (teamStatus?.a_missing ?? 0)
    : releasedPlayers.length;
   
const selectedCount =
  selectedAgents.length;

const minimumReserve =
  Math.max(
    playersToBuy -
      selectedCount,
    0
  );

  const missingSlots = Math.max(
  playersToBuy - selectedCount,
  0
);

const selectedFreeAgents =
  selectedAgents
    .map((id) =>
      freeAgents.find(
        (p) => p.id === id
      )
    )
    .filter(Boolean) as Player[];

    const releasedByRole = {
  P: teamStatus?.p_missing ?? 0,
  D: teamStatus?.d_missing ?? 0,
  C: teamStatus?.c_missing ?? 0,
  A: teamStatus?.a_missing ?? 0,
};

const boughtByRole = {
  P: selectedFreeAgents.filter((p) => p.ruolo === "P").length,
  D: selectedFreeAgents.filter((p) => p.ruolo === "D").length,
  C: selectedFreeAgents.filter((p) => p.ruolo === "C").length,
  A: selectedFreeAgents.filter((p) => p.ruolo === "A").length,
};

const missingByRole = {
  P: Math.max(
    releasedByRole.P -
      boughtByRole.P,
    0
  ),
  D: Math.max(
    releasedByRole.D -
      boughtByRole.D,
    0
  ),
  C: Math.max(
    releasedByRole.C -
      boughtByRole.C,
    0
  ),
  A: Math.max(
    releasedByRole.A -
      boughtByRole.A,
    0
  ),
};
 
  const filteredAgents =
  useMemo(() => {
    let rows = [
      ...freeAgents,
    ];

   rows.sort((a, b) => {
  const getSurname = (full: string) => {
    const parts = full.trim().split(/\s+/);

    return parts.length > 1
      ? parts.slice(1).join(" ")
      : parts[0];
  };

  return getSurname(a.nome).localeCompare(
    getSurname(b.nome),
    "it",
    {
      sensitivity: "base",
    }
  );
});

    if (agentSearch) {
  rows = rows.filter((p) =>
    p.nome
      .toLowerCase()
      .includes(
        agentSearch.toLowerCase()
      )
  );
}

if (
  agentRoleFilter !== "ALL"
) {
  rows = rows.filter(
    (p) =>
      p.ruolo ===
      agentRoleFilter
  );
}

    return rows;
  }, [
  freeAgents,
  agentSearch,
  agentRoleFilter,
]);

const groupedAgents = {
  P: filteredAgents.filter(
    (p) => p.ruolo === "P"
  ),
  D: filteredAgents.filter(
    (p) => p.ruolo === "D"
  ),
  C: filteredAgents.filter(
    (p) => p.ruolo === "C"
  ),
  A: filteredAgents.filter(
    (p) => p.ruolo === "A"
  ),
};

  const filteredPlayers =
    useMemo(() => {
       
      let rows = [
        ...myPlayers,
      ];

      if (search) {
        rows = rows.filter(
          (p) => {
            const name = p.nome;
            return name
              .toLowerCase()
              .includes(
                search.toLowerCase()
              );
          }
        );
        }

      if (
        roleFilter !== "ALL"
      ) {
        rows = rows.filter(
          (p) =>
            p.ruolo ===
            roleFilter
        );
      }

      return rows;
    }, [
      myPlayers,
      search,
      roleFilter,
    ]);

  if (loading) {
    return (
      <main
        style={{
          minHeight:
            "100vh",
          background:
            "#020617",
          color: "white",
          display: "flex",
          justifyContent:
            "center",
          alignItems:
            "center",
        }}
      >
        ⏳ Caricamento...
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom,#020617,#0f172a)",
        color: "white",
        padding: 20,
      }}
    >
      <div
        style={{
          maxWidth: 1000,
          margin: "0 auto",
        }}
      >
        <BackHome />

        <h1
          style={{
            textAlign:
              "center",
            marginBottom: 10,
          }}
        >
          💰 IL MIO MERCATO
        </h1>
<div
  style={{
    background:
      "rgba(255,255,255,.04)",
    border:
      "1px solid rgba(255,255,255,.08)",
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
  }}
>
      <div
        style={{
          color: "#facc15",
          fontWeight: 800,
          fontSize: "1.05rem",
          marginBottom: 14,
        }}
      >
        📋 Riepilogo svincoli
      </div>

      {releasedPlayers.map((p) => (
        <div
          key={p.id}
          style={{
  display: "grid",
  gridTemplateColumns:
    "1.8fr .7fr .9fr .9fr",
  columnGap: 10,
  alignItems: "center",
  padding: "10px 0",
  borderTop:
    "1px solid rgba(255,255,255,.08)",
  fontSize: ".92rem",
}}
        >
                  <div
  style={{
    fontWeight: 700,
  }}
>
  {p.nome}
</div>

<div
  style={{
    color: "#94a3b8",
    fontSize: ".85rem",
    whiteSpace: "nowrap",
  }}
>
  {p.ruolo} • {nationCode(p.nazionale)}
</div>

                    <div
            style={{
              color: "#facc15",
              fontWeight: 700,
              textAlign: "right",
    fontVariantNumeric: "tabular-nums",
            }}
          >
            {p.prezzo} mln
          </div>

          <div
            style={{
              color: "#4ade80",
              fontWeight: 700,
              textAlign: "right",
    fontVariantNumeric: "tabular-nums",
            }}
          >
            +
            {Math.ceil(
              (p.prezzo ?? 0) / 2
            )}{" "}
            mln
          </div>
        </div>
      ))}

      <div
  style={{
    marginTop: 16,
    paddingTop: 16,
    borderTop:
      "1px solid rgba(255,255,255,.1)",
    display: "flex",
    justifyContent:
      "space-between",
    flexWrap: "wrap",
    gap: 10,
    fontWeight: 800,
  }}
>
  <div>
    🌍 Svincoli automatici:
    {automaticIds.length}
  </div>

  <div>
  🪑 Slot da reintegrare:
  {" "}
  {(teamStatus?.p_missing ?? 0) +
    (teamStatus?.d_missing ?? 0) +
    (teamStatus?.c_missing ?? 0) +
    (teamStatus?.a_missing ?? 0)}

  <div
    style={{
      marginTop: 6,
      fontSize: ".9rem",
      color: "#cbd5e1",
      fontWeight: 600,
    }}
  >
    🧤 {teamStatus?.p_missing ?? 0} •
    {" "}🛡️ {teamStatus?.d_missing ?? 0} •
    {" "}⚙️ {teamStatus?.c_missing ?? 0} •
    {" "}🎯 {teamStatus?.a_missing ?? 0}
  </div>
</div>

  <div
    style={{
      color: "#4ade80",
    }}
  >
    Recupero totale:
    +{totalRefund} mln
  </div>

  <div
    style={{
      width: "100%",
      marginTop: 12,
      paddingTop: 12,
      borderTop:
        "1px solid rgba(255,255,255,.08)",
      color: "#facc15",
      fontWeight: 800,
      fontSize: "1.05rem",
    }}
  >
    💳 Crediti disponibili:
    {availableCredits} mln
  </div>
  </div>
</div>

        {confirmed && (
  <div
    style={{
      background:
        "rgba(22,163,74,.12)",
      border:
        "1px solid rgba(34,197,94,.3)",
      borderRadius: 16,
      padding: 18,
      marginBottom: 20,
      textAlign: "center",
      color: "#bbf7d0",
    }}
  >
    ✅ Hai già confermato
    definitivamente gli
    svincoli. Non sono più
    modificabili.
  </div>
)}

        {releasePhase && !confirmed && (
  <div
    style={{
      background:
        "rgba(22,163,74,.12)",
      border:
        "1px solid rgba(34,197,94,.3)",
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      textAlign: "center",
      color: "#bbf7d0",
    }}
  >
    🟢 FASE SVINCOLI APERTA

    <br />

    Puoi selezionare i giocatori
    da svincolare ancora per

    <div
  style={{
    fontSize: "2rem",
    fontWeight: 900,
    letterSpacing: 2,
    fontVariantNumeric:
      "tabular-nums",
    marginTop: 14,
    color: "#fff",
  }}
>
  {formatCountdown(
  round?.release_deadline ??
    null
)}
</div>
  </div>
)}

{releasePhase &&
  teamConfirmations.length > 0 && (
    <div
      style={{
  background:
    "rgba(255,255,255,.04)",
  border:
    "1px solid rgba(255,255,255,.08)",
  borderRadius: 16,
  padding: 14,
  marginBottom: 16,
}}
    >
      <div
        style={{
          textAlign: "center",
          color: "#facc15",
          fontWeight: 800,
          marginBottom: 16,
        }}
      >
     ✅ Conferme allenatori ({confirmedCount}/{visibleConfirmations.length})
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(160px,1fr))",
          gap: 8,
        }}
      >
        {[...visibleConfirmations]
  .sort(
    (a, b) =>
      Number(b.confirmed) -
      Number(a.confirmed)
  )
  .map((t) => (
          <div
            key={t.username}
            style={{
              padding: "8px 12px",
              borderRadius: 12,
              background:
                "rgba(255,255,255,.03)",
              border:
                "1px solid rgba(255,255,255,.08)",
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
            }}
          >
            <span>
              {t.username}
            </span>

            <span
              style={{
                fontSize: "1.1rem",
              }}
            >
              {t.confirmed
                ? "🟢"
                : "🟡"}
            </span>
          </div>
        ))}
      </div>
    </div>
)}

{offersConfirmed && (
  <div
    style={{
      background:
        "rgba(22,163,74,.12)",
      border:
        "1px solid rgba(34,197,94,.3)",
      borderRadius: 16,
      padding: 18,
      marginBottom: 20,
      textAlign: "center",
      color: "#bbf7d0",
    }}
  >
    ✅ Hai già confermato
    definitivamente le buste.
    Non sono più modificabili.
  </div>
)}


{bidPhase && (
  <div
    style={{
      background:
        "rgba(245,158,11,.12)",
      border:
        "1px solid rgba(245,158,11,.3)",
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      textAlign: "center",
      color: "#fde68a",
    }}
  >
    🟠 FASE ACQUISTI APERTA

    <br />

    Gli svincoli sono terminati.

    <br />

    È ora possibile inserire
    le offerte in busta ancora per

    <br />
    <br />

    <div
      style={{
        fontSize: "2rem",
        fontWeight: 900,
        letterSpacing: 2,
        fontVariantNumeric:
          "tabular-nums",
        marginTop: 12,
        color: "#fff",
      }}
    >
      {formatCountdown(
        round?.bid_deadline ??
          null
      )}
    </div>
  </div>
)}


{marketClosed && (
  <div
    style={{
      background:
        "rgba(59,130,246,.12)",
      border:
        "1px solid rgba(59,130,246,.25)",
      borderRadius: 16,
      padding: 18,
      marginBottom: 20,
      textAlign: "center",
      color: "#bfdbfe",
    }}
  >
    🔵 SESSIONE DI MERCATO CONCLUSA

    <br />

    I risultati delle buste
    sono disponibili nella
    sezione Risultati Mercato.
  </div>
)}

        {releasePhase &&
  automaticIds.length > 0 && (
    <div
      style={{
        background:
          "rgba(250,204,21,.12)",
        border:
          "1px solid rgba(250,204,21,.3)",
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        textAlign: "center",
        color: "#fde68a",
      }}
    >
      ⚠️ Hai{" "}
      {automaticIds.length}{" "}
      svincoli automatici per
      nazionali eliminate.
    </div>
)}

        <p
          style={{
            textAlign:
              "center",
            color:
              "#cbd5e1",
            marginBottom:
              25,
          }}
        >
          {releasePhase &&
  !confirmed &&
  "Seleziona i giocatori da svincolare."}

{bidPhase &&
  "Fase acquisti aperta."}

  {releasePhase &&
  !confirmed && (
    <>
      <br />
      <br />
      Giocatori in rosa: {myPlayers.length}
    </>
)}

        </p>

        {releasePhase && (
  <>
    <input
  value={search}
  onChange={(e) => {
    setSearch(e.target.value);
  }}
  onClick={(e) => {
    e.stopPropagation();
  }}
      placeholder="🔍 Cerca giocatore..."
      style={{
        width: "100%",
        padding: 12,
        borderRadius: 12,
        border: "none",
        marginBottom: 16,
      }}
    />

    <div
      style={{
        display: "flex",
        gap: 10,
        flexWrap: "wrap",
        marginBottom: 20,
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
            padding: "8px 14px",
            borderRadius: 999,
            border: "none",
            cursor: "pointer",
            fontWeight: 700,
            background:
              roleFilter === r
                ? "#facc15"
                : "#334155",
            color:
              roleFilter === r
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
  </>
)}

{releasePhase && !confirmed && (
  <div
    style={{
      background:
        "rgba(59,130,246,.12)",
      border:
        "1px solid rgba(59,130,246,.25)",
      borderRadius: 16,
      padding: 12,
      marginBottom: 20,
      color: "#bfdbfe",
      fontSize: ".9rem",
      lineHeight: 1.45,
    }}
  >
    💾 Bozza modificabile e
    salvabile infinite volte.

    <br />
    <br />

    ⏰ Alla deadline, se non
    confermi, verranno comunque
    considerati gli svincoli
    selezionati.

    <br />
    <br />

    ✅ La conferma rende gli
    svincoli definitivi e non
    più modificabili.
  </div>
)}

{releasePhase && (
  <div
    style={{
      display: "flex",
      gap: 12,
      flexWrap: "wrap",
      marginBottom: 20,
    }}
  >
    <button
      onClick={saveDraft}
      disabled={
  saving ||
  confirming ||
  confirmed
}
      style={{
        flex: 1,
        minWidth: 180,
        padding: 16,
        border: "none",
        borderRadius: 14,
        background: "#2563eb",
        color: "white",
        fontWeight: 800,
      }}
    >
      💾 SALVA IN BOZZA
    </button>

    <button
      onClick={confirmReleases}
      disabled={
  saving ||
  confirming ||
  confirmed
}
      style={{
        flex: 1,
        minWidth: 180,
        padding: 16,
        border: "none",
        borderRadius: 14,
        background: "#16a34a",
        color: "white",
        fontWeight: 800,
      }}
    >
      {
  confirmed
    ? "✅ SVINCOLI CONFERMATI"
    : "✅ CONFERMA SVINCOLI"
}
    </button>
  </div>
)}

        <div
          style={{
            display: "flex",
            flexDirection:
              "column",
            gap: 12,
          }}
        >
          {releasePhase &&
  filteredPlayers.map(
            (p) => {
              const automatic =
                automaticIds.includes(
                  p.id
                );

              const selected =
                selectedIds.includes(
                  p.id
                );

              return (
                <div
                  key={p.id}
                  style={{
                    background:
                      "#111827",
                    borderRadius:
                      16,
                    padding:
                      16,
                    border:
                      automatic
                        ? "1px solid rgba(250,204,21,.35)"
                        : "1px solid rgba(255,255,255,.08)",
                  }}
                >
                  <div
                    style={{
                      display:
                        "flex",
                      justifyContent:
                        "space-between",
                      gap: 20,
                      flexWrap:
                        "wrap",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontWeight:
                            800,
                          fontSize:
                            "1.05rem",
                        }}
                      >
                        {p.nome}
                      </div>

                      <div
  style={{
    color: "#94a3b8",
    marginTop: 4,
  }}
>
  {nationCode(p.nazionale)}
</div>

                      <label
                        style={{
                          display:
                            "flex",
                          alignItems:
                            "center",
                          gap: 8,
                          marginTop:
                            12,
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={
                            automatic ||
                            selected
                          }
                          disabled={
  automatic ||
  !releasePhase ||
  confirmed
}
                          onChange={() =>
                            toggleRelease(
                              p.id
                            )
                          }
                        />

                        {automatic
  ? "🌍 Già svincolato automaticamente"
  : selected
  ? "✅ Da svincolare"
  : "⬜ Svincola"}

                      </label>
                    </div>

                   <div
  style={{
    textAlign: "right",
  }}
>
  <div>{p.ruolo}</div>

  <div
    style={{
      color: "#facc15",
      fontWeight: 800,
      fontSize: "1.1rem",
      marginTop: 8,
    }}
  >
    Acquisto: {p.prezzo} mln
  </div>

  <div
    style={{
      color: "#4ade80",
      marginTop: 6,
      fontSize: ".95rem",
    }}
  >
    Recupero: {Math.ceil((p.prezzo ?? 0) / 2)} mln
  </div>

  {automatic && (
    <div
      style={{
        color: "#fde68a",
        fontSize: ".85rem",
        marginTop: 6,
      }}
    >
      Credito già recuperato automaticamente
    </div>
  )}
</div>

                      </div>
                    </div>
                 );
            }
          )}

          {releasePhase &&
  filteredPlayers.length === 0 && (
    <div
      style={{
        background: "#111827",
        borderRadius: 16,
        padding: 20,
        textAlign: "center",
        color: "#94a3b8",
      }}
    >
      Nessun giocatore trovato.
    </div>
)}

        </div>
  {bidPhase && (
  <div
    style={{
      background: "#111827",
      borderRadius: 16,
      padding: 20,
      marginTop: 20,
    }}
  >
    <div
      style={{
        textAlign: "center",
        color: "#facc15",
        fontWeight: 800,
        fontSize: "1.1rem",
        marginBottom: 20,
      }}
    >
      📑 LISTONE SVINCOLATI
    </div>

<div
  style={{
    background:
      "rgba(59,130,246,.12)",
    border:
      "1px solid rgba(59,130,246,.25)",
    borderRadius: 12,
    padding: 14,
    marginBottom: 18,
    color: "#bfdbfe",
    lineHeight: 1.5,
    textAlign: "center",
  }}
>
  Seleziona i giocatori che vuoi
  acquistare.

  <br />
  <br />

  I valori mostrati nel listone
  sono solamente indicativi.

  <br />

  Per ogni giocatore selezionato
  potrai inserire manualmente
  la tua offerta in crediti e
  poi confermare le buste.
</div>

    <div
      style={{
        textAlign: "center",
        color: "#94a3b8",
        marginBottom: 20,
      }}
    >
      Giocatori disponibili:{" "}
      {filteredAgents.length}
    </div>
    
{playersToBuy === 0 && (
  <div
    style={{
      background:
        "rgba(250,204,21,.12)",
      border:
        "1px solid rgba(250,204,21,.3)",
      borderRadius: 12,
      padding: 14,
      marginBottom: 18,
      color: "#fde68a",
      textAlign: "center",
    }}
  >
    {releasePhase ? (
  <>
    Non hai posti liberi in rosa.
    <br />
    Per acquistare giocatori devi
    prima effettuare degli svincoli.
  </>
) : (
  <>
    Non hai posti liberi in rosa.
    <br />
    La rosa è già completa.
  </>
)}
  </div>
)}

<div
  style={{
    background:
      "rgba(255,255,255,.04)",
    border:
      "1px solid rgba(255,255,255,.08)",
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
  }}
>
    <div
      style={{
        color: "#facc15",
        fontWeight: 800,
        marginBottom: 16,
      }}
    >
      📝 Le tue offerte
    </div>

<button
  onClick={confirmOffers}
  disabled={
    offersConfirmed ||
    confirmingOffers ||
    playersToBuy === 0 ||
    selectedCount !== playersToBuy
  }
  style={{
    width: "100%",
    padding: 16,
    border: "none",
    borderRadius: 14,
    background:
      offersConfirmed
        ? "#475569"
        : selectedCount !== playersToBuy
        ? "#475569"
        : "#16a34a",
    color: "white",
    fontWeight: 800,
    marginTop: 20,
  }}
>
  {offersConfirmed
    ? "✅ BUSTE CONFERMATE"
    : "✅ CONFERMA BUSTE"}
</button>

    {selectedFreeAgents.map((p) => (
        <div
          key={p.id}
          style={{
            display: "flex",
            gap: 12,
            alignItems:
              "center",
            marginBottom: 12,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              flex: 1,
              minWidth: 180,
            }}
          >
            {p.nome}
          </div>

          <input
  type="text"
  inputMode="numeric"
  disabled={offersConfirmed}
  value={agentOffers[p.id] ?? ""}
  onChange={async (e) => {
    const raw = e.target.value.replace(/\D/g, "");

    if (raw === "") {
      setAgentOffers((prev) => ({
        ...prev,
        [p.id]: "",
      }));
      return;
    }

    const value = Math.max(1, Number(raw));

  const otherOffers =
    Object.entries(agentOffers)
      .filter(
        ([id]) =>
          Number(id) !== p.id
      )
     .reduce(
  (sum, [, offer]) =>
    sum +
    (Number(offer) || 0),
  0
);

  const reserve =
    Math.max(
      playersToBuy -
        selectedAgents.length,
      0
    );

  const maxAllowed =
    availableCredits -
    otherOffers -
    reserve;

  const finalValue =
    Math.min(
      value,
      Math.max(
        maxAllowed,
        1
      )
    );

  setAgentOffers((prev) => ({
  ...prev,
  [p.id]: String(finalValue),
}));
 if (user && round) {
  await supabase
    .from("market_bids")
    .update({
      bid: finalValue,
    })
    .eq("team_id", user.team_id)
    .eq("player_id", p.id)
    .eq("round_id", round.id);
}
}}

            style={{
              width: 90,
              padding: 8,
              borderRadius: 10,
              border: "none",
            }}
          />

          <button
            onClick={() =>
              toggleAgent(
                p.id
              )
              
            }
            disabled={offersConfirmed}
            style={{
              padding:
                "8px 12px",
              border: "none",
              borderRadius: 10,
              background:
                "#dc2626",
              color: "white",
              fontWeight: 700,
            }}
          >
            ✕
          </button>
        </div>
      ))}

    <div
  style={{
    borderTop:
      "1px solid rgba(255,255,255,.08)",
    paddingTop: 14,
    marginTop: 14,
    fontWeight: 800,
    lineHeight: 1.8,
  }}
>
  👥 Giocatori da acquistare: {playersToBuy}
<br />
{playersToBuy > 0 && (
  <>
    🧤 Portieri da acquistare: {missingByRole.P}
    <br />

    🛡️ Difensori da acquistare: {missingByRole.D}
    <br />

    ⚙️ Centrocampisti da acquistare: {missingByRole.C}
    <br />

    🎯 Attaccanti da acquistare: {missingByRole.A}
    <br />
    <br />
  </>
)}

{releasePhase && (
  <>
    🧤 Portieri: {missingByRole.P}
    <br />
    🛡️ Difensori: {missingByRole.D}
    <br />
    ⚙️ Centrocampisti: {missingByRole.C}
    <br />
    🎯 Attaccanti: {missingByRole.A}
    <br />
  </>
)}

<br />

📌 Giocatori selezionati:
{selectedCount}/{playersToBuy}

<br />

🪑 Slot ancora da completare:
{" "}
<span
  style={{
    color:
      missingSlots === 0
        ? "#4ade80"
        : "#fde68a",
  }}
>
  {missingSlots}
</span>

<br />

💰 Crediti disponibili:
  {" "}
  <span style={{ color: "#facc15" }}>
    {availableCredits} mln
  </span>

  <br />

  🧾 Crediti offerti:
  {" "}
  <span style={{ color: "#f87171" }}>
    {spentOffers} mln
  </span>

  <br />

  💳 Crediti residui:
  {" "}
  <span style={{ color: "#4ade80" }}>
    {remainingCredits} mln
  </span>

  <br />

  🔒 Crediti da tenere:
  {" "}
  <span style={{ color: "#fde68a" }}>
    {minimumReserve} mln
  </span>

  <br />

  💸 Massimo ancora spendibile:
  {" "}
  <span style={{ color: "#22c55e" }}>
    {Math.max(
      remainingCredits -
        minimumReserve,
      0
    )} mln
  </span>
</div>
  </div>
  
    <input
      value={agentSearch}
onChange={(e) =>
  setAgentSearch(
    e.target.value
  )
}
      placeholder="🔍 Cerca giocatore..."
      style={{
        width: "100%",
        padding: 12,
        borderRadius: 12,
        border: "none",
        marginBottom: 16,
      }}
    />

    <div
      style={{
        display: "flex",
        gap: 10,
        flexWrap: "wrap",
        marginBottom: 20,
      }}
    >
      {["ALL", "P", "D", "C", "A"].map(
  (r) => (
    <button
      key={r}
      onClick={() =>
        setAgentRoleFilter(r)
      }
      style={{
        padding: "8px 14px",
        borderRadius: 999,
        border: "none",
        cursor: "pointer",
        fontWeight: 700,
        background:
          agentRoleFilter === r
            ? "#facc15"
            : "#334155",
        color:
          agentRoleFilter === r
            ? "#000"
            : "#fff",
      }}
    >
      {r === "ALL"
        ? "Tutti"
        : r}
    </button>
  )
)}
    </div>

    {(["P", "D", "C", "A"] as const)
  .filter((role) => {
    if (agentRoleFilter === "ALL") {
      return groupedAgents[role].length > 0;
    }

    return role === agentRoleFilter;
  })
  .map((role) => {
  const maxForRole =
  releasedByRole[role];

  return (
    <div
      key={role}
      style={{
        marginBottom: 18,
      }}
    >
      <div
        onClick={() =>
          setOpenRoles(
            (prev) => ({
              ...prev,
              [role]:
                !prev[role],
            })
          )
        }
        style={{
          background:
            "#1e293b",
          borderRadius: 14,
          padding: 14,
          cursor: "pointer",
          display: "flex",
          justifyContent:
            "space-between",
          alignItems:
            "center",
          fontWeight: 800,
          marginBottom: 10,
        }}
      >
       <span>
  {role} •
  {groupedAgents[role].length}
  {" • "}
  da prendere:
{
  Math.max(
    maxForRole -
      selectedFreeAgents.filter(
        (x) =>
          x.ruolo === role
      ).length,
    0
  )
}
</span>

        <span>
          {openRoles[
            role
          ]
            ? "▲"
            : "▼"}
        </span>
      </div>

      {openRoles[role] &&
        groupedAgents[
          role
        ].map((p) => {
          const selected =
            selectedAgents.includes(
              p.id
            );

 const selectedRoleCount =
  selectedFreeAgents.filter(
    (x) => x.ruolo === role
  ).length;

const roleFull =
  selectedRoleCount >=
  maxForRole;

const limitReached =
  !selected &&
  (
    selectedAgents.length >=
      playersToBuy ||
    roleFull
  );

if (role === "C") {
  console.log({
    nome: p.nome,
    selected,
    selectedRoleCount,
    allowed: maxForRole,
    roleFull,
    limitReached,
  });
}
  return (
            <div
              key={p.id}
              onClick={(e) => {
                e.stopPropagation();

                if (
                  limitReached
                )
                  return;

                toggleAgent(
                  p.id
                );
              }}
              style={{
                background:
                  selected
                    ? "rgba(250,204,21,.12)"
                    : "rgba(255,255,255,.04)",

                boxShadow:
                  selected
                    ? "0 0 0 1px rgba(250,204,21,.35)"
                    : "none",

                opacity:
                  limitReached
                    ? 0.45
                    : 1,

                cursor:
                  limitReached
                    ? "not-allowed"
                    : "pointer",

                border:
                  selected
                    ? "1px solid rgba(250,204,21,.45)"
                    : "1px solid rgba(255,255,255,.08)",

                borderRadius: 14,
                padding: 14,
                marginBottom: 10,
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems:
                  "center",
              }}
            >
              <div>
                <div
                  style={{
                    fontWeight:
                      800,
                  }}
                >
                  {p.nome}
                </div>

               <div
  style={{
    color: "#94a3b8",
    marginTop: 4,
  }}
>
  {nationCode(p.nazionale)}
</div>
              </div>

                            <div
                style={{
                  textAlign: "right",
                }}
              >
                <div>
                  {p.ruolo}
                </div>

                <div
                  style={{
                    color: "#facc15",
                    fontWeight: 800,
                    marginTop: 6,
                  }}
                >
                  {p.prezzo}
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
})}
  </div>
)}
      </div>
    </main>
  );
}