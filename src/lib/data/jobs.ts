export type Job = {
  id: string;
  title: string;
  company: string;
  ra: string;
  type: "CLT" | "PJ" | "Estágio" | "Temporário" | "Jovem Aprendiz";
  mode: "Presencial" | "Híbrido" | "Remoto";
  salary?: string;
  area: string;
  postedAt: string; // ISO
  featured?: boolean;
  description: string;
  requirements: string[];
  benefits: string[];
  applyEmail: string;
};

// Vagas de exemplo — substitua pelas vagas reais dos anunciantes.
export const JOBS: Job[] = [
  { id: "atendente-cafe-cerrado", title: "Atendente / Barista", company: "Café Cerrado", ra: "plano-piloto", type: "CLT", mode: "Presencial", salary: "R$ 1.900 + gorjetas", area: "Alimentação", postedAt: "2026-11-02", featured: true, description: "Atendimento ao cliente, preparo de bebidas e organização do salão.", requirements: ["Ensino médio completo", "Disponibilidade aos fins de semana", "Experiência com café é um diferencial"], benefits: ["Vale-transporte", "Alimentação no local", "Curso de barista"], applyEmail: "vagas@cafecerrado.com.br" },
  { id: "auxiliar-administrativo-taguatinga", title: "Auxiliar Administrativo", company: "Grupo Planalto Serviços", ra: "taguatinga", type: "CLT", mode: "Presencial", salary: "R$ 2.200", area: "Administrativo", postedAt: "2026-11-02", featured: true, description: "Rotinas administrativas, controle de documentos e atendimento telefônico.", requirements: ["Ensino médio completo", "Pacote Office", "Boa comunicação"], benefits: ["VT", "VR R$ 30/dia", "Plano de saúde"], applyEmail: "rh@grupoplanalto.com.br" },
  { id: "desenvolvedor-frontend-remoto", title: "Desenvolvedor(a) Front-end Pleno", company: "Capital Tech", ra: "aguas-claras", type: "PJ", mode: "Híbrido", salary: "R$ 8.000 a R$ 11.000", area: "Tecnologia", postedAt: "2026-11-01", featured: true, description: "Desenvolvimento de interfaces web com React e TypeScript para clientes do setor público.", requirements: ["React e TypeScript", "3 anos de experiência", "Git"], benefits: ["Horário flexível", "Auxílio home office", "Day off no aniversário"], applyEmail: "talentos@capitaltech.com.br" },
  { id: "tecnico-enfermagem-ceilandia", title: "Técnico(a) de Enfermagem", company: "Clínica Vida Ceilândia", ra: "ceilandia", type: "CLT", mode: "Presencial", salary: "R$ 2.800", area: "Saúde", postedAt: "2026-11-01", featured: true, description: "Atendimento a pacientes, administração de medicação e apoio à equipe médica.", requirements: ["Curso técnico e COREN ativo", "Escala 12x36"], benefits: ["Insalubridade", "VT", "Refeição"], applyEmail: "rh@clinicavida.com.br" },
  { id: "mecanico-auto-center", title: "Mecânico Automotivo", company: "Auto Center Ceilândia", ra: "ceilandia", type: "CLT", mode: "Presencial", salary: "R$ 3.200 + comissão", area: "Automotivo", postedAt: "2026-10-31", description: "Manutenção preventiva e corretiva de veículos leves.", requirements: ["Experiência comprovada", "CNH B"], benefits: ["VT", "Comissão", "Uniforme"], applyEmail: "contato@autocenterceilandia.com.br" },
  { id: "professor-matematica-samambaia", title: "Professor(a) de Matemática", company: "Curso Futuro", ra: "samambaia", type: "PJ", mode: "Presencial", salary: "R$ 60/hora-aula", area: "Educação", postedAt: "2026-10-31", description: "Aulas para turmas preparatórias de concursos e ENEM.", requirements: ["Licenciatura em Matemática", "Experiência com preparatórios"], benefits: ["Material didático", "Horários flexíveis"], applyEmail: "coordenacao@cursofuturo.com.br" },
  { id: "estagio-marketing-plano", title: "Estágio em Marketing Digital", company: "Agência Eixo", ra: "plano-piloto", type: "Estágio", mode: "Híbrido", salary: "Bolsa R$ 1.200", area: "Comunicação", postedAt: "2026-10-30", description: "Apoio na criação de conteúdo e gestão de redes sociais.", requirements: ["Cursando Publicidade, Jornalismo ou Marketing", "Canva"], benefits: ["Auxílio transporte", "Recesso remunerado"], applyEmail: "estagio@agenciaeixo.com.br" },
  { id: "vendedor-loja-gama", title: "Vendedor(a) de Loja", company: "Papelaria Gama Centro", ra: "gama", type: "Temporário", mode: "Presencial", salary: "R$ 1.700 + comissão", area: "Comércio", postedAt: "2026-10-30", description: "Vendas e atendimento no período de volta às aulas.", requirements: ["Ensino médio", "Experiência com vendas"], benefits: ["VT", "Comissão"], applyEmail: "loja@papelariagama.com.br" },
  { id: "eletricista-sobradinho", title: "Eletricista Predial", company: "Elétrica Rápida", ra: "sobradinho", type: "CLT", mode: "Presencial", salary: "R$ 2.900", area: "Serviços", postedAt: "2026-10-29", description: "Instalações e manutenção elétrica residencial e comercial.", requirements: ["NR-10", "CNH B"], benefits: ["VT", "Plano odontológico", "Periculosidade"], applyEmail: "vagas@eletricarapida.com.br" },
  { id: "jovem-aprendiz-sia", title: "Jovem Aprendiz — Logística", company: "Distribuidora Central", ra: "sia", type: "Jovem Aprendiz", mode: "Presencial", salary: "R$ 900", area: "Logística", postedAt: "2026-10-29", description: "Apoio no controle de estoque e expedição.", requirements: ["14 a 22 anos", "Estudando"], benefits: ["VT", "Lanche", "Curso profissionalizante"], applyEmail: "aprendiz@distcentral.com.br" },
  { id: "personal-trainer-aguas-claras", title: "Professor(a) de Educação Física", company: "Movimento Academia", ra: "aguas-claras", type: "CLT", mode: "Presencial", salary: "R$ 2.600", area: "Saúde", postedAt: "2026-10-28", description: "Acompanhamento de alunos na musculação e aulas coletivas.", requirements: ["CREF ativo", "Disponibilidade de horário"], benefits: ["Academia grátis", "VT"], applyEmail: "rh@movimentoacademia.com.br" },
  { id: "analista-financeiro-remoto", title: "Analista Financeiro", company: "Cooperativa Candanga", ra: "plano-piloto", type: "CLT", mode: "Remoto", salary: "R$ 5.500", area: "Finanças", postedAt: "2026-10-27", description: "Contas a pagar e receber, conciliação e relatórios gerenciais.", requirements: ["Ciências Contábeis ou Administração", "Excel avançado"], benefits: ["Plano de saúde", "PLR", "Auxílio home office"], applyEmail: "rh@coopcandanga.com.br" },
];

export const getJob = (id: string) => JOBS.find((j) => j.id === id);
export const JOB_AREAS = [...new Set(JOBS.map((j) => j.area))].sort();
