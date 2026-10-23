import type { DeliveryLimit, DietaryTag, PriceBand, RatingMin } from "./types";

/** Chip options and labels for each group, in the order they appear on the page. */
export const DELIVERY_CHIPS: readonly { value: DeliveryLimit; label: string }[] = [
  { value: 20, label: "20 min or less" },
  { value: 30, label: "30 min or less" },
  { value: 45, label: "45 min or less" },
];
export const PRICE_CHIPS: readonly { value: PriceBand; label: string }[] = [
  { value: "$", label: "$" },
  { value: "$$", label: "$$" },
  { value: "$$$", label: "$$$" },
  { value: "$$$$", label: "$$$$" },
];
export const DIETARY_CHIPS: readonly { value: DietaryTag; label: string }[] = [
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "glutenFree", label: "Gluten-free" },
];
export const RATING_CHIPS: readonly { value: RatingMin; label: string }[] = [
  { value: 4.0, label: "4.0+" },
  { value: 4.5, label: "4.5+" },
];
