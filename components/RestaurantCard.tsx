import type { Restaurant } from "@/lib/types";

/** Dietary tags shown only where the data says yes. */
function dietaryTags(r: Restaurant): string[] {
  const tags: string[] = [];
  if (r.isVegetarian) tags.push("Vegetarian");
  if (r.isVegan) tags.push("Vegan");
  if (r.isGlutenFree) tags.push("Gluten-free");
  return tags;
}

/** One restaurant card, as in the wireframe: no id on the card. */
export function RestaurantCard({ restaurant: r }: { restaurant: Restaurant }) {
  return (
    <article className="rounded-xl border border-neutral-200 bg-white p-4">
      <h2 className="text-[15px] font-bold text-neutral-900">{r.name}</h2>
      <p className="text-[13px] text-neutral-500">{r.cuisine}</p>
      <p className="mt-2 text-[13px] font-semibold text-neutral-900">
        {r.deliveryTimeMin} min · {r.priceBand} · ★ {r.rating.toFixed(1)}
      </p>
      <ul className="mt-3 flex flex-wrap gap-1.5">
        {dietaryTags(r).map((tag) => (
          <li key={tag} className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11.5px] font-semibold text-emerald-700">
            {tag}
          </li>
        ))}
      </ul>
    </article>
  );
}
