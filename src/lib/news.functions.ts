import { createServerFn } from "@tanstack/react-start";
import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";
import type { Article } from "./news-types";
import { getEditoria } from "./news-types";

const safe = async <T,>(p: Promise<T>, fallback: T): Promise<T> => {
  try {
    return await p;
  } catch (e) {
    console.error("[news]", e);
    return fallback;
  }
};

export const getDFNews = createServerFn({ method: "GET" }).handler(async (): Promise<Article[]> => {
  const { fetchAgenciaBrasilia } = await import("./news.server");
  return safe(fetchAgenciaBrasilia(18), []);
});

export const getEditoriaNews = createServerFn({ method: "GET" })
  .inputValidator((d) => z.object({ slug: z.string().max(40) }).parse(d))
  .handler(async ({ data }): Promise<Article[]> => {
    const { fetchAgenciaBrasil } = await import("./news.server");
    const feed = data.slug === "ultimas" ? "ultimasnoticias" : getEditoria(data.slug)?.feed;
    if (!feed) return [];
    return safe(fetchAgenciaBrasil(feed), []);
  });

export const getCCBB = createServerFn({ method: "GET" }).handler(async (): Promise<Article[]> => {
  const { fetchCCBB } = await import("./news.server");
  return safe(fetchCCBB(8), []);
});

export const getArticle = createServerFn({ method: "GET" })
  .inputValidator((d) => z.object({ id: z.string().min(3).max(300) }).parse(d))
  .handler(async ({ data }): Promise<Article | null> => {
    const { fetchArticleById } = await import("./news.server");
    return safe(fetchArticleById(data.id), null);
  });

const stale = 5 * 60 * 1000;
export const dfNewsQuery = () => queryOptions({ queryKey: ["df"], queryFn: () => getDFNews(), staleTime: stale });
export const editoriaQuery = (slug: string) =>
  queryOptions({ queryKey: ["ed", slug], queryFn: () => getEditoriaNews({ data: { slug } }), staleTime: stale });
export const ccbbQuery = () => queryOptions({ queryKey: ["ccbb"], queryFn: () => getCCBB(), staleTime: stale });
export const articleQuery = (id: string) =>
  queryOptions({ queryKey: ["a", id], queryFn: () => getArticle({ data: { id } }), staleTime: stale });
