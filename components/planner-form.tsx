"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const CITY_SUGGESTIONS = ["Medellín", "Bogotá", "Cartagena", "Ciudad de México", "Buenos Aires", "París", "Tokio"];
const DAYS_OPTIONS = [1, 2, 3, 4, 5, 7, 10, 14];
const BUDGET_OPTIONS = [
  { value: "Económico", icon: "💰" },
  { value: "Medio", icon: "💳" },
  { value: "Alto", icon: "✨" },
  { value: "Lujo", icon: "🌟" },
];
const INTEREST_OPTIONS = ["Naturaleza", "Gastronomía", "Arte", "Historia", "Aventura", "Cultura", "Nocturno", "Familia"];

export interface PlannerFormData {
  city: string;
  days: number;
  budget: string;
  interests: string;
}

interface PlannerFormProps {
  isLoggedIn: boolean;
  isPending: boolean;
  onSubmit?: (data: PlannerFormData) => void;
}

export function PlannerForm({ isLoggedIn, isPending, onSubmit }: PlannerFormProps) {
  const router = useRouter();
  const [city, setCity] = useState("Medellín");
  const [selectedDays, setSelectedDays] = useState(3);
  const [selectedBudget, setSelectedBudget] = useState("Medio");
  const [selectedInterests, setSelectedInterests] = useState<string[]>(["Cultura"]);
  const [error, setError] = useState<string | null>(null);

  function toggleInterest(tag: string) {
    setSelectedInterests(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoggedIn) {
      router.push("/sign-in");
      return;
    }
    if (!city.trim()) {
      setError("Ingresa una ciudad de destino");
      return;
    }
    if (selectedInterests.length === 0) {
      setError("Selecciona al menos un interés");
      return;
    }
    setError(null);
    onSubmit?.({ city: city.trim(), days: selectedDays, budget: selectedBudget, interests: selectedInterests.join(", ") });
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Ciudad */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" /> Ciudad de destino
            </label>
            <input
              type="text"
              value={city}
              onChange={e => setCity(e.target.value)}
              placeholder="Ej: Medellín, París, Tokio..."
              className="w-full px-4 py-3 bg-muted rounded-xl border-none text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            />
            <div className="flex flex-wrap gap-2">
              {CITY_SUGGESTIONS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCity(c)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    city === c
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted text-muted-foreground hover:bg-muted/70"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Días */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Duración del viaje
            </label>
            <div className="flex flex-wrap gap-2">
              {DAYS_OPTIONS.map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setSelectedDays(d)}
                  className={`w-14 h-14 rounded-2xl text-sm font-bold transition-all flex flex-col items-center justify-center gap-0.5 ${
                    selectedDays === d
                      ? "bg-primary text-primary-foreground shadow-md scale-105"
                      : "bg-muted text-foreground hover:bg-muted/70"
                  }`}
                >
                  <span>{d}</span>
                  <span className="text-[9px] font-normal opacity-70">{d === 1 ? "día" : "días"}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Presupuesto */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Presupuesto
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {BUDGET_OPTIONS.map(b => (
                <button
                  key={b.value}
                  type="button"
                  onClick={() => setSelectedBudget(b.value)}
                  className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl transition-all ${
                    selectedBudget === b.value
                      ? "bg-primary text-primary-foreground shadow-md scale-105"
                      : "bg-muted text-foreground hover:bg-muted/70"
                  }`}
                >
                  <span className="text-xl">{b.icon}</span>
                  <span className="text-xs font-semibold">{b.value}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Intereses */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Intereses <span className="normal-case font-normal">(elige los que quieras)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {INTEREST_OPTIONS.map(tag => {
                const isSelected = selectedInterests.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleInterest(tag)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                      isSelected
                        ? "bg-rv-secondary-accent/20 text-rv-secondary-accent border border-rv-secondary-accent/40"
                        : "bg-muted text-muted-foreground hover:bg-muted/70"
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">{error}</p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 rounded-full py-4 bg-gradient-to-r from-primary to-rv-primary-container text-primary-foreground font-heading font-bold text-lg shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all disabled:opacity-70"
          >
            {isPending ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Generando itinerario...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                {isLoggedIn ? "Generar itinerario" : "Iniciar sesión para generar"}
              </>
            )}
          </button>
        </form>
      </CardContent>
    </Card>
  );
}
