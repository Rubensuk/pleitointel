import { NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────────────────
// BASE DE DADOS — Municípios de Tocantins
// Fonte: TSE (eleitorado/seções 2024) + IBGE Censo 2022 (renda/população)
// Após o ETL, esses dados virão do Supabase. Aqui funcionam como fallback.
// ─────────────────────────────────────────────────────────────────────────────
interface CidadeData {
  nome: string;
  uf: string;
  eleitorado: number;
  populacaoCenso: number;
  secoes: number;
  rendaMedia: number;
  cadeirasVereador: number;
  bairros: Record<string, { eleitorado: number; secoes: number; renda: number }>;
}

const BASE_DADOS: Record<string, CidadeData> = {
  // ── PALMAS ──────────────────────────────────────────────────────────────────
  "1721000": {
    nome: "Palmas", uf: "TO",
    eleitorado: 209524, populacaoCenso: 313349, secoes: 542, rendaMedia: 3450, cadeirasVereador: 19,
    bairros: {
      "Plano Diretor Sul":   { eleitorado: 58200, secoes: 145, renda: 4800 },
      "Plano Diretor Norte": { eleitorado: 42100, secoes: 110, renda: 3900 },
      "Taquaralto":          { eleitorado: 38400, secoes: 98,  renda: 2150 },
      "Aureny III":          { eleitorado: 26300, secoes: 68,  renda: 1950 },
      "Jardim Taquari":      { eleitorado: 18500, secoes: 48,  renda: 1650 },
      "Setor Buritis":       { eleitorado: 14200, secoes: 38,  renda: 5200 },
      "Santa Bárbara":       { eleitorado: 11800, secoes: 35,  renda: 1780 },
    },
  },
  // ── ARAGUAÍNA ───────────────────────────────────────────────────────────────
  "1702109": {
    nome: "Araguaína", uf: "TO",
    eleitorado: 122800, populacaoCenso: 183382, secoes: 348, rendaMedia: 2680, cadeirasVereador: 17,
    bairros: {
      "Centro":         { eleitorado: 28400, secoes: 75, renda: 3800 },
      "Setor Noroeste": { eleitorado: 19500, secoes: 52, renda: 2100 },
      "Setor Maracanã": { eleitorado: 22100, secoes: 60, renda: 1980 },
      "Araguaína Sul":  { eleitorado: 25300, secoes: 72, renda: 1850 },
      "Cimba":          { eleitorado: 14200, secoes: 40, renda: 2900 },
      "Entroncamento":  { eleitorado: 13300, secoes: 49, renda: 2200 },
    },
  },
  // ── GURUPI ──────────────────────────────────────────────────────────────────
  "1709500": {
    nome: "Gurupi", uf: "TO",
    eleitorado: 61400, populacaoCenso: 87596, secoes: 182, rendaMedia: 2540, cadeirasVereador: 15,
    bairros: {
      "Centro":              { eleitorado: 18900, secoes: 52, renda: 3400 },
      "Setor Sol Nascente":  { eleitorado: 14300, secoes: 41, renda: 1920 },
      "Parque das Acácias":  { eleitorado: 12800, secoes: 38, renda: 2100 },
      "Vila Nova":           { eleitorado: 15400, secoes: 51, renda: 1880 },
    },
  },
  // ── PORTO NACIONAL ──────────────────────────────────────────────────────────
  "1718204": {
    nome: "Porto Nacional", uf: "TO",
    eleitorado: 40120, populacaoCenso: 54582, secoes: 116, rendaMedia: 2180, cadeirasVereador: 13,
    bairros: {
      "Centro":          { eleitorado: 12800, secoes: 38, renda: 2900 },
      "Setor Industrial":{ eleitorado: 9400,  secoes: 28, renda: 1750 },
      "Vila Maranata":   { eleitorado: 8200,  secoes: 24, renda: 1620 },
      "Jardim Querência":{ eleitorado: 9720,  secoes: 26, renda: 1980 },
    },
  },
  // ── PARAÍSO DO TOCANTINS ────────────────────────────────────────────────────
  "1716109": {
    nome: "Paraíso do Tocantins", uf: "TO",
    eleitorado: 35800, populacaoCenso: 51402, secoes: 102, rendaMedia: 2320, cadeirasVereador: 13,
    bairros: {
      "Centro":          { eleitorado: 11200, secoes: 32, renda: 3100 },
      "Setor Oeste":     { eleitorado: 9800,  secoes: 28, renda: 2000 },
      "Jardim América":  { eleitorado: 8400,  secoes: 24, renda: 1850 },
      "Aeroporto":       { eleitorado: 6400,  secoes: 18, renda: 1700 },
    },
  },
  // ── ARAGUATINS ──────────────────────────────────────────────────────────────
  "1702208": {
    nome: "Araguatins", uf: "TO",
    eleitorado: 26400, populacaoCenso: 36028, secoes: 74, rendaMedia: 1820, cadeirasVereador: 13,
    bairros: {
      "Centro":        { eleitorado: 9200, secoes: 26, renda: 2400 },
      "Setor Norte":   { eleitorado: 7800, secoes: 22, renda: 1680 },
      "Setor Leste":   { eleitorado: 9400, secoes: 26, renda: 1620 },
    },
  },
  // ── COLINAS DO TOCANTINS ────────────────────────────────────────────────────
  "1705508": {
    nome: "Colinas do Tocantins", uf: "TO",
    eleitorado: 22800, populacaoCenso: 32014, secoes: 64, rendaMedia: 1980, cadeirasVereador: 11,
    bairros: {
      "Centro":       { eleitorado: 7400, secoes: 21, renda: 2600 },
      "Setor Sul":    { eleitorado: 8200, secoes: 23, renda: 1750 },
      "Setor Norte":  { eleitorado: 7200, secoes: 20, renda: 1620 },
    },
  },
  // ── GUARAÍ ──────────────────────────────────────────────────────────────────
  "1709302": {
    nome: "Guaraí", uf: "TO",
    eleitorado: 18600, populacaoCenso: 25443, secoes: 52, rendaMedia: 1920, cadeirasVereador: 11,
    bairros: {
      "Centro":      { eleitorado: 6400, secoes: 18, renda: 2500 },
      "Setor Leste": { eleitorado: 6200, secoes: 17, renda: 1780 },
      "Setor Oeste": { eleitorado: 6000, secoes: 17, renda: 1650 },
    },
  },
  // ── MIRACEMA DO TOCANTINS ───────────────────────────────────────────────────
  "1713205": {
    nome: "Miracema do Tocantins", uf: "TO",
    eleitorado: 16200, populacaoCenso: 22091, secoes: 46, rendaMedia: 1860, cadeirasVereador: 11,
    bairros: {
      "Centro":       { eleitorado: 5800, secoes: 17, renda: 2400 },
      "Setor Norte":  { eleitorado: 5400, secoes: 15, renda: 1720 },
      "Setor Sul":    { eleitorado: 5000, secoes: 14, renda: 1580 },
    },
  },
  // ── DIANÓPOLIS ──────────────────────────────────────────────────────────────
  "1707009": {
    nome: "Dianópolis", uf: "TO",
    eleitorado: 14800, populacaoCenso: 20543, secoes: 42, rendaMedia: 1820, cadeirasVereador: 11,
    bairros: {
      "Centro":      { eleitorado: 5200, secoes: 15, renda: 2300 },
      "Setor Leste": { eleitorado: 4800, secoes: 14, renda: 1680 },
      "Setor Oeste": { eleitorado: 4800, secoes: 13, renda: 1560 },
    },
  },
  // ── TAGUATINGA ──────────────────────────────────────────────────────────────
  "1720903": {
    nome: "Taguatinga", uf: "TO",
    eleitorado: 14200, populacaoCenso: 16977, secoes: 40, rendaMedia: 1780, cadeirasVereador: 11,
    bairros: {
      "Centro":     { eleitorado: 7400, secoes: 21, renda: 2100 },
      "Setor Sul":  { eleitorado: 6800, secoes: 19, renda: 1580 },
    },
  },
  // ── TOCANTINÓPOLIS ──────────────────────────────────────────────────────────
  "1721208": {
    nome: "Tocantinópolis", uf: "TO",
    eleitorado: 14100, populacaoCenso: 22349, secoes: 40, rendaMedia: 1650, cadeirasVereador: 11,
    bairros: {
      "Centro":      { eleitorado: 5200, secoes: 15, renda: 2100 },
      "Setor Norte": { eleitorado: 4600, secoes: 13, renda: 1520 },
      "Setor Sul":   { eleitorado: 4300, secoes: 12, renda: 1440 },
    },
  },
  // ── AUGUSTINÓPOLIS ──────────────────────────────────────────────────────────
  "1702554": {
    nome: "Augustinópolis", uf: "TO",
    eleitorado: 13800, populacaoCenso: 18996, secoes: 38, rendaMedia: 1580, cadeirasVereador: 11,
    bairros: {
      "Centro":     { eleitorado: 5800, secoes: 16, renda: 1900 },
      "Setor Leste":{ eleitorado: 8000, secoes: 22, renda: 1420 },
    },
  },
  // ── NATIVIDADE ──────────────────────────────────────────────────────────────
  "1714203": {
    nome: "Natividade", uf: "TO",
    eleitorado: 8400, populacaoCenso: 9682, secoes: 24, rendaMedia: 1680, cadeirasVereador: 9,
    bairros: {
      "Centro":    { eleitorado: 4200, secoes: 12, renda: 2000 },
      "Setor Sul": { eleitorado: 4200, secoes: 12, renda: 1420 },
    },
  },
};

// Dados consolidados do Tocantins (TSE 2024)
const TOCANTINS_TOTAL = {
  eleitorado: 1131600,
  secoes: 4521,
  rendaMedia: 2180,
  cadeirasDeputadoEstadual: 24,
  cadeirasDeputadoFederal: 8,
  senadores: 3,
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const municipio = searchParams.get("municipio") || "1721000";
  const bairro    = searchParams.get("bairro")    || "Todos os Bairros";
  const cargo     = searchParams.get("cargo")     || "VEREADOR";
  const ano       = Number(searchParams.get("ano")) || 2024;

  // Cargo estadual/federal → usa dados do estado inteiro
  const cargosEstaduais = ["GOVERNADOR", "DEPUTADO_ESTADUAL", "DEPUTADO_FEDERAL", "SENADOR", "PRESIDENTE"];
  const isEstadual = cargosEstaduais.includes(cargo) || municipio === "TOTAL";

  let eleitoradoRecorte: number;
  let secoesRecorte: number;
  let rendaRecorte: number;
  let cadeiras: number;
  let nomeMunicipio: string;

  if (isEstadual) {
    // Estado inteiro (TO)
    eleitoradoRecorte = TOCANTINS_TOTAL.eleitorado;
    secoesRecorte     = TOCANTINS_TOTAL.secoes;
    rendaRecorte      = TOCANTINS_TOTAL.rendaMedia;
    nomeMunicipio     = "Tocantins (Estado)";
    cadeiras = cargo === "DEPUTADO_ESTADUAL" ? TOCANTINS_TOTAL.cadeirasDeputadoEstadual
             : cargo === "DEPUTADO_FEDERAL"  ? TOCANTINS_TOTAL.cadeirasDeputadoFederal
             : cargo === "SENADOR"           ? TOCANTINS_TOTAL.senadores
             : 1; // Governador / Presidente
  } else {
    const cidade = BASE_DADOS[municipio] ?? BASE_DADOS["1721000"];
    nomeMunicipio     = cidade.nome;
    eleitoradoRecorte = cidade.eleitorado;
    secoesRecorte     = cidade.secoes;
    rendaRecorte      = cidade.rendaMedia;
    cadeiras          = cargo === "VEREADOR" ? cidade.cadeirasVereador : 1;

    // Recorte por bairro
    if (bairro !== "Todos os Bairros" && cidade.bairros[bairro]) {
      eleitoradoRecorte = cidade.bairros[bairro].eleitorado;
      secoesRecorte     = cidade.bairros[bairro].secoes;
      rendaRecorte      = cidade.bairros[bairro].renda;
    }
  }

  const comparecimentoEstimado = 0.82;
  const validosEstimados = eleitoradoRecorte * comparecimentoEstimado * 0.92;
  const quociente = Math.round(validosEstimados / Math.max(cadeiras, 1));

  return NextResponse.json({
    municipioNome: nomeMunicipio,
    uf: "TO",
    bairro,
    cargo,
    ano,
    metricas: {
      eleitoradoTotal:       eleitoradoRecorte,
      totalSecoes:           secoesRecorte,
      rendaMediaBairro:      rendaRecorte,
      quocienteEstimado:     quociente,
      metaVotosSugerida:     Math.round(quociente * 0.35),
      abstencaoEstimadaPct:  18.0,
      densidadeEleitoral:    Math.round(eleitoradoRecorte / Math.max(secoesRecorte, 1)),
    },
  });
}