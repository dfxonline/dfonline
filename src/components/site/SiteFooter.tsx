import { Link } from "@tanstack/react-router";
import { FooterLogo } from "./Logo";
import { RAS } from "@/lib/data/ras";
import { EDITORIAS, SOURCE_HOME, SOURCE_LABEL, type Source } from "@/lib/news-types";

export function SiteFooter() {
  return (
    <footer className="topo mt-16 text-brand-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <FooterLogo />
            <p className="mt-4 text-sm text-brand-foreground/75">
              O portal de notícias de Brasília e de todas as Regiões Administrativas do Distrito Federal.
            </p>
          </div>
          <div>
            <h4 className="mb-3 font-display font-bold">Editorias</h4>
            <ul className="space-y-1.5 text-sm text-brand-foreground/80">
              {EDITORIAS.map((e) => (
                <li key={e.slug}>
                  <Link to="/editoria/$slug" params={{ slug: e.slug }} className="hover:text-primary">{e.label}</Link>
                </li>
              ))}
              <li><Link to="/guia" className="hover:text-primary">Guia de Empresas</Link></li>
              <li><Link to="/empregos" className="hover:text-primary">Empregos</Link></li>
            </ul>
          </div>
          <div className="md:col-span-2">
            <h4 className="mb-3 font-display font-bold">Cidades do DF</h4>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-brand-foreground/80 sm:grid-cols-3">
              {RAS.map((ra) => (
                <li key={ra.slug}>
                  <Link to="/cidades/$slug" params={{ slug: ra.slug }} className="hover:text-primary">
                    <span className="text-brand-foreground/50">RA {ra.roman}</span> {ra.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-brand-foreground/15 pt-6 text-xs text-brand-foreground/60">
          <p>
            Conteúdos reproduzidos com crédito às fontes:{" "}
            {(Object.keys(SOURCE_LABEL) as Source[]).map((s, i) => (
              <span key={s}>
                {i > 0 && " · "}
                <a href={SOURCE_HOME[s]} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">
                  {SOURCE_LABEL[s]}
                </a>
              </span>
            ))}
          </p>
          <p className="mt-2">© {new Date().getFullYear()} DF Online. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
