import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { JOBS, JOB_AREAS } from "@/lib/data/jobs";
import { RAS, getRA } from "@/lib/data/ras";
import { JobRow } from "@/components/site/Cards";
import office from "@/assets/jobs-office.jpg";

export const Route = createFileRoute("/empregos/")({
  head: () => ({
    meta: [
      { title: "Vagas de Emprego no DF — DF Online" },
      { name: "description", content: "Vagas de emprego em Brasília e em todas as cidades do Distrito Federal. CLT, estágio, jovem aprendiz e mais." },
      { property: "og:title", content: "Vagas de Emprego no DF" },
      { property: "og:description", content: "Encontre sua próxima oportunidade de trabalho no Distrito Federal." },
    ],
  }),
  component: Empregos,
});

function Empregos() {
  const [q, setQ] = useState("");
  const [area, setArea] = useState("");
  const [ra, setRa] = useState("");
  const featured = JOBS.filter((j) => j.featured);
  const list = useMemo(
    () =>
      JOBS.filter(
        (j) => (!area || j.area === area) && (!ra || j.ra === ra) && (!q || `${j.title} ${j.company}`.toLowerCase().includes(q.toLowerCase())),
      ),
    [q, area, ra],
  );

  return (
    <div>
      <section className="relative overflow-hidden bg-brand-deep text-brand-foreground">
        <img src={office} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
        <div className="relative mx-auto max-w-7xl px-4 py-16">
          <p className="text-sm font-bold uppercase tracking-widest text-primary">Empregos DF</p>
          <h1 className="mt-1 max-w-2xl text-3xl font-bold md:text-5xl">Sua próxima oportunidade está no DF</h1>
          <p className="mt-2 text-brand-foreground/80">{JOBS.length} vagas abertas em Brasília e nas cidades do Distrito Federal.</p>
          <div className="mt-6 flex max-w-3xl flex-col gap-2 rounded-lg bg-card p-2 text-foreground md:flex-row">
            <div className="flex flex-1 items-center gap-2 px-3">
              <Search className="h-5 w-5 text-muted-foreground" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cargo ou empresa" className="h-11 w-full bg-transparent outline-none" />
            </div>
            <select value={ra} onChange={(e) => setRa(e.target.value)} className="h-11 rounded-md border bg-background px-3 text-sm">
              <option value="">Todo o DF</option>
              {RAS.map((r) => <option key={r.slug} value={r.slug}>RA {r.roman} — {r.name}</option>)}
            </select>
            <button className="h-11 rounded-md bg-primary px-6 font-bold text-primary-foreground hover:bg-primary/90">Buscar vagas</button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10">
        <h2 className="flex items-center gap-2 text-2xl font-bold text-brand"><Sparkles className="h-5 w-5 text-primary" /> Vagas em destaque</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((j) => (
            <Link key={j.id} to="/empregos/$id" params={{ id: j.id }} className="group flex flex-col rounded-xl border-2 border-primary/20 bg-card p-5 transition-colors hover:border-primary">
              <span className="self-start rounded bg-accent px-2 py-0.5 text-xs font-bold text-primary">{j.type}</span>
              <h3 className="mt-3 font-display text-lg font-bold leading-snug group-hover:text-primary">{j.title}</h3>
              <p className="text-sm text-muted-foreground">{j.company}</p>
              <p className="mt-1 text-sm text-muted-foreground">{getRA(j.ra)?.name} · {j.mode}</p>
              {j.salary && <p className="mt-auto pt-4 font-semibold text-brand">{j.salary}</p>}
            </Link>
          ))}
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-4">
          <aside>
            <h3 className="font-display font-bold text-brand">Área</h3>
            <ul className="mt-3 space-y-1">
              {["", ...JOB_AREAS].map((a) => (
                <li key={a || "all"}>
                  <button onClick={() => setArea(a)} className={`w-full rounded px-3 py-1.5 text-left text-sm ${area === a ? "bg-primary font-semibold text-primary-foreground" : "hover:bg-secondary"}`}>
                    {a || "Todas as áreas"}
                  </button>
                </li>
              ))}
            </ul>
          </aside>
          <div className="lg:col-span-3">
            <p className="mb-3 text-sm text-muted-foreground">{list.length} vaga(s)</p>
            <div className="space-y-3">{list.map((j) => <JobRow key={j.id} j={j} />)}</div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 rounded-xl bg-cream p-8 md:flex-row">
          <div>
            <h2 className="text-2xl font-bold text-brand">Sua empresa está contratando?</h2>
            <p className="text-muted-foreground">Divulgue suas vagas para quem mora no DF.</p>
          </div>
          <a href="mailto:vagas@dfonline.com.br" className="rounded-md bg-primary px-6 py-3 font-bold text-primary-foreground hover:bg-primary/90">Anunciar vaga</a>
        </div>
      </div>
    </div>
  );
}
