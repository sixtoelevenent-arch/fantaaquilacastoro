"use client";

import {
  useEffect,
  useState,
  type CSSProperties,
} from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import BackHome from "@/components/BackHome";

export default function AccountPage() {

  const router = useRouter();

  type User = {
  id: number;
  username: string;
  team_id: number;
};

type Team = {
  id: number;
  nome: string;
  proprietario: string;
  gruppo: string;
};

const [user, setUser] = useState<User | null>(null);
const [team, setTeam] = useState<Team | null>(null);

const secondaryButton: CSSProperties = {
  width: "100%",
  padding: 20,
  border: "none",
  borderRadius: 16,
  color: "white",
  fontWeight: 800,
  fontSize: "1.05rem",
  cursor: "pointer",
};

  useEffect(() => {
  const raw = localStorage.getItem("fantasy_user");

  if (!raw) {
    router.push("/login");
    return;
  }

  const u = JSON.parse(raw);

  setUser(u);
  loadTeam(u.team_id);
}, []);

  async function loadTeam(teamId: number) {
  const { data, error } = await supabase
    .from("teams")
    .select("*")
    .eq("id", teamId)
    .maybeSingle();

  if (error || !data) {
    localStorage.removeItem("fantasy_user");
    router.push("/login");
    return;
  }

  setTeam(data);
}

  function logout() {

    localStorage.removeItem(
      "fantasy_user"
    );

    router.push("/");
  }

  if (!user || !team) {

    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#020617",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        Caricamento...
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
          maxWidth: 700,
          margin: "0 auto",
        }}
      >
        <BackHome />

        <h1
  style={{
    textAlign: "center",
    marginBottom: 8,
  }}
>
  🏟️ AREA RISERVATA
</h1>

<p
  style={{
    textAlign: "center",
    color: "#94a3b8",
    marginBottom: 24,
    lineHeight: 1.5,
  }}
>
  {team.nome}
  <br />
  Allenatore: {team.proprietario}
</p>

        <div
          style={{
  background: "#111827",
  borderRadius: 20,
  padding: 22,
  marginBottom: 24,
  border:
    "1px solid rgba(255,255,255,.08)",
  lineHeight: 1.9,
}}
        >
          <div>
  <strong>Username:</strong>{" "}
  {user.username}
</div>

<div>
  <strong>Squadra:</strong>{" "}
  {team.nome}
</div>

<div>
  <strong>Allenatore:</strong>{" "}
  {team.proprietario}
</div>

<div>
  <strong>Girone:</strong>{" "}
  {team.gruppo}
</div>

        </div>

        <button
          onClick={() =>
            router.push("/formazioni")
          }
          style={{
            width: "100%",
            padding: 22,
            border: "none",
            borderRadius: 16,
            background: "#16a34a",
            color: "white",
            fontWeight: 900,
            fontSize: "1.2rem",
            marginBottom: 14,
            cursor: "pointer",
          }}
        >
          ⚽ GESTISCI FORMAZIONE
        </button>

        <button
  onClick={() =>
    router.push("/il-mio-mercato")
  }
  style={{
    width: "100%",
    padding: 22,
    border: "none",
    borderRadius: 16,
    background: "#f59e0b",
    color: "white",
    fontWeight:900,
    fontSize: "1.2rem",
            marginBottom: 14,
            cursor: "pointer",
  }}
>
  💰 IL MIO MERCATO
</button>

<div
  style={{
    display: "flex",
    flexDirection: "column",
    gap: 14,
    marginBottom: 14,
  }}
>
  <button
    onClick={() =>
      router.push("/account/la-mia-rosa")
    }
    style={{
      ...secondaryButton,
      background: "#7c3aed",
    }}
  >
    📋 LA MIA ROSA
  </button>

  <button
    onClick={() =>
      router.push("/account/i-miei-svincoli")
    }
    style={{
      ...secondaryButton,
      background: "#ca8a04",
    }}
  >
    🔄 I MIEI SVINCOLI
  </button>

  <button
    onClick={() =>
      router.push("/account/risultati-mercato")
    }
    style={{
      ...secondaryButton,
      background: "#0ea5e9",
    }}
  >
    🏆 RISULTATI MERCATO
  </button>
</div>

        <button
          onClick={() =>
            router.push("/change-password")
          }
          style={{
            width: "100%",
            padding: 18,
            border: "none",
            borderRadius: 16,
            background: "#2563eb",
            color: "white",
            fontWeight: 800,
            marginBottom: 14,
            cursor: "pointer",
          }}
        >
          🔑 CAMBIA PASSWORD
        </button>

        <button
          onClick={logout}
          style={{
            width: "100%",
            padding: 18,
            border: "none",
            borderRadius: 16,
            background: "#dc2626",
            color: "white",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          🚪 LOGOUT
        </button>

      </div>
    </main>
  );
}
