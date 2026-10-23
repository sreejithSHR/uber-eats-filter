import type { DietaryTag, FilterState, Restaurant } from "./types";

/** Whether a restaurant has a dietary tag, read straight from its data column. */
function hasTag(r: Restaurant, tag: DietaryTag): boolean {
  if (tag === "vegetarian") return r.isVegetarian;
  if (tag === "vegan") return r.isVegan;
  return r.isGlutenFree;
}

/**
 * Pure filter: returns a new list of the restaurants that pass every active group, in data order.
 * Never edits the input. A null group is untouched and lets everything through.
 * Groups AND together; price, delivery and rating chips OR within their group; dietary chips all must be yes.
 */
export function filterRestaurants(restaurants: readonly Restaurant[], filters: FilterState): Restaurant[] {
  const { delivery, price, dietary, rating } = filters;
  const maxMinutes = delivery === null ? null : Math.max(...delivery);
  const minRating = rating === null ? null : Math.min(...rating);
  return restaurants.filter(
    (r) =>
      (maxMinutes === null || r.deliveryTimeMin <= maxMinutes) &&
      (price === null || price.includes(r.priceBand)) &&
      (dietary === null || dietary.every((tag) => hasTag(r, tag))) &&
      (minRating === null || r.rating >= minRating),
  );
}
