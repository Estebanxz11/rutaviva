import { auth } from "@/lib/auth";
import { PlannerClient } from "@/components/planner-client";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function PlannerPage() {
  const session = await auth();

  let previousPlans: { id: string; city: string; days: number; budget: string; generatedPlan: string }[] = [];
  try {
    if (session?.user?.id) {
      previousPlans = await db.tripPlan.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        take: 3,
        select: { id: true, city: true, days: true, budget: true, generatedPlan: true },
      });
    }
  } catch {
    // DB not available
  }

  return (
    <div className="pt-8 pb-24 px-4 md:px-8 max-w-7xl mx-auto">
      <section className="mb-12">
        <h1 className="font-heading text-5xl md:text-7xl font-extrabold tracking-tight text-foreground mb-4 leading-none">
          Planifica Tu <span className="text-primary italic">Próxima Aventura.</span>
        </h1>
        <p className="text-muted-foreground max-w-xl text-lg">
          Ingresa tus preferencias y deja que nuestra IA genere un itinerario personalizado que encaje con tu energía viajera.
        </p>
      </section>

      <PlannerClient isLoggedIn={!!session?.user} previousPlans={previousPlans} />
    </div>
  );
}

