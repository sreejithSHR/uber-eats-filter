"use client";

import { useMemo, useState } from "react";
import { DELIVERY_CHIPS, DIETARY_CHIPS, PRICE_CHIPS, RATING_CHIPS } from "@/lib/chips";
import { filterRestaurants } from "@/lib/filter";
import { EMPTY_FILTERS, toGroup, type FilterState, type NonEmptyList, type Restaurant } from "@/lib/types";
import { RestaurantCard } from "./RestaurantCard";

/** Add or remove one chip value; removing the last chip returns null (untouched). */
function toggle<T>(group: NonEmptyList<T> | null, value: T): NonEmptyList<T> | null {
  const current: T[] = group ?? [];
  return toGroup(current.includes(value) ? current.filter((v) => v !== value) : [...current, value]);
}

/** Join labels as "a", "a and b", or "a, b and c". */
function joinLabels(labels: string[]): string {
  return labels.length < 2 ? labels.join("") : `${labels.slice(0, -1).join(", ")} and ${labels[labels.length - 1]}`;
}

/** Labels of every active chip, in group order, for the empty-state sentence. */
function activeLabels(f: FilterState): string[] {
  const pick = <T,>(chips: readonly { value: T; label: string }[], group: NonEmptyList<T> | null) =>
    chips.filter((c) => group?.includes(c.value)).map((c) => c.label);
  return [
    ...pick(DIETARY_CHIPS, f.dietary),
    ...pick(DELIVERY_CHIPS, f.delivery),
    ...pick(PRICE_CHIPS, f.price),
    ...pick(RATING_CHIPS, f.rating),
  ];
}

/** One labelled row of pill chips; every tap updates the list immediately (no Apply button). */
function ChipGroup<T>(props: {
  title: string;
  chips: readonly { value: T; label: string }[];
  selected: NonEmptyList<T> | null;
  onToggle: (value: T) => void;
}) {
  return (
    <fieldset className="rounded-xl border border-neutral-200 bg-white p-4">
      <legend className="sr-only">{props.title}</legend>
      <p className="text-xs font-bold tracking-wide text-neutral-500">{props.title.toUpperCase()}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {props.chips.map((c) => {
          const on = props.selected?.includes(c.value) ?? false;
          return (
            <button
              key={c.label}
              type="button"
              aria-pressed={on}
              onClick={() => props.onToggle(c.value)}
              className={`rounded-full border px-3.5 py-1.5 text-[13px] font-semibold ${
                on ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-300 bg-white text-neutral-900 hover:border-neutral-500"
              }`}
            >
              {c.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

/** The stackable filter bar, live count, cards and empty state. */
export function RestaurantBrowser({ restaurants }: { restaurants: Restaurant[] }) {
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);
  const visible = useMemo(() => filterRestaurants(restaurants, filters), [restaurants, filters]);
  const labels = activeLabels(filters);

  return (
    <>
      <section className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <ChipGroup title="Dietary" chips={DIETARY_CHIPS} selected={filters.dietary}
          onToggle={(v) => setFilters((f) => ({ ...f, dietary: toggle(f.dietary, v) }))} />
        <ChipGroup title="Delivery time" chips={DELIVERY_CHIPS} selected={filters.delivery}
          onToggle={(v) => setFilters((f) => ({ ...f, delivery: toggle(f.delivery, v) }))} />
        <ChipGroup title="Price" chips={PRICE_CHIPS} selected={filters.price}
          onToggle={(v) => setFilters((f) => ({ ...f, price: toggle(f.price, v) }))} />
        <ChipGroup title="Rating" chips={RATING_CHIPS} selected={filters.rating}
          onToggle={(v) => setFilters((f) => ({ ...f, rating: toggle(f.rating, v) }))} />
      </section>

      <div className="mt-6 flex items-center gap-4">
        <p className="text-xl font-bold text-neutral-900" data-testid="count">
          {visible.length} of {restaurants.length} restaurants
        </p>
        {labels.length > 0 && (
          <button type="button" onClick={() => setFilters(EMPTY_FILTERS)}
            className="rounded-full border border-neutral-300 bg-white px-4 py-1.5 text-[13px] font-semibold">
            Clear all
          </button>
        )}
      </div>

      {visible.length === 0 ? (
        <div className="mt-4 max-w-md rounded-xl border border-dashed border-neutral-900 bg-white p-6" data-testid="empty">
          <p className="text-[15px] font-medium text-neutral-900">
            No restaurants match {joinLabels(labels)} right now. Try turning one filter off to see more places.
          </p>
          <button type="button" onClick={() => setFilters(EMPTY_FILTERS)}
            className="mt-4 rounded-full bg-neutral-900 px-5 py-2 text-sm font-bold text-white">
            Clear all
          </button>
        </div>
      ) : (
        <section className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((r) => <RestaurantCard key={r.id} restaurant={r} />)}
        </section>
      )}
    </>
  );
}
