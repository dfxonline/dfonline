import type { Article } from "./news-types";
import { recentCityNews } from "./city-news";

/** Allocate each story once; never fill a sparse section with an already used story. */
export function homeNewsSections(df: Article[], latest: Article[]) {
  const used = new Set<string>();
  const take = (articles: Article[], limit: number) => {
    const selected: Article[] = [];
    for (const article of articles) {
      if (selected.length >= limit) break;
      if (used.has(article.id)) continue;
      used.add(article.id);
      selected.push(article);
    }
    return selected;
  };
  const local = recentCityNews(df, df.length);
  const headlines = take(local.length ? local : latest, 3);
  const side = take(local, 4);
  const cityNews = take(local, 6);
  const dfRest = take(local, 6);
  const brasil = take(latest, 7);
  return { headlines, side, cityNews, dfRest, brasil };
}