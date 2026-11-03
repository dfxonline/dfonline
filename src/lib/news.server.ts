import type { Article, Source } from "./news-types";
import { detectRAs } from "./data/ras";

const UA = "Mozilla/5.0 (compatible; DFOnlineBot/1.0; +https://dfonline.com.br)";
const TTL = 10 * 60 * 1000;
const cache = new Map<string, { at: number; value: unknown }>();

async function cached<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < TTL) return hit.value as T;
  const value = await fn();
  cache.set(key, { at: Date.now(), value });
  return value;
}

async function getText(url: string): Promise<string> {
  const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "text/html,application/xml" } });
  if (!res.ok) throw new Error(`Falha ao buscar ${url} [${res.status}]`);
  return res.text();
}

const ENT: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
export function decode(s: string) {
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, n) => ENT[n.toLowerCase()] ?? m);
}
const stripTags = (s: string) => decode(s.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
const clip = (s: string, n = 220) => (s.length > n ? s.slice(0, n).replace(/\s+\S*$/, "") + "…" : s);

function sanitize(html: string, base: string) {
  return html
    .replace(/<(script|style|iframe|noscript|form|button)[\s\S]*?<\/\1>/gi, "")
    .replace(/<source[^>]*>/gi, "")
    .replace(/<\/?picture[^>]*>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\sstyle="[^"]*"/gi, "")
    .replace(/\sclass="[^"]*"/gi, "")
    .replace(/(src|href)="\/(?!\/)/gi, `$1="${base}/`)
    .replace(/<a /gi, '<a target="_blank" rel="noopener noreferrer" ');
}

function meta(html: string, prop: string) {
  const re = new RegExp(`<meta[^>]+(?:property|name)="${prop}"[^>]+content="([^"]*)"`, "i");
  const m = html.match(re);
  return m ? decode(m[1]) : undefined;
}

function tag(xml: string, name: string) {
  const m = xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, "i"));
  return m ? m[1].replace(/^<!\[CDATA\[|\]\]>$/g, "").trim() : "";
}

function withRAs(a: Omit<Article, "ras">): Article {
  return { ...a, ras: detectRAs(`${a.title} ${a.excerpt}`).map((r) => r.slug) };
}

/* ---------------- Agência Brasil (EBC) ---------------- */
const ABR = "https://agenciabrasil.ebc.com.br";

export function fetchAgenciaBrasil(feed: string): Promise<Article[]> {
  return cached(`abr:${feed}`, async () => {
    const xml = await getText(`${ABR}/rss/${feed}/feed.xml`);
    const items = xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];
    return items.map((it) => {
      const link = decode(tag(it, "link"));
      const m = link.match(/ebc\.com\.br\/([^/]+)\/noticia\/([^/]+)\/([^/?#]+)/);
      const id = m ? `abr~${m[1]}~${m[2]}~${m[3]}` : `abr~x~x~${encodeURIComponent(link)}`;
      const descHtml = decode(tag(it, "description"));
      const body = descHtml.replace(/^[\s\S]*?logo-agenciabrasil[\s\S]*?<\/p>/i, "");
      const text = stripTags(body);
      return withRAs({
        id,
        source: "agenciabrasil",
        title: stripTags(tag(it, "title")),
        excerpt: clip(text),
        image: decode(tag(it, "imagem-destaque")) || undefined,
        date: new Date(tag(it, "pubDate")).toISOString(),
        author: stripTags(tag(it, "dc:creator")) || "Agência Brasil",
        link,
        category: m?.[1] ?? feed,
        html: sanitize(body, ABR),
      });
    });
  });
}

/* ---------------- Agência Brasília (GDF) ---------------- */
const AGB = "https://www.agenciabrasilia.df.gov.br";

function parseBRDate(s?: string) {
  const m = s?.match(/(\d{2})\/(\d{2})\/(\d{4})(?:\s*às\s*(\d{2})h(\d{2}))?/);
  if (!m) return new Date().toISOString();
  return new Date(`${m[3]}-${m[2]}-${m[1]}T${m[4] ?? "12"}:${m[5] ?? "00"}:00-03:00`).toISOString();
}

function extractDiv(html: string, marker: string) {
  const start = html.indexOf(marker);
  if (start < 0) return "";
  const open = html.lastIndexOf("<div", start);
  let depth = 0;
  const re = /<\/?div\b[^>]*>/gi;
  re.lastIndex = open;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    depth += m[0][1] === "/" ? -1 : 1;
    if (depth === 0) return html.slice(html.indexOf(">", open) + 1, m.index);
  }
  return "";
}

export function fetchAgenciaBrasiliaArticle(slug: string): Promise<Article> {
  return cached(`agb:a:${slug}`, async () => {
    const link = `${AGB}/w/${slug}`;
    const html = await getText(link);
    const body = extractDiv(html, 'class="text-content"');
    const sig = html.match(/class="assinatura[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/);
    const title = meta(html, "og:title") ?? slug;
    const excerpt = meta(html, "og:description") ?? clip(stripTags(body));
    return withRAs({
      id: `agb~${slug}`,
      source: "agenciabrasilia",
      title,
      excerpt,
      image: meta(html, "og:image"),
      imageCredit: meta(html, "og:image:alt"),
      date: parseBRDate(html.match(/\d{2}\/\d{2}\/\d{4} às \d{2}h\d{2}/)?.[0]),
      author: sig ? stripTags(sig[1]) : "Agência Brasília",
      link,
      category: "df",
      html: sanitize(body, AGB),
    });
  });
}

export function fetchAgenciaBrasilia(limit = 18): Promise<Article[]> {
  return cached(`agb:list:${limit}`, async () => {
    const home = await getText(AGB + "/");
    const slugs = [
      ...new Set([...home.matchAll(/href="(?:https:\/\/www\.agenciabrasilia\.df\.gov\.br)?\/w\/([^"/?#]+)\/?"/g)].map((m) => m[1])),
    ]
      .filter((s) => !s.includes("secom-do-gdf-tem-novo"))
      .slice(0, limit);
    const results = await Promise.allSettled(slugs.map((s) => fetchAgenciaBrasiliaArticle(s)));
    return results
      .flatMap((r) => (r.status === "fulfilled" ? [r.value] : []))
      .sort((a, b) => b.date.localeCompare(a.date));
  });
}

/* ---------------- CCBB Brasília ---------------- */
const CCBB = "https://ccbb.com.br";

export function fetchCCBBEvent(slug: string): Promise<Article> {
  return cached(`ccbb:a:${slug}`, async () => {
    const link = `${CCBB}/brasilia/programacao/${slug}/`;
    const html = await getText(link);
    const title = (meta(html, "og:title") ?? slug).replace(/\s*[-|–]\s*CCBB.*$/i, "");
    const desc = meta(html, "og:description") ?? "";
    return {
      id: `ccbb~${slug}`,
      source: "ccbb" as Source,
      title,
      excerpt: clip(desc),
      image: meta(html, "og:image"),
      date: new Date().toISOString(),
      author: "Centro Cultural Banco do Brasil Brasília",
      link,
      category: "cultura",
      html: `<p>${desc}</p>`,
      ras: ["plano-piloto"],
    };
  });
}

export function fetchCCBB(limit = 8): Promise<Article[]> {
  return cached(`ccbb:list:${limit}`, async () => {
    const html = await getText(`${CCBB}/brasilia/programacao/`);
    const skip = new Set(["vem-ai", "exposicoes-permanentes"]);
    const slugs = [...new Set([...html.matchAll(/href="https:\/\/ccbb\.com\.br\/brasilia\/programacao\/([a-z0-9-]+)\/"/g)].map((m) => m[1]))]
      .filter((s) => !skip.has(s))
      .slice(0, limit);
    const results = await Promise.allSettled(slugs.map((s) => fetchCCBBEvent(s)));
    return results.flatMap((r) => (r.status === "fulfilled" ? [r.value] : []));
  });
}

/* ---------------- Detalhe por id ---------------- */
export async function fetchArticleById(id: string): Promise<Article | null> {
  const [kind, ...rest] = id.split("~");
  if (kind === "agb" && rest[0]) return fetchAgenciaBrasiliaArticle(rest[0]);
  if (kind === "ccbb" && rest[0]) return fetchCCBBEvent(rest[0]);
  if (kind === "abr" && rest.length === 3) {
    const [editoria] = rest;
    for (const feed of [editoria, "ultimasnoticias"]) {
      try {
        const list = await fetchAgenciaBrasil(feed);
        const found = list.find((a) => a.id === id);
        if (found) return found;
      } catch {
        /* tenta próximo feed */
      }
    }
    // Fallback: página original
    const link = `${ABR}/${rest[0]}/noticia/${rest[1]}/${rest[2]}`;
    const html = await getText(link);
    return withRAs({
      id,
      source: "agenciabrasil",
      title: meta(html, "og:title") ?? rest[2],
      excerpt: meta(html, "og:description") ?? "",
      image: meta(html, "og:image"),
      date: new Date().toISOString(),
      author: "Agência Brasil",
      link,
      category: rest[0],
      html: `<p>${meta(html, "og:description") ?? ""}</p>`,
    });
  }
  return null;
}
