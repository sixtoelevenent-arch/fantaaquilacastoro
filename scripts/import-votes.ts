import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import axios from "axios";
import * as cheerio from "cheerio";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const URL =
  "https://fantapiu3.com/voti-globali/fantacalcio-voti-gazzetta-sport-coppa-del-mondo.php?fonte=votifp3&giornata=1";

function normalize(str: string) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\./g, "")
    .replace(/'/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();
}

function normalizeNation(nation: string) {
  const n = normalize(nation);

  const map: Record<string, string> = {
    OLANDA: "PAESI BASSI",
    USA: "STATI UNITI",
  };

  return map[n] || n;
}

function lastName(nome: string) {
  const clean = normalize(nome);
  const parts = clean.split(" ");
  return parts[parts.length - 1];
}

async function main() {
  console.log("Download Fantapiu3...");

  const { data } = await axios.get(URL, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/137 Safari/537.36",
    },
  });

  const $ = cheerio.load(data);

  const { data: players, error: playersError } = await supabase
    .from("players")
    .select("id,nome,nazionale,fantapiu3_name");

  if (playersError) throw playersError;

  const exactMap = new Map<string, any>();

for (const p of players || []) {
  const nation = normalizeNation(p.nazionale);

  exactMap.set(
    `${normalize(p.fantapiu3_name || "")}|${nation}`,
    p
  );
}

console.log("EXACT MAP:", exactMap.size);

  let importati = 0;
  let nonTrovati = 0;

  const rows = $(".table-row");

  console.log("Righe trovate:", rows.length);

  for (let i = 0; i < rows.length; i++) {
    const row = rows.eq(i);

    const nome = row.find(".team-name").first().text().trim();

    if (!nome) continue;

    const info = row.find(".team-country").text().trim();

    const nazioneFantapiu = info
      .split("-")[0]
      .trim();

      if (!nazioneFantapiu) continue;

if (
  normalize(nome) === normalize(nazioneFantapiu)
) {
  continue;
}

    const key =
  `${normalize(nome)}|${normalizeNation(nazioneFantapiu)}`;

let player = exactMap.get(key);
    if (!player) {
  nonTrovati++;

  console.log(
    "NON TROVATO:",
    nome,
    "|",
    nazioneFantapiu,
    "| KEY:",
    key
  );

  continue;
}

    const valori = row
  .find(".table-text.bold")
  .map((_, el) => $(el).text().trim())
  .get();

if (
  nome.toUpperCase().includes("EMBOLO") ||
  nome.toUpperCase().includes("MUSIALA")
) {
  console.log(nome);
  console.log(valori);
}

if (valori.length < 10) continue;

const voto = parseFloat(
  valori[1].replace(",", ".")
);

// =====================
// GOL FATTI / SUBITI
// =====================

const valoreGol =
  parseInt(valori[2]) || 0;

// Fantapiù3 usa:
// +3 = 1 gol
// +6 = 2 gol
// +9 = 3 gol

const golSegnati =
  valoreGol > 0
    ? Math.floor(valoreGol / 3)
    : 0;

// Portieri:
// -1 = 1 gol subito
// -2 = 2 gol subiti

const golSubiti =
  valoreGol < 0
    ? Math.abs(valoreGol)
    : 0;

// =====================
// GOL SU RIGORE
// =====================

// +3 = 1 rigore segnato

const golRigoreValue =
  parseInt(valori[3]) || 0;

const golRigore =
  golRigoreValue > 0
    ? Math.floor(golRigoreValue / 3)
    : 0;

// =====================
// AMMONIZIONE
// =====================

// -0.5

const ammonizioneValue =
  parseFloat(valori[4].replace(",", ".")) || 0;

const ammonizione =
  ammonizioneValue < 0;

// =====================
// ESPULSIONE
// =====================

// -1

const espulsioneValue =
  parseFloat(valori[5].replace(",", ".")) || 0;

const espulsione =
  espulsioneValue < 0;

// =====================
// RIGORI PARATI / SBAGLIATI
// =====================

// +3 = rigore parato
// -3 = rigore sbagliato

const rigoriValue =
  parseInt(valori[6]) || 0;

const rigoriParati =
  rigoriValue > 0
    ? Math.floor(rigoriValue / 3)
    : 0;

const rigoriSbagliati =
  rigoriValue < 0
    ? Math.floor(Math.abs(rigoriValue) / 3)
    : 0;

// =====================
// AUTOGOL
// =====================

// -2 = 1 autogol

const autogolValue =
  parseInt(valori[7]) || 0;

const autogol =
  autogolValue < 0
    ? Math.floor(Math.abs(autogolValue) / 2)
    : 0;

// =====================
// ASSIST
// =====================

// +1 = 1 assist

const assistValue =
  parseInt(valori[8]) || 0;

const assist = assistValue;

    const { error } = await supabase
      .from("player_votes")
      .upsert(
        {
          matchday_id: 1,
          player_id: player.id,
          voto,
          gol: golSegnati + (golRigore > 0 ? 1 : 0),
          assist,
          ammonizione,
          espulsione,
          autogol,
          rigori_parati: rigoriParati,
          rigori_sbagliati: rigoriSbagliati,
          gol_subiti: Math.abs(golSubiti),
          clean_sheet: golSubiti === 0,
          sv: false,
        },
        {
          onConflict: "matchday_id,player_id",
        }
      );

    if (error) {
      console.log("ERRORE:", nome, error.message);
      continue;
    }

    importati++;
  }

  console.log("");
  console.log("IMPORTATI:", importati);
  console.log("NON TROVATI:", nonTrovati);
}

main().catch(console.error);