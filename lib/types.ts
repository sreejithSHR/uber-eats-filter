/** Price band shown to diners; mapped from price_tier 1-4 in the data file. */
export type PriceBand = "$" | "$$" | "$$$" | "$$$$";

/** Dietary tags a diner can filter on. */
export type DietaryTag = "vegetarian" | "vegan" | "glutenFree";

/** Delivery-time chips, in minutes, labelled "20/30/45 min or less". A restaurant passes when delivery_time_min <= the limit, so exactly 30 passes the 30 chip. */
export type DeliveryLimit = 20 | 30 | 45;

/** Rating chips. A restaurant passes when rating >= the minimum. */
export type RatingMin = 4.0 | 4.5;

/** One row of the Uber Eats Game-Day Restaurant Set, with typed fields. */
export interface Restaurant {
  id: number;
  name: string;
  cuisine: string;
  deliveryTimeMin: number;
  priceBand: PriceBand;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  rating: number;
}

/** The diner's filter choices. Each group is null when nothing is picked in it. */
export interface FilterState {
  delivery: DeliveryLimit | null;
  price: PriceBand[] | null;
  dietary: DietaryTag[] | null;
  rating: RatingMin | null;
}

/** Starting state: nothing selected in every group. */
export const EMPTY_FILTERS: FilterState = { delivery: null, price: null, dietary: null, rating: null };
