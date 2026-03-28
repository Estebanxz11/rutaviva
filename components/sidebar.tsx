"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Map, CalendarDays, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/explore", label: "Explorar", icon: Compass },
  { href: "/my-places", label: "Mis Lugares", icon: Map },
  { href: "/planner", label: "Planificador IA", icon: CalendarDays },
];

interface SidebarProps {
  userName?: string | null;
  userEmail?: string | null;
}

export function Sidebar({ userName, userEmail }: SidebarProps) {
  const pathname = usePathname();

  const initials = userName
    ? userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "RV";

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 min-h-[calc(100vh-5rem)] border-r border-border bg-card px-4 py-6 gap-6">
      {/* User profile */}
      <div className="flex items-center gap-3 px-2">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">
          {initials}
        </div>
        <div className="overflow-hidden">
          <p className="text-sm font-semibold text-foreground truncate">
            {userName ?? "Explorador"}
          </p>
          <p className="text-xs text-muted-foreground truncate">{userEmail ?? ""}</p>
        </div>
      </div>

      {/* New trip button */}
      <Link
        href="/planner"
        className="flex items-center gap-2 justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold py-2.5 px-4 hover:opacity-90 transition-opacity"
      >
        <Plus className="h-4 w-4" />
        Nuevo viaje
      </Link>

      {/* Nav links */}
      <nav className="flex flex-col gap-1">
        {navLinks.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                active
                  ? "bg-rv-primary-container/30 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
