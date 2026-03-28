"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { MapPin, Menu, X, LogOut, BookOpen, Star } from "lucide-react";
import { useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

interface NavbarProps {
  user: {
    id?: string | null;
    name?: string | null;
    email?: string | null;
  } | null;
}

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/explore", label: "Explorar" },
  { href: "/planner", label: "Planificador IA" },
];

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <header suppressHydrationWarning className="fixed top-0 z-50 w-full h-20 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <nav suppressHydrationWarning className="container mx-auto flex h-full items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="font-heading font-black text-2xl tracking-tighter text-rv-logo">
            RutaViva
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-foreground pb-0.5",
                pathname === link.href
                  ? "text-foreground border-b-2 border-primary"
                  : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Auth + theme section */}
        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost" }), "relative h-9 w-9 rounded-full p-0")}>
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-rv-primary-container text-rv-on-primary-fixed font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="flex items-center gap-2 p-2">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/my-places" className="flex items-center gap-2 w-full">
                    <Star className="h-4 w-4" />
                    Mis Lugares
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/planner" className="flex items-center gap-2 w-full">
                    <BookOpen className="h-4 w-4" />
                    Planificador
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-red-600 focus:text-red-600 cursor-pointer"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/sign-in" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "rounded-full")}>
                Iniciar sesión
              </Link>
              <Link href="/sign-up" className={cn(buttonVariants({ size: "sm" }), "rounded-full bg-primary hover:bg-primary/90 text-primary-foreground")}>
                Registrarse
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl px-4 py-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "text-sm font-medium py-2",
                pathname === link.href
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link
                href="/my-places"
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium py-2 text-muted-foreground"
              >
                Mis Lugares
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-sm font-medium py-2 text-red-600 text-left"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <div className="flex gap-2 pt-2">
              <Link
                href="/sign-in"
                onClick={() => setMobileOpen(false)}
                className={cn(buttonVariants({ variant: "outline", size: "sm" }), "flex-1 rounded-full")}
              >
                Iniciar sesión
              </Link>
              <Link
                href="/sign-up"
                onClick={() => setMobileOpen(false)}
                className={cn(buttonVariants({ size: "sm" }), "flex-1 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground")}
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
