import { RestaurantCard } from "@/components/RestaurantCard";
import { loadRestaurants } from "@/lib/restaurants";

/** Game-day restaurant list: all 40 cards from the committed data file. */
export default function Home() {
  const restaurants = loadRestaurants();
  return (
    <main className="min-h-screen bg-neutral-100 px-10 py-8">
      <h1 className="text-2xl font-bold text-neutral-900">Uber Eats · Game-day restaurants</h1>
      <p className="mt-1 text-sm text-neutral-500">{restaurants.length} of {restaurants.length} restaurants</p>
      <section className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {restaurants.map((r) => (
          <RestaurantCard key={r.id} restaurant={r} />
        ))}
      </section>
    </main>
  );
}
