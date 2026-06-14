import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import * as XLSX from "xlsx";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const FILE = "FP3_quotazioni__coppa_del_mondo_2026.xlsx";
const SHEET = "Sheet1";

async function main() {
  const workbook = XLSX.readFile(FILE);

  const sheet = workbook.Sheets[SHEET];

  const rows: any[] = XLSX.utils.sheet_to_json(sheet, {
    defval: "",
    range: 2,
    header: [
      "giocatore",
      "squadra",
      "ruolo",
      "ruolo2",
      "qa",
      "qi",
      "diff",
    ],
  });

  const { data: existingPlayers, error: existingError } = await supabase
    .from("players")
    .select("*");

  if (existingError) throw existingError;

  const existingMap = new Map();

  for (const p of existingPlayers || []) {
    const key = String(p.fantapiu3_name || "")
      .trim()
      .toUpperCase();

    existingMap.set(key, p);
  }

  let aggiornati = 0;
  let inseriti = 0;

  const nuoviGiocatori: any[] = [];

  for (const row of rows) {
    const nome = String(row.giocatore || "").trim();
    const nazionale = String(row.squadra || "").trim();
    const ruolo = String(row.ruolo || "").trim();
    const prezzo = Number(row.qa || 1);

    if (!nome || !nazionale || !ruolo) continue;

    const key = nome.toUpperCase();

    const existing = existingMap.get(key);

    if (existing) {
      const { error } = await supabase
        .from("players")
        .update({
          nome,
          ruolo,
          nazionale,
          national_team: nazionale,
          prezzo,
          fantapiu3_name: nome,
          fantapiu3_code: nome,
        })
        .eq("id", existing.id);

      if (error) {
        console.error(error);
        return;
      }

      aggiornati++;
    } else {
      nuoviGiocatori.push({
        nome,
        ruolo,
        nazionale,
        national_team: nazionale,
        prezzo,
        team_id: null,
        fantapiu3_name: nome,
        fantapiu3_code: nome,
      });

      inseriti++;
    }
  }

  console.log("AGGIORNATI:", aggiornati);
  console.log("NUOVI:", inseriti);

  const chunkSize = 500;

  for (let i = 0; i < nuoviGiocatori.length; i += chunkSize) {
    const chunk = nuoviGiocatori.slice(i, i + chunkSize);

    const { error } = await supabase
      .from("players")
      .insert(chunk);

    if (error) {
      console.error(error);
      return;
    }
  }

  console.log("IMPORT COMPLETATO");
}

main().catch(console.error);