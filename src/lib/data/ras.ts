export type RA = {
  number: number;
  roman: string;
  name: string;
  slug: string;
  /** Termos usados para identificar notícias desta RA */
  keywords: string[];
  population?: string;
};

const raw: [number, string, string, string[]][] = [
  [1, "I", "Plano Piloto", ["Plano Piloto", "Asa Sul", "Asa Norte", "Esplanada", "Eixo Monumental", "Noroeste"]],
  [2, "II", "Gama", ["Gama"]],
  [3, "III", "Taguatinga", ["Taguatinga"]],
  [4, "IV", "Brazlândia", ["Brazlândia"]],
  [5, "V", "Sobradinho", ["Sobradinho"]],
  [6, "VI", "Planaltina", ["Planaltina"]],
  [7, "VII", "Paranoá", ["Paranoá"]],
  [8, "VIII", "Núcleo Bandeirante", ["Núcleo Bandeirante"]],
  [9, "IX", "Ceilândia", ["Ceilândia"]],
  [10, "X", "Guará", ["Guará"]],
  [11, "XI", "Cruzeiro", ["Cruzeiro"]],
  [12, "XII", "Samambaia", ["Samambaia"]],
  [13, "XIII", "Santa Maria", ["Santa Maria"]],
  [14, "XIV", "São Sebastião", ["São Sebastião"]],
  [15, "XV", "Recanto das Emas", ["Recanto das Emas"]],
  [16, "XVI", "Lago Sul", ["Lago Sul"]],
  [17, "XVII", "Riacho Fundo", ["Riacho Fundo"]],
  [18, "XVIII", "Lago Norte", ["Lago Norte"]],
  [19, "XIX", "Candangolândia", ["Candangolândia"]],
  [20, "XX", "Águas Claras", ["Águas Claras"]],
  [21, "XXI", "Riacho Fundo II", ["Riacho Fundo II"]],
  [22, "XXII", "Sudoeste/Octogonal", ["Sudoeste", "Octogonal"]],
  [23, "XXIII", "Varjão", ["Varjão"]],
  [24, "XXIV", "Park Way", ["Park Way"]],
  [25, "XXV", "SCIA/Estrutural", ["Estrutural", "SCIA"]],
  [26, "XXVI", "Sobradinho II", ["Sobradinho II"]],
  [27, "XXVII", "Jardim Botânico", ["Jardim Botânico"]],
  [28, "XXVIII", "Itapoã", ["Itapoã"]],
  [29, "XXIX", "SIA", ["SIA", "Setor de Indústria e Abastecimento"]],
  [30, "XXX", "Vicente Pires", ["Vicente Pires"]],
  [31, "XXXI", "Fercal", ["Fercal"]],
  [32, "XXXII", "Sol Nascente/Pôr do Sol", ["Sol Nascente", "Pôr do Sol"]],
  [33, "XXXIII", "Arniqueira", ["Arniqueira"]],
  [34, "XXXIV", "Arapoanga", ["Arapoanga"]],
  [35, "XXXV", "Água Quente", ["Água Quente"]],
];

function slugify(s: string) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Todas as Regiões Administrativas do DF, em ordem numérica (RA I, RA II, ...). */
export const RAS: RA[] = raw
  .map(([number, roman, name, keywords]) => ({ number, roman, name, slug: slugify(name), keywords }))
  .sort((a, b) => a.number - b.number);

export const getRA = (slug: string) => RAS.find((r) => r.slug === slug);

/** Escapa o termo para regex, exigindo limites de palavra. */
function termRegex(term: string) {
  const esc = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^\\p{L}])${esc}(?![\\p{L}]|\\s+II\\b)`, "u");
}

/** Retorna as RAs mencionadas num texto. */
export function detectRAs(text: string): RA[] {
  return RAS.filter((ra) =>
    ra.keywords.some((k) => (k === "SIA" ? /\bSIA\b/.test(text) : termRegex(k).test(text))),
  );
}
