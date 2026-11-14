import { describe, expect, it } from "vitest";
import { homeNewsSections } from "@/lib/home-news";
import type { Article } from "@/lib/news-types";

const article = (id: string, day: number): Article => ({
  id, date: `2026-11-${String(day).padStart(2, "0")}T15:00:00Z`, ras: [],
  source: "agenciabrasilia", title: id, excerpt: "", author: "", link: "", category: "df", html: "",
});

describe("Home news distribution", () => {
  it("does not repeat stories between the slide, highlights, cities and DF", () => {
    const df = Array.from({ length: 18 }, (_, i) => article(`df-${i}`, i + 1));
    const sections = homeNewsSections([...df, df[0]].filter((a): a is Article => Boolean(a)), []);
    expect(sections.headlines.map(a => a.id)).toEqual(["df-17", "df-16", "df-15"]);
    expect(sections.side.map(a => a.id)).toEqual(["df-14", "df-13", "df-12", "df-11"]);
    expect(sections.cityNews.map(a => a.id)).toEqual(["df-10", "df-9", "df-8", "df-7", "df-6", "df-5"]);
    const ids = Object.values(sections).flat().map(a => a.id);
    expect(ids).toHaveLength(18);
    expect(new Set(ids).size).toBe(18);
  });
  it("does not reuse fallback national headlines in Brasil", () => {
    const sections = homeNewsSections([], [article("a", 14), article("b", 13), article("c", 12), article("d", 11)]);
    expect(sections.headlines.map(a => a.id)).toEqual(["a", "b", "c"]);
    expect(sections.brasil.map(a => a.id)).toEqual(["d"]);
    expect(sections.side).toEqual([]);
    expect(sections.cityNews).toEqual([]);
  });
  it("leaves sparse sections empty instead of repeating stories", () => {
    const sections = homeNewsSections([article("only", 14)], []);
    expect(sections.headlines.map(a => a.id)).toEqual(["only"]);
    expect(sections.side).toEqual([]);
    expect(sections.cityNews).toEqual([]);
    expect(sections.dfRest).toEqual([]);
  });
});