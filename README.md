# Uber Eats · Game-day stackable restaurant filters

A Next.js (App Router) + TypeScript page that renders the 40-restaurant Game-Day set as cards with stackable filters: dietary, delivery time, price and rating. Every chip tap narrows the list instantly; there is no Apply button.

![All 40 restaurant cards](docs/all-40-cards.png)

## Checks
- [Expected-results check table](checks/expected-results.md): four hand-worked filter stacks (plus a two-chip extra row) with names and counts, used to judge the filter code.
- [Results vs expected](checks/results-vs-expected.md): each stack clicked on the page, with screenshots; all five counts match.

## Filter logic (`lib/filter.ts`)
- `filterRestaurants(restaurants, filters)` is one pure function: it returns a new list and never edits the input.
- Groups combine with AND. Price chips OR together; delivery passes at or under the largest selected limit; rating passes at or above the lowest selected minimum; every selected dietary tag must be yes in the data.
- The count on the page is the filtered list's length. When nothing matches, the empty state names the active filters in a sentence and offers Clear all.

## Data
- `data/restaurants.csv` is the Uber Eats Game-Day Restaurant Set, committed as-is and read from the project folder at build time (`lib/restaurants.ts`). Nothing is hand-typed or fetched from the web.
- Every row is validated while loading: unknown price tiers or non true/false flags fail the build instead of rendering bad data.

## Types (`lib/types.ts`)
- `Restaurant`: one typed row. `priceBand` is `PriceBand = "$" | "$$" | "$$$" | "$$$$"`, mapped from `price_tier` 1-4, never a plain string.
- `FilterState`: four groups (`delivery`, `price`, `dietary`, `rating`), each `null` when nothing is picked. Multi-pick groups use `NonEmptyList<T>`, so an empty list cannot compile; `toGroup()` turns an emptied chip list back into `null`. `EMPTY_FILTERS` is the starting state.
- Strict TypeScript, with no type-check escape hatches anywhere in the project.

## Rule calls to note
- Dietary chips follow the data's yes/no columns exactly. Three rows (Chiang Mai Noodle Bar, Sprout & Seed, Tofu Temple) are vegan but marked not vegetarian; that is raised with the data owner as an open question, not patched in code.
- Delivery limits and rating minimums are inclusive, and the chip names say so: the delivery chips read "20 / 30 / 45 min or less" (not "Under 30"), so Olive & Ember Mezze at exactly 30 min matches what the label promises; exactly 4.0 passes 4.0+.
- Cards with no dietary flags (16 of 40, e.g. Smokestack Burger Co., Liberty Diner) show a "No dietary tags" line, so the slot reads as deliberate rather than broken.

## Run
```bash
npm install
npm run dev   # http://localhost:3000
```
