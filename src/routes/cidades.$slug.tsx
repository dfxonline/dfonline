import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { dfNewsQuery, editoriaQuery } from "@/lib/news.functions";
import { RAS, getRA } from "@/lib/data/ras";
import { BUSINESSES } from "@/lib/data/businesses";
import { JOBS } from "@/lib/data/jobs";
import { EmptyNews, NewsCard, NewsRow, SectionHeader } from "@/components/site/NewsCard";
import { BusinessCard, JobRow } from "@/components/site/Cards";

export const Route = createFileRoute("/cidades/$slug")({
  loader: async ({ context, params }) => {
    const ra = getRA(params.slug);
    if (!ra) throw notFound();
    await Promise.all([
      context.queryClient.ensureQueryData(dfNewsQuery()),
      context.queryClient.ensureQueryData(editoriaQuery("brasil")),
    ]);
    return { name: ra.name, roman: ra.roman };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `Notícias de ${loaderData.name} (RA ${loaderData.roman}) — DF Online` },
          { name: "description", content: `Últimas notícias, empresas e vagas de emprego em ${loaderData.name}, RA ${loaderData.roman} do Distrito Federal.` },
          { property: "og:title", content: `Notícias de ${loaderData.name} — RA ${loaderData.roman}` },
          { property: "og:description", content: `Acompanhe o que acontece em ${loaderData.name}, no DF.` },
        ]
      : [{ title: "Cidade não encontrada — DF Online" }, { name: "robots", content: "noindex" }],
  }),
  component: Cidade,
  notFoundComponent: () => <p className="p-16 text-center">Cidade não encontrada. <Link to="/cidades" className="text-primary">Ver todas</Link></p>,
  errorComponent: () => <p className="p-16 text-center">Não foi possível carregar esta cidade.</p>,
});

function Cidade() {
  const { slug } = Route.useParams();
  const ra = getRA(slug)!;
  const { data: df } = useSuspenseQuery(dfNewsQuery());
  const { data: brasil } = useSuspenseQuery(editoriaQuery("brasil"));
  const local = [...df, ...brasil].filter((a) => a.ras.includes(slug));
  const others = df.filter((a) => !a.ras.includes(slug));
  const biz = BUSINESSES.filter((b) => b.ra === slug);
  const jobs = JOBS.filter((j) => j.ra === slug);
  const prev = RAS.find((r) => r.number === ra.number - 1);
  const next = RAS.find((r) => r.number === ra.number + 1);

  return (
    <div>
      <section className="topo py-12 text-brand-foreground">
        <div className="mx-auto max-w-7xl px-4">
          <Link to="/cidades" className="text-sm text-brand-foreground/70 hover:text-primary">← Todas as cidades</Link>
          <div className="mt-3 flex items-center gap-4">
            <span className="rounded-md bg-primary px-3 py-2 font-display text-lg font-bold text-primary-foreground">RA {ra.roman}</span>
            <h1 className="text-3xl font-bold md:text-5xl">{ra.name}</h1>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SectionHeader title={`Notícias de ${ra.name}`} />
          {local.length ? (
            <div className="grid gap-6 sm:grid-cols-2">{local.map((a) => <NewsCard key={a.id} a={a} />)}</div>
          ) : (
            <EmptyNews message={`Ainda não há notícias recentes sobre ${ra.name} nas agências. Confira abaixo as últimas do DF.`} />
          )}

          {biz.length > 0 && (
            <div className="mt-12">
              <SectionHeader title={`Empresas em ${ra.name}`} to={<Link to="/guia">Guia completo →</Link>} />
              <div className="grid gap-5 sm:grid-cols-2">{biz.map((b) => <BusinessCard key={b.slug} b={b} />)}</div>
            </div>
          )}
          {jobs.length > 0 && (
            <div className="mt-12">
              <SectionHeader title={`Vagas em ${ra.name}`} />
              <div className="space-y-3">{jobs.map((j) => <JobRow key={j.id} j={j} />)}</div>
            </div>
          )}

          <div className="mt-12 flex justify-between gap-4">
            {prev ? (
              <Link to="/cidades/$slug" params={{ slug: prev.slug }} className="flex items-center gap-1 text-sm font-semibold text-brand hover:text-primary">
                <ChevronLeft className="h-4 w-4" /> RA {prev.roman} · {prev.name}
              </Link>
            ) : <span />}
            {next && (
              <Link to="/cidades/$slug" params={{ slug: next.slug }} className="flex items-center gap-1 text-sm font-semibold text-brand hover:text-primary">
                RA {next.roman} · {next.name} <ChevronRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
        <aside>
          <SectionHeader title="Últimas do DF" />
          <div className="divide-y">{others.slice(0, 8).map((a) => <NewsRow key={a.id} a={a} />)}</div>
        </aside>
      </div>
    </div>
  );
}
