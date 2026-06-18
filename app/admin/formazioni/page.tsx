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

const ROLE_ORDER = {
  P: 1,
  D: 2,
  C: 3,
  A: 4,
};

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
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);

  const [matchday, setMatchday] = useState<Matchday | null>(null);

  const [modulo, setModulo] = useState("4-3-3");

  const [titolari, setTitolari] = useState<number[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const { data: teamsData } = await supabase
      .from("teams")
      .select("*")
      .order("nome");

    const { data: matchdayData } = await supabase
      .from("matchdays")
      .select("id,nome")
      .eq("attiva", true)
      .single();
      

    setTeams(teamsData || []);
    setMatchday(matchdayData || null);

    setLoading(false);
  }

  async function loadPlayers(teamId: number) {

  const { data } = await supabase
    .from("players")
    .select("*")
    .eq("team_id", teamId);

    const sortedPlayers = (data || []).sort(
  (a: Player, b: Player) =>
    ROLE_ORDER[a.ruolo as keyof typeof ROLE_ORDER] -
    ROLE_ORDER[b.ruolo as keyof typeof ROLE_ORDER]
);

  setPlayers(sortedPlayers);
  setTitolari([]);
}
     function togglePlayer(playerId: number) {
    if (titolari.includes(playerId)) {
      setTitolari((prev) => prev.filter((id) => id !== playerId));
      return;
    }

    if (titolari.length >= 11) {
      alert("Puoi selezionare massimo 11 titolari");
      return;
    }

    setTitolari((prev) => [...prev, playerId]);
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
    if (!selectedTeam) {
      alert("Seleziona una squadra");
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
      const { data: oldFormation } = await supabase
        .from("formations")
        .select("id")
        .eq("team_id", selectedTeam)
        .eq("matchday_id", matchday.id)
        .maybeSingle();

      if (oldFormation) {
        await supabase
          .from("formation_players")
          .delete()
          .eq("formation_id", oldFormation.id);

        await supabase
          .from("formations")
          .delete()
          .eq("id", oldFormation.id);
      }

      const { data: newFormation, error: formationError } = await supabase
        .from("formations")
        .insert({
          team_id: selectedTeam,
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

      const benchPlayers = players.filter(
  (p) => !titolari.includes(p.id)
);

const titolariOrdinati = players
  .filter((p) => titolari.includes(p.id))
  .sort(
  (a: Player, b: Player) =>
    ROLE_ORDER[a.ruolo as keyof typeof ROLE_ORDER] -
    ROLE_ORDER[b.ruolo as keyof typeof ROLE_ORDER]
);

const rows = [

  ...titolariOrdinati.map((p, index) => ({
    formation_id: newFormation.id,
    player_id: p.id,
    titolare: true,
    posizione: index + 1,
    ordine_panchina: null,
  })),

  ...benchPlayers.map((p, index) => ({
    formation_id: newFormation.id,
    player_id: p.id,
    titolare: false,
    posizione: null,
    ordine_panchina: index + 1,
  })),
];

      const { error: playersError } = await supabase
        .from("formation_players")
        .insert(rows);

      if (playersError) {
        throw playersError;
      }

      alert("Formazione salvata correttamente");
    } catch (err) {
      console.error(err);
      alert("Errore durante il salvataggio");
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
                value={selectedTeam ?? ""}
                onChange={async (e) => {
                  const id = Number(e.target.value);
                  setSelectedTeam(id);
                  await loadPlayers(id);
                }}
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                }}
              >
                <option value="">
                  Seleziona squadra
                </option>

                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.nome} - {team.proprietario}
                  </option>
                ))}
              </select>

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
  ? "SALVATAGGIO..."
  : "💾 SALVA FORMAZIONE"}
            </button>
          </>
        )}

        <Link
          href="/admin"
          style={{
            display: "block",
            marginTop: "20px",
            textAlign: "center",
            color: "#cbd5e1",
            textDecoration: "none",
          }}
        >
          ← Torna all'Area Admin
        </Link>
      </div>
    </main>
  );
}