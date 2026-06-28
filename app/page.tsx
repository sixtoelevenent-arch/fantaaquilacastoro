"use client";
import {
  useEffect,
  useState,
} from "react";
import Link from "next/link";
export default function Home() {
  const [logged, setLogged] =
  useState(false);

useEffect(() => {
  setLogged(
    !!localStorage.getItem(
      "fantasy_user"
    )
  );
}, []);
  const buttonStyle = {
    display: "block",
    width: "100%",
    padding: "16px",
    borderRadius: "14px",
    textDecoration: "none",
    color: "white",
    fontWeight: "bold" as const,
    fontSize: "18px",
    marginBottom: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
    textAlign: "center" as const,
    boxSizing: "border-box" as const,
  };
      
  const showMarketButton =
  new Date() <
  new Date("2026-06-28T18:00:00+02:00");

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom, #020617 0%, #08122c 50%, #020617 100%)",
        color: "white",
        padding: "12px 20px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Link
  href={logged ? "/account" : "/login"}
  style={{
    position: "absolute",
    top: 10,
    right: 10,

    width: 120,
    height: 48,

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    background: "#2563eb",
    color: "white",

    borderRadius: 14,
    textDecoration: "none",

    fontWeight: 800,
    fontSize: "1rem",

    zIndex: 50,
  }}
>
  {logged ? "👤 ACCOUNT" : "🔑 ENTRA"}
</Link>

      <img
        src="/Logo.jpg"
        alt="FantAquilaCastoro 2026"
        style={{
          width: "90px",
          height: "90px",
          objectFit: "contain",
          marginBottom: "8px",
        }}
      />

      <div
        style={{
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(1.9rem, 7vw, 3rem)",
            lineHeight: 1.05,
            marginBottom: "8px",
            fontWeight: "800",
          }}
        >
          FantAquilaCastoro
          <br />
          2026
        </h1>

        <div
          style={{
            color: "#fbbf24",
            fontSize: "clamp(1.5rem, 5vw, 2.2rem)",
            fontWeight: "800",
            marginBottom: "6px",
          }}
        >
          Road to New York 🗽
        </div>

        <div
          style={{
            color: "#fbbf24",
            fontSize: "1rem",
            fontWeight: "600",
            marginBottom: "18px",
          }}
        >
          FIFA World Cup Fantasy Edition
        </div>

        <div
          style={{
            color: "#cbd5e1",
            marginBottom: "10px",
            fontSize: "0.95rem",
          }}
        >
          📅 11 Giugno → 19 Luglio 2026
        </div>

        <div
          style={{
            color: "#cbd5e1",
            marginBottom: "18px",
            lineHeight: 1.6,
            fontSize: "0.95rem",
          }}
        >
          ⚽ 12 Fantallenatori • 🌍 12 Nazionali
          <br />
          🏆 1 Campione
        </div>

        <div
          style={{
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.03)",
            borderRadius: "14px",
            padding: "12px",
            color: "#fbbf24",
            fontWeight: "700",
            fontSize: "1.1rem",
            maxWidth: "320px",
            margin: "0 auto",
          }}
        >
          🏆 Campione in carica: Sirty
        </div>
      </div>

      <div
        style={{
          width: "100%",
          maxWidth: "350px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <a
          href="/live"
          style={{
            ...buttonStyle,
            background: "#dc2626",
            padding: "18px",
            fontSize: "20px",
            marginBottom: "20px",
            boxShadow: "0 0 18px rgba(220,38,38,0.40)",
          }}
        >
          🔴 LIVE GIORNATA
        </a>

{showMarketButton && (
  <>
    <style jsx>{`
      @keyframes blinkMarket {
        0%,
        100% {
          opacity: 1;
          transform: scale(1);
        }
        50% {
          opacity: 0.55;
          transform: scale(1.02);
        }
      }
    `}</style>

    <a
      href="/mercato"
      style={{
        ...buttonStyle,
        background:
          "linear-gradient(90deg,#facc15,#f59e0b)",
        color: "#111827",
        marginTop: "-8px",
        marginBottom: "20px",
        fontSize: "18px",
        fontWeight: 800,
        boxShadow:
          "0 0 20px rgba(250,204,21,0.45)",
        animation:
          "blinkMarket 1s infinite",
      }}
    >
      💰 MERCATO APERTO
    </a>
  </>
)}

        <a
          href="/classifiche"
          style={{
            ...buttonStyle,
            background: "#2563eb",
          }}
        >
          📊 CLASSIFICHE
        </a>

        <a
          href="/calendario"
          style={{
            ...buttonStyle,
            background: "#7c3aed",
          }}
        >
          🗓️ CALENDARIO
        </a>

        <a
          href="/fase-finale"
          style={{
            ...buttonStyle,
            background: "#b45309",
          }}
        >
          ⚔️ FASE FINALE
        </a>

        <a
          href="/rose-ufficiali.html"
          style={{
            ...buttonStyle,
            background: "#0ea5e9",
          }}
        >
          📋 ROSE UFFICIALI
        </a>

        <a
  href="/statistiche"
  style={{
    ...buttonStyle,
    background: "#9333ea",
  }}
>
  📈 STATISTICHE
</a>

        <a
          href="/svincolati"
          style={{
            ...buttonStyle,
            background: "#475569",
          }}
        >
          📑 LISTONE SVINCOLATI
        </a>

        <a
          href="/regolamento"
          style={{
            ...buttonStyle,
            background: "#16a34a",
          }}
        >
          📜 REGOLAMENTO
        </a>

        <a
          href="/torneo"
          style={{
            ...buttonStyle,
            background: "#1d4ed8",
          }}
        >
          ℹ️ TORNEO
        </a>

        <a
          href="/albo-d-oro"
          style={{
            ...buttonStyle,
            background: "#ca8a04",
          }}
        >
          🏅 ALBO D'ORO
        </a>
      </div>

      <div
        style={{
          marginTop: "30px",
          textAlign: "center",
          color: "#94a3b8",
          fontSize: "13px",
        }}
      >
        FantAquilaCastoro 2026 • Road to New York 🗽
      </div>
    </main>
  );
}