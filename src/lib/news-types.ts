export type Source = "agenciabrasil" | "agenciabrasilia" | "ccbb";

export type Article = {
  id: string;
  source: Source;
  title: string;
  excerpt: string;
  image?: string;
  imageCredit?: string;
  date: string;
  author: string;
  link: string;
  category: string;
  html: string;
  /** slugs das RAs mencionadas */
  ras: string[];
};

export const SOURCE_LABEL: Record<Source, string> = {
  agenciabrasil: "Agência Brasil",
  agenciabrasilia: "Agência Brasília",
  ccbb: "CCBB Brasília",
};

export const SOURCE_HOME: Record<Source, string> = {
  agenciabrasil: "https://agenciabrasil.ebc.com.br/",
  agenciabrasilia: "https://www.agenciabrasilia.df.gov.br/",
  ccbb: "https://ccbb.com.br/brasilia/",
};

export type Editoria = {
  slug: string;
  label: string;
  /** feed da Agência Brasil */
  feed: string;
  description: string;
};

export const EDITORIAS: Editoria[] = [
  { slug: "politica", label: "Política", feed: "politica", description: "Política no DF e no Brasil." },
  { slug: "economia", label: "Economia", feed: "economia", description: "Economia, emprego, renda e negócios." },
  { slug: "brasil", label: "Brasil", feed: "geral", description: "O que acontece no país." },
  { slug: "cultura", label: "Cultura", feed: "cultura", description: "Agenda cultural, CCBB Brasília e mais." },
  { slug: "esportes", label: "Esportes", feed: "esportes", description: "Esportes no DF e no Brasil." },
  { slug: "saude", label: "Saúde", feed: "saude", description: "Saúde pública e bem-estar." },
  { slug: "educacao", label: "Educação", feed: "educacao", description: "Escolas, universidades e concursos." },
];

export const getEditoria = (slug: string) => EDITORIAS.find((e) => e.slug === slug);
