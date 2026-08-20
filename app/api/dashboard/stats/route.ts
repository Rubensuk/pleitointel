import { NextResponse } from "next/server";

// Base unificada com correlação IBGE <-> TSE e demografia básica
interface CidadeData {
  nome: string;
  uf: string;
  eleitorado: number;
  populacaoCenso: number;
  secoes: number;
  rendaMedia: number;
  bairros: Record<string, { eleitorado: number; secoes: number; renda: number }>;
}

const BASE_DADOS: Record<string, CidadeData> = {
  "1721000": {
    nome: "Palmas",
    uf: "TO",
    eleitorado: 209524,
    populacaoCenso: 313349,
    secoes: 542,
    rendaMedia: 3450,
    bairros: {
      "Plano Diretor Sul": { eleitorado: 58200, secoes: 145, renda: 4800 },
      "Plano Diretor Norte": { eleitorado: 42100, secoes: 110, renda: 3900 },
      "Taquaralto": { eleitorado: 38400, secoes: 98, renda: 2150 },
      "Aureny III": { eleitorado: 26300, secoes: 68, renda: 1950 },
      "Jardim Taquari": { eleitorado: 18500, secoes: 48, renda: 1650 },
    },
  },
  "1702109": {
    nome: "Araguaína",
    uf: "TO",
    eleitorado: 122800,
    populacaoCenso: 183382,
    secoes: 348,
    rendaMedia: 2680,
    bairros: {
      "Centro": { eleitorado: 28400, secoes: 75, renda: 3800 },
      "Setor Noroeste": { eleitorado: 19500, secoes: 52, renda: 2100 },
      "Setor Maracanã": { eleitorado: 22100, secoes: 60, renda: 1980 },
      "Araguaína Sul": { eleitorado: 25300, secoes: 72, renda: 1850 },
      "Cimba": { eleitorado: 14200, secoes: 40, renda: 2900 },
      "Entroncamento": { eleitorado: 13300, secoes: 49, renda: 2200 },
    },
  },
  "1709500": {
    nome: "Gurupi",
    uf: "TO",
    eleitorado: 61400,
    populacaoCenso: 87596,
    secoes: 182,
    rendaMedia: 2540,
    bairros: {
      "Centro": { eleitorado: 18900, secoes: 52, renda: 3400 },
      "Setor Sol Nascente": { eleitorado: 14300, secoes: 41, renda: 1920 },
      "Parque das Acácias": { eleitorado: 12800, secoes: 38, renda: 2100 },
      "Vila Nova": { eleitorado: 15400, secoes: 51, renda: 1880 },
    },
  },
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const municipio = searchParams.get("municipio") || "1721000";
  const bairro = searchParams.get("bairro") || "Todos os Bairros";
  const cargo = searchParams.get("cargo") || "VEREADOR";
  const ano = Number(searchParams.get("ano")) || 2024;

  const cidade = BASE_DADOS[municipio] || BASE_DADOS["1721000"];

  let eleitoradoRecorte = cidade.eleitorado;
  let secoesRecorte = cidade.secoes;
  let rendaRecorte = cidade.rendaMedia;

  if (bairro !== "Todos os Bairros" && cidade.bairros[bairro]) {
    eleitoradoRecorte = cidade.bairros[bairro].eleitorado;
    secoesRecorte = cidade.bairros[bairro].secoes;
    rendaRecorte = cidade.bairros[bairro].renda;
  }

  // Regras de Quociente Eleitoral simulado
  let cadeiras = cargo === "VEREADOR" ? 19 : cargo === "PREFEITO" ? 1 : 24;
  const comparecimentoEstimado = 0.82; // 82% comparecimento histórico
  const validosEstimados = eleitoradoRecorte * comparecimentoEstimado * 0.92; // 92% válidos
  const quociente = Math.round(validosEstimados / cadeiras);

  return NextResponse.json({
    municipioNome: cidade.nome,
    uf: cidade.uf,
    bairro,
    cargo,
    ano,
    metricas: {
      eleitoradoTotal: eleitoradoRecorte,
      totalSecoes: secoesRecorte,
      rendaMediaBairro: rendaRecorte,
      quocienteEstimado: quociente,
      metaVotosSugerida: Math.round(quociente * 0.35), // Meta para puxador / legenda
      abstencaoEstimadaPct: 18.0,
      densidadeEleitoral: Math.round(eleitoradoRecorte / Math.max(secoesRecorte, 1)),
    },
  });
}