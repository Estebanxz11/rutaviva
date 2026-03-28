"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Heart, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { togglePlaceStatus } from "@/actions/places";
import { toast } from "sonner";

interface PlaceActionButtonsProps {
  placeId: string;
  userStatus: "wishlist" | "visited" | null;
  isLoggedIn: boolean;
}

export function PlaceActionButtons({
  placeId,
  userStatus,
  isLoggedIn,
}: PlaceActionButtonsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [optimisticStatus, setOptimisticStatus] = useState(userStatus);

  function handleAction(status: "wishlist" | "visited") {
    if (!isLoggedIn) {
      router.push("/sign-in");
      return;
    }

    const newStatus = optimisticStatus === status ? null : status;
    setOptimisticStatus(newStatus);

    startTransition(async () => {
      await togglePlaceStatus(placeId, status);
      const messages: Record<string, string> = {
        wishlist: newStatus === status ? "Añadido a tu lista de deseos" : "Eliminado de tu lista de deseos",
        visited: newStatus === status ? "Marcado como visitado ✓" : "Desmarcado como visitado",
      };
      toast.success(messages[status]);
    });
  }

  return (
    <div className="flex gap-3 flex-wrap">
      <Button
        variant={optimisticStatus === "wishlist" ? "default" : "outline"}
        className={`rounded-full ${
          optimisticStatus === "wishlist"
            ? "bg-amber-500 hover:bg-amber-600 border-amber-500"
            : "border-amber-500 text-amber-600 hover:bg-amber-50"
        }`}
        onClick={() => handleAction("wishlist")}
        disabled={isPending}
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Heart
            className="h-4 w-4 mr-2"
            fill={optimisticStatus === "wishlist" ? "currentColor" : "none"}
          />
        )}
        {optimisticStatus === "wishlist" ? "Guardado" : "Guardar"}
      </Button>

      <Button
        variant={optimisticStatus === "visited" ? "default" : "outline"}
        className={`rounded-full ${
          optimisticStatus === "visited"
            ? "bg-gradient-to-r from-primary to-rv-primary-container text-primary-foreground border-0"
            : "border-primary text-primary hover:bg-primary/10"
        }`}
        onClick={() => handleAction("visited")}
        disabled={isPending}
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <CheckCircle2
            className="h-4 w-4 mr-2"
            fill={optimisticStatus === "visited" ? "currentColor" : "none"}
          />
        )}
        {optimisticStatus === "visited" ? "Visitado" : "Marcar visitado"}
      </Button>
    </div>
  );
}
