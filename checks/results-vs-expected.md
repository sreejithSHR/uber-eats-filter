# Filter results vs the expected-results table

Each stack from [`expected-results.md`](expected-results.md) was clicked on the running page (`npm run build && npm start`) in Edge. The count shown is `filteredList.length`, and the number of cards on screen was checked against it. No page reload happened during the clicks.

| # | Chips tapped | Expected (table) | Page showed | Cards on screen | Match | Screenshot |
|---|---|---|---|---|---|---|
| 1 | Vegetarian + 30 min or less + $ + $$ | 9 | 9 | 9 | Yes | [check-1](../docs/check-1.png) |
| 2 | Vegetarian + 30 min or less + $ + $$ + 4.0+ | 8 | 8 | 8 | Yes | [check-2](../docs/check-2.png) |
| 3 | Vegetarian + 30 min or less | 11 | 11 | 11 | Yes | [check-3](../docs/check-3.png) |
| 4 | 20 min or less + $ + 4.5+ | 0 (none) | 0 | 0 | Yes, and the empty state reads "No restaurants match 20 min or less, $ and 4.5+ right now." | [check-4](../docs/check-4.png) |
| Extra | Vegetarian + Gluten-free (two dietary chips) | 7 | 7 | 7 | Yes | [check-5-two-chips](../docs/check-5-two-chips.png) |

**Table fixes made:** the vegan-as-vegetarian rule was removed in the previous stage, so the expected counts are 9, 8 and 11 (not 11, 10 and 13). One row was added below the table for the two-chip case, because none of the four rows forced the "every selected dietary tag must be yes" rule. A bug that keeps places with only one of the two tags would show 22 there instead of 7.
