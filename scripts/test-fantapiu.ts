import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";

async function main() {
  const { data } = await axios.get(
    "https://fantapiu3.com/voti-globali/fantacalcio-voti-gazzetta-sport-coppa-del-mondo.php?fonte=votifp3&giornata=1",
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/137.0.0.0 Safari/537.36",
      },
    }
  );

  const $ = cheerio.load(data);

  const righe: string[] = [];

  $(".table-row").each((_, row) => {
    const nome = $(row).find(".team-name").text().trim();
    const info = $(row).find(".team-country").text().trim();

    righe.push(`${nome};${info}`);
  });

  fs.writeFileSync(
    "fantapiu3_players.csv",
    righe.join("\n"),
    "utf8"
  );

  console.log(`Creato fantapiu3_players.csv con ${righe.length} righe`);
}

main().catch(console.error);