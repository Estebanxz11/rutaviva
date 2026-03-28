"use client";

import { useTransition, useState } from "react";
import Link from "next/link";
import { MapPin, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { loginUser } from "@/actions/auth";

export function SignInForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await loginUser(formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden bg-background">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-rv-primary-container/30 blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-rv-secondary-container/30 blur-[100px] pointer-events-none translate-x-1/3 -translate-y-1/3" />

      {/* Floating decorative images (desktop only) */}
      <div className="absolute top-12 left-12 w-32 h-32 rounded-3xl -rotate-12 grayscale opacity-40 overflow-hidden hidden lg:block">
        <div className="w-full h-full bg-gradient-to-br from-primary/30 to-rv-secondary-accent/30" />
      </div>
      <div className="absolute bottom-12 right-12 w-48 h-48 rounded-3xl rotate-6 grayscale opacity-40 overflow-hidden hidden lg:block">
        <div className="w-full h-full bg-gradient-to-br from-rv-secondary-accent/30 to-primary/30" />
      </div>

      <div className="relative w-full max-w-md z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8 gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
            <MapPin className="h-8 w-8 text-primary-foreground" />
          </div>
          <div className="text-center">
            <h1 className="font-heading font-black text-3xl text-primary tracking-tighter">RutaViva</h1>
            <p className="text-muted-foreground text-sm mt-1">Bienvenido de nuevo, aventurero.</p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-[2rem] bg-card p-8 shadow-xl">
          <form action={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
              <input
                name="email"
                type="email"
                placeholder="your@email.com"
                required
                autoComplete="email"
                className="w-full pl-12 pr-4 py-4 bg-muted rounded-xl border-none text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="w-full pl-12 pr-4 py-4 bg-muted rounded-xl border-none text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
            </div>

            {error && (
              <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 rounded-full py-4 bg-primary text-primary-foreground font-heading font-bold text-lg shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all disabled:opacity-70"
            >
              {isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Iniciar sesión
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            ¿No tienes cuenta?{" "}
            <Link href="/sign-up" className="text-primary font-bold hover:underline">
              Regístrate gratis
            </Link>
          </p>
        </div>
      </div>

      {/* Minimal page footer */}
      <footer suppressHydrationWarning className="relative z-10 mt-8 text-center text-xs text-muted-foreground">
        <p className="mb-2">RutaViva © {new Date().getFullYear()}. Sigue Aventurando.</p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/explore" className="hover:text-foreground transition-colors">Explorar</Link>
          <a href="mailto:soporte@rutaviva.app" className="hover:text-foreground transition-colors">Soporte</a>
        </div>
      </footer>
    </div>
  );
}
