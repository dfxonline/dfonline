import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { HeaderLogo } from "./Logo";
import { RAS } from "@/lib/data/ras";
import { EDITORIAS } from "@/lib/news-types";

function Today() {
  const [d] = useState(() =>
    new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "America/Sao_Paulo" }),
  );
  return <span suppressHydrationWarning className="capitalize">{d}</span>;
}

const navLink = "px-3 py-3 text-sm font-semibold text-brand-foreground/90 hover:text-brand-foreground hover:bg-brand-deep transition-colors";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [citiesOpen, setCitiesOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-background shadow-sm">
      <div className="hidden border-b bg-cream text-xs text-muted-foreground md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5">
          <Today />
          <span>Brasília e todas as Regiões Administrativas do DF</span>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <HeaderLogo />
        <div className="hidden items-center gap-2 md:flex">
          <Link to="/guia" className="rounded-md px-4 py-2 text-sm font-semibold text-brand hover:bg-secondary">
            Guia de Empresas
          </Link>
          <Link to="/empregos" className="rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90">
            Vagas de emprego
          </Link>
        </div>
        <button className="rounded-md p-2 text-brand md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Abrir menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      <nav className="hidden bg-brand md:block" onMouseLeave={() => setCitiesOpen(false)}>
        <div className="relative mx-auto flex max-w-7xl items-center px-2">
          <Link to="/" className={navLink} activeOptions={{ exact: true }} activeProps={{ className: "bg-brand-deep" }}>
            Início
          </Link>
          <button className={`${navLink} flex items-center gap-1`} onMouseEnter={() => setCitiesOpen(true)} onClick={() => setCitiesOpen((o) => !o)}>
            Cidades <ChevronDown className="h-4 w-4" />
          </button>
          {EDITORIAS.map((e) => (
            <Link key={e.slug} to="/editoria/$slug" params={{ slug: e.slug }} className={navLink} activeProps={{ className: "bg-brand-deep" }}>
              {e.label}
            </Link>
          ))}
          <Link to="/guia" className={navLink} activeProps={{ className: "bg-brand-deep" }}>
            Guia
          </Link>
          <Link to="/empregos" className={navLink} activeProps={{ className: "bg-brand-deep" }}>
            Empregos
          </Link>

          {citiesOpen && (
            <div className="absolute left-0 right-0 top-full z-50 rounded-b-lg border bg-card p-5 shadow-xl">
              <div className="mb-3 flex items-center justify-between">
                <p className="font-display text-lg font-bold text-brand">Regiões Administrativas do DF</p>
                <Link to="/cidades" className="text-sm font-semibold text-primary" onClick={() => setCitiesOpen(false)}>
                  Ver todas →
                </Link>
              </div>
              <ul className="grid grid-cols-5 gap-x-4 gap-y-1">
                {RAS.map((ra) => (
                  <li key={ra.slug}>
                    <Link
                      to="/cidades/$slug"
                      params={{ slug: ra.slug }}
                      onClick={() => setCitiesOpen(false)}
                      className="flex gap-2 rounded px-2 py-1 text-sm hover:bg-secondary hover:text-primary"
                    >
                      <span className="w-12 shrink-0 text-xs font-bold text-muted-foreground">RA {ra.roman}</span>
                      <span className="truncate">{ra.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </nav>

      {open && (
        <div className="max-h-[80vh] overflow-y-auto border-t bg-brand md:hidden">
          <div className="flex flex-col p-2">
            <Link to="/" className={navLink} onClick={() => setOpen(false)}>Início</Link>
            <Link to="/cidades" className={navLink} onClick={() => setOpen(false)}>Cidades (todas as RAs)</Link>
            {EDITORIAS.map((e) => (
              <Link key={e.slug} to="/editoria/$slug" params={{ slug: e.slug }} className={navLink} onClick={() => setOpen(false)}>
                {e.label}
              </Link>
            ))}
            <Link to="/guia" className={navLink} onClick={() => setOpen(false)}>Guia de Empresas</Link>
            <Link to="/empregos" className={navLink} onClick={() => setOpen(false)}>Empregos</Link>
          </div>
        </div>
      )}
    </header>
  );
}
