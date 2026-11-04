import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { RAS } from "@/lib/data/ras";

export const Route = createFileRoute("/cidades/")({
  head: () => ({
    meta: [
      { title: "Cidades do DF — As 35 Regiões Administrativas | DF Online" },
      { name: "description", content: "Notícias de todas as Regiões Administrativas do Distrito Federal, da RA I Plano Piloto à RA XXXV Água Quente." },
      { property: "og:title", content: "Cidades do DF — As 35 Regiões Administrativas" },
      { property: "og:description", content: "Escolha sua cidade e acompanhe as notícias da sua Região Administrativa." },
    ],
  }),
  component: Cidades,
});

function Cidades() {
  return (
    <div>
      <section className="topo py-12 text-brand-foreground">
        <div className="mx-auto max-w-7xl px-4">
          <p className="text-sm font-bold uppercase tracking-widest text-primary">Cidades</p>
          <h1 className="mt-1 text-3xl font-bold md:text-5xl">Regiões Administrativas do DF</h1>
          <p className="mt-3 max-w-2xl text-brand-foreground/80">As 35 RAs do Distrito Federal, em ordem numérica. Escolha a sua cidade para ver as notícias locais.</p>
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-4 py-10">
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {RAS.map((ra) => (
            <li key={ra.slug}>
              <Link to="/cidades/$slug" params={{ slug: ra.slug }} className="group flex items-center gap-4 rounded-lg border bg-card p-4 transition-colors hover:border-primary">
                <span className="flex h-12 w-16 shrink-0 items-center justify-center rounded-md bg-brand font-display text-sm font-bold text-brand-foreground group-hover:bg-primary">
                  RA {ra.roman}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-lg font-semibold group-hover:text-primary">{ra.name}</span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" /> Região Administrativa {ra.number}</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
