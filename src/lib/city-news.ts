import type { Article } from "./news-types";

export function recentCityNews(articles: Article[], limit = 6): Article[] {
  return [...articles]
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
    .slice(0, limit);
}