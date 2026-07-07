import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import axios from "axios";
import * as cheerio from "cheerio";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BASE_URL =
  "https://fantapiu3.com/voti-globali/fantacalcio-voti-gazzetta-sport-coppa-del-mondo.php?fonte=votifp3&giornata=";

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
  "OLANDA": "PAESI BASSI",
  "USA": "STATI UNITI",
  "IVORY COAST": "COSTA DAVORIO",
  "SOUTH KOREA": "COREA DEL SUD",
  "CZECH REPUBLIC": "REPUBBLICA CECA",
};

  return map[n] || n;
}

async function main() {

  const { data: activeMatchday, error: matchdayError } =
  await supabase
    .from("matchdays")
    .select("id,nome,fantapiu_giornata")
    .eq("attiva", true)
    .single();

console.log(
  "ACTIVE MATCHDAY:",
  activeMatchday
);

if (matchdayError || !activeMatchday) {
  throw new Error(
    "Nessuna giornata attiva trovata"
  );
}

console.log(
  "GIORNATA ATTIVA:",
  activeMatchday.nome
);

const URL =
  `${BASE_URL}${activeMatchday.fantapiu_giornata}`;

  console.log("URL:", URL);

const response = await axios.get(URL, {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/137 Safari/537.36",
  },
});

console.log("URL:", URL);

console.log(
  "HTML LENGTH:",
  response.data.length
);

console.log(
  "Pagina caricata correttamente"
);

console.log("STATUS:", response.status);
console.log("PRIMI 500 CARATTERI:");
console.log(response.data.substring(0, 500));

const $ = cheerio.load(response.data);

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
  let ignorati = 0;
 
  const rowsToUpsert: any[] = [];
  const rows = $(".table-row");

  console.log("Righe trovate:", rows.length);

  if (rows.length === 0) {
  console.log("NESSUNA RIGA TROVATA");
}

  for (let i = 0; i < rows.length; i++) {
    const row = rows.eq(i);

    const nome = row.find(".team-name").first().text().trim();

    if (!nome) continue;

    const info = row.find(".team-country").text().trim();

    const blacklist = [
  "ANCELOTTI",
  "NAGELSMANN",
  "KOEMAN",
  "MARSCH",
  "MONTELLA",
  "POCHETTINO",
  "DE LA FUENTE",
  "MORIYASU",
  "YAKIN M",
  "BROOS",
];

if (blacklist.includes(normalize(nome))) {
  continue;
}
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

  console.log(
    "ROSA NON TROVATA:",
    nome,
    "|",
    nazioneFantapiu
  );

  ignorati++;
  continue;
}

    const valori = row
  .find(".table-text.bold")
  .map((_, el) => $(el).text().trim())
  .get();

  console.log("PLAYER:", nome);
console.log("VALORI:", valori);

if (valori.length < 10) continue;

const votoRaw = (valori[1] ?? "").trim();

const votoParsed = parseFloat(
  votoRaw.replace(",", ".")
);

const isSv =
  votoRaw.toUpperCase() === "SV";

const voto =
  isSv || Number.isNaN(votoParsed)
    ? null
    : votoParsed;
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

    rowsToUpsert.push({
  matchday_id: activeMatchday.id,
  player_id: player.id,
  voto,
  gol: golSegnati + golRigore,
  assist,
  ammonizione,
  espulsione,
  autogol,
  rigori_parati: rigoriParati,
  rigori_sbagliati: rigoriSbagliati,
  gol_subiti: Math.abs(golSubiti),
  clean_sheet: golSubiti === 0,
  sv: isSv,
});
    importati++;
  }

  console.log("RIGHE DA SALVARE:", rowsToUpsert.length);

if (rowsToUpsert.length > 0) {
  console.log(rowsToUpsert[0]);
}
const { error: upsertError } =
  await supabase
    .from("player_votes")
    .upsert(rowsToUpsert, {
      onConflict:
        "matchday_id,player_id",
    });

if (upsertError) {
  throw upsertError;
}

  console.log("");
  console.log("IMPORTATI:", importati);
  console.log("IGNORATI:", ignorati);
 
}

main().catch(console.error);