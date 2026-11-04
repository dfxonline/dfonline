import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";
import { ccbbQuery, editoriaQuery } from "@/lib/news.functions";
import { getEditoria } from "@/lib/news-types";
import { EmptyNews, HeroCard, NewsCard, SectionHeader } from "@/components/site/NewsCard";

export const Route = createFileRoute("/editoria/$slug")({
  loader: async ({ context, params }) => {
    const ed = getEditoria(params.slug);
    if (!ed) throw notFound();
    await context.queryClient.ensureQueryData(editoriaQuery(params.slug));
    if (params.slug === "cultura") await context.queryClient.ensureQueryData(ccbbQuery());
    return { label: ed.label, description: ed.description };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.label} — DF Online` },
          { name: "description", content: `${loaderData.description} Notícias atualizadas no DF Online.` },
          { property: "og:title", content: `${loaderData.label} — DF Online` },
          { property: "og:description", content: loaderData.description },
        ]
      : [{ title: "Editoria não encontrada — DF Online" }],
  }),
  component: EditoriaPage,
  notFoundComponent: () => <p className="p-16 text-center">Editoria não encontrada.</p>,
  errorComponent: () => <p className="p-16 text-center">Não foi possível carregar esta editoria.</p>,
});

function EditoriaPage() {
  const { slug } = Route.useParams();
  const ed = getEditoria(slug)!;
  const { data: items } = useSuspenseQuery(editoriaQuery(slug));
  const { data: ccbb = [] } = useQuery({ ...ccbbQuery(), enabled: slug === "cultura" });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-display text-4xl font-bold text-brand">{ed.label}</h1>
      <p className="mt-1 text-muted-foreground">{ed.description}</p>

      {slug === "cultura" && ccbb.length > 0 && (
        <section className="mt-8 rounded-xl bg-cream p-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-primary">Em cartaz</p>
              <h2 className="text-2xl font-bold text-brand">CCBB Brasília</h2>
            </div>
            <a href="https://ccbb.com.br/brasilia/programacao/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90">
              Programação completa <ExternalLink className="h-4 w-4" />
            </a>
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{ccbb.map((a) => <NewsCard key={a.id} a={a} size="sm" />)}</div>
          <p className="mt-4 text-xs text-muted-foreground">Fonte: Centro Cultural Banco do Brasil Brasília (ccbb.com.br).</p>
        </section>
      )}

      {items.length ? (
        <>
          <div className="mt-8"><HeroCard a={items[0]} /></div>
          <div className="mt-10">
            <SectionHeader title={`Mais em ${ed.label}`} to={<Link to="/">Início →</Link>} />
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">{items.slice(1).map((a) => <NewsCard key={a.id} a={a} />)}</div>
          </div>
          <p className="mt-8 text-xs text-muted-foreground">Notícias: Agência Brasil (EBC), reproduzidas com crédito.</p>
        </>
      ) : (
        <div className="mt-8"><EmptyNews /></div>
      )}
    </div>
  );
}
