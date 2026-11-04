import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Check, MapPin } from "lucide-react";
import { JOBS, getJob } from "@/lib/data/jobs";
import { getRA } from "@/lib/data/ras";
import { JobRow } from "@/components/site/Cards";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/empregos/$id")({
  loader: ({ params }) => {
    const j = getJob(params.id);
    if (!j) throw notFound();
    return { title: j.title, company: j.company, description: j.description };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} — ${loaderData.company} | Empregos DF Online` },
          { name: "description", content: loaderData.description },
          { property: "og:title", content: `Vaga: ${loaderData.title}` },
          { property: "og:description", content: `${loaderData.company} — ${loaderData.description}` },
        ]
      : [{ title: "Vaga não encontrada — DF Online" }],
  }),
  component: Vaga,
  notFoundComponent: () => <p className="p-16 text-center">Vaga não encontrada. <Link to="/empregos" className="text-primary">Ver vagas</Link></p>,
  errorComponent: () => <p className="p-16 text-center">Erro ao carregar a vaga.</p>,
});

function Vaga() {
  const { id } = Route.useParams();
  const j = getJob(id)!;
  const ra = getRA(j.ra);
  const mail = `mailto:${j.applyEmail}?subject=${encodeURIComponent(`Candidatura: ${j.title} (via DF Online)`)}`;

  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Link to="/empregos" className="text-sm text-muted-foreground hover:text-primary">← Todas as vagas</Link>
        <h1 className="mt-3 text-3xl font-bold md:text-4xl">{j.title}</h1>
        <p className="mt-1 text-lg text-muted-foreground">{j.company}</p>
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          {[j.type, j.mode, j.area].map((t) => <span key={t} className="rounded bg-secondary px-3 py-1 font-medium text-brand">{t}</span>)}
          <span className="flex items-center gap-1 rounded bg-secondary px-3 py-1 font-medium text-brand"><MapPin className="h-3.5 w-3.5" /> {ra?.name}</span>
        </div>
        <h2 className="mt-8 text-xl font-bold text-brand">Descrição</h2>
        <p className="mt-2">{j.description}</p>
        <h2 className="mt-8 text-xl font-bold text-brand">Requisitos</h2>
        <ul className="mt-2 space-y-2">{j.requirements.map((r) => <li key={r} className="flex gap-2"><Check className="h-5 w-5 text-primary" /> {r}</li>)}</ul>
        <h2 className="mt-8 text-xl font-bold text-brand">Benefícios</h2>
        <ul className="mt-2 space-y-2">{j.benefits.map((r) => <li key={r} className="flex gap-2"><Check className="h-5 w-5 text-primary" /> {r}</li>)}</ul>
      </div>
      <aside className="lg:sticky lg:top-40 lg:self-start">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          {j.salary && <p className="font-display text-2xl font-bold text-brand">{j.salary}</p>}
          <p className="mt-1 text-sm text-muted-foreground">Publicada em {formatDate(j.postedAt + "T12:00:00-03:00")}</p>
          <a href={mail} className="mt-5 flex w-full justify-center rounded-md bg-primary px-5 py-3 font-bold text-primary-foreground hover:bg-primary/90">Candidatar-se</a>
          <p className="mt-3 text-center text-xs text-muted-foreground">Envie seu currículo para {j.applyEmail}</p>
        </div>
        <h3 className="mt-8 font-display font-bold text-brand">Outras vagas</h3>
        <div className="mt-3 space-y-2">{JOBS.filter((x) => x.id !== j.id).slice(0, 4).map((x) => <JobRow key={x.id} j={x} compact />)}</div>
      </aside>
    </div>
  );
}
