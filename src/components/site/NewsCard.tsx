import { Link } from "@tanstack/react-router";
import type { Article } from "@/lib/news-types";
import { SOURCE_LABEL } from "@/lib/news-types";
import { timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";
import fallback from "@/assets/news-esplanada.jpg";

export function SourceTag({ a, className }: { a: Article; className?: string }) {
  return (
    <span className={cn("text-[11px] font-semibold uppercase tracking-wider text-primary", className)}>
      {SOURCE_LABEL[a.source]}
    </span>
  );
}

function Img({ a, className, eager }: { a: Article; className?: string; eager?: boolean }) {
  return (
    <img
      src={a.image || fallback}
      alt=""
      loading={eager ? "eager" : "lazy"}
      referrerPolicy="no-referrer"
      onError={(e) => ((e.currentTarget as HTMLImageElement).src = fallback)}
      className={cn("h-full w-full object-cover transition-transform duration-500 group-hover:scale-105", className)}
    />
  );
}

export function NewsCard({ a, size = "md" }: { a: Article; size?: "sm" | "md" | "lg" }) {
  return (
    <Link to="/noticia/$id" params={{ id: a.id }} className="group block">
      <div className={cn("overflow-hidden rounded-md bg-muted", size === "lg" ? "aspect-[16/10]" : "aspect-[16/10]")}>
        <Img a={a} />
      </div>
      <div className="mt-3 flex items-center gap-2">
        <SourceTag a={a} />
        <span className="text-xs text-muted-foreground">· {timeAgo(a.date)}</span>
      </div>
      <h3
        className={cn(
          "mt-1 font-display font-semibold leading-snug text-foreground group-hover:text-primary",
          size === "lg" ? "text-2xl" : size === "sm" ? "text-base" : "text-lg",
        )}
      >
        {a.title}
      </h3>
      {size !== "sm" && <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{a.excerpt}</p>}
    </Link>
  );
}

export function NewsRow({ a }: { a: Article }) {
  return (
    <Link to="/noticia/$id" params={{ id: a.id }} className="group flex gap-3 py-3">
      <div className="h-20 w-28 shrink-0 overflow-hidden rounded bg-muted">
        <Img a={a} />
      </div>
      <div className="min-w-0">
        <SourceTag a={a} />
        <h4 className="line-clamp-3 font-display text-[15px] font-semibold leading-snug group-hover:text-primary">{a.title}</h4>
      </div>
    </Link>
  );
}

export function HeroCard({ a }: { a: Article }) {
  return (
    <Link to="/noticia/$id" params={{ id: a.id }} className="group relative block overflow-hidden rounded-lg bg-brand-deep">
      <div className="aspect-[16/10] md:aspect-[16/9]">
        <Img a={a} eager className="opacity-90" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-brand-deep via-brand-deep/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5 md:p-8">
        <span className="inline-block rounded bg-primary px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-primary-foreground">
          {SOURCE_LABEL[a.source]}
        </span>
        <h2 className="mt-3 font-display text-2xl font-bold leading-tight text-brand-foreground md:text-4xl">{a.title}</h2>
        <p className="mt-2 hidden max-w-2xl text-brand-foreground/85 md:line-clamp-2">{a.excerpt}</p>
      </div>
    </Link>
  );
}

export function SectionHeader({ title, to, linkLabel = "Ver mais" }: { title: string; to?: React.ReactNode; linkLabel?: string }) {
  return (
    <div className="mb-5 flex items-end justify-between border-b-2 border-brand pb-2">
      <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-brand">
        <span className="inline-block h-6 w-2 rounded-sm bg-primary" />
        {title}
      </h2>
      {to && <span className="text-sm font-semibold text-primary">{to}</span>}
      {!to && linkLabel === "" && null}
    </div>
  );
}

export function EmptyNews({ message = "Não foi possível carregar as notícias agora. Tente novamente em instantes." }) {
  return <p className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">{message}</p>;
}
