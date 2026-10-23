import { RestaurantBrowser } from "@/components/RestaurantBrowser";
import { loadRestaurants } from "@/lib/restaurants";

/** Game-day restaurant list with stackable filters over the committed data file. */
export default function Home() {
  const restaurants = loadRestaurants();
  return (
    <main className="min-h-screen bg-neutral-100 px-10 py-8">
      <h1 className="text-2xl font-bold text-neutral-900">Uber Eats · Game-day restaurants</h1>
      <p className="mt-1 text-sm text-neutral-500">Tap chips to stack filters. Every tap updates the list.</p>
      <RestaurantBrowser restaurants={restaurants} />
    </main>
  );
}
