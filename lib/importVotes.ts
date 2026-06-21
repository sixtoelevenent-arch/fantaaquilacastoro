import axios from "axios";
import * as cheerio from "cheerio";
import { createClient } from "@supabase/supabase-js";

console.log(
  "SUPABASE URL:",
  process.env.NEXT_PUBLIC_SUPABASE_URL
);

console.log(
  "SERVICE KEY:",
  !!process.env.SUPABASE_SERVICE_ROLE_KEY
);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const { data: activeMatchday, error: matchdayError } =
  await supabase
    .from("matchdays")
    .select("id,nome,attiva");

console.log("MATCHDAYS:", activeMatchday);
console.log("ERROR:", matchdayError);

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

export async function importVotes() {
  console.log("Download Fantapiu3...");

  const { data: activeMatchday, error: matchdayError } =
  await supabase
    .from("matchdays")
    .select("id,nome")
    .eq("attiva", true)
    .single();

    console.log(
  "ACTIVE MATCHDAY:",
  activeMatchday
);

console.log(
  "MATCHDAY ERROR:",
  matchdayError
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
  `${BASE_URL}${activeMatchday.id}`;

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

const player = exactMap.get(key);

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
  normalize(nome).includes("CALHANOGLU")
) {
  console.log("CALHANOGLU");
  console.log("VALORI:", valori);
  console.log("VOTO RAW:", valori[1]);
}
  
if (valori.length < 10) continue;

const votoRaw = valori[1].trim();

const votoParsed = parseFloat(
  votoRaw.replace(",", ".")
);

const isSv =
  valori[1].trim().toUpperCase() === "SV";

const voto =
  isSv || Number.isNaN(votoParsed)
    ? null
    : votoParsed;

const valoreGol =
  parseInt(valori[2]) || 0;

const golSegnati =
  valoreGol > 0
    ? Math.floor(valoreGol / 3)
    : 0;

const golSubiti =
  valoreGol < 0
    ? Math.abs(valoreGol)
    : 0;

const golRigoreValue =
  parseInt(valori[3]) || 0;

const golRigore =
  golRigoreValue > 0
    ? Math.floor(golRigoreValue / 3)
    : 0;


const ammonizioneValue =
  parseFloat(valori[4].replace(",", ".")) || 0;

const ammonizione =
  ammonizioneValue < 0;

const espulsioneValue =
  parseFloat(valori[5].replace(",", ".")) || 0;

const espulsione =
  espulsioneValue < 0;

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

const autogolValue =
  parseInt(valori[7]) || 0;

const autogol =
  autogolValue < 0
    ? Math.floor(Math.abs(autogolValue) / 2)
    : 0;

const assistValue =
  parseInt(valori[8]) || 0;

const assist = assistValue;

    const { error } = await supabase
  .from("player_votes")
  .upsert(
    {
      matchday_id: activeMatchday.id,
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
      sv: isSv,
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
  return {
  importati,
  nonTrovati,
};
}

