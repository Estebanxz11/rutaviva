"use client";

import { useEffect } from "react";
import Link from "next/link";
import { MapPin, RefreshCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mb-6">
        <MapPin className="h-8 w-8 text-destructive" />
      </div>
      <h1 className="font-heading font-extrabold text-4xl tracking-tighter text-foreground mb-2">
        Algo salió mal
      </h1>
      <p className="text-muted-foreground max-w-sm mb-8">
        Se produjo un error inesperado. Puedes intentar de nuevo o volver a explorar.
      </p>
      <div className="flex items-center gap-4">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-full hover:opacity-90 transition-opacity"
        >
          <RefreshCcw className="h-4 w-4" />
          Intentar de nuevo
        </button>
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 px-6 py-3 bg-muted text-foreground font-bold rounded-full hover:bg-muted/80 transition-colors"
        >
          Ir a Explorar
        </Link>
      </div>
    </div>
  );
}
