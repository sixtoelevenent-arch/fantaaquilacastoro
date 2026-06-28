"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import BackHome from "@/components/BackHome";

type MarketRound = {
  id: number;
  status: string;
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

  const [loading, setLoading] = useState(true);

  const [user, setUser] =
    useState<User | null>(null);

  const [round, setRound] =
    useState<MarketRound | null>(null);
const [confirmed, setConfirmed] =
  useState(false);
 
  const now = new Date();

const releaseClosed =
  round?.release_deadline
    ? now >
      new Date(round.release_deadline)
    : false;

const bidClosed =
  round?.bid_deadline
    ? now >
      new Date(round.bid_deadline)
    : false;

const releasePhase =
  !releaseClosed;

const bidPhase =
  releaseClosed &&
  !bidClosed;

const marketClosed =
  bidClosed;

  const [myPlayers, setMyPlayers] =
    useState<Player[]>([]);

    const [freeAgents, setFreeAgents] =
  useState<Player[]>([]);

    const [leftoverBudget, setLeftoverBudget] =
  useState(0);

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

    useEffect(() => {
    loadPage();
  }, []);

    async function loadPage() {
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
  .or("status.eq.svincoli,status.eq.buste")
  .single();

    setRound(
      roundData as MarketRound
    );

    if (roundData) {

  const { data: releases } =
    await supabase
      .from("market_releases")
      .select(`
        team_id,
        confirmed
      `)
      .eq("round_id", roundData.id);

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

    if (!roundData) {
  setLoading(false);
  return;
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
  .from("free_agents")
  .select(`
    id,
    player_name,
    nazionale,
    ruolo,
    quotazione
  `)
  .eq("disponibile", true)
  .order("ruolo")
  .order("player_name");

  const { data: mappings } = await supabase
  .from("player_display_names")
  .select(`
    fantapiu3_name,
    display_name
  `);

const displayMap: Record<string, string> = {};

(mappings ?? []).forEach((m: any) => {
  displayMap[
    m.fantapiu3_name
  ] = m.display_name;
});

setFreeAgents(
  (agents ?? []).map((p: any) => ({
    id: p.id,
    nome:
      displayMap[p.player_name] ??
      p.player_name,
    nazionale: p.nazionale,
    ruolo: p.ruolo,
    prezzo: p.quotazione,
  }))
);

const { data: budget } =
  await supabase
    .from("market_budgets")
    .select(`
      total_budget
    `)
    .eq("team_id", u.team_id)
    .maybeSingle();
  
   if (budget) {
  setLeftoverBudget(
    budget.total_budget ?? 0
  );
}
        if (roundData) {
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
  .eq("round_id", roundData.id)
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
  release.bids_confirmed ?? false
);

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

const releasedRows =
  playersReleased ?? [];

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
    .eq("round_id", roundData.id)
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

setAutomaticIds(
  releasedRows
    .filter(
      (r) => r.automatic
    )
    .map(
      (r) => r.player_id
    )
);

  
}
}

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

alert(
  "Svincoli confermati."
);

loadPage();
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

  const { data: release } =
  await supabase
    .from("market_releases")
    .select("id")
    .eq("round_id", round.id)
    .eq("team_id", user.team_id)
    .maybeSingle();

if (!release) {
  alert(
    "Impossibile trovare la sessione di mercato."
  );
  setConfirmingOffers(false);
  return;
}

await supabase
  .from("market_releases")
  .update({
    bids_confirmed: true,
    bids_confirmed_at:
      new Date().toISOString(),
  })
  .eq("id", release.id);

  setOffersConfirmed(true);
  setConfirmingOffers(false);

  alert(
    "Buste confermate."
  );
}


 const releasedPlayers = useMemo(
  () =>
    myPlayers.filter((p) =>
      selectedIds.includes(p.id)
    ),
  [myPlayers, selectedIds]
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

const availableCredits = leftoverBudget;

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
  releasedPlayers.length;

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
  P: releasedPlayers.filter((p) => p.ruolo === "P").length,
  D: releasedPlayers.filter((p) => p.ruolo === "D").length,
  C: releasedPlayers.filter((p) => p.ruolo === "C").length,
  A: releasedPlayers.filter((p) => p.ruolo === "A").length,
};

const boughtByRole = {
  P: selectedFreeAgents.filter((p) => p.ruolo === "P").length,
  D: selectedFreeAgents.filter((p) => p.ruolo === "D").length,
  C: selectedFreeAgents.filter((p) => p.ruolo === "C").length,
  A: selectedFreeAgents.filter((p) => p.ruolo === "A").length,
};

const missingByRole = {
  P: Math.max(releasedByRole.P - boughtByRole.P, 0),
  D: Math.max(releasedByRole.D - boughtByRole.D, 0),
  C: Math.max(releasedByRole.C - boughtByRole.C, 0),
  A: Math.max(releasedByRole.A - boughtByRole.A, 0),
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
{releasePhase &&
  releasedPlayers.length > 0 && (
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
  "105px 43px 20px 58px 68px",
columnGap: 8,
alignItems: "center",
            padding: "10px 0",
            borderTop:
              "1px solid rgba(255,255,255,.08)",
             fontSize: ".95rem",
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
    fontSize: ".9rem",
    marginTop: 2,
  }}
>
  {p.ruolo} • {p.nazionale}
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
  Giocatori da svincolare:
  {releasedPlayers.length}
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
)}

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

        {releasePhase && (
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
    🟢 FASE SVINCOLI APERTA

    <br />

    Puoi selezionare i giocatori
    da svincolare fino alla
    deadline delle ore 10:00 di Domenica 28.
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
  padding: 18,
  marginBottom: 20,
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
        ✅ Conferme allenatori
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(160px,1fr))",
          gap: 10,
        }}
      >
        {visibleConfirmations.map((t) => (
          <div
            key={t.username}
            style={{
              padding: "10px 12px",
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
      padding: 18,
      marginBottom: 20,
      textAlign: "center",
      color: "#fde68a",
    }}
  >
    🟠 FASE ACQUISTI APERTA

    <br />

    Gli svincoli sono terminati.

    <br />

    È ora possibile inserire
    le offerte in busta fino
    alla deadline delle ore
    17:30.
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
  "Seleziona i giocatori da svincolare."}

{bidPhase &&
  "Fase acquisti aperta."}

{marketClosed &&
  "Sessione di mercato conclusa."}

          {releasePhase && (
  <>
    <br />
    <br />
    Giocatori in rosa:{" "}
    {myPlayers.length}
  </>
)}
        </p>

        {releasePhase && (
  <>
    <input
      value={search}
      onChange={(e) =>
        setSearch(e.target.value)
        
      }
      onClick={(e) =>
  e.stopPropagation()
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
                          color:
                            "#94a3b8",
                          marginTop:
                            4,
                        }}
                      >
                        {
                          p.nazionale
                        }
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
                        textAlign:
                          "right",
                      }}
                    >
                      <div>
                        {p.ruolo}
                      </div>

                      <div
                        style={{
                          color:
                            "#facc15",
                          fontWeight:
                            800,
                          fontSize:
                            "1.1rem",
                          marginTop:
                            8,
                        }}
                      >
                        Acquisto:{" "}
                        {p.prezzo} mln
<div
  style={{
    color: "#4ade80",
    marginTop: 6,
    fontSize: ".95rem",
  }}
>
  Recupero:{" "}
  {Math.ceil(
  (p.prezzo ?? 0) / 2
)}{" "}
  mln
  {automatic && (
  <div
    style={{
      color: "#fde68a",
      fontSize: ".85rem",
      marginTop: 6,
    }}
  >
    Credito già recuperato
    automaticamente
  </div>
)}
</div>

                      </div>
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
    Non hai posti liberi in rosa.
    <br />
    Per acquistare giocatori devi
    prima effettuare degli svincoli.
  </div>
)}

{bidPhase && (
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
🧤 Portieri: {missingByRole.P}
<br />
🛡️ Difensori: {missingByRole.D}
<br />
⚙️ Centrocampisti: {missingByRole.C}
<br />
🎯 Attaccanti: {missingByRole.A}

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
  )}


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
  .map((role) => (
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
  {role} • {groupedAgents[role].length}
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

          const limitReached =
            !selected &&
            selectedAgents.length >=
              playersToBuy;

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
                    color:
                      "#94a3b8",
                    marginTop: 4,
                  }}
                >
                  {
                    p.nazionale
                  }
                </div>
              </div>

              <div
                style={{
                  textAlign:
                    "right",
                }}
              >
                <div>
                  {p.ruolo}
                </div>

                <div
                  style={{
                    color:
                      "#facc15",
                    fontWeight:
                      800,
                    marginTop: 6,
                  }}
                >
                  {p.prezzo} mln
                </div>
              </div>
            </div>
          );
        })}
    </div>
  )
)}
  </div>
)}

     </div>
    </main>
  );
}