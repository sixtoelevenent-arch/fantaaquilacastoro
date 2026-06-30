import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";


const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
async function run() {
const file = fs.readFileSync(
path.join(process.cwd(), "convertcsv3.csv"),
"utf8"
);
const rows = file
.split(/\r?\n/)
.filter((r) => r.trim());
const header = rows.shift();
if (!header) {
throw new Error("CSV vuoto");
}
let updated = 0;
const notFound: string[] = [];
const duplicates: string[] = [];
for (const row of rows) {
const cols = row.split(",");
if (cols.length < 5) continue;

const ruolo = cols[0]?.trim();
const nome = cols[1]?.trim();
const nazionale = cols[2]?.trim();
const prezzo = Number(cols[3]);
const nomeNorm = nome
  .replace(/^J\. /, "")
  .replace(/^U\. /, "")
  .replace(/^P\. /, "")
  .replace(/^B\. /, "")
  .trim();

const nazionaleNorm = nazionale
  .replace("R.D. Congo", "RD Congo")
  .replace(
    "Messico",
    nome.includes("Giménez") ? "Uruguay" : "Messico"
  );

if (!nome || !nazionale || Number.isNaN(prezzo)) {
  continue;
}

const { data: players, error } = await supabase
  .from("players")
  .select("id")
  .ilike("nome", nomeNorm)
  .ilike("nazionale", nazionaleNorm);

if (error) {
  console.error(error);
  continue;
}

if (!players?.length) {
  notFound.push(
    `${nome} | ${nazionale} | ${ruolo}`
  );
  continue;
}

if (players.length > 1) {
  duplicates.push(
    `${nome} | ${nazionale}`
  );
  continue;
}

const { error: updateError } =
  await supabase
    .from("players")
    .update({
      prezzo,
    })
    .eq("id", players[0].id);

if (updateError) {
  console.error(updateError);
  continue;
}

updated++;

}

}
run();
