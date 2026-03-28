import { requireAuth } from "@/lib/session";
import { db } from "@/lib/db";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sidebar } from "@/components/sidebar";
import { BADGES, getLevelTitle } from "@/lib/constants";
import { Calendar, Star, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { PlaceWithStatus } from "@/types";

export const dynamic = "force-dynamic";

export default async function MyPlacesPage() {
  const user = await requireAuth();

  const [userPlaces, totalPlaces] = await Promise.all([
    db.userPlace.findMany({
      where: { userId: user.id! },
      include: { place: true },
      orderBy: { updatedAt: "desc" },
    }),
    db.place.count(),
  ]);

  const visited = userPlaces.filter((up) => up.status === "visited");
  const wishlist = userPlaces.filter((up) => up.status === "wishlist");
  const progressPercent = totalPlaces > 0
    ? Math.round((visited.length / totalPlaces) * 100)
    : 0;

  const visitedCount = visited.length;
  const earnedBadges = BADGES.filter((b) => b.condition(visitedCount));
  const level = Math.max(1, Math.floor(visitedCount / 3) + 1);

  const visitedPlaces: PlaceWithStatus[] = visited.map((up) => ({
    ...up.place,
    userStatus: "visited" as const,
  }));

  const wishlistPlaces: PlaceWithStatus[] = wishlist.map((up) => ({
    ...up.place,
    userStatus: "wishlist" as const,
  }));

  return (
    <div className="flex min-h-[calc(100vh-5rem)]">
      <Sidebar userName={user.name} userEmail={user.email} />

      <main className="flex-1 px-8 py-12 overflow-y-auto">
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Diario Personal de Descubrimiento</p>
            <h1 className="font-heading font-extrabold text-4xl md:text-5xl tracking-tighter text-foreground">
              Tu Diario Personal<br />de Descubrimiento
            </h1>
            <p className="text-muted-foreground mt-2">Sigue cada lugar que has conquistado y cada rincón con el que sueñas.</p>
          </div>
          <Link
            href="/planner"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary to-rv-primary-container text-on-primary font-heading font-bold text-sm whitespace-nowrap shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity shrink-0"
          >
            <Sparkles className="h-4 w-4" />
            Generar Itinerario IA
          </Link>
        </div>

        {/* Bento stats + progress */}
        <div className="grid md:grid-cols-12 gap-4 mb-10">
          {/* Explorer Progress — 8 cols */}
          <div className="md:col-span-8 rounded-[1.5rem] bg-rv-surface-low p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-rv-secondary-accent mb-1">Progreso del Explorador</p>
            <p className="font-heading font-extrabold text-4xl tracking-tighter text-foreground mb-1">
              {visited.length} / {totalPlaces} Lugares
            </p>
            <div className="h-4 bg-rv-secondary-container rounded-full overflow-hidden my-4">
              <div
                className="h-full bg-rv-secondary-accent rounded-full shadow-[0_0_10px_rgba(0,96,147,0.3)] transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground italic">
              &quot;Todo viaje comienza con un solo paso — ya has dado {visited.length}.&quot;
            </p>
          </div>

          {/* Stats & Achievements — 4 cols */}
          <div className="md:col-span-4 rounded-[1.5rem] bg-rv-primary-container/20 p-6 flex flex-col">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-4">Estadísticas y Logros</p>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="font-heading font-black text-primary text-sm">Lv{level}</span>
              </div>
              <div>
                <p className="font-bold text-sm text-foreground">{getLevelTitle(level)}</p>
                <p className="text-xs text-muted-foreground">{visitedCount * 25} XP ganados</p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {BADGES.slice(0, 8).map((badge) => {
                const earned = badge.condition(visitedCount);
                return (
                  <div
                    key={badge.id}
                    title={earned ? badge.name : `Bloqueado — ${badge.description}`}
                    className={`w-10 h-10 rounded-full bg-rv-surface-low flex items-center justify-center text-lg transition-all ${
                      earned ? "" : "grayscale opacity-25"
                    }`}
                  >
                    {badge.icon}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Logros del Explorador */}
        <div className="mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Logros del Explorador</p>
          <h2 className="font-heading font-extrabold text-2xl tracking-tighter text-foreground mb-6">Tus Medallas de Viaje</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {BADGES.map((badge) => {
              const earned = badge.condition(visitedCount);
              return (
                <div
                  key={badge.id}
                  className={`rounded-2xl p-4 flex flex-col items-center gap-2 text-center border transition-all ${
                    earned
                      ? "bg-rv-primary-container/20 border-primary/40"
                      : "bg-rv-surface-low border-transparent opacity-50 grayscale"
                  }`}
                >
                  <span className="text-3xl">{badge.icon}</span>
                  <p className="font-heading font-bold text-xs text-foreground leading-tight">{badge.name}</p>
                  <p className="text-[10px] text-muted-foreground leading-tight">{badge.description}</p>
                  {earned && (
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-black">
                      ✓ Obtenido
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="visited">
          <TabsList className="mb-8 bg-rv-surface-low rounded-2xl p-1.5 h-auto gap-1 w-fit">
            <TabsTrigger
              value="visited"
              className="rounded-xl px-5 py-2.5 text-sm font-heading font-bold text-muted-foreground data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all gap-2"
            >
              Visitados
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-black">
                {visited.length}
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="wishlist"
              className="rounded-xl px-5 py-2.5 text-sm font-heading font-bold text-muted-foreground data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all gap-2"
            >
              Lista de Deseos
              <span className="px-2 py-0.5 rounded-full bg-rv-secondary-accent/10 text-rv-secondary-accent text-xs font-black">
                {wishlist.length}
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="visited">
            {visitedPlaces.length === 0 ? (
              <p className="text-muted-foreground text-center py-12">
                Aún no has marcado ningún lugar como visitado.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {visitedPlaces.map((place) => (
                  <JournalCard key={place.id} place={place} status="visited" />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="wishlist">
            {wishlistPlaces.length === 0 ? (
              <p className="text-muted-foreground text-center py-12">
                No tienes lugares guardados aún.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistPlaces.map((place) => (
                  <JournalCard key={place.id} place={place} status="wishlist" />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function JournalCard({ place, status }: { place: PlaceWithStatus; status: "visited" | "wishlist" }) {
  return (
    <Link href={`/places/${place.slug}`} className="group rounded-xl overflow-hidden bg-card shadow-sm hover:shadow-md transition-shadow cursor-pointer block">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={place.imageUrl}
          alt={place.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        {/* Status badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase bg-white/90 backdrop-blur-sm ${
            status === "visited" ? "text-primary" : "text-rv-secondary-accent"
          }`}>
            {status === "visited" ? "VISITADO" : "DESEADO"}
          </span>
        </div>
        {/* Place name overlay */}
        <div className="absolute bottom-0 p-4 w-full">
          <p className="text-white/70 text-[10px] font-bold uppercase tracking-wider">{place.country}</p>
          <h3 className="font-heading font-bold text-white text-lg leading-tight">{place.name}</h3>
        </div>
      </div>
      {/* Footer */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
          <Calendar className="h-3.5 w-3.5" />
          <span>{place.city}</span>
        </div>
        <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
          <Star className="h-3.5 w-3.5 fill-amber-500" />
          <span>4.8</span>
        </div>
      </div>
    </Link>
  );
}

