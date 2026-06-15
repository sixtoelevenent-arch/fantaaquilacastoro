"use client";
import BackHome from "@/components/BackHome";
import { useState } from "react";
export default function Home() {
  const [search, setSearch] = useState("");

  const buttonStyle = {
    display: "block",
    width: "100%",
    padding: "16px 18px",
    borderRadius: "14px",
    textDecoration: "none",
    color: "white",
    fontWeight: "700",
    fontSize: "18px",
    marginBottom: "14px",
    textAlign: "center" as const,
    boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
    transition: "all 0.2s ease",
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #111827, #0f172a)",
        color: "white",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >

      <BackHome />

<div
  style={{
    marginTop: 12,
    paddingTop: 12,
    borderTop:
      "1px solid rgba(255,255,255,0.08)",
  }}
>
  <input
    type="text"
    placeholder="🔍 Cerca squadra o giocatore..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    style={{
      width: "100%",
      padding: "12px 16px",
      borderRadius: 12,
      border: "1px solid rgba(255,255,255,0.15)",
      background: "rgba(255,255,255,0.08)",
      color: "white",
      fontSize: "1rem",
      outline: "none",
    }}
  />
</div>

      <div
        style={{
          width: "100%",
          maxWidth: "900px",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(2.5rem, 7vw, 4rem)",
            textAlign: "center",
            marginTop: "20px",
            marginBottom: "10px",
            fontWeight: "800",
          }}
        >
          🏆 FantAquilaCastoro 2026
        </h1>

        <p
          style={{
            color: "#cbd5e1",
            marginBottom: "8px",
            textAlign: "center",
            fontSize: "1.1rem",
          }}
        >
          Mondiale Fantasy a 12 Squadre
        </p>

        <p
          style={{
            color: "#94a3b8",
            marginBottom: "40px",
            textAlign: "center",
            fontSize: "0.95rem",
          }}
        >
          Road to New York 🗽
        </p>

        <div
          style={{
            width: "100%",
            maxWidth: "420px",
            margin: "0 auto",
          }}
        >
          <h1
  style={{
    textAlign: "center",
    color: "#ef4444",
    fontSize: "clamp(2rem, 5vw, 3.2rem)",
    fontWeight: "800",
    marginTop: "10px",
    marginBottom: "20px",
  }}
>
  🔴 LIVE GIORNATA
</h1>

          <a
            href="/classifiche"
            style={{
              ...buttonStyle,
              background: "#2563eb",
            }}
          >
            📊 Classifiche
          </a>

          <a
            href="/calendario"
            style={{
              ...buttonStyle,
              background: "#7c3aed",
            }}
          >
            🗓️ Calendario
          </a>

          <a
            href="/gironi"
            style={{
              ...buttonStyle,
              background: "#059669",
            }}
          >
            🏆 Gironi
          </a>

          <a
            href="/fase-finale"
            style={{
              ...buttonStyle,
              background: "#b45309",
            }}
          >
            ⚔️ Fase Finale
          </a>

          <a
            href="/rose-ufficiali.html"
            style={{
              ...buttonStyle,
              background: "#0ea5e9",
            }}
          >
            📋 Rose Ufficiali
          </a>

          <a
            href="/svincolati"
            style={{
              ...buttonStyle,
              background: "#475569",
            }}
          >
            📑 Listone Svincolati
          </a>

          <a
            href="/regolamento"
            style={{
              ...buttonStyle,
              background: "#16a34a",
            }}
          >
            📜 Regolamento
          </a>

          <a
            href="/torneo"
            style={{
              ...buttonStyle,
              background: "#1d4ed8",
            }}
          >
            ℹ️ Torneo
          </a>

          <a
            href="/albo-doro"
            style={{
              ...buttonStyle,
              background: "#ca8a04",
            }}
          >
            🏅 Albo d'Oro
          </a>
        </div>

        <div
          style={{
            marginTop: "50px",
            paddingTop: "20px",
            borderTop: "1px solid #374151",
            textAlign: "center",
            color: "#94a3b8",
            fontSize: "14px",
          }}
        >
          FantAquilaCastoro 2026 • Road to New York 🗽
        </div>
      </div>
    </main>
  );
}