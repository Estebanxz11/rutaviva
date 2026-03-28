"use client";

import Image from "next/image";
import { useState } from "react";
import { MapPin } from "lucide-react";

interface PlaceImageProps {
  src: string;
  alt: string;
  category: string;
}

const categoryGradients: Record<string, string> = {
  Naturaleza: "from-green-700 to-emerald-500",
  Cultura: "from-purple-700 to-violet-500",
  Gastronomía: "from-orange-600 to-amber-400",
  Aventura: "from-red-700 to-rose-500",
  Historia: "from-yellow-700 to-amber-500",
  Arte: "from-pink-700 to-fuchsia-500",
  Religioso: "from-blue-700 to-sky-500",
  Entretenimiento: "from-teal-700 to-cyan-500",
};

export function PlaceImage({ src, alt, category }: PlaceImageProps) {
  const [error, setError] = useState(false);
  const gradient = categoryGradients[category] ?? "from-emerald-700 to-teal-500";

  if (error) {
    return (
      <div
        className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}
      >
        <MapPin className="h-10 w-10 text-white/60" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover group-hover:scale-105 transition-transform duration-300"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      onError={() => setError(true)}
    />
  );
}
