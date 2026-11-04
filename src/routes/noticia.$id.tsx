import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ExternalLink, MapPin } from "lucide-react";
import { articleQuery, dfNewsQuery } from "@/lib/news.functions";
import { SOURCE_LABEL } from "@/lib/news-types";
import { formatDate } from "@/lib/format";
import { getRA } from "@/lib/data/ras";
import { NewsRow, SectionHeader } from "@/components/site/NewsCard";

export const Route = createFileRoute("/noticia/$id")({
  loader: async ({ context, params }) => {
    const a = await context.queryClient.ensureQueryData(articleQuery(params.id));
    if (!a) throw notFound();
    context.queryClient.prefetchQuery(dfNewsQuery());
    return a;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Notícia indisponível — DF Online" }, { name: "robots", content: "noindex" }] };
    const m = [
      { title: `${loaderData.title} — DF Online` },
      { name: "description", content: loaderData.excerpt },
      { property: "og:title", content: loaderData.title },
      { property: "og:description", content: loaderData.excerpt },
      { property: "og:type", content: "article" },
    ];
    if (loaderData.image?.startsWith("https://"))
      m.push({ property: "og:image", content: loaderData.image }, { name: "twitter:image", content: loaderData.image });
    return { meta: m };
  },
  component: Article,
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <h1 className="text-2xl font-bold">Notícia não encontrada</h1>
      <Link to="/" className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 font-bold text-primary-foreground">Voltar ao início</Link>
    </div>
  ),
  errorComponent: () => <p className="p-10 text-center">Não foi possível carregar esta notícia.</p>,
});

function Article() {
  const { id } = Route.useParams();
  const { data: a } = useSuspenseQuery(articleQuery(id));
  const { data: df } = useSuspenseQuery(dfNewsQuery());
  if (!a) return null;
  const src = SOURCE_LABEL[a.source];

  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 lg:grid-cols-3">
      <article className="lg:col-span-2">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">{src}</span>
        <h1 className="mt-2 font-display text-3xl font-bold leading-tight md:text-5xl">{a.title}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{a.excerpt}</p>
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-y py-3 text-sm text-muted-foreground">
          <span>Por <strong className="text-foreground">{a.author}</strong></span>
          {a.source !== "ccbb" && <span>{formatDate(a.date, true)}</span>}
          {a.ras.map((s) => {
            const ra = getRA(s);
            return ra ? (
              <Link key={s} to="/cidades/$slug" params={{ slug: s }} className="inline-flex items-center gap-1 rounded bg-secondary px-2 py-0.5 text-xs font-semibold text-brand">
                <MapPin className="h-3 w-3" /> RA {ra.roman} · {ra.name}
              </Link>
            ) : null;
          })}
        </div>
        {a.image && (
          <figure className="mt-6">
            <img src={a.image} alt="" referrerPolicy="no-referrer" className="w-full rounded-lg" />
            <figcaption className="mt-2 text-xs text-muted-foreground">{a.imageCredit ?? `Imagem: ${src}`}</figcaption>
          </figure>
        )}
        <div className="prose-news mt-8" dangerouslySetInnerHTML={{ __html: a.html }} />

        <div className="mt-10 rounded-lg border-l-4 border-primary bg-cream p-5">
          <p className="text-sm">
            <strong>Crédito:</strong> conteúdo originalmente publicado por <strong>{src}</strong>
            {a.author && a.author !== src ? ` (${a.author})` : ""}. Reproduzido pelo DF Online com citação da fonte.
          </p>
          <a href={a.link} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90">
            Ler no site {a.source === "ccbb" ? "do CCBB" : `da ${src}`} <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </article>
      <aside>
        <SectionHeader title="Mais do DF" />
        <div className="divide-y">{df.filter((d) => d.id !== a.id).slice(0, 8).map((d) => <NewsRow key={d.id} a={d} />)}</div>
      </aside>
    </div>
  );
}
