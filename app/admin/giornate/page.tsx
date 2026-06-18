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
    const { data } = await supabase
      .from("matchdays")
      .select("id,nome,attiva,chiusa")
      .order("id");

    setGiornate(data || []);
    setLoading(false);
  }

  async function riapriGiornata(id: number) {
    await supabase
      .from("matchdays")
      .update({ chiusa: false })
      .eq("id", id);

    await loadGiornate();
  }

  async function impostaAttiva(id: number) {
    await supabase
  .from("matchdays")
  .update({ attiva: false })
  .eq("attiva", true);

    await supabase
      .from("matchdays")
      .update({
        attiva: true,
        chiusa: false,
      })
      .eq("id", id);

    await loadGiornate();
  }

  async function chiudiGiornata(id: number) {
    await supabase
      .from("matchdays")
      .update({ chiusa: true })
      .eq("id", id);

    await loadGiornate();
  }

  async function chiudiEPassa(id: number) {
    const prossima = giornate.find((g) => g.id === id + 1);
if (!prossima) {
  alert("Nessuna giornata successiva disponibile");
  return;
}
    await supabase
      .from("matchdays")
      .update({
        chiusa: true,
        attiva: false,
      })
      .eq("id", id);

    if (prossima) {
      await supabase
        .from("matchdays")
        .update({
          chiusa: false,
          attiva: true,
        })
        .eq("id", prossima.id);
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

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                {giornata.chiusa ? (
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
                ) : (
                  <button
                    onClick={() => chiudiGiornata(giornata.id)}
                    style={{
                      padding: "10px 14px",
                      borderRadius: "8px",
                      border: "none",
                      background: "#dc2626",
                      color: "white",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    🔒 Chiudi
                  </button>
                )}

                {!giornata.attiva && (
                  <button
                    onClick={() => impostaAttiva(giornata.id)}
                    style={{
                      padding: "10px 14px",
                      borderRadius: "8px",
                      border: "none",
                      background: "#2563eb",
                      color: "white",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    ⭐ Imposta come attiva
                  </button>
                )}

                {giornata.attiva && (
                  <button
                    onClick={() => chiudiEPassa(giornata.id)}
                    style={{
                      padding: "10px 14px",
                      borderRadius: "8px",
                      border: "none",
                      background: "#f59e0b",
                      color: "white",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    ⭐ Chiudi e passa alla successiva
                  </button>
                )}
              </div>
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