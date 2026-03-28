import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { ExploreSearch } from "@/components/explore-search";
import { Sidebar } from "@/components/sidebar";
import { PLACE_CATEGORIES } from "@/lib/constants";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Heart, Plus } from "lucide-react";
import type { PlaceWithStatus } from "@/types";

export const dynamic = "force-dynamic";

interface ExplorePageProps {
  searchParams: Promise<{ category?: string; q?: string }>;
}

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const { category, q } = await searchParams;
  const session = await auth();

  let places: Awaited<ReturnType<typeof db.place.findMany>> = [];
  let userPlaceMap: Record<string, "wishlist" | "visited"> = {};
  let totalPlaces = 0;

  try {
    const [filtered, total] = await Promise.all([
      db.place.findMany({
        where: {
          ...(category ? { category } : {}),
          ...(q ? { name: { contains: q, mode: "insensitive" } } : {}),
        },
        orderBy: { featured: "desc" },
      }),
      db.place.count(),
    ]);
    places = filtered;
    totalPlaces = total;

    if (session?.user?.id) {
      const userPlaces = await db.userPlace.findMany({
        where: { userId: session.user.id },
      });
      userPlaceMap = Object.fromEntries(
        userPlaces.map((up) => [up.placeId, up.status as "wishlist" | "visited"])
      );
    }
  } catch {
    // DB not available — show empty state
  }

  const placesWithStatus: PlaceWithStatus[] = places.map((p) => ({
    ...p,
    userStatus: userPlaceMap[p.id] ?? null,
  }));

  // Split places into bento slots
  const [featured, tall, ...rest] = placesWithStatus;
  const grid3 = rest.slice(0, 3);
  const remaining = rest.slice(3);

  const exploredCount = Object.values(userPlaceMap).filter(s => s === "visited").length;
  const progressPercent = totalPlaces > 0 ? Math.round((exploredCount / totalPlaces) * 100) : 0;

  return (
    <div className="flex min-h-[calc(100vh-5rem)]">
      <Sidebar userName={session?.user?.name} userEmail={session?.user?.email} />

      <main className="flex-1 px-8 py-12 overflow-y-auto max-w-6xl mx-auto w-full">
        {/* Header & Progress */}
        <header className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <span className="text-rv-secondary-accent font-bold text-xs uppercase tracking-[0.2em]">
                Diario de Descubrimiento
              </span>
              <h1 className="font-heading font-extrabold text-5xl md:text-6xl text-foreground tracking-tighter leading-none">
                Encuentra tu próximo <br />
                <span className="text-primary italic">lugar increíble.</span>
              </h1>
            </div>
            <div className="w-full md:w-64 space-y-2 shrink-0">
              <div className="flex justify-between text-xs font-bold text-muted-foreground">
                <span>PROGRESO DE EXPLORACIÓN</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="h-2 w-full bg-rv-secondary-container rounded-full overflow-hidden">
                <div
                  className="h-full bg-rv-secondary-accent rounded-full shadow-[0_0_10px_rgba(0,96,147,0.3)]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Search & Filters */}
        <section className="mb-12 space-y-8">
          <ExploreSearch />

          <div className="flex items-center gap-3 overflow-x-auto pb-2 hide-scrollbar">
            <Link href="/explore">
              <span className={cn(
                "inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold whitespace-nowrap cursor-pointer transition-colors text-sm",
                !category
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "bg-rv-surface-low text-foreground hover:bg-muted"
              )}>
                Todos
              </span>
            </Link>
            {PLACE_CATEGORIES.map((cat) => (
              <Link key={cat} href={`/explore?category=${encodeURIComponent(cat)}`}>
                <span className={cn(
                  "inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold whitespace-nowrap cursor-pointer transition-colors text-sm",
                  category === cat
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "bg-rv-surface-low text-foreground hover:bg-muted"
                )}>
                  {cat}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Bento Discovery Grid */}
        {placesWithStatus.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            No se encontraron lugares para esta categoría.
          </div>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Large Featured Card — col 8 */}
            {featured && (
              <Link href={`/places/${featured.slug}`} className="md:col-span-8 group relative aspect-[16/10] rounded-xl overflow-hidden bg-muted cursor-pointer block">
                <Image
                  src={featured.imageUrl}
                  alt={featured.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 66vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 p-8 w-full flex justify-between items-end">
                  <div className="space-y-1">
                    <span className="px-3 py-1 bg-primary/20 backdrop-blur-md text-rv-primary-container text-[10px] font-bold uppercase rounded-full border border-primary/30">
                      Elección del Editor
                    </span>
                    <h3 className="text-3xl font-heading font-bold text-white tracking-tight">{featured.name}</h3>
                    <p className="text-white/70 text-sm">{featured.city}, {featured.country}</p>
                  </div>
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-white rounded-full text-black text-sm font-bold hover:bg-primary hover:text-white transition-all active:scale-95 shadow-xl">
                    <Heart className="h-4 w-4" />
                    Guardar
                  </button>
                </div>
              </Link>
            )}

            {/* Tall Card — col 4 */}
            {tall && (
              <Link href={`/places/${tall.slug}`} className="md:col-span-4 group relative rounded-xl overflow-hidden bg-muted cursor-pointer block min-h-[300px]">
                <Image
                  src={tall.imageUrl}
                  alt={tall.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 p-6 w-full">
                  <h3 className="text-xl font-heading font-bold text-white mb-4">{tall.name}</h3>
                  <button className="w-full py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-xs font-bold hover:bg-white hover:text-black transition-all">
                    Guardar
                  </button>
                </div>
              </Link>
            )}

            {/* 3× Square Cards — col 4 each */}
            {grid3.map((place) => (
              <Link key={place.id} href={`/places/${place.slug}`} className="md:col-span-4 group relative aspect-square rounded-xl overflow-hidden bg-muted cursor-pointer block">
                <Image
                  src={place.imageUrl}
                  alt={place.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 p-6 w-full flex justify-between items-center">
                  <h3 className="font-heading font-bold text-white">{place.name}</h3>
                  <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </Link>
            ))}

            {/* Remaining places — 3-col standard grid */}
            {remaining.length > 0 && (
              <div className="md:col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {remaining.map((place) => (
                  <Link key={place.id} href={`/places/${place.slug}`} className="group relative aspect-square rounded-xl overflow-hidden bg-muted cursor-pointer block">
                    <Image
                      src={place.imageUrl}
                      alt={place.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-0 p-5 w-full flex justify-between items-center">
                      <h3 className="font-heading font-bold text-white">{place.name}</h3>
                      <button className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

