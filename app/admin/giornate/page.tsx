"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Matchday = {
  id: number;
  nome: string;
  attiva: boolean;
  chiusa: boolean;
};

export default function Page() {
  const [giornate, setGiornate] = useState<Matchday[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGiornate();
  }, []);

  async function loadGiornate() {
    const { data, error } = await supabase
      .from("matchdays")
      .select("id,nome,attiva,chiusa")
      .order("id");

    if (error) {
      console.error(error);
    } else {
      setGiornate(data || []);
    }

    setLoading(false);
  }

  async function riapriGiornata(id: number) {
    const { error } = await supabase
      .from("matchdays")
      .update({ chiusa: false })
      .eq("id", id);

    if (error) {
      alert("Errore durante la riapertura");
      console.error(error);
      return;
    }

    await loadGiornate();
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
            marginBottom: "30px",
          }}
        >
          📅 Gestione Giornate
        </h1>

        {loading ? (
          <p style={{ textAlign: "center" }}>Caricamento...</p>
        ) : (
          giornate.map((giornata) => (
            <div
              key={giornata.id}
              style={{
                background: "#1f2937",
                border: "1px solid #374151",
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  marginBottom: "8px",
                }}
              >
                {giornata.nome}
              </div>

              <div>
                {giornata.attiva ? "⭐ Attiva" : "⚪ Non attiva"}
              </div>

              <div style={{ marginBottom: "12px" }}>
                {giornata.chiusa ? "🔒 Chiusa" : "🔓 Aperta"}
              </div>

              {giornata.chiusa && (
                <button
                  onClick={() => riapriGiornata(giornata.id)}
                  style={{
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "none",
                    background: "#16a34a",
                    color: "white",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  🔓 Riapri
                </button>
              )}
            </div>
          ))
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