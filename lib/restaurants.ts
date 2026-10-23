import { readFileSync } from "node:fs";
import path from "node:path";
import type { PriceBand, Restaurant } from "./types";

const PRICE_BANDS: readonly PriceBand[] = ["$", "$$", "$$$", "$$$$"];
const EXPECTED_HEADER =
  "id,name,cuisine,delivery_time_min,price_tier,is_vegetarian,is_vegan,is_gluten_free,rating";

/** Convert price_tier (1-4) to its band; throws on anything else so bad data never renders. */
function toPriceBand(tier: string): PriceBand {
  const band = PRICE_BANDS[Number(tier) - 1];
  if (!band) throw new Error(`Unknown price_tier "${tier}"`);
  return band;
}

/** Parse a "true"/"false" cell; throws on anything else. */
function toBool(cell: string): boolean {
  if (cell === "true") return true;
  if (cell === "false") return false;
  throw new Error(`Expected true/false, got "${cell}"`);
}

/** Split one CSV line, honouring double-quoted cells (names may contain commas). */
function splitCsvLine(line: string): string[] {
  const cells: string[] = [];
  let cell = "";
  let quoted = false;
  for (const ch of line) {
    if (ch === '"') quoted = !quoted;
    else if (ch === "," && !quoted) { cells.push(cell); cell = ""; }
    else cell += ch;
  }
  cells.push(cell);
  return cells;
}

/** Read all restaurants from data/restaurants.csv in the project folder (never hand-typed, never fetched). */
export function loadRestaurants(): Restaurant[] {
  const csv = readFileSync(path.join(process.cwd(), "data", "restaurants.csv"), "utf8").trim();
  const [header, ...lines] = csv.split(/\r?\n/);
  if (header !== EXPECTED_HEADER) throw new Error(`Unexpected header: ${header}`);
  return lines.map((line) => {
    const [id, name, cuisine, minutes, tier, veg, vegan, gf, rating] = splitCsvLine(line);
    return {
      id: Number(id),
      name,
      cuisine,
      deliveryTimeMin: Number(minutes),
      priceBand: toPriceBand(tier),
      isVegetarian: toBool(veg),
      isVegan: toBool(vegan),
      isGlutenFree: toBool(gf),
      rating: Number(rating),
    };
  });
}
