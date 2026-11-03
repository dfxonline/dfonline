import cafe from "@/assets/biz-cafe.jpg";
import restaurante from "@/assets/biz-restaurante.jpg";
import academia from "@/assets/biz-academia.jpg";
import oficina from "@/assets/biz-oficina.jpg";
import office from "@/assets/jobs-office.jpg";
import cidade from "@/assets/news-cidade.jpg";

export type Business = {
  slug: string;
  name: string;
  category: string;
  ra: string; // slug da RA
  address: string;
  phone: string;
  whatsapp: string; // somente dígitos, com DDI
  hours: string;
  short: string;
  description: string;
  photos: string[];
  tags: string[];
  featured?: boolean;
  rating: number;
  mapQuery: string;
};

export const BUSINESS_CATEGORIES = [
  "Alimentação",
  "Saúde e Bem-estar",
  "Automotivo",
  "Serviços",
  "Compras",
  "Educação",
] as const;

// Empresas de exemplo — substitua pelos anunciantes reais.
export const BUSINESSES: Business[] = [
  {
    slug: "cafe-cerrado-asa-norte",
    name: "Café Cerrado",
    category: "Alimentação",
    ra: "plano-piloto",
    address: "CLN 408, Bloco C, Loja 12 — Asa Norte, Brasília/DF",
    phone: "(61) 3333-0408",
    whatsapp: "5561999990408",
    hours: "Seg a Sáb, 7h às 20h · Dom, 8h às 14h",
    short: "Cafés especiais do Cerrado, pães artesanais e coworking.",
    description:
      "O Café Cerrado nasceu do encontro entre baristas e pequenos produtores do Planalto Central. Servimos grãos especiais torrados semanalmente, pães de fermentação natural e um cardápio de brunch completo. O espaço tem Wi‑Fi rápido, tomadas em todas as mesas e uma vista privilegiada para o fim de tarde da Asa Norte.",
    photos: [cafe, restaurante, office],
    tags: ["Wi‑Fi", "Pet friendly", "Brunch"],
    featured: true,
    rating: 4.8,
    mapQuery: "CLN 408 Asa Norte Brasília",
  },
  {
    slug: "sabores-do-brasil-taguatinga",
    name: "Sabores do Brasil",
    category: "Alimentação",
    ra: "taguatinga",
    address: "QNA 32, Lote 5 — Taguatinga Norte, Taguatinga/DF",
    phone: "(61) 3351-3232",
    whatsapp: "5561999993232",
    hours: "Ter a Dom, 11h às 23h",
    short: "Comida brasileira caseira, feijoada aos sábados.",
    description:
      "Restaurante familiar com mais de 15 anos em Taguatinga. Self‑service no almoço com pratos regionais de todo o Brasil e à la carte à noite. Aos sábados, feijoada completa com samba ao vivo. Espaço para eventos e confraternizações.",
    photos: [restaurante, cafe, cidade],
    tags: ["Delivery", "Música ao vivo", "Eventos"],
    featured: true,
    rating: 4.7,
    mapQuery: "QNA 32 Taguatinga Norte",
  },
  {
    slug: "movimento-academia-aguas-claras",
    name: "Movimento Academia",
    category: "Saúde e Bem-estar",
    ra: "aguas-claras",
    address: "Rua 25 Norte, Lote 3 — Águas Claras/DF",
    phone: "(61) 3036-2525",
    whatsapp: "5561999992525",
    hours: "Seg a Sex, 5h às 23h · Sáb e Dom, 8h às 14h",
    short: "Musculação, funcional e aulas coletivas com vista panorâmica.",
    description:
      "Academia completa com equipamentos de última geração, área de peso livre, cross training e mais de 40 aulas coletivas por semana. Avaliação física gratuita na matrícula e professores à disposição em todos os horários.",
    photos: [academia, office, cidade],
    tags: ["Estacionamento", "Avaliação grátis", "24 aulas/sem"],
    featured: true,
    rating: 4.9,
    mapQuery: "Rua 25 Norte Águas Claras",
  },
  {
    slug: "auto-center-ceilandia",
    name: "Auto Center Ceilândia",
    category: "Automotivo",
    ra: "ceilandia",
    address: "QNM 18, Conjunto L — Ceilândia Sul, Ceilândia/DF",
    phone: "(61) 3371-1818",
    whatsapp: "5561999991818",
    hours: "Seg a Sex, 8h às 18h · Sáb, 8h às 12h",
    short: "Mecânica geral, injeção eletrônica, freios e suspensão.",
    description:
      "Oficina com equipe certificada e diagnóstico computadorizado. Fazemos revisão preventiva, troca de óleo, alinhamento e balanceamento, ar‑condicionado automotivo e muito mais. Orçamento sem compromisso e garantia em todos os serviços.",
    photos: [oficina, cidade, office],
    tags: ["Orçamento grátis", "Garantia", "Cartão"],
    featured: true,
    rating: 4.6,
    mapQuery: "QNM 18 Ceilândia Sul",
  },
  {
    slug: "studio-equilibrio-sudoeste",
    name: "Studio Equilíbrio",
    category: "Saúde e Bem-estar",
    ra: "sudoeste-octogonal",
    address: "CLSW 103, Bloco B — Sudoeste, Brasília/DF",
    phone: "(61) 3344-1030",
    whatsapp: "5561999991030",
    hours: "Seg a Sex, 6h às 21h · Sáb, 8h às 12h",
    short: "Pilates, fisioterapia e yoga em turmas reduzidas.",
    description:
      "Estúdio especializado em pilates clínico e fisioterapia, com atendimento individual ou em pequenos grupos. Ambiente acolhedor e profissionais com pós‑graduação.",
    photos: [academia, cafe],
    tags: ["Pilates", "Fisioterapia", "Yoga"],
    rating: 4.9,
    mapQuery: "CLSW 103 Sudoeste Brasília",
  },
  {
    slug: "papelaria-gama-centro",
    name: "Papelaria Gama Centro",
    category: "Compras",
    ra: "gama",
    address: "Setor Central, Quadra 2, Loja 8 — Gama/DF",
    phone: "(61) 3556-0202",
    whatsapp: "5561999990202",
    hours: "Seg a Sáb, 8h às 19h",
    short: "Material escolar, escritório, impressões e encadernação.",
    description:
      "Tudo para escola e escritório em um só lugar. Impressões coloridas, plotagem, encadernação e personalizados. Lista escolar com desconto e entrega no Gama e região.",
    photos: [office, cidade],
    tags: ["Impressão", "Lista escolar", "Entrega"],
    rating: 4.5,
    mapQuery: "Setor Central Gama DF",
  },
  {
    slug: "curso-futuro-samambaia",
    name: "Curso Futuro",
    category: "Educação",
    ra: "samambaia",
    address: "QR 404, Conjunto 1 — Samambaia Norte, Samambaia/DF",
    phone: "(61) 3358-4040",
    whatsapp: "5561999994040",
    hours: "Seg a Sex, 8h às 22h · Sáb, 8h às 13h",
    short: "Preparatório para concursos, ENEM e cursos profissionalizantes.",
    description:
      "Há 10 anos preparando alunos de Samambaia e região para concursos públicos do DF e ENEM. Turmas presenciais e online, simulados semanais e material próprio.",
    photos: [office, cafe],
    tags: ["Concursos", "ENEM", "Online"],
    rating: 4.7,
    mapQuery: "QR 404 Samambaia Norte",
  },
  {
    slug: "eletrica-rapida-sobradinho",
    name: "Elétrica Rápida",
    category: "Serviços",
    ra: "sobradinho",
    address: "Quadra 8, Área Especial — Sobradinho/DF",
    phone: "(61) 3591-0808",
    whatsapp: "5561999990808",
    hours: "Seg a Sáb, 7h às 19h · Plantão 24h",
    short: "Eletricistas residenciais e comerciais com atendimento 24h.",
    description:
      "Instalações, reparos, quadros de energia, iluminação e laudos técnicos. Atendemos Sobradinho, Sobradinho II, Fercal e Planaltina com plantão 24 horas.",
    photos: [oficina, cidade],
    tags: ["24h", "Laudos", "Residencial"],
    rating: 4.6,
    mapQuery: "Quadra 8 Sobradinho DF",
  },
];

export const getBusiness = (slug: string) => BUSINESSES.find((b) => b.slug === slug);

export const whatsappLink = (b: Business) =>
  `https://wa.me/${b.whatsapp}?text=${encodeURIComponent(`Olá! Encontrei a ${b.name} no Guia de Empresas do DF Online.`)}`;
