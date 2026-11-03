import { Link } from "@tanstack/react-router";
import { Briefcase, MapPin, Star } from "lucide-react";
import type { Business } from "@/lib/data/businesses";
import type { Job } from "@/lib/data/jobs";
import { getRA } from "@/lib/data/ras";
import { formatDate } from "@/lib/format";

export function BusinessCard({ b }: { b: Business }) {
  const ra = getRA(b.ra);
  return (
    <Link to="/guia/$slug" params={{ slug: b.slug }} className="group flex flex-col overflow-hidden rounded-lg border bg-card shadow-sm transition-shadow hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img src={b.photos[0]} alt={b.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        {b.featured && (
          <span className="absolute left-3 top-3 rounded bg-primary px-2 py-0.5 text-[11px] font-bold uppercase text-primary-foreground">Destaque</span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold uppercase tracking-wide text-primary">{b.category}</span>
          <span className="flex items-center gap-1 font-semibold text-brand">
            <Star className="h-3.5 w-3.5 fill-primary text-primary" /> {b.rating.toFixed(1)}
          </span>
        </div>
        <h3 className="mt-1 font-display text-lg font-bold group-hover:text-primary">{b.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{b.short}</p>
        <p className="mt-auto flex items-center gap-1 pt-3 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" /> {ra ? `RA ${ra.roman} · ${ra.name}` : ""}
        </p>
      </div>
    </Link>
  );
}

export function JobRow({ j, compact }: { j: Job; compact?: boolean }) {
  const ra = getRA(j.ra);
  return (
    <Link to="/empregos/$id" params={{ id: j.id }} className="group flex items-center gap-4 rounded-lg border bg-card p-4 transition-colors hover:border-primary">
      {!compact && (
        <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-md bg-secondary text-brand sm:flex">
          <Briefcase className="h-5 w-5" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <h3 className="font-display font-semibold leading-snug group-hover:text-primary">{j.title}</h3>
        <p className="text-sm text-muted-foreground">
          {j.company} · {ra?.name}
        </p>
        {!compact && (
          <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
            <span className="rounded bg-secondary px-2 py-0.5 font-medium text-brand">{j.type}</span>
            <span className="rounded bg-secondary px-2 py-0.5 font-medium text-brand">{j.mode}</span>
            <span className="rounded bg-secondary px-2 py-0.5 font-medium text-brand">{j.area}</span>
          </div>
        )}
      </div>
      <div className="shrink-0 text-right">
        {j.salary && <p className="text-sm font-semibold text-brand">{j.salary}</p>}
        <p className="text-xs text-muted-foreground">{formatDate(j.postedAt + "T12:00:00-03:00")}</p>
      </div>
    </Link>
  );
}

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.32l-.34-.2-3.57.94.95-3.48-.22-.36a9.4 9.4 0 0 1-1.44-5.02c0-5.2 4.23-9.43 9.44-9.43a9.38 9.38 0 0 1 9.43 9.44c0 5.2-4.23 9.43-9.44 9.43m8.03-17.46A11.27 11.27 0 0 0 12.05.72C5.8.72.7 5.8.7 12.06c0 2 .52 3.95 1.52 5.67L.6 23.6l6.01-1.58a11.3 11.3 0 0 0 5.43 1.38h.01c6.25 0 11.34-5.09 11.35-11.34 0-3.03-1.18-5.88-3.32-8.02" />
    </svg>
  );
}
