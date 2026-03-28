"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function ExploreSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const q = (form.elements.namedItem("q") as HTMLInputElement).value.trim();
    const params = new URLSearchParams(searchParams.toString());
    if (q) {
      params.set("q", q);
    } else {
      params.delete("q");
    }
    startTransition(() => router.push(`/explore?${params.toString()}`));
  }

  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
      <Input
        name="q"
        defaultValue={searchParams.get("q") ?? ""}
        placeholder="Busca parques, museos, restaurantes..."
        className="pl-14 py-5 h-14 bg-muted rounded-xl border-none text-base focus-visible:ring-primary"
      />
    </form>
  );
}
