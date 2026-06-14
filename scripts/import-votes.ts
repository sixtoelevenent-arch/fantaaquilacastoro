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

  const playerMap = new Map<string, any>();

  for (const p of players || []) {
    const key = `${lastName(p.nome)}|${normalize(p.nazionale)}`;
    playerMap.set(key, p);
  }

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

    const key = `${normalize(nome)}|${normalize(nazioneFantapiu)}`;

    const player = playerMap.get(key);

    if (!player) {
      nonTrovati++;
      console.log("NON TROVATO:", key);
      continue;
    }

    const valori = row
      .find(".table-text.bold")
      .map((_, el) => $(el).text().trim())
      .get();

    if (valori.length < 10) continue;

    const voto = parseFloat(valori[1].replace(",", "."));

    const golSubiti = parseInt(valori[2]) || 0;
    const golSegnati = parseInt(valori[3]) || 0;
    const ammonizione = Number(valori[4]) < 0;
    const espulsione = Number(valori[5]) < 0;
    const rigori = parseInt(valori[6]) || 0;
    const autogol = parseInt(valori[7]) || 0;
    const assist = parseInt(valori[8]) || 0;

    const { error } = await supabase
      .from("player_votes")
      .upsert(
        {
          matchday_id: 1,
          player_id: player.id,
          voto,
          gol: golSegnati,
          assist,
          ammonizione,
          espulsione,
          autogol,
          rigori_parati: rigori > 0 ? rigori : 0,
          rigori_sbagliati: 0,
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