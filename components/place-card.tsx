import Link from "next/link";
import { MapPin, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PlaceImage } from "@/components/place-image";
import type { PlaceWithStatus } from "@/types";

interface PlaceCardProps {
  place: PlaceWithStatus;
}

export function PlaceCard({ place }: PlaceCardProps) {
  return (
    <Link href={`/places/${place.slug}`} className="group block">
      <div className="relative aspect-square rounded-xl overflow-hidden bg-muted">
        <PlaceImage src={place.imageUrl} alt={place.name} category={place.category} />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center rounded-full bg-black/40 backdrop-blur-sm px-2.5 py-1 text-xs font-medium text-white">
            {place.category}
          </span>
        </div>

        {/* User status badge */}
        {place.userStatus && (
          <div className="absolute top-3 right-3">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur-sm ${
                place.userStatus === "visited"
                  ? "bg-primary/90 text-primary-foreground"
                  : "bg-amber-400/90 text-amber-900"
              }`}
            >
              {place.userStatus === "visited" ? "✓ Visitado" : "♡ Guardado"}
            </span>
          </div>
        )}

        {/* Info + action at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-heading font-bold text-white text-base leading-tight truncate group-hover:text-rv-primary-container transition-colors">
              {place.name}
            </h3>
            <div className="flex items-center gap-1 mt-0.5 text-white/70 text-xs">
              <MapPin className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{place.city}</span>
            </div>
          </div>
          <div className="ml-3 h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:border-primary transition-colors">
            <Plus className="h-4 w-4 text-white" />
          </div>
        </div>
      </div>
    </Link>
  );
}

