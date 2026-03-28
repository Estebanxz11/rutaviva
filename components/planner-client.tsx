"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PlannerForm, type PlannerFormData } from "@/components/planner-form";
import { Sparkles, Save, CheckCircle2, Loader2 } from "lucide-react";
import { addCityToWishlist, savePlan } from "@/actions/planner";

interface PreviousPlan {
  id: string;
  city: string;
  days: number;
  budget: string;
  generatedPlan: string;
}

interface PlannerClientProps {
  isLoggedIn: boolean;
  previousPlans: PreviousPlan[];
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function boldify(text: string): string {
  const escaped = escapeHtml(text);
  return escaped
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
}

const PERIOD_EMOJIS: Record<string, string> = {
  mañana: "🌅",
  manana: "🌅",
  tarde: "☀️",
  noche: "🌙",
  mediodia: "🌤️",
  mediodía: "🌤️",
};

function renderContent(text: string) {
  const lines = text.split("\n");
  const nodes: React.ReactNode[] = [];

  lines.forEach((line, i) => {
    const t = line.trim();
    if (!t) return;

    if (t.startsWith("### ")) {
      const label = t.slice(4).replace(/[*_]/g, "").trim();
      const key = label.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const emoji = PERIOD_EMOJIS[label.toLowerCase()] ?? PERIOD_EMOJIS[key] ?? "✦";
      nodes.push(
        <div key={i} className="flex items-center gap-2 mt-5 mb-3">
          <span className="text-base leading-none">{emoji}</span>
          <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
          <div className="flex-1 h-px bg-border/40" />
        </div>
      );
    } else if (t.startsWith("## ")) {
      nodes.push(
        <p key={i} className="font-heading font-bold text-foreground mt-4 mb-1">
          {t.slice(3).replace(/\*\*/g, "")}
        </p>
      );
    } else if (t.startsWith("- ") || t.startsWith("* ")) {
      const content = t.slice(2);
      const boldMatch = content.match(/^\*\*([^*]+)\*\*\s*[—–-]?\s*([\s\S]*)$/);
      if (boldMatch) {
        // Activity card: **HH:MM · Place** — description
        nodes.push(
          <div key={i} className="bg-background/60 border border-border/30 rounded-lg px-3 py-2.5 my-1.5 space-y-1">
            <p className="text-sm font-bold text-foreground leading-snug"
              dangerouslySetInnerHTML={{ __html: escapeHtml(boldMatch[1]) }} />
            {boldMatch[2] && (
              <p className="text-xs text-muted-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ __html: boldify(boldMatch[2]) }} />
            )}
          </div>
        );
      } else {
        nodes.push(
          <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground my-0.5">
            <span className="text-primary shrink-0 mt-0.5 text-[10px]">✦</span>
            <span dangerouslySetInnerHTML={{ __html: boldify(content) }} />
          </div>
        );
      }
    } else if (/^\d+\.\s/.test(t)) {
      nodes.push(
        <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground my-0.5">
          <span className="text-rv-secondary-accent shrink-0 mt-0.5 text-[10px] font-bold">→</span>
          <span dangerouslySetInnerHTML={{ __html: boldify(t.replace(/^\d+\.\s/, "")) }} />
        </div>
      );
    } else {
      nodes.push(
        <p key={i} className="text-sm text-muted-foreground leading-relaxed"
          dangerouslySetInnerHTML={{ __html: boldify(t) }} />
      );
    }
  });

  return nodes;
}

function parseDays(markdown: string): { day: number | null; title: string; content: string }[] {
  // Match ## Día N or ## Dia N (with or without tilde, 1 or 2 #)
  const dayRegex = /^#{1,3}\s+D[íi]a\s+\d+/mi;
  if (!dayRegex.test(markdown)) {
    // No day headers found — return as single block
    return [{ day: null, title: "", content: markdown }];
  }
  const parts = markdown.split(/(?=^#{1,3}\s+D[íi]a\s+\d+)/mi).filter(Boolean);
  return parts.map((part, i) => {
    const titleMatch = part.match(/^#{1,3}\s+([^\n]+)/);
    const title = titleMatch ? titleMatch[1].replace(/\*\*/g, "").trim() : `Día ${i + 1}`;
    const dayMatch = title.match(/\d+/);
    const day = dayMatch ? parseInt(dayMatch[0]) : i + 1;
    const content = part.replace(/^#{1,3}\s+[^\n]+\n?/, "").trim();
    return { day, title, content };
  });
}

export function PlannerClient({ isLoggedIn, previousPlans }: PlannerClientProps) {
  const [plan, setPlan] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [addMessage, setAddMessage] = useState<{ text: string; ok: boolean } | null>(null);

  async function handlePlannerSubmit(data: PlannerFormData) {
    setPlan("");
    setCity(data.city);
    setAddMessage(null);
    setStreamError(null);
    setIsPending(true);

    try {
      const res = await fetch("/api/planner/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok || !res.body) {
        const errBody = await res.json().catch(() => ({ error: "Error desconocido" }));
        setStreamError(errBody.error ?? "Error al generar el itinerario");
        setIsPending(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullPlan = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullPlan += chunk;
        setPlan(fullPlan);
      }

      if (fullPlan) {
        await savePlan({ ...data, generatedPlan: fullPlan });
      }
    } catch (err) {
      console.error("Streaming failed:", err);
      setStreamError("Error de conexión. Intenta de nuevo.");
    } finally {
      setIsPending(false);
    }
  }

  async function handleAddToWishlist() {
    if (!city) return;
    setIsAdding(true);
    setAddMessage(null);
    const res = await addCityToWishlist(city);
    setIsAdding(false);
    if ("error" in res && res.error) {
      setAddMessage({ text: res.error, ok: false });
    } else {
      setAddMessage({ text: `✓ ${res.count} lugares de ${city} añadidos a tu lista de deseos`, ok: true });
    }
  }

  const displayPlan = isPending && plan !== null && plan.length > 0 ? plan + "▍" : plan;
  const days = displayPlan ? parseDays(displayPlan) : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left: Form */}
      <div className="lg:col-span-5 space-y-6">
        <PlannerForm
          isLoggedIn={isLoggedIn}
          isPending={isPending}
          onSubmit={handlePlannerSubmit}
        />

        {streamError && (
          <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">{streamError}</p>
        )}

        {isPending && (
          <div className="bg-rv-tertiary-container/30 rounded-xl p-6 space-y-4">
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <h4 className="font-heading font-bold text-foreground">Construyendo Viaje...</h4>
                <p className="text-xs text-muted-foreground">Explorando joyas escondidas con IA</p>
              </div>
            </div>
            <div className="w-full h-3 bg-card rounded-full overflow-hidden">
              <div className="h-full bg-rv-secondary-accent rounded-full shadow-[0_0_12px_rgba(0,96,147,0.3)] animate-pulse w-3/4" />
            </div>
          </div>
        )}
      </div>

      {/* Right: Itinerary */}
      <section className="lg:col-span-7 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-3xl font-extrabold tracking-tight text-foreground">
            Tu <span className="italic text-rv-secondary-accent">Plan de Viaje</span>
          </h2>
          {plan && (
            <div className="space-y-2">
              <button
                onClick={handleAddToWishlist}
                disabled={isAdding}
                className="flex items-center gap-2 text-primary font-bold text-sm bg-primary/10 px-4 py-2 rounded-full hover:bg-primary/20 transition-all disabled:opacity-60"
              >
                {isAdding ? (
                  <><Loader2 className="h-4 w-4 animate-spin" />Añadiendo...</>
                ) : (
                  <><Save className="h-4 w-4" />Añadir a Mis Viajes</>
                )}
              </button>
              {addMessage && (
                <p className={`text-xs font-medium px-2 flex items-center gap-1.5 ${
                  addMessage.ok ? "text-green-600" : "text-destructive"
                }`}>
                  {addMessage.ok && <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />}
                  {addMessage.text}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Generated plan */}
        {displayPlan && days ? (
          <div className="space-y-10 relative border-l-2 border-dashed border-border/50 ml-4 pl-8">
            {days.map((section, i) => (
              <motion.div
                key={i}
                className="relative"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, delay: i * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <div className={`absolute -left-[45px] top-0 w-8 h-8 rounded-full flex items-center justify-center font-heading font-bold text-xs ring-4 ring-background ${
                  i % 2 === 0 ? "bg-primary text-white" : "bg-rv-secondary-accent text-white"
                }`}>
                  {section.day ?? <Sparkles className="h-3.5 w-3.5" />}
                </div>
                <div className="space-y-3">
                  {section.title && (
                    <h3 className="font-heading text-xl font-bold text-foreground">{section.title}</h3>
                  )}
                  <div className="bg-card rounded-xl p-5 shadow-sm space-y-1.5">
                    {renderContent(section.content)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        /* Previous plans */
        ) : previousPlans.length > 0 && !isPending ? (
          <div className="space-y-4">
            {previousPlans.map((p) => (
              <button
                key={p.id}
                className="w-full text-left rounded-xl bg-card p-5 shadow-sm hover:shadow-md transition-shadow"
                onClick={() => { setPlan(p.generatedPlan); setCity(p.city); setAddMessage(null); }}
              >
                <p className="text-sm font-heading font-semibold text-foreground mb-1">
                  {p.city} · {p.days} días · {p.budget}
                </p>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {p.generatedPlan.slice(0, 180)}...
                </p>
                <p className="text-xs text-primary font-bold mt-2">Clic para ver el plan completo →</p>
              </button>
            ))}
          </div>

        /* Decorative placeholder */
        ) : !isPending ? (
          <div className="space-y-12 relative border-l-2 border-dashed border-border/50 ml-4 pl-8">
            <div className="relative">
              <div className="absolute -left-[45px] top-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-heading font-bold text-xs ring-4 ring-background">
                1
              </div>
              <div className="space-y-4">
                <h3 className="font-heading text-xl font-bold text-foreground">Exploraciones Matutinas</h3>
                <p className="text-sm text-muted-foreground">Empieza tu aventura mezclando lo moderno con lo auténtico de la ciudad.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-card rounded-xl overflow-hidden shadow-sm">
                    <div className="h-36 bg-muted flex items-center justify-center">
                      <Sparkles className="h-8 w-8 text-muted-foreground/30" />
                    </div>
                    <div className="p-4 space-y-1">
                      <h4 className="font-heading font-bold text-foreground text-sm">09:00 AM · Desayuno local</h4>
                      <p className="text-xs text-muted-foreground">Comienza el día con sabores auténticos.</p>
                    </div>
                  </div>
                  <div className="bg-card rounded-xl overflow-hidden shadow-sm">
                    <div className="h-36 bg-muted flex items-center justify-center">
                      <Sparkles className="h-8 w-8 text-muted-foreground/30" />
                    </div>
                    <div className="p-4 space-y-1">
                      <h4 className="font-heading font-bold text-foreground text-sm">11:30 AM · Ruta cultural</h4>
                      <p className="text-xs text-muted-foreground">Explora museos y arte callejero.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -left-[45px] top-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-heading font-bold text-xs ring-4 ring-background">
                2
              </div>
              <div className="opacity-50 space-y-3">
                <h3 className="font-heading text-xl font-bold text-foreground">Revelaciones de la Tarde</h3>
                <div className="h-24 border-2 border-dashed border-border/30 rounded-xl flex items-center justify-center">
                  <span className="text-sm font-medium italic text-muted-foreground/50">Genera tu itinerario para ver el plan completo</span>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}
