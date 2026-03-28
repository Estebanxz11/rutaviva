import { NextRequest } from "next/server";
import OpenAI from "openai";
import { z } from "zod";
import { auth } from "@/lib/auth";

const schema = z.object({
  city: z.string().min(2).max(100),
  days: z.coerce.number().min(1).max(14),
  budget: z.string().min(1).max(50),
  interests: z.string().min(2).max(300),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: "No autorizado" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "JSON inválido" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: "Datos de solicitud inválidos" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { city, days, budget, interests } = parsed.data;

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "Servicio de IA no configurado" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
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

  let aiStream: AsyncIterable<OpenAI.Chat.Completions.ChatCompletionChunk>;
  try {
    aiStream = await openai.chat.completions.create({
      model: "openrouter/free",
      messages: [{ role: "user", content: prompt }],
      stream: true,
      max_tokens: 4000,
    });
  } catch (err) {
    console.error("[stream] AI init failed:", err);
    return new Response(JSON.stringify({ error: "Error al conectar con el servicio de IA" }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }

  const readable = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        for await (const chunk of aiStream) {
          const text = chunk.choices[0]?.delta?.content ?? "";
          if (text) controller.enqueue(encoder.encode(text));
        }
      } catch (err) {
        console.error("[stream] Stream error:", err);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "no-cache",
    },
  });
}
