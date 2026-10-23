# Uber Eats · Game-day stackable restaurant filters

A Next.js (App Router) + TypeScript page that renders the 40-restaurant Game-Day set as cards. This is the typed foundation for the stackable filters (delivery time, price, dietary, rating).

![All 40 restaurant cards](docs/all-40-cards.png)

## Data
- `data/restaurants.csv` is the Uber Eats Game-Day Restaurant Set, committed as-is and read from the project folder at build time (`lib/restaurants.ts`). Nothing is hand-typed or fetched from the web.
- Every row is validated while loading: unknown price tiers or non true/false flags fail the build instead of rendering bad data.

## Types (`lib/types.ts`)
- `Restaurant`: one typed row. `priceBand` is `PriceBand = "$" | "$$" | "$$$" | "$$$$"`, mapped from `price_tier` 1-4, never a plain string.
- `FilterState`: four groups (`delivery`, `price`, `dietary`, `rating`), each `null` when nothing is picked. `EMPTY_FILTERS` is the starting state.
- Strict TypeScript, with no type-check escape hatches anywhere in the project.

## Rule calls to note
- Vegan counts as vegetarian in the filter: three rows (Chiang Mai Noodle Bar, Sprout & Seed, Tofu Temple) are vegan but flagged not vegetarian. The data file is left untouched; this is a filter rule, and cards still show only the tags the data says yes to.
- Delivery limits and rating minimums are inclusive: exactly 30 min passes Under 30; exactly 4.0 passes 4.0+.

## Run
```bash
npm install
npm run dev   # http://localhost:3000
```
