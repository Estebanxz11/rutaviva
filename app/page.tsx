import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Compass, TrendingUp, Users } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { PlaceCard } from "@/components/place-card";
import { FadeIn } from "@/components/ui/fade-in";
import { db } from "@/lib/db";
import { PLACE_CATEGORIES } from "@/lib/constants";

export const dynamic = "force-dynamic";

async function getFeaturedPlaces() {
  try {
    return await db.place.findMany({
      where: { featured: true },
      take: 6,
    });
  } catch {
    return [];
  }
}

export default async function Home() {
  const featuredPlaces = await getFeaturedPlaces();

  return (
    <div className="flex flex-col">

      {/* ─── Hero ─── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden px-8 bg-background">
        {/* Blobs */}
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-rv-secondary-container/25 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-[400px] h-[400px] rounded-full bg-rv-primary-container/20 blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-20">
          {/* Text col — 7 */}
          <div className="lg:col-span-7 z-10">
            <FadeIn delay={0} y={10}>
              <span className="inline-block py-1 px-4 bg-rv-secondary-container text-[#004b74] dark:bg-rv-secondary-container/30 dark:text-rv-secondary-accent rounded-full text-xs font-bold tracking-widest uppercase mb-6">
                Redefiniendo el descubrimiento urbano
              </span>
            </FadeIn>
            <FadeIn delay={0.12} y={32}>
              <h1 className="font-heading text-6xl md:text-8xl font-extrabold tracking-tighter text-foreground leading-[0.9] mb-8">
                El mundo es tuyo.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-rv-primary-container">
                  Empieza a vivirlo.
                </span>
              </h1>
            </FadeIn>
            <FadeIn delay={0.22} y={20}>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl mb-10 leading-relaxed">
                De Cartagena a Tokio, de Medellín a París — planifica itinerarios únicos con IA, guarda los rincones que te roban el corazón y convierte cada viaje en una historia que vale la pena contar.
              </p>
            </FadeIn>
            <FadeIn delay={0.32} y={16}>
              <div className="flex flex-col sm:flex-row gap-4">
                <ButtonLink
                  href="/explore"
                  variant="ghost"
                  size="lg"
                  className="group px-8 py-4 bg-gradient-to-r from-primary to-rv-primary-container text-rv-on-primary-fixed font-bold rounded-full text-lg flex items-center justify-center gap-2 transition-all hover:shadow-[0_0_30px_rgba(46,204,113,0.35)] active:scale-95"
                >
                  Empieza a explorar
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </ButtonLink>
                <ButtonLink
                  href="/planner"
                  variant="ghost"
                  size="lg"
                  className="px-8 py-4 bg-muted text-foreground font-bold rounded-full text-lg hover:bg-accent transition-all active:scale-95"
                >
                  Cómo funciona
                </ButtonLink>
              </div>
            </FadeIn>
          </div>

          {/* Visual col — 5 */}
          <FadeIn className="lg:col-span-5 relative" delay={0.2} x={30} y={0}>
            <div className="relative w-full aspect-square md:aspect-[4/5] rounded-[3rem] overflow-hidden rotate-2 hover:rotate-0 transition-transform duration-700 shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80"
                alt="Explorador urbano en Medellín"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              <div className="absolute bottom-6 left-6 right-6 p-5 backdrop-blur-xl bg-white/20 rounded-2xl border border-white/30">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-rv-primary-container rounded-full flex items-center justify-center shrink-0">
                    <Sparkles className="h-5 w-5 text-rv-on-primary-fixed" />
                  </div>
                  <div>
                    <p className="text-xs text-white/80 font-bold uppercase tracking-wider">Top Logro</p>
                    <p className="text-base text-white font-bold">Leyenda Urbana · Nivel 12</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-rv-secondary-container/30 blur-3xl rounded-full pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-rv-primary-container/20 blur-3xl rounded-full pointer-events-none" />
          </FadeIn>
        </div>
      </section>

      {/* ─── Featured places ─── */}
      <section className="py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-10">
            {PLACE_CATEGORIES.map((cat) => (
              <Link key={cat} href={`/explore?category=${encodeURIComponent(cat)}`}>
                <span className="inline-flex items-center rounded-full border border-border px-4 py-1.5 text-sm font-medium hover:bg-rv-primary-container/20 hover:border-primary hover:text-primary transition-colors cursor-pointer">
                  {cat}
                </span>
              </Link>
            ))}
          </div>
          <FadeIn y={20} delay={0}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Destacados</p>
              <h2 className="font-heading font-extrabold text-3xl md:text-4xl tracking-tight text-foreground">Lugares que no te puedes perder</h2>
            </div>
            <ButtonLink href="/explore" variant="outline" className="gap-2 rounded-full hidden sm:flex">
              Ver todos <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </div>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredPlaces.map((place, i) => (
              <FadeIn key={place.id} delay={i * 0.08} y={32}>
                <PlaceCard place={place} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features bento ─── */}
      <section className="py-24 px-8 bg-muted">
        <div className="max-w-7xl mx-auto">
          <FadeIn y={24} delay={0}>
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="font-heading text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">Las herramientas del explorador</h2>
              <p className="text-muted-foreground text-lg max-w-md">Todo lo que necesitas para convertir un simple paseo en una expedición legendaria.</p>
            </div>
            <div className="h-1 w-24 bg-primary rounded-full mb-4 shrink-0" />
          </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Card 1 — Explore: col-8, image + text side by side */}
            <FadeIn className="md:col-span-8" delay={0.05}>
            <div className="group bg-card rounded-xl p-8 flex flex-col md:flex-row gap-8 items-center transition-all hover:-translate-y-1 shadow-sm h-full">
              <div className="flex-1 order-2 md:order-1">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <Compass className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-heading text-2xl font-bold mb-4">Explora lugares con propósito</h3>
                <p className="text-muted-foreground leading-relaxed">Descubre sitios especiales: desde arte urbano oculto hasta los mejores cafés con vista. Nuestro mapa garantiza que nunca pierdas el alma de Medellín.</p>
              </div>
              <div className="relative w-full md:w-1/2 aspect-video rounded-xl overflow-hidden order-1 md:order-2">
                <Image
                  src="https://images.unsplash.com/photo-1548094990-c16ca90f1f0d?w=600&q=80"
                  alt="Explorar mapa de Medellín"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 30vw"
                />
              </div>
            </div>
            </FadeIn>

            {/* Card 2 — Track: col-4, primary green */}
            <FadeIn className="md:col-span-4" delay={0.15}>
            <div className="bg-primary text-primary-foreground rounded-xl p-8 flex flex-col justify-between transition-all hover:-translate-y-1 shadow-xl shadow-primary/10 h-full">
              <div>
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-6">
                  <TrendingUp className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="font-heading text-2xl font-bold mb-4">Sigue tu camino</h3>
                <p className="text-primary-foreground/90 leading-relaxed">Visualiza tu progreso. Marca lugares como visitados, mantén una lista de deseos y gana insignias mientras conquistas nuevos barrios.</p>
              </div>
              <div className="mt-8">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Exploración de la ciudad</span>
                  <span className="text-2xl font-black">74%</span>
                </div>
                <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white w-[74%] rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                </div>
              </div>
            </div>
            </FadeIn>

            {/* Card 3 — AI Itineraries: col-4, secondary-container blue */}
            <FadeIn className="md:col-span-4" delay={0.1}>
            <div className="bg-rv-secondary-container dark:bg-rv-secondary-container text-[#004b74] dark:text-rv-secondary-accent rounded-xl p-8 transition-all hover:-translate-y-1 h-full">
              <div className="w-12 h-12 rounded-xl bg-white/40 dark:bg-rv-secondary-accent/20 flex items-center justify-center mb-6">
                <Sparkles className="h-7 w-7 text-rv-secondary-accent dark:text-rv-secondary-accent" />
              </div>
              <h3 className="font-heading text-2xl font-bold mb-4">Itinerarios con IA</h3>
              <p className="leading-relaxed mb-6 opacity-85">Dinos tu estado de ánimo y nuestra IA crea una ruta única por la ciudad, equilibrando los iconos populares con las joyas más tranquilas.</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-white/50 dark:bg-rv-secondary-accent/20 rounded-full text-xs font-bold">Artístico</span>
                <span className="px-3 py-1 bg-white/50 dark:bg-rv-secondary-accent/20 rounded-full text-xs font-bold">Gastronómico</span>
                <span className="px-3 py-1 bg-white/50 dark:bg-rv-secondary-accent/20 rounded-full text-xs font-bold">Relajado</span>
              </div>
            </div>
            </FadeIn>

            {/* Card 4 — Social proof: col-8 */}
            <FadeIn className="md:col-span-8" delay={0.2}>
            <div className="bg-card rounded-xl p-8 flex flex-col md:flex-row gap-8 items-center transition-all hover:-translate-y-1 shadow-sm h-full">
              <div className="flex -space-x-4 shrink-0">
                {[
                  { bg: "#006a35" },
                  { bg: "#006093" },
                  { bg: "#004a23" },
                ].map(({ bg }, i) => (
                  <div
                    key={i}
                    style={{ backgroundColor: bg }}
                    className="w-14 h-14 rounded-full border-4 border-card flex items-center justify-center"
                  >
                    <Users className="h-5 w-5 text-white/70" />
                  </div>
                ))}
                <div className="w-14 h-14 rounded-full border-4 border-card bg-rv-primary-container flex items-center justify-center text-rv-on-primary-fixed font-bold text-xs">
                  +2k
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-heading text-3xl font-extrabold tracking-tight mb-2">Eleva tu experiencia de viaje.</h3>
                <p className="text-muted-foreground italic">"RutaViva convirtió mi fin de semana en Medellín en una aventura. Encontré rincones que ni los locales conocen."</p>
                <p className="text-sm font-bold text-primary mt-4">— María, exploradora desde 2024</p>
              </div>
            </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── Dark CTA ─── */}
      <section className="py-24 px-8 overflow-hidden">
        <div className="max-w-5xl mx-auto bg-foreground rounded-[2.5rem] p-12 md:p-20 relative overflow-hidden text-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-rv-secondary-accent/20 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none" />
          <FadeIn className="relative z-10" y={40}>
            <h2 className="font-heading text-4xl md:text-6xl font-black text-background tracking-tighter mb-8 leading-tight">
              ¿Listo para escribir tu próximo capítulo?
            </h2>
            <p className="text-background/70 text-lg md:text-xl max-w-2xl mx-auto mb-12">
              Únete a miles de viajeros mapeando las ciudades más vibrantes. Empieza gratis hoy y domina la ciudad.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ButtonLink
                href="/explore"
                variant="ghost"
                size="lg"
                className="px-10 py-5 bg-primary text-primary-foreground font-bold rounded-full text-xl hover:shadow-[0_0_40px_rgba(46,204,113,0.4)] transition-all active:scale-95"
              >
                Empieza a explorar ahora
              </ButtonLink>
              <ButtonLink
                href="/planner"
                variant="ghost"
                size="lg"
                className="px-10 py-5 bg-transparent border-2 border-background/30 text-background font-bold rounded-full text-xl hover:bg-background/10 transition-all active:scale-95"
              >
                Ver el Planificador IA
              </ButtonLink>
            </div>
          </FadeIn>
        </div>
      </section>

    </div>
  );
}

