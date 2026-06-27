"use client";

import { useRouter } from "next/navigation";
import BackHome from "@/components/BackHome";

export default function SimulazioneMercatoPage() {
  const router = useRouter();

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
            marginBottom: 24,
          }}
        >
          🧪 SIMULAZIONE MERCATO
        </h1>

        <div
          style={{
            background: "#111827",
            borderRadius: 16,
            padding: 20,
            marginBottom: 20,
            textAlign: "center",
            color: "#cbd5e1",
            lineHeight: 1.6,
          }}
        >
          Questa sezione consente di
          simulare completamente una
          sessione di mercato con 4
          squadre di test, senza
          modificare il mercato reale.
        </div>

        <button
          onClick={() =>
            router.push(
              "/admin/simulazione-mercato/svincoli"
            )
          }
          style={{
            width: "100%",
            padding: 20,
            border: "none",
            borderRadius: 16,
            background: "#ca8a04",
            color: "white",
            fontWeight: 900,
            fontSize: "1.1rem",
            marginBottom: 14,
            cursor: "pointer",
          }}
        >
          🔄 SIMULA SVINCOLI
        </button>

        <button
          onClick={() =>
            router.push(
              "/admin/simulazione-mercato/buste"
            )
          }
          style={{
            width: "100%",
            padding: 20,
            border: "none",
            borderRadius: 16,
            background: "#2563eb",
            color: "white",
            fontWeight: 900,
            fontSize: "1.1rem",
            marginBottom: 14,
            cursor: "pointer",
          }}
        >
          💰 SIMULA BUSTE
        </button>

        <button
          onClick={() =>
            router.push(
              "/admin/simulazione-mercato/risultati"
            )
          }
          style={{
            width: "100%",
            padding: 20,
            border: "none",
            borderRadius: 16,
            background: "#16a34a",
            color: "white",
            fontWeight: 900,
            fontSize: "1.1rem",
            marginBottom: 14,
            cursor: "pointer",
          }}
        >
          🏆 RISULTATI SIMULAZIONE
        </button>

        <button
          onClick={() =>
            router.push(
              "/admin/simulazione-mercato/esegui"
            )
          }
          style={{
            width: "100%",
            padding: 20,
            border: "none",
            borderRadius: 16,
            background: "#dc2626",
            color: "white",
            fontWeight: 900,
            fontSize: "1.1rem",
            cursor: "pointer",
          }}
        >
          🚀 ESEGUI SIMULAZIONE
        </button>

       <button
  onClick={() =>
    router.push(
      "/admin/simulazione-mercato/reset"
    )
  }
  style={{
    width: "100%",
    padding: 20,
    border: "none",
    borderRadius: 16,
    background: "#475569",
    color: "white",
    fontWeight: 900,
    fontSize: "1.1rem",
    marginTop: 14,
    cursor: "pointer",
  }}
>
  ♻️ RESET SIMULAZIONE
</button>

      </div>
    </main>
  );
}