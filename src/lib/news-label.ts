import type { Article } from "./news-types";
import { detectRAs, getRA } from "./data/ras";

const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

const categories: Record<string, string> = {
  esporte: "ESPORTE", esportes: "ESPORTE", politica: "POLÍTICA", economia: "ECONOMIA",
  saude: "SAÚDE", seguranca: "SEGURANÇA", educacao: "EDUCAÇÃO", cultura: "CULTURA",
  internacional: "INTERNACIONAL", direitoshumanos: "DIREITOS HUMANOS", meioambiente: "MEIO AMBIENTE",
};

const topics: [string, RegExp][] = [
  ["SEGURANÇA", /\b(policia|policial|policiais|crime|crimes|prisao|preso|homicidio|roubo|furtos?|seguranca publica)\b/],
  ["SAÚDE", /\b(saude|hospital|hospitais|vacina\w*|sus|dengue|medicos?|enfermagem|ubs)\b/],
  ["ESPORTE", /\b(esportes?|atletas?|futebol|campeonato|torneio|olimpi\w*|competicao esportiva)\b/],
  ["EDUCAÇÃO", /\b(educacao|escolas?|estudantes?|professores?|ensino|matriculas?|universidade)\b/],
  ["CULTURA", /\b(cultura|cultural|teatro|cinema|exposicao|festival|musica|ccbb)\b/],
  ["ECONOMIA", /\b(economia|economico|empregos?|vagas|renda|inflacao|comercio|empreendedor\w*|negocios)\b/],
  ["POLÍTICA", /\b(politica|eleicoes|eleitoral|deputados?|senado|congresso|partidos?|votacao|cldf)\b/],
];

/** City mentions in the headline take precedence; multi-city coverage keeps a topic label. */
export function newsLabel(article: Pick<Article, "title" | "excerpt" | "category" | "ras">): string {
  const headlineCities = detectRAs(article.title);
  const cities = headlineCities.length ? headlineCities : article.ras.flatMap((slug) => {
    const city = getRA(slug);
    return city ? [city] : [];
  });
  if (cities.length === 1) return cities[0]?.name.toLocaleUpperCase("pt-BR") ?? "DISTRITO FEDERAL";
  const category = categories[normalize(article.category)];
  if (category) return category;
  const text = normalize(`${article.title} ${article.excerpt}`);
  return topics.find(([, pattern]) => pattern.test(text))?.[0]
    ?? (article.category === "df" ? "DISTRITO FEDERAL" : "BRASIL");
}