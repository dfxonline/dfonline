import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { BUSINESSES, BUSINESS_CATEGORIES } from "@/lib/data/businesses";
import { RAS } from "@/lib/data/ras";
import { BusinessCard } from "@/components/site/Cards";

export const Route = createFileRoute("/guia/")({
  head: () => ({
    meta: [
      { title: "Guia de Empresas do DF — DF Online" },
      { name: "description", content: "Encontre restaurantes, serviços, saúde, comércio e muito mais em todas as cidades do Distrito Federal." },
      { property: "og:title", content: "Guia de Empresas do DF" },
      { property: "og:description", content: "O guia local de negócios de Brasília e das Regiões Administrativas." },
    ],
  }),
  component: Guia,
});

function Guia() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [ra, setRa] = useState("");
  const list = useMemo(
    () =>
      BUSINESSES.filter(
        (b) =>
          (!cat || b.category === cat) &&
          (!ra || b.ra === ra) &&
          (!q || `${b.name} ${b.short} ${b.tags.join(" ")}`.toLowerCase().includes(q.toLowerCase())),
      ).sort((a, b) => Number(!!b.featured) - Number(!!a.featured)),
    [q, cat, ra],
  );

  return (
    <div>
      <section className="topo py-14 text-brand-foreground">
        <div className="mx-auto max-w-7xl px-4">
          <p className="text-sm font-bold uppercase tracking-widest text-primary">Guia de Empresas</p>
          <h1 className="mt-1 text-3xl font-bold md:text-5xl">O que você procura no DF?</h1>
          <div className="mt-6 flex max-w-3xl flex-col gap-2 rounded-lg bg-card p-2 text-foreground md:flex-row">
            <div className="flex flex-1 items-center gap-2 px-3">
              <Search className="h-5 w-5 text-muted-foreground" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Restaurante, academia, eletricista..." className="h-11 w-full bg-transparent outline-none" />
            </div>
            <select value={ra} onChange={(e) => setRa(e.target.value)} className="h-11 rounded-md border bg-background px-3 text-sm">
              <option value="">Todas as cidades</option>
              {RAS.map((r) => <option key={r.slug} value={r.slug}>RA {r.roman} — {r.name}</option>)}
            </select>
            <button className="h-11 rounded-md bg-primary px-6 font-bold text-primary-foreground hover:bg-primary/90">Buscar</button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex flex-wrap gap-2">
          {["", ...BUSINESS_CATEGORIES].map((c) => (
            <button
              key={c || "all"}
              onClick={() => setCat(c)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${cat === c ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:border-primary"}`}
            >
              {c || "Todas"}
            </button>
          ))}
        </div>
        <p className="mt-6 text-sm text-muted-foreground">{list.length} empresa(s) encontrada(s)</p>
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{list.map((b) => <BusinessCard key={b.slug} b={b} />)}</div>
        <div className="mt-14 flex flex-col items-center justify-between gap-4 rounded-xl bg-cream p-8 md:flex-row">
          <div>
            <h2 className="text-2xl font-bold text-brand">Tem uma empresa no DF?</h2>
            <p className="text-muted-foreground">Apareça no Guia do DF Online e seja encontrado por milhares de leitores.</p>
          </div>
          <a href="mailto:comercial@dfonline.com.br" className="rounded-md bg-primary px-6 py-3 font-bold text-primary-foreground hover:bg-primary/90">Anuncie sua empresa</a>
        </div>
      </div>
    </div>
  );
}
