import { describe, expect, it } from "vitest";
import { recentCityNews } from "@/lib/city-news";
import type { Article } from "@/lib/news-types";

const article = (id: string, date: string, ras: string[]): Article => ({
  id, date, ras, source: "agenciabrasilia", title: id, excerpt: "", author: "", link: "", category: "df", html: "",
});

describe("City news on the home page", () => {
  it("only selects news associated with DF cities", () => {
    expect(recentCityNews([
      article("local", "2026-11-12T15:00:00Z", ["taguatinga"]),
      article("national", "2026-11-13T15:00:00Z", []),
    ]).map((a) => a.id)).toEqual(["local"]);
  });

  it("puts the most recent city news first", () => {
    expect(recentCityNews([
      article("older", "2026-11-11T15:00:00Z", ["gama"]),
      article("newest", "2026-11-12T15:00:00Z", ["taguatinga"]),
    ]).map((a) => a.id)).toEqual(["newest", "older"]);
  });
});