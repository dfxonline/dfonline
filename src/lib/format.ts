export function formatDate(iso: string, withTime = false) {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "America/Sao_Paulo",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
}

export function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 60000;
  if (diff < 60) return `há ${Math.max(1, Math.round(diff))} min`;
  if (diff < 60 * 24) return `há ${Math.round(diff / 60)} h`;
  return formatDate(iso);
}
