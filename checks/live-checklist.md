# Live demo checklist: stackable restaurant filter

**Live page:** https://uber-eats-filter-e6lw.vercel.app/
**Deployed commit checked:** [`a5531b2`](https://github.com/sreejithSHR/uber-eats-filter/commit/a5531b2) (Next.js 15.5.28). The page footer prints the commit Vercel built it from (`Build: a5531b2`, read from `VERCEL_GIT_COMMIT_SHA`), and that footer is visible in every screenshot below. Later commits that only change `checks/`, `docs/` or the README are skipped by Vercel (`vercel.json`), so the live page stays on this commit.
**How the screenshots were taken:** [`scripts/live-check.js`](../scripts/live-check.js) opens the live URL in a brand-new Microsoft Edge browser context (no cookies, not signed in to anything, the same as a private window), taps each stack's chips, reads the count and every restaurant name, and saves a full-page screenshot plus [`live-results.json`](../docs/live/live-results.json). Re-run it with `node scripts/live-check.js https://uber-eats-filter-e6lw.vercel.app/ docs/live`.
**How each row was checked:** clear all filters, tap the listed chips, then read the result count and every restaurant name on screen, and compare both with the [expected-results table](expected-results.md). No row needed a page reload; the list and count changed on each tap.

## First load

| Check | Result |
|---|---|
| Opens with no login, account or gate | Yes. The link loads straight to the restaurant list (HTTP 200, no redirect, no password field). |
| Which build is live | Footer reads **Build: a5531b2**. |
| Shows every sample restaurant | Yes. **40 of 40 restaurants**, 40 cards on screen. ([screenshot](../docs/live/live-first-load.png)) |
| Data source | `data/restaurants.csv`, committed in this repository and read at build time. Nothing is fetched from the web. |
| Type safety | Production build passes with 0 TypeScript errors; the code has no type-check escape hatches. |

## One row per stack

| # | Active filters | Expected count | Live count | Names match the table? | Notes | Screenshot |
|---|---|---|---|---|---|---|
| 1 | Vegetarian + 30 min or less + $ + $$ | 9 | 9 | Yes, all 9 in data order | **Olive & Ember Mezze** (exactly 30 min) is on the list, as the "30 min or less" chip promises. | [live-check-1](../docs/live/live-check-1.png) |
| 2 | Vegetarian + 30 min or less + $ + $$ + 4.0+ | 8 | 8 | Yes, all 8 | **Leafline Salad Co.** and **Olive & Ember Mezze** (exactly 4.0) stay; Mumbai Express Kitchen (3.9) drops out. | [live-check-2](../docs/live/live-check-2.png) |
| 3 | Vegetarian + 30 min or less | 11 | 11 | Yes, all 11 | Row 1 with price dropped: the count went up (9 to 11), never down. | [live-check-3](../docs/live/live-check-3.png) |
| 4 | 20 min or less + $ + 4.5+ | 0 (none) | 0 | Yes, no cards shown | The written message appears instead of a blank space: "No restaurants match 20 min or less, $ and 4.5+ right now." **Clear all** then brings back **all 40**. | [message](../docs/live/live-check-4.png), [after Clear all](../docs/live/live-check-4-after-clear-all.png) |
| Extra | Vegetarian + Gluten-free | 7 | 7 | Yes, all 7 | Both dietary tags must be yes: Slice & Fire Pizza (vegetarian only) is correctly left out. | [live-check-5](../docs/live/live-check-5-two-chips.png) |

**Result:** every stack passed on the live page, with counts and names matching the table, and no Apply button or reload. Open data question still with the data owner: three restaurants are marked vegan but not vegetarian; the filter follows the data as written.
