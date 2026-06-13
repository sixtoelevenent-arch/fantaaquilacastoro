"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Matchday = {
  id: number;
  nome: string;
};

export default function AdminVotiPage() {
  const [testo, setTesto] = useState("");
  const [matchday, setMatchday] = useState<Matchday | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMatchday();
  }, []);

  async function loadMatchday() {
    const { data, error } = await supabase
      .from("matchdays")
      .select("id,nome")
      .eq("chiusa", false)
      .single();

    if (error) {
      console.error(error);
    } else {
      setMatchday(data);
    }

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
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "10px",
          }}
        >
          📥 Gestione Voti
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#cbd5e1",
            marginBottom: "25px",
          }}
        >
          {loading
            ? "Caricamento giornata..."
            : `Giornata attiva: ${matchday?.nome ?? "Nessuna giornata attiva"}`}
        </p>

        <textarea
          value={testo}
          onChange={(e) => setTesto(e.target.value)}
          placeholder="Incolla qui i voti..."
          style={{
            width: "100%",
            minHeight: "400px",
            padding: "16px",
            borderRadius: "12px",
            border: "1px solid #334155",
            background: "#111827",
            color: "white",
            fontSize: "14px",
            resize: "vertical",
          }}
        />

        <button
          style={{
            marginTop: "20px",
            width: "100%",
            padding: "16px",
            borderRadius: "12px",
            border: "none",
            background: "#16a34a",
            color: "white",
            fontWeight: 700,
            fontSize: "18px",
            cursor: "pointer",
          }}
        >
          📥 Importa Voti
        </button>

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