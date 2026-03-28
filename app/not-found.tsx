import Link from "next/link";
import { MapPin, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
        <MapPin className="h-8 w-8 text-primary" />
      </div>
      <h1 className="font-heading font-extrabold text-7xl tracking-tighter text-foreground mb-2">
        404
      </h1>
      <p className="font-heading font-bold text-2xl text-muted-foreground mb-4">
        Este lugar no está en el mapa
      </p>
      <p className="text-muted-foreground max-w-sm mb-8">
        La ruta que buscas no existe o fue movida. Vuelve a explorar y encuentra tu próximo destino.
      </p>
      <Link
        href="/explore"
        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-full hover:opacity-90 transition-opacity"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a Explorar
      </Link>
    </div>
  );
}
