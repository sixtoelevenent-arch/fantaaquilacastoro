"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Team = {
  id: number;
  nome: string;
  proprietario: string;
};

export default function FormazioniPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTeams();
  }, []);

  async function loadTeams() {
    const { data, error } = await supabase
      .from("teams")
      .select("id,nome,proprietario")
      .order("nome");

    if (error) {
      console.error(error);
      return;
    }

    setTeams(data || []);
    setLoading(false);
  }

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
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        <Link
          href="/admin"
          style={{
            display: "inline-block",
            marginBottom: "20px",
            color: "#93c5fd",
            textDecoration: "none",
          }}
        >
          ← Torna ad Admin
        </Link>

        <h1
          style={{
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          ⚽ Gestione Formazioni
        </h1>

        {loading ? (
          <p style={{ textAlign: "center" }}>Caricamento...</p>
        ) : (
          teams.map((team) => (
            <div
              key={team.id}
              style={{
                background: "#1f2937",
                border: "1px solid #374151",
                borderRadius: "14px",
                padding: "16px",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                }}
              >
                {team.nome}
              </div>

              <div
                style={{
                  color: "#cbd5e1",
                  marginTop: "4px",
                }}
              >
                {team.proprietario}
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}