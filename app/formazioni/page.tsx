"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

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
  .select("id,nome")
  .eq("attiva", true)
  .single();

let targetMatchday = activeMatchday;

if (activeMatchday?.id === 1) {
  const { data } = await supabase
    .from("matchdays")
    .select("id,nome")
    .eq("id", 2)
    .single();

  targetMatchday = data;
}

if (activeMatchday?.id === 2) {
  const { data } = await supabase
    .from("matchdays")
    .select("id,nome")
    .eq("id", 3)
    .single();

  targetMatchday = data;
}

if (!targetMatchday) {

  alert("Nessuna giornata trovata");

  setLoading(false);

  return;
}

setMatchday(targetMatchday);

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
    .select("id, modulo")
    .eq("team_id", teamId)
    .eq("matchday_id", matchdayId)
    .maybeSingle();

  if (!formation) {

  setTitolari([]);

  const panchinari = sortedPlayers.map(
    (p) => p.id
  );

  setPanchina(panchinari);

  return;

}

  setModulo(formation.modulo);

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

  if (titolari.length >= 11) {

    alert("Puoi selezionare massimo 11 titolari");

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

  alert(
  "oldFormations = " +
  JSON.stringify(oldFormations)
);

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
        <h1
          style={{
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          ⚽ Gestione Formazioni
        </h1>

        {matchday && (
          <div
            style={{
              textAlign: "center",
              marginBottom: "20px",
              fontWeight: 700,
            }}
          >
            📅 {matchday.nome}
          </div>
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

            <div
              style={{
                marginBottom: "15px",
                fontWeight: 700,
              }}
            >
              Titolari selezionati: {titolariCount}/11
            </div>

            <div
              style={{
                display: "grid",
                gap: "8px",
              }}
            >
              {players.map((player) => (
                <label
                  key={player.id}
                  style={{
                    background: "#1f2937",
                    padding: "10px",
                    borderRadius: "8px",
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={titolari.includes(player.id)}
                    onChange={() => togglePlayer(player.id)}
                  />

                  <strong>
                    [{player.ruolo}]
                  </strong>

                  {player.nome}
                </label>
              ))}
            </div>

<h2
  style={{
    marginTop: "30px",
    marginBottom: "15px",
  }}
>
  Panchina
</h2>

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

        <div>
          {index + 1}. [{player.ruolo}] {player.nome}
        </div>

        <div
          style={{
            display: "flex",
            gap: "6px",
          }}
        >

          <button
            type="button"
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
              disabled={saving}
              style={{
                marginTop: "25px",
                width: "100%",
                padding: "16px",
                border: "none",
                borderRadius: "12px",
                background: "#16a34a",
                color: "white",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {saving
                ? "Salvataggio..."
                : "💾 Salva Formazione"}
            </button>
          </>
        )}

        <Link
          href="/"
          style={{
            display: "block",
            marginTop: "20px",
            textAlign: "center",
            color: "#cbd5e1",
            textDecoration: "none",
          }}
        >
          ← Torna alla Home
        </Link>
      </div>
    </main>
  );
}