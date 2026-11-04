import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Clock, MapPin, Phone, Star } from "lucide-react";
import { BUSINESSES, getBusiness, whatsappLink } from "@/lib/data/businesses";
import { getRA } from "@/lib/data/ras";
import { BusinessCard, WhatsAppIcon } from "@/components/site/Cards";

export const Route = createFileRoute("/guia/$slug")({
  loader: ({ params }) => {
    const b = getBusiness(params.slug);
    if (!b) throw notFound();
    return { name: b.name, short: b.short, category: b.category };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.name} — Guia de Empresas DF Online` },
          { name: "description", content: loaderData.short },
          { property: "og:title", content: `${loaderData.name} · ${loaderData.category}` },
          { property: "og:description", content: loaderData.short },
        ]
      : [{ title: "Empresa não encontrada — DF Online" }],
  }),
  component: Empresa,
  notFoundComponent: () => <p className="p-16 text-center">Empresa não encontrada. <Link to="/guia" className="text-primary">Voltar ao guia</Link></p>,
  errorComponent: () => <p className="p-16 text-center">Erro ao carregar a empresa.</p>,
});

function Empresa() {
  const { slug } = Route.useParams();
  const b = getBusiness(slug)!;
  const ra = getRA(b.ra);
  const [photo, setPhoto] = useState(0);
  const related = BUSINESSES.filter((x) => x.slug !== b.slug && (x.category === b.category || x.ra === b.ra)).slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <nav className="text-sm text-muted-foreground">
        <Link to="/guia" className="hover:text-primary">Guia de Empresas</Link> / <span>{b.category}</span>
      </nav>

      <div className="mt-4 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-xl bg-muted">
            <img src={b.photos[photo]} alt={`${b.name} — foto ${photo + 1}`} className="aspect-[16/10] w-full object-cover" />
          </div>
          <div className="mt-3 flex gap-3">
            {b.photos.map((p, i) => (
              <button key={i} onClick={() => setPhoto(i)} className={`h-20 w-28 overflow-hidden rounded-md border-2 ${i === photo ? "border-primary" : "border-transparent"}`}>
                <img src={p} alt="" className="h-full w-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>

          <div className="mt-8">
            <span className="text-sm font-semibold uppercase tracking-wide text-primary">{b.category}</span>
            <h1 className="mt-1 text-3xl font-bold md:text-4xl">{b.name}</h1>
            <p className="mt-2 flex items-center gap-1 text-sm font-semibold text-brand">
              <Star className="h-4 w-4 fill-primary text-primary" /> {b.rating.toFixed(1)}
            </p>
            <h2 className="mt-8 text-xl font-bold text-brand">Sobre</h2>
            <p className="mt-2 leading-relaxed text-foreground/85">{b.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {b.tags.map((t) => <span key={t} className="rounded-full bg-secondary px-3 py-1 text-sm text-brand">{t}</span>)}
            </div>

            <h2 className="mt-10 text-xl font-bold text-brand">Localização</h2>
            <p className="mt-2 flex items-start gap-2 text-sm"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {b.address}</p>
            <div className="mt-4 overflow-hidden rounded-xl border">
              <iframe
                title={`Mapa — ${b.name}`}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(b.mapQuery)}&z=15&output=embed`}
                className="h-80 w-full"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        <aside className="lg:sticky lg:top-40 lg:self-start">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <a
              href={whatsappLink(b)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-md bg-whatsapp px-5 py-3.5 font-bold text-whatsapp-foreground transition-opacity hover:opacity-90"
            >
              <WhatsAppIcon className="h-5 w-5" /> Chamar no WhatsApp
            </a>
            <a href={`tel:${b.phone.replace(/\D/g, "")}`} className="mt-3 flex w-full items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 font-bold text-primary-foreground hover:bg-primary/90">
              <Phone className="h-4 w-4" /> Ligar {b.phone}
            </a>
            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex gap-2"><Clock className="h-4 w-4 shrink-0 text-primary" /> {b.hours}</li>
              <li className="flex gap-2"><MapPin className="h-4 w-4 shrink-0 text-primary" /> {b.address}</li>
              {ra && (
                <li>
                  <Link to="/cidades/$slug" params={{ slug: ra.slug }} className="font-semibold text-brand hover:text-primary">
                    Notícias de {ra.name} (RA {ra.roman}) →
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-5 text-2xl font-bold text-brand">Veja também</h2>
          <div className="grid gap-6 sm:grid-cols-3">{related.map((x) => <BusinessCard key={x.slug} b={x} />)}</div>
        </section>
      )}
    </div>
  );
}
