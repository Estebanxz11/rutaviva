import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { MapPin, ArrowLeft, Heart, Clock, ExternalLink } from "lucide-react";
import { PlaceActionButtons } from "@/components/place-action-buttons";

export const dynamic = "force-dynamic";

interface PlacePageProps {
  params: Promise<{ slug: string }>;
}

export default async function PlacePage({ params }: PlacePageProps) {
  const { slug } = await params;
  const session = await auth();

  const place = await db.place.findUnique({ where: { slug } });
  if (!place) notFound();

  // Get related places (same category, different slug)
  let relatedPlaces: typeof place[] = [];
  try {
    const related = await db.place.findMany({
      where: { category: place.category, slug: { not: slug } },
      take: 3,
    });
    relatedPlaces = related;
  } catch {
    // ignore
  }

  let userStatus: "wishlist" | "visited" | null = null;
  if (session?.user?.id) {
    const userPlace = await db.userPlace.findUnique({
      where: {
        userId_placeId: { userId: session.user.id, placeId: place.id },
      },
    });
    userStatus = (userPlace?.status as "wishlist" | "visited") ?? null;
  }

  const explorerCount = await db.userPlace.count({ where: { placeId: place.id } });

  return (
    <div className="min-h-[calc(100vh-5rem)]">
      {/* Full-bleed hero — 614px */}
      <div className="relative h-[614px] w-full overflow-hidden">
        <Image
          src={place.imageUrl}
          alt={place.name}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Back button */}
        <div className="absolute top-6 left-6">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 rounded-full text-sm font-semibold transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Explorar
          </Link>
        </div>

        {/* Hero content bottom */}
        <div className="absolute bottom-10 left-8 right-8">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-rv-primary-container text-xs font-black uppercase tracking-widest text-primary mb-4">
            {place.category}
          </span>
          <h1 className="font-heading font-extrabold text-4xl md:text-6xl tracking-tighter text-white mb-3 leading-none">
            {place.name}
          </h1>
          <div className="flex items-center gap-4 text-white/80 text-sm">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-primary" />
              {place.city}, {place.country}
            </span>
          </div>
        </div>
      </div>

      {/* Content — overlaps hero */}
      <div className="-mt-10 relative z-10 px-4 md:px-8 pb-16 grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {/* Left column — 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions card */}
          <div className="rounded-[1.5rem] bg-card shadow-xl p-6">
            <p className="text-xs font-black uppercase tracking-widest text-rv-secondary-accent mb-4">
              Estado de Aventura
            </p>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex -space-x-2">
                {["A", "B", "C"].map((l, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-primary/20 border-2 border-card flex items-center justify-center text-xs font-bold text-primary">
                    {l}
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-bold text-foreground">{explorerCount}</span> {explorerCount === 1 ? "explorador visitó" : "exploradores visitaron"}
              </p>
            </div>
            <div className="flex gap-3">
              <PlaceActionButtons
                placeId={place.id}
                userStatus={userStatus}
                isLoggedIn={!!session?.user}
              />
            </div>
          </div>

          {/* The Narrative */}
          <div className="rounded-[1.5rem] bg-card shadow-sm p-6">
            <h2 className="font-heading font-extrabold text-2xl tracking-tighter text-foreground mb-4">
              La Historia
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {place.description}
            </p>
          </div>

          {/* Info Bento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl bg-muted h-48 p-5 flex flex-col justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-rv-secondary-accent mb-2">Horario de Atención</p>
                <p className="font-heading font-bold text-foreground">Variable</p>
                <p className="text-muted-foreground text-sm mt-1">Consulta horarios directamente en el lugar antes de visitar.</p>
              </div>
              <div className="flex items-center gap-2 text-primary">
                <Clock className="h-4 w-4" />
                <span className="text-xs font-bold">Verifica disponibilidad</span>
              </div>
            </div>
            <div className="rounded-xl bg-muted h-48 p-5 flex flex-col justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-rv-secondary-accent mb-2">Especialidad del Local</p>
                <p className="font-heading font-bold text-foreground">Experiencia Única</p>
                <p className="text-muted-foreground text-sm mt-1">La experiencia más popular entre los viajeros locales.</p>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                Imperdible ✦
              </span>
            </div>
          </div>
        </div>

        {/* Right sidebar — 1/3 */}
        <div className="space-y-6">
          {/* Map card */}
          <div className="rounded-[1.5rem] bg-card shadow-sm overflow-hidden">
            <div className="relative h-40 bg-muted">
              <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted-foreground/10 flex items-center justify-center">
                <MapPin className="h-10 w-10 text-muted-foreground/30" />
              </div>
              {/* Grayscale overlay */}
              <div className="absolute inset-0 grayscale opacity-50 bg-gradient-to-b from-transparent to-background/20" />
            </div>
            <div className="p-5">
              <p className="font-bold text-foreground text-sm mb-1">{place.name}</p>
              <p className="text-muted-foreground text-xs mb-4">{place.city}, {place.country}</p>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(place.name + " " + place.city)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 w-full justify-center py-2.5 px-4 rounded-lg bg-rv-secondary-accent text-white text-sm font-bold hover:opacity-90 transition-opacity"
              >
                <ExternalLink className="h-4 w-4" />
                Abrir en Mapas
              </a>
            </div>
          </div>

          {/* Explorer Tips */}
          <div className="rounded-[1.5rem] bg-card shadow-sm p-5">
            <p className="text-xs font-black uppercase tracking-widest text-rv-secondary-accent mb-3">Consejos del Explorador</p>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">✦</span>
                Visita en días de semana para evitar multitudes.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">✦</span>
                Lleva efectivo — algunos locales no aceptan tarjeta.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">✦</span>
                La mejor hora: temprano en la mañana para luz perfecta.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* You Might Also Love */}
      {relatedPlaces.length > 0 && (
        <div className="px-4 md:px-8 pb-16 max-w-7xl mx-auto">
          <h2 className="font-heading font-extrabold text-2xl md:text-3xl tracking-tighter text-foreground mb-6">
            También Te Puede Gustar
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedPlaces.map((related) => (
              <Link key={related.id} href={`/places/${related.slug}`} className="group block rounded-xl overflow-hidden bg-card shadow-sm hover:shadow-md transition-shadow">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={related.imageUrl}
                    alt={related.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-rv-secondary-accent mb-1">{related.category}</p>
                  <h3 className="font-heading font-bold text-foreground">{related.name}</h3>
                  <p className="text-muted-foreground text-xs mt-1 line-clamp-2">{related.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
