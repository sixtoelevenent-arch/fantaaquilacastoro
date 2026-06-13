"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Team = {
  id: number;
  nome: string;
  proprietario: string;
};

export default function Page() {
  const [teams] = useState<Team[]>([]);

  useEffect(() => {
    console.log("SUPABASE TEST", supabase);
  }, []);

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
      <h1>⚽ Gestione Formazioni</h1>

      <p>Test Step 3</p>

      <p>Squadre: {teams.length}</p>
    </main>
  );
}