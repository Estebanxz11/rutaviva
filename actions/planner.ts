"use server";

import { db } from "@/lib/db";
import { requireAuth } from "@/lib/session";
import OpenAI from "openai";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const plannerSchema = z.object({
  city: z.string().min(2),
  days: z.coerce.number().min(1).max(14),
  budget: z.string().min(1),
  interests: z.string().min(2),
});

export async function generateTripPlan(formData: FormData) {
  const user = await requireAuth();

  const parsed = plannerSchema.safeParse({
    city: formData.get("city"),
    days: formData.get("days"),
    budget: formData.get("budget"),
    interests: formData.get("interests"),
  });

  if (!parsed.success) {
    return { error: "Datos del formulario inválidos" };
  }

  const { city, days, budget, interests } = parsed.data;

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return { error: "Servicio de IA no configurado" };
  }

  const openai = new OpenAI({
    apiKey,
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
      "X-Title": "RutaViva",
    },
  });

  const prompt = `Eres un experto guía de viajes local. Crea un itinerario MUY DETALLADO y práctico para:
- Ciudad: ${city}
- Días: ${days}
- Presupuesto: ${budget}
- Intereses: ${interests}

REGLAS DE CONTENIDO (obligatorio en cada actividad):
- Nombres REALES y específicos de lugares (restaurantes, museos, parques, barrios, mercados)
- Cómo llegar: transporte público, Uber/taxi, o a pie
- Horario de apertura o hora recomendada de visita
- Precio o rango de costos estimado en moneda local
- Un consejo práctico (tip local) relevante

REGLAS DE FORMATO (sigue EXACTAMENTE, sin excepciones):
- Empieza DIRECTO con "## Día 1" — sin introducción ni texto previo
- Cada día: "## Día 1", "## Día 2", etc.
- Subsecciones fijas dentro de cada día: "### Mañana", "### Tarde", "### Noche"
- Cada actividad en este formato exacto: "- **HH:MM · Nombre del Lugar** — descripción, cómo llegar, precio, tip."
- Responde SOLO en español

Ejemplo del formato esperado:
## Día 1

### Mañana
- **09:00 · Parque Arví** — Senderismo entre cascadas y biodiversidad. Acceso: Metro línea A → Acevedo → Metrocable L "Parque Arví". Horario: 9AM–5PM. Precio: ~$5.000 COP. Tip: lleva agua y chaqueta, el clima es fresco.
- **11:30 · El Portal de los Sabores** — Almuerzo con productos del mercado local al aire libre dentro del parque. Precio: $15.000–$25.000 COP. Tip: prueba las arepas de chócolo.

### Tarde
- **14:00 · Comuna 13** — Tour guiado por el arte urbano y las escaleras eléctricas. Acceso: Metro línea A → Estadio → Uber o bus. Precio: $25.000–$35.000 COP. Tip: reserva con antelación.

### Noche
- **19:30 · El Poblado** — Cena y ambiente nocturno. Acceso: Uber o Metro → El Poblado. Precio: $20.000–$50.000 COP. Tip: el Parque del Periodista es más local y auténtico.

## Día 2
...`;

  let generatedPlan: string;
  try {
    const completion = await openai.chat.completions.create({
      model: "openrouter/free",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 4000,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      console.error("[planner] Empty response from AI:", JSON.stringify(completion));
      return { error: "El servicio de IA no devolvió respuesta. Intenta de nuevo." };
    }
    generatedPlan = content;
  } catch (err) {
    console.error("[planner] AI call failed:", err);
    return { error: "Error al conectar con el servicio de IA. Intenta de nuevo." };
  }

  try {
    const tripPlan = await db.tripPlan.create({
      data: {
        userId: user.id!,
        city,
        days,
        budget,
        interests,
        generatedPlan,
      },
    });

    revalidatePath("/planner");

    // Fire-and-forget: discover places for this city in background (disabled to save tokens)
    // void autoDiscoverPlaces(city, openai);

    return { success: true, plan: generatedPlan, city, tripPlanId: tripPlan.id };
  } catch (err) {
    console.error("[planner] DB save failed:", err);
    // Plan was generated — return it even if saving failed
    // void autoDiscoverPlaces(city, openai);
    return { success: true, plan: generatedPlan, city, tripPlanId: "" };
  }
}

export async function savePlan(data: {
  city: string;
  days: number;
  budget: string;
  interests: string;
  generatedPlan: string;
}) {
  const user = await requireAuth();
  try {
    await db.tripPlan.create({
      data: {
        userId: user.id!,
        city: data.city,
        days: data.days,
        budget: data.budget,
        interests: data.interests,
        generatedPlan: data.generatedPlan,
      },
    });
    revalidatePath("/planner");
  } catch (err) {
    console.error("[savePlan] DB save failed:", err);
  }
}

const CATEGORY_IMAGES: Record<string, string> = {
  Naturaleza: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80",
  Cultura: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800&q=80",
  Arte: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  Historia: "https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=800&q=80",
  Gastronomía: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
  Aventura: "https://images.unsplash.com/photo-1598459030786-5fa0b457c2ef?w=800&q=80",
  Religioso: "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80",
  Entretenimiento: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80",
};

const VALID_CATEGORIES = Object.keys(CATEGORY_IMAGES);

async function autoDiscoverPlaces(city: string, openai: OpenAI) {
  try {
    // Skip if this city already has 5+ places
    const existingCount = await db.place.count({ where: { city } });
    if (existingCount >= 5) {
      console.log(`[autoDiscover] ${city} already has ${existingCount} places, skipping.`);
      return;
    }

    const prompt = `Dame exactamente 5 lugares turísticos icónicos de ${city}.
RESPONDE ÚNICAMENTE con un array JSON válido. Sin texto adicional, sin markdown, sin explicaciones.

Formato exacto (respeta cada campo):
[
  {
    "slug": "nombre-del-lugar-en-kebab-case-sin-tildes",
    "name": "Nombre del Lugar",
    "city": "${city}",
    "country": "País correcto",
    "category": "una de: Naturaleza|Cultura|Arte|Historia|Gastronomía|Aventura|Religioso|Entretenimiento",
    "shortDescription": "Descripción de una línea, máximo 120 caracteres.",
    "description": "Descripción detallada de 2-3 oraciones. Historia, qué hacer y por qué vale la pena visitar."
  }
]`;

    const completion = await openai.chat.completions.create({
      model: "openrouter/free",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1500,
    });

    const raw = completion.choices[0]?.message?.content ?? "";

    // Extract JSON array even if the model adds extra text around it
    const jsonMatch = raw.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error("[autoDiscover] No JSON found in response:", raw.slice(0, 300));
      return;
    }

    const places: Array<{
      slug: string;
      name: string;
      city: string;
      country: string;
      category: string;
      shortDescription: string;
      description: string;
    }> = JSON.parse(jsonMatch[0]);

    let added = 0;
    for (const place of places) {
      if (!place.slug || !place.name) continue;

      // Sanitize slug: lowercase kebab-case, no accents, no special chars
      const slug = place.slug
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      const category = VALID_CATEGORIES.includes(place.category)
        ? place.category
        : "Cultura";

      await db.place.upsert({
        where: { slug },
        create: {
          slug,
          name: place.name,
          city: place.city || city,
          country: place.country || "",
          category,
          shortDescription: (place.shortDescription ?? "").slice(0, 255),
          description: place.description ?? "",
          imageUrl: CATEGORY_IMAGES[category],
          featured: false,
        },
        update: {}, // never overwrite manually curated data
      });
      added++;
    }

    revalidatePath("/explore");
    console.log(`[autoDiscover] +${added} places discovered for "${city}"`);
  } catch (err) {
    // Fire-and-forget: never crash the main flow
    console.error("[autoDiscover] Failed for", city, err);
  }
}

export async function getUserTripPlans(userId: string) {
  return db.tripPlan.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function addCityToWishlist(city: string) {
  const user = await requireAuth();

  const places = await db.place.findMany({
    where: { city },
    select: { id: true },
  });

  if (places.length === 0) {
    return { error: "No hay lugares registrados para esa ciudad aún.", count: 0 };
  }

  let added = 0;
  for (const place of places) {
    await db.userPlace.upsert({
      where: { userId_placeId: { userId: user.id!, placeId: place.id } },
      create: { userId: user.id!, placeId: place.id, status: "wishlist" },
      update: {}, // never downgrade from visited
    });
    added++;
  }

  revalidatePath("/my-places");
  return { success: true, count: added };
}
