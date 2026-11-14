import { describe, expect, it } from "vitest";
import { newsLabel } from "@/lib/news-label";

const base = { title: "Notícia geral", excerpt: "", category: "df", ras: [] as string[] };

describe("News labels", () => {
  it("prioritizes Gama over the topic for local reporting", () => {
    expect(newsLabel({ ...base, title: "Gama recebe campeonato de futebol", category: "esportes", ras: ["gama"] })).toBe("GAMA");
  });
  it.each([
    ["esportes", "ESPORTE"], ["politica", "POLÍTICA"], ["economia", "ECONOMIA"],
    ["saude", "SAÚDE"], ["seguranca", "SEGURANÇA"],
  ])("uses the category %s for general reporting", (category, expected) => {
    expect(newsLabel({ ...base, category })).toBe(expected);
  });
  it.each([
    ["Campeonato de futebol começa no DF", "ESPORTE"],
    ["CLDF realiza votação nesta semana", "POLÍTICA"],
    ["Comércio impulsiona economia no DF", "ECONOMIA"],
    ["Vacinação contra dengue nos hospitais", "SAÚDE"],
    ["Polícia investiga roubo no DF", "SEGURANÇA"],
  ])("detects the topic for DF news without a feed category: %s", (title, expected) => {
    expect(newsLabel({ ...base, title })).toBe(expected);
  });
  it("keeps a topic for coverage spanning multiple cities", () => {
    expect(newsLabel({ ...base, title: "Gama e Taguatinga recebem campeonato", ras: ["gama", "taguatinga"] })).toBe("ESPORTE");
  });
  it("uses a neutral DF label when no topic is identifiable", () => {
    expect(newsLabel(base)).toBe("DISTRITO FEDERAL");
  });
});