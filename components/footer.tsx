import Link from "next/link";
import { MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-muted w-full py-12 px-8" suppressHydrationWarning>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {/* Brand */}
        <div className="col-span-1">
          <div className="flex items-center gap-1.5 mb-4">
            <MapPin className="h-5 w-5 text-rv-logo" />
            <span className="font-heading font-black text-rv-logo text-2xl tracking-tighter">RutaViva</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Diseñado para los inquietos. Construido para los curiosos. Creemos que cada calle tiene una historia esperando ser descubierta.
          </p>
        </div>

        {/* Platform links */}
        <div>
          <h4 className="font-bold text-foreground mb-4 text-sm uppercase tracking-widest">Plataforma</h4>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li>
              <Link className="hover:text-foreground underline decoration-rv-logo decoration-2 underline-offset-4 transition-colors" href="/explore">
                Explorar
              </Link>
            </li>
            <li>
              <Link className="hover:text-foreground underline decoration-rv-logo decoration-2 underline-offset-4 transition-colors" href="/my-places">
                Mis Lugares
              </Link>
            </li>
            <li>
              <Link className="hover:text-foreground underline decoration-rv-logo decoration-2 underline-offset-4 transition-colors" href="/planner">
                Planificador IA
              </Link>
            </li>
          </ul>
        </div>

        {/* Company links */}
        <div>
          <h4 className="font-bold text-foreground mb-4 text-sm uppercase tracking-widest">Empresa</h4>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li><Link className="hover:text-foreground underline decoration-rv-logo decoration-2 underline-offset-4 transition-colors" href="/explore">Explorar</Link></li>
            <li><Link className="hover:text-foreground underline decoration-rv-logo decoration-2 underline-offset-4 transition-colors" href="/planner">Planificador IA</Link></li>
            <li><a className="hover:text-foreground underline decoration-rv-logo decoration-2 underline-offset-4 transition-colors" href="mailto:soporte@rutaviva.app">Soporte</a></li>
          </ul>
        </div>

        {/* Newsletter — static, no form action yet */}
        <div>
          <h4 className="font-bold text-foreground mb-4 text-sm uppercase tracking-widest">Mantente al día</h4>
          <p className="text-xs text-muted-foreground mb-3">Más destinos y funciones próximamente.</p>
          <a
            href="mailto:soporte@rutaviva.app"
            className="inline-flex items-center gap-2 py-2.5 px-5 rounded-full bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-opacity"
          >
            Contáctanos
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} RutaViva. Sigue tu camino.</p>
        <div className="flex gap-3">
          <MapPin className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
        </div>
      </div>
    </footer>
  );
}
