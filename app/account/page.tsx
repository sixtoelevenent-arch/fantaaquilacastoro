"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import BackHome from "@/components/BackHome";

export default function AccountPage() {

  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [team, setTeam] = useState<any>(null);

  useEffect(() => {

    const raw =
      localStorage.getItem("fantasy_user");

    if (!raw) {
      router.push("/login");
      return;
    }

    const u = JSON.parse(raw);

    setUser(u);

    loadTeam(u.team_id);

  }, []);

  async function loadTeam(
    teamId: number
  ) {

    const { data } = await supabase
      .from("teams")
      .select("*")
      .eq("id", teamId)
      .single();

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
            marginBottom: 25,
          }}
        >
          👤 ACCOUNT
        </h1>

        <div
          style={{
            background: "#111827",
            borderRadius: 16,
            padding: 20,
            marginBottom: 20,
          }}
        >
          <div>
            <strong>Username:</strong>
            {" "}
            {user.username}
          </div>

          <br />

          <div>
            <strong>Squadra:</strong>
            {" "}
            {team.nome}
          </div>

          <br />

          <div>
            <strong>Allenatore:</strong>
            {" "}
            {team.proprietario}
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