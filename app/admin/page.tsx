"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Page() {
  const [importing, setImporting] =
  useState(false);

  const router = useRouter();

  useEffect(() => {
    const isAdmin =
      localStorage.getItem("fantasy_admin");

    if (isAdmin !== "true") {
      router.push("/login");
    }
  }, [router]);

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom, #020617 0%, #08122c 50%, #020617 100%)",
        color: "white",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h1
        style={{
          fontSize: "2.2rem",
          marginBottom: "10px",
          textAlign: "center",
        }}
      >
        <img
  src="/logo.png"
  alt="FantAquilaCastoro"
  style={{
    width: 90,
    height: 90,
    marginBottom: 20,
  }}
/>
        ⚙️ Area Admin
      </h1>

      <p
        style={{
          color: "#cbd5e1",
          marginBottom: "35px",
          textAlign: "center",
          fontSize: "18px",
        }}
      >
        Gestione FantAquilaCastoro 2026
      </p>

      <div
        style={{
          width: "100%",
          maxWidth: "320px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        
        <Link
          href="/admin/formazioni"
          style={{
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  padding: "16px",
  borderRadius: "14px",
  textDecoration: "none",
  color: "white",
  fontWeight: 700,
  fontSize: "18px",
  cursor: "pointer",
  background: "#2563eb",
  boxShadow:
    "0 8px 20px rgba(0,0,0,0.25)",
  border:
    "1px solid rgba(255,255,255,0.08)",
}}
        >
          ⚽ Formazioni
        </Link>

        <Link
          href="/admin/giornate"
          style={{
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  padding: "16px",
  borderRadius: "14px",
  textDecoration: "none",
  color: "white",
  fontWeight: 700,
  fontSize: "18px",
  cursor: "pointer",
  background: "#7c3aed",
  boxShadow:
    "0 8px 20px rgba(0,0,0,0.25)",
  border:
    "1px solid rgba(255,255,255,0.08)",
}}
        >
          📅 Gestione Giornate
        </Link>

        <button
  disabled={importing}
  onClick={async () => {

    const ok = confirm(
      "Importare i voti adesso?"
    );

    if (!ok) return;

    try {

      setImporting(true);

      const res = await fetch(
        "/api/admin/import-votes",
        {
          method: "POST",
        }
      );

      const data =
        await res.json();

      if (!data.success) {
        throw new Error(
          data.error
        );
      }

      alert(
        `✅ Import completato

Importati: ${data.importati}
Non trovati: ${data.nonTrovati}`
      );

    } catch (err: any) {

      alert(
        err.message ||
        "Errore import"
      );

    } finally {

      setImporting(false);

    }
  }}
  style={{
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  padding: "16px",
  borderRadius: "14px",
  appearance: "none",
  WebkitAppearance: "none",
  color: "white",
  fontWeight: 700,
  fontSize: "18px",
  background: "#16a34a",
  cursor: "pointer",
  boxShadow:
    "0 8px 20px rgba(0,0,0,0.25)",
  border:
    "1px solid rgba(255,255,255,0.08)",
}}
>
  {importing
    ? "⏳ Import in corso..."
    : "📥 Importa Voti"}
</button>

        <button
          onClick={() => {
            localStorage.removeItem(
              "fantasy_admin"
            );

            router.push("/");
          }}
          style={{
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  padding: "16px",
  borderRadius: "14px",
  appearance: "none",
  WebkitAppearance: "none",
  color: "white",
  fontWeight: 700,
  fontSize: "18px",
  background: "#dc2626",
  cursor: "pointer",
  boxShadow:
    "0 8px 20px rgba(0,0,0,0.25)",
  border:
    "1px solid rgba(255,255,255,0.08)",
}}
        >
          🚪 Logout Admin
        </button>

        <Link
          href="/"
          style={{
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  padding: "16px",
  borderRadius: "14px",
  textDecoration: "none",
  color: "white",
  fontWeight: 700,
  fontSize: "18px",
  cursor: "pointer",
  background: "#334155",
  boxShadow:
    "0 8px 20px rgba(0,0,0,0.25)",
  border:
    "1px solid rgba(255,255,255,0.08)",
}}
        >
          🏠 Torna alla Home
        </Link>
      </div>
    </main>

    
  );
}