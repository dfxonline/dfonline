import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, Briefcase, MapPin } from "lucide-react";
import { ccbbQuery, dfNewsQuery, editoriaQuery } from "@/lib/news.functions";
import { EmptyNews, HeroCard, NewsCard, NewsRow, SectionHeader } from "@/components/site/NewsCard";
import { BusinessCard } from "@/components/site/Cards";
import { BUSINESSES } from "@/lib/data/businesses";
import { JOBS } from "@/lib/data/jobs";
import { RAS, getRA } from "@/lib/data/ras";
import { timeAgo } from "@/lib/format";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DF Online — Notícias de Brasília e das cidades do DF" },
      { name: "description", content: "Últimas notícias de Brasília e das 35 Regiões Administrativas do DF, guia de empresas locais e vagas de emprego." },
      { property: "og:title", content: "DF Online — Notícias de Brasília e das cidades do DF" },
      { property: "og:description", content: "Notícias do DF, guia de empresas e vagas de emprego em um só lugar." },
    ],
  }),
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(dfNewsQuery()),
      context.queryClient.ensureQueryData(editoriaQuery("ultimas")),
      context.queryClient.ensureQueryData(editoriaQuery("politica")),
      context.queryClient.ensureQueryData(editoriaQuery("economia")),
      context.queryClient.ensureQueryData(ccbbQuery()),
    ]),
  component: Home,
});

function more(to: React.ReactNode) {
  return to;
}

function Home() {
  const { data: df } = useSuspenseQuery(dfNewsQuery());
  const { data: ultimas } = useSuspenseQuery(editoriaQuery("ultimas"));
  const { data: politica } = useSuspenseQuery(editoriaQuery("politica"));
  const { data: economia } = useSuspenseQuery(editoriaQuery("economia"));
  const { data: ccbb } = useSuspenseQuery(ccbbQuery());

  const lead = df[0] ?? ultimas[0];
  const side = (df.length > 1 ? df.slice(1, 5) : ultimas.slice(1, 5));
  const dfRest = df.slice(5, 11);
  const featuredBiz = BUSINESSES.filter((b) => b.featured).slice(0, 4);
  const featuredJobs = JOBS.filter((j) => j.featured).slice(0, 4);

  return (
    <div>
      {/* Ticker */}
      {ultimas.length > 0 && (
        <div className="border-b bg-card">
          <div className="mx-auto flex max-w-7xl items-center gap-3 overflow-hidden px-4 py-2 text-sm">
            <span className="shrink-0 rounded bg-primary px-2 py-0.5 text-xs font-bold uppercase text-primary-foreground">Agora</span>
            <div className="flex gap-8 overflow-x-auto whitespace-nowrap [scrollbar-width:none]">
              {ultimas.slice(0, 6).map((a) => (
                <Link key={a.id} to="/noticia/$id" params={{ id: a.id }} className="hover:text-primary">
                  <span className="text-muted-foreground">{timeAgo(a.date)} · </span>
                  {a.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Manchetes */}
        {lead ? (
          <section className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <HeroCard a={lead} />
            </div>
            <div className="divide-y rounded-lg border bg-card px-4">
              <p className="pt-4 font-display text-sm font-bold uppercase tracking-wider text-brand">Destaques do DF</p>
              {side.map((a) => (
                <NewsRow key={a.id} a={a} />
              ))}
            </div>
          </section>
        ) : (
          <EmptyNews />
        )}

        {/* Cidades */}
        <section className="mt-12">
          <SectionHeader title="Cidades do DF" to={<Link to="/cidades">Todas as 35 RAs →</Link>} />
          <div className="flex flex-wrap gap-2">
            {RAS.map((ra) => (
              <Link
                key={ra.slug}
                to="/cidades/$slug"
                params={{ slug: ra.slug }}
                className="rounded-full border bg-card px-3 py-1.5 text-sm transition-colors hover:border-primary hover:text-primary"
              >
                <span className="font-bold text-muted-foreground">RA {ra.roman}</span> {ra.name}
              </Link>
            ))}
          </div>
        </section>

        {/* DF + Brasil */}
        <section className="mt-12 grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SectionHeader title="Distrito Federal" />
            {dfRest.length ? (
              <div className="grid gap-6 sm:grid-cols-2">
                {dfRest.map((a) => (
                  <div key={a.id}>
                    <NewsCard a={a} />
                    {a.ras.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {a.ras.slice(0, 2).map((s) => {
                          const ra = getRA(s);
                          return ra ? (
                            <Link key={s} to="/cidades/$slug" params={{ slug: s }} className="inline-flex items-center gap-1 rounded bg-secondary px-2 py-0.5 text-xs font-medium text-brand hover:text-primary">
                              <MapPin className="h-3 w-3" /> {ra.name}
                            </Link>
                          ) : null;
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <EmptyNews />
            )}
          </div>
          <aside>
            <SectionHeader title="Brasil" to={<Link to="/editoria/$slug" params={{ slug: "brasil" }}>Mais →</Link>} />
            <div className="divide-y">
              {ultimas.slice(0, 7).map((a) => (
                <NewsRow key={a.id} a={a} />
              ))}
            </div>

            {/* Empregos — destaque discreto */}
            <div className="mt-8 rounded-lg border bg-cream p-5">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-primary" />
                <p className="font-display font-bold text-brand">Vagas no DF</p>
              </div>
              <ul className="mt-3 space-y-3">
                {featuredJobs.map((j) => (
                  <li key={j.id}>
                    <Link to="/empregos/$id" params={{ id: j.id }} className="group block">
                      <p className="text-sm font-semibold leading-snug group-hover:text-primary">{j.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {j.company} · {getRA(j.ra)?.name}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link to="/empregos" className="mt-4 inline-flex text-sm font-semibold text-primary hover:underline">
                Ver todas as vagas →
              </Link>
            </div>
          </aside>
        </section>
      </div>

      {/* Guia de Empresas — destaque */}
      <section className="topo py-14 text-brand-foreground">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-primary">Guia de Empresas</p>
              <h2 className="mt-1 font-display text-3xl font-bold md:text-4xl">Os melhores negócios perto de você</h2>
              <p className="mt-2 max-w-xl text-brand-foreground/75">Restaurantes, serviços, saúde e comércio de todas as cidades do DF — com fotos, localização e contato direto pelo WhatsApp.</p>
            </div>
            <Link to="/guia" className="inline-flex items-center gap-2 self-start rounded-md bg-primary px-5 py-3 font-bold text-primary-foreground hover:bg-primary/90 md:self-auto">
              Explorar o guia <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8 grid gap-5 text-foreground sm:grid-cols-2 lg:grid-cols-4">
            {featuredBiz.map((b) => (
              <BusinessCard key={b.slug} b={b} />
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12">
        <section className="grid gap-10 md:grid-cols-2">
          <div>
            <SectionHeader title="Política" to={<Link to="/editoria/$slug" params={{ slug: "politica" }}>Mais →</Link>} />
            {politica[0] && <NewsCard a={politica[0]} />}
            <div className="mt-2 divide-y">{politica.slice(1, 4).map((a) => <NewsRow key={a.id} a={a} />)}</div>
          </div>
          <div>
            <SectionHeader title="Economia" to={<Link to="/editoria/$slug" params={{ slug: "economia" }}>Mais →</Link>} />
            {economia[0] && <NewsCard a={economia[0]} />}
            <div className="mt-2 divide-y">{economia.slice(1, 4).map((a) => <NewsRow key={a.id} a={a} />)}</div>
          </div>
        </section>

        {ccbb.length > 0 && (
          <section className="mt-12">
            <SectionHeader title="Cultura · Em cartaz no CCBB Brasília" to={<Link to="/editoria/$slug" params={{ slug: "cultura" }}>Agenda cultural →</Link>} />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {ccbb.slice(0, 4).map((a) => (
                <NewsCard key={a.id} a={a} size="sm" />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

void more;
