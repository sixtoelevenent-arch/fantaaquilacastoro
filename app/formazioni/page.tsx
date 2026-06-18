"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Card from "@/components/Card";
import BackHome from "@/components/BackHome";

type Team = {
  id: number;
  nome: string;
  proprietario: string;
};

type Player = {
  id: number;
  nome: string;
  ruolo: string;
  team_id: number;
};

type Matchday = {
  id: number;
  nome: string;
  ordine?: number;
  chiusura_formazioni?: string;
};

const MODULI = [
  "3-4-3",
  "3-5-2",
  "4-4-2",
  "4-3-3",
  "4-5-1",
  "5-3-2",
  "5-4-1",
];

function getModuloCounts(modulo: string) {
  const [d, c, a] = modulo.split("-").map(Number);

  return {
    P: 1,
    D: d,
    C: c,
    A: a,
  };
}

export default function Page() {
  const [players, setPlayers] = useState<Player[]>([]);

  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);

  const [user, setUser] = useState<any>(null);

  const [matchday, setMatchday] = useState<Matchday | null>(null);

  const [modulo, setModulo] = useState("4-3-3");

  const [titolari, setTitolari] = useState<number[]>([]);
  const [panchina, setPanchina] = useState<number[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [locked, setLocked] = useState(false);

const [lastUpdate, setLastUpdate] =
  useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {

  const rawUser =
    localStorage.getItem("fantasy_user");

  if (!rawUser) {
    location.href = "/login";
    return;
  }

  const loggedUser =
    JSON.parse(rawUser);

  setUser(loggedUser);

  setSelectedTeam(loggedUser.team_id);

  const { data: activeMatchday } = await supabase
  .from("matchdays")
.select(
  "id,nome,ordine,chiusura_formazioni"
)
.eq("attiva", true)
.single();
if (!activeMatchday) {
  alert("Nessuna giornata attiva");
  setLoading(false);
  return;
}
let targetMatchday = activeMatchday;

const { data: nextMatchday } = await supabase
  .from("matchdays")
  .select(
    "id,nome,ordine,chiusura_formazioni"
  )
  .gt("ordine", activeMatchday.ordine)
  .order("ordine")
  .limit(1)
  .maybeSingle();

 targetMatchday =
  nextMatchday || activeMatchday; 

if (!targetMatchday) {

  alert("Nessuna giornata trovata");

  setLoading(false);

  return;
}

setMatchday(targetMatchday);

if (
  targetMatchday.chiusura_formazioni &&
  new Date() >
    new Date(
      targetMatchday.chiusura_formazioni
    )
) {
  setLocked(true);
}

await loadPlayers(
  loggedUser.team_id,
  targetMatchday.id
);

setLoading(false);

}

  async function loadPlayers(
  teamId: number,
  matchdayId: number
) {

  const { data } = await supabase
    .from("players")
    .select("*")
    .eq("team_id", teamId);

  const ordineRuoli = {
    P: 1,
    D: 2,
    C: 3,
    A: 4,
  };

  const sortedPlayers = (data || []).sort(
    (a, b) =>
      ordineRuoli[a.ruolo as keyof typeof ordineRuoli] -
      ordineRuoli[b.ruolo as keyof typeof ordineRuoli]
  );

  setPlayers(sortedPlayers);

  const { data: formation } = await supabase
    .from("formations")
    .select(
  "id, modulo, updated_at, submitted_at"
)
    .eq("team_id", teamId)
    .eq("matchday_id", matchdayId)
    .maybeSingle();

  if (!formation) {

  const { data: lastFormation } =
    await supabase
      .from("formations")
      .select("id, modulo")
      .eq("team_id", teamId)
      .order("matchday_id", {
        ascending: false,
      })
      .limit(1)
      .single();

  if (!lastFormation) {

    setTitolari([]);

    const panchinari =
      sortedPlayers.map((p) => p.id);

    setPanchina(panchinari);

    return;
  }

  setModulo(lastFormation.modulo);

  const { data: oldPlayers } =
    await supabase
      .from("formation_players")
      .select(`
        player_id,
        titolare,
        posizione,
        ordine_panchina
      `)
      .eq(
        "formation_id",
        lastFormation.id
      );

  const titolariIds =
    (oldPlayers || [])
      .filter((p) => p.titolare)
      .sort(
        (a, b) =>
          (a.posizione || 99) -
          (b.posizione || 99)
      )
      .map((p) => p.player_id);

  const panchinaIds =
    (oldPlayers || [])
      .filter((p) => !p.titolare)
      .sort(
        (a, b) =>
          (a.ordine_panchina || 999) -
          (b.ordine_panchina || 999)
      )
      .map((p) => p.player_id);

  setTitolari(titolariIds);

  setPanchina(panchinaIds);

  return;
}

  setModulo(formation.modulo);
setLastUpdate(
  formation.updated_at ||
  formation.submitted_at ||
  ""
);

  const { data: formationPlayers } = await supabase
  .from("formation_players")
  .select(
    "player_id,titolare,posizione,ordine_panchina"
  )
  .eq("formation_id", formation.id);

const titolariIds = (formationPlayers || [])
  .filter((p) => p.titolare)
  .sort(
    (a, b) =>
      (a.posizione || 99) -
      (b.posizione || 99)
  )
  .map((p) => p.player_id);

const panchinaIds = (formationPlayers || [])
  .filter((p) => !p.titolare)
  .sort(
    (a, b) =>
      (a.ordine_panchina || 999) -
      (b.ordine_panchina || 999)
  )
  .map((p) => p.player_id);

setTitolari(titolariIds);
setPanchina(panchinaIds);

}

  function togglePlayer(playerId: number) {

  const player = players.find(
    (p) => p.id === playerId
  );

  if (!player) return;

  if (titolari.includes(playerId)) {

    setTitolari((prev) =>
      prev.filter((id) => id !== playerId)
    );

    setPanchina((prev) => [
      ...prev,
      playerId,
    ]);

    return;
  }

  const required =
    getModuloCounts(modulo);

  const selectedPlayers =
    players.filter((p) =>
      titolari.includes(p.id)
    );

  const counts = {
    P: selectedPlayers.filter(
      (p) => p.ruolo === "P"
    ).length,

    D: selectedPlayers.filter(
      (p) => p.ruolo === "D"
    ).length,

    C: selectedPlayers.filter(
      (p) => p.ruolo === "C"
    ).length,

    A: selectedPlayers.filter(
      (p) => p.ruolo === "A"
    ).length,
  };
  
  
  if (
    counts[
      player.ruolo as keyof typeof counts
    ] >=
    required[
      player.ruolo as keyof typeof required
    ]
  ) {
    return;
  }

  setTitolari((prev) => [
    ...prev,
    playerId,
  ]);

  setPanchina((prev) =>
    prev.filter((id) => id !== playerId)
  );
}

function moveBenchPlayer(
  index: number,
  direction: "up" | "down"
) {

  const nuovaPanchina = [...panchina];

  const targetIndex =
    direction === "up"
      ? index - 1
      : index + 1;

  if (
    targetIndex < 0 ||
    targetIndex >= nuovaPanchina.length
  ) {
    return;
  }

  [
    nuovaPanchina[index],
    nuovaPanchina[targetIndex],
  ] = [
    nuovaPanchina[targetIndex],
    nuovaPanchina[index],
  ];

  setPanchina(nuovaPanchina);
}


  function validateFormation() {
    if (titolari.length !== 11) {
      return "Devi selezionare esattamente 11 titolari";
    }

    const counts = {
      P: 0,
      D: 0,
      C: 0,
      A: 0,
    };

    players
      .filter((p) => titolari.includes(p.id))
      .forEach((p) => {
        if (p.ruolo in counts) {
          counts[p.ruolo as keyof typeof counts]++;
        }
      });

    const required = getModuloCounts(modulo);

    if (
      counts.P !== required.P ||
      counts.D !== required.D ||
      counts.C !== required.C ||
      counts.A !== required.A
    ) {
      return (
        `Modulo ${modulo} non rispettato.\n\n` +
        `Richiesti:\n` +
        `P ${required.P}\n` +
        `D ${required.D}\n` +
        `C ${required.C}\n` +
        `A ${required.A}\n\n` +
        `Attuali:\n` +
        `P ${counts.P}\n` +
        `D ${counts.D}\n` +
        `C ${counts.C}\n` +
        `A ${counts.A}`
      );
    }

    return null;
  }

  async function salvaFormazione() {
    
    if (locked) {
  alert(
    "Inserimento formazioni chiuso"
  );
  return;
}

    if (!user?.team_id) {
    alert("Utente non valido");
    return;
    }

    if (!matchday) {
      alert("Nessuna giornata attiva");
      return;
    }

    const error = validateFormation();

    if (error) {
      alert(error);
      return;
    }

    setSaving(true);

    try {
      const { data: oldFormations } = await supabase
  .from("formations")
  .select("id")
  .eq("team_id", user.team_id)
  .eq("matchday_id", matchday.id);

  
      let formationId: number;

if (oldFormations?.length) {

  formationId = oldFormations[0].id;

  await supabase
    .from("formation_players")
    .delete()
    .eq("formation_id", formationId);

  await supabase
    .from("formations")
    .update({
      modulo,
    })
    .eq("id", formationId);

} else {

  const { data: newFormation, error: formationError } =
    await supabase
      .from("formations")
      .insert({
        team_id: user.team_id,
        matchday_id: matchday.id,
        modulo,
        submitted: true,
        locked: true,
        formation_source: "admin",
      })
      .select()
      .single();

  if (formationError || !newFormation) {
    throw formationError;
  }

  formationId = newFormation.id;
}

   const benchPlayers = panchina
  .map((id) =>
    players.find((p) => p.id === id)
  )
  .filter(
    (p): p is Player => p !== undefined
  );

      const ordineRuoli = {
  P: 1,
  D: 2,
  C: 3,
  A: 4,
};

const titolariOrdinati = players
  .filter((p) => titolari.includes(p.id))
  .sort(
    (a, b) =>
      ordineRuoli[a.ruolo as keyof typeof ordineRuoli] -
      ordineRuoli[b.ruolo as keyof typeof ordineRuoli]
  );

const rows = [

  ...titolariOrdinati.map((p, index) => ({
    formation_id: formationId,
    player_id: p.id,
    titolare: true,
    posizione: index + 1,
    ordine_panchina: null,
  })),

        ...benchPlayers.map((p, index) => ({
          formation_id: formationId,
          player_id: p.id,
          titolare: false,
          posizione: null,
          ordine_panchina: index + 1,
        })),
      ];

      const { error: playersError } = await supabase
        .from("formation_players")
        .insert(rows);
console.log(
  "PLAYERS ERROR",
  playersError
);
      if (playersError) {
        throw playersError;
      }

      alert("Formazione salvata correttamente");
    } catch (err: any) {

  console.error("ERRORE SALVATAGGIO", err);

  alert(
    err?.message ||
    JSON.stringify(err, null, 2)
  );

}

    setSaving(false);
  }
  const required =
  getModuloCounts(modulo);

const selectedPlayers =
  players.filter((p) =>
    titolari.includes(p.id)
  );

const counts = {
  P: selectedPlayers.filter(
    (p) => p.ruolo === "P"
  ).length,

  D: selectedPlayers.filter(
    (p) => p.ruolo === "D"
  ).length,

  C: selectedPlayers.filter(
    (p) => p.ruolo === "C"
  ).length,

  A: selectedPlayers.filter(
    (p) => p.ruolo === "A"
  ).length,
};

function getTitolariRuolo(
  ruolo: string
) {
  return players.filter(
    (p) =>
      p.ruolo === ruolo &&
      titolari.includes(p.id)
  );
}

  const titolariCount = titolari.length;

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom, #020617 0%, #08122c 50%, #020617 100%)",
        color: "white",
        padding: "20px",
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
    color: "#38bdf8",
    fontSize: "2.2rem",
    fontWeight: 900,
    marginBottom: 10,
  }}
>
  ⚽ INSERIMENTO FORMAZIONE
</h1>

<div
  style={{
    textAlign: "center",
    color: "#94a3b8",
    marginBottom: 20,
  }}
>
  {user?.username}
</div>

        {matchday && (
  <Card>
    <div
      style={{
        textAlign: "center",
      }}
    >
      <div
        style={{
          color: "#facc15",
          fontWeight: 900,
          fontSize: "1.1rem",
        }}
      >
        📅 {matchday.nome}

        {locked && (
  <div
    style={{
      marginTop: 10,
      color: "#ef4444",
      fontWeight: 900,
    }}
  >
    🔒 Inserimento formazioni chiuso
  </div>
)}

        {lastUpdate && (
  <div
    style={{
      marginTop: 8,
      color: "#94a3b8",
      fontSize: "0.85rem",
    }}
  >
    Ultimo salvataggio:
    {" "}
    {new Date(lastUpdate)
      .toLocaleString("it-IT")}
  </div>
)}

      </div>

      <div
        style={{
          marginTop: 8,
          color: "#94a3b8",
          fontSize: "0.9rem",
        }}
      >
        Seleziona 11 titolari e ordina la panchina
      </div>
    </div>
  </Card>
)}

        {loading ? (
          <p>Caricamento...</p>
        ) : (
          <>
            <div
              style={{
                display: "grid",
                gap: "12px",
                marginBottom: "20px",
              }}
            >
              
           <select
  value={modulo}
  
  disabled={locked}
  onChange={(e) => setModulo(e.target.value)}
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                }}
              >
                {MODULI.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </div>

<Card>

<div
  style={{
    display: "flex",
    justifyContent: "space-evenly",
    textAlign: "center",
    fontWeight: 900,
  }}
>

  <div>
    🧤
    <br/>
    {counts.P}/{required.P}
  </div>

  <div>
    🛡️
    <br/>
    {counts.D}/{required.D}
  </div>

  <div>
    ⚙️
    <br/>
    {counts.C}/{required.C}
  </div>

  <div>
    🎯
    <br/>
    {counts.A}/{required.A}
  </div>

</div>

</Card>

            <div
              style={{
                marginBottom: "15px",
                fontWeight: 700,
              }}
            >
              Titolari selezionati: {titolariCount}/11
            </div>

            <Card>

<div
  style={{
    marginBottom: 15,
    textAlign: "center",
    fontWeight: 900,
    color:
      titolariCount === 11
        ? "#22c55e"
        : "#ef4444",
  }}
>
  TITOLARI {titolariCount}/11

  <div
    style={{
      marginTop: 8,
      fontSize: "0.9rem",
    }}
  >
    {titolariCount === 11
      ? "✅ Formazione completa"
      : `❌ Mancano ${11 - titolariCount} titolari`}
  </div>

</div>

<Card>

<div
  style={{
    background:
      "linear-gradient(to bottom,#15803d,#166534)",
      boxShadow:
  "inset 0 0 25px rgba(255,255,255,0.08)",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    position: "relative",
    overflow: "hidden",
    border:
      "2px solid rgba(255,255,255,0.15)",
  }}
>

  <div
    style={{
      position: "absolute",
      top: "25%",
      left: 0,
      right: 0,
      height: 2,
      background: "rgba(255,255,255,0.15)",
    }}
  />

  <div
    style={{
      position: "absolute",
      top: "50%",
      left: 0,
      right: 0,
      height: 2,
      background: "rgba(255,255,255,0.15)",
    }}
  />

  <div
    style={{
      position: "absolute",
      top: "75%",
      left: 0,
      right: 0,
      height: 2,
      background: "rgba(255,255,255,0.15)",
    }}
  />

  <div
    style={{
      textAlign: "center",
      marginBottom: 30,
    }}
  >
    {getTitolariRuolo("P").map((p) => (
      <div
        key={p.id}
        style={{
          display: "inline-block",
          background: "#0f172a",
          padding: "10px 14px",
          borderRadius: 12,
          fontWeight: 700,
        }}
      >
        🧤 {p.nome}
      </div>
    ))}
  </div>

  <div
    style={{
      display: "flex",
      justifyContent: "center",
gap: 20,
      marginBottom: 35,
      flexWrap: "wrap",
      gap: 10,
    }}
  >
    {getTitolariRuolo("D").map((p) => (
      <div
        key={p.id}
        style={{
          background: "#0f172a",
          padding: "10px 14px",
          borderRadius: 12,
          fontSize: "0.85rem",
        }}
      >
        {p.nome}
      </div>
    ))}
  </div>

  <div
    style={{
      display: "flex",
      justifyContent: "center",
gap: 20,
      marginBottom: 35,
      flexWrap: "wrap",
      gap: 10,
    }}
  >
    {getTitolariRuolo("C").map((p) => (
      <div
        key={p.id}
        style={{
          background: "#0f172a",
          padding: "10px 14px",
          borderRadius: 12,
          fontSize: "0.85rem",
        }}
      >
        {p.nome}
      </div>
    ))}
  </div>

  <div
    style={{
      display: "flex",
      justifyContent: "center",
gap: 20,
      flexWrap: "wrap",
      gap: 10,
    }}
  >
    {getTitolariRuolo("A").map((p) => (
      <div
        key={p.id}
        style={{
          background: "#0f172a",
          padding: "10px 14px",
          borderRadius: 12,
          fontSize: "0.85rem",
        }}
      >
        {p.nome}
      </div>
    ))}
  </div>

</div>

</Card>

  
<div
  style={{
    background: "#166534",
    borderRadius: 20,
    padding: 20,
    border:
      "2px solid rgba(255,255,255,0.15)",
  }}
>

  {["P","D","C","A"].map((ruolo) => (

    <div
      key={ruolo}
      style={{
        marginBottom: 22,
      }}
    >

      <div
        style={{
          textAlign: "center",
          marginBottom: 10,
          fontWeight: 900,
          color: "white",
        }}
      >
        {ruolo === "P"
          ? "🧤 PORTIERE"
          : ruolo === "D"
          ? "🛡️ DIFESA"
          : ruolo === "C"
          ? "⚙️ CENTROCAMPO"
          : "🎯 ATTACCO"}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: 8,
        }}
      >

        {players
          .filter((p) => p.ruolo === ruolo)
          .map((player) => (

            <label
              key={player.id}
              style={{
                width: "31%",
                minWidth: 95,
                minHeight: 60,
                background:
                  titolari.includes(player.id)
                    ? "#14532d"
                    : "#1f2937",
                border:
                  titolari.includes(player.id)
                    ? "2px solid #22c55e"
                    : "1px solid rgba(255,255,255,0.15)",
                borderRadius: 12,
                padding: 8,
                textAlign: "center",
                cursor: "pointer",
              }}
            >

              <input
                type="checkbox"
                disabled={locked}
                checked={titolari.includes(player.id)}
                onChange={() =>
                  togglePlayer(player.id)
                }
              />

              <div
  style={{
    marginTop: 4,
    fontWeight: 700,
    fontSize: "0.75rem",
    wordBreak: "break-word",
  }}
>
  {player.nome}
</div>

            </label>

          ))}

      </div>

    </div>

  ))}

</div>

</Card>

<Card>

<div
  style={{
    fontWeight: 900,
    fontSize: "1.1rem",
    marginBottom: 12,
  }}
>
  📋 PANCHINA ({panchina.length}/14)
</div>

</Card>

<div
  style={{
    display: "grid",
    gap: "8px",
    marginBottom: "20px",
  }}
>
  {panchina.map((playerId, index) => {

    const player = players.find(
      (p) => p.id === playerId
    );

    if (!player) return null;

    return (

      <div
        key={player.id}
        style={{
          background: "#1f2937",
          padding: "10px",
          borderRadius: "8px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >

        <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: 8,
  }}
>
  <strong>
    {index + 1}.
  </strong>

  <span
    style={{
      color:
        player.ruolo === "P"
          ? "#38bdf8"
          : player.ruolo === "D"
          ? "#22c55e"
          : player.ruolo === "C"
          ? "#facc15"
          : "#ef4444",
      fontWeight: 800,
    }}
  >
    {player.ruolo}
  </span>

  <span>
    {player.nome}
  </span>
</div>

        <div
          style={{
            display: "flex",
            gap: "6px",
          }}
        >

          <button
  type="button"
  disabled={locked}
  style={{
    padding: "8px 12px",
    minWidth: 36,
minHeight: 36,
fontSize: "0.8rem",
  }}
  onClick={() =>
    moveBenchPlayer(
      index,
      "up"
    )
  }
>
  ⬆️
</button>

<button
  type="button"
  disabled={locked}
  style={{
    padding: "8px 12px",
    minWidth: 36,
minHeight: 36,
fontSize: "0.8rem",
  }}
  onClick={() =>
    moveBenchPlayer(
      index,
      "down"
    )
  }
>
  ⬇️
</button>

        </div>

      </div>

    );

  })}
</div>

            <button
  onClick={salvaFormazione}
  disabled={saving || locked}
  style={{
    marginTop: 25,
    width: "100%",
    padding: "18px",
    border: "none",
    borderRadius: "14px",
    background: "#16a34a",
    color: "white",
    fontWeight: 900,
    fontSize: "1.05rem",
    cursor: "pointer",
  }}
>
  {saving
    ? "SALVATAGGIO..."
    : "💾 SALVA FORMAZIONE"}
</button>
          </>
        )}

        
      </div>
    </main>
  );
}