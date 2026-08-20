import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { texto, cargo } = body;

    if (!texto || texto.trim().length === 0) {
      return NextResponse.json(
        { error: "Texto para validação é obrigatório" },
        { status: 400 }
      );
    }

    const textoLower = texto.toLowerCase();
    const alertas: Array<{ tipo: "critico" | "aviso" | "info"; mensagem: string; regra: string }> = [];

    if (textoLower.includes("pedir seu voto") || textoLower.includes("vote em mim") || textoLower.includes("vote 10") || textoLower.includes("vote 15")) {
      alertas.push({
        tipo: "critico",
        mensagem: "Identificado pedido explícito de voto. Se veiculado no período de pré-campanha, configura propaganda eleitoral antecipada irregular.",
        regra: "Art. 36-A da Lei nº 9.504/1997 e Resolução TSE nº 23.610."
      });
    }

    if (cargo?.toLowerCase().includes("vereador") && (textoLower.includes("vou asfaltar") || textoLower.includes("vou construir hospital") || textoLower.includes("vou abrir escola"))) {
      alertas.push({
        tipo: "aviso",
        mensagem: "Promessa típica do Poder Executivo (Prefeito). O cargo de Vereador tem atribuição fiscalizatória e legislativa.",
        regra: "Atribuições Constitucionais dos Poderes (CF/88, Art. 29 e 31)."
      });
    }

    if (textoLower.includes("fraude") || textoLower.includes("urna adulterada") || textoLower.includes("eleição roubada")) {
      alertas.push({
        tipo: "critico",
        mensagem: "Afirmações sem embasamento oficial sobre a higidez do processo de votação violam diretamente as vedações do TSE contra desinformação eleitoral.",
        regra: "Resolução TSE nº 23.610 (Combate à Desinformação no Processo Eleitoral)."
      });
    }

    const aprovado = alertas.filter(a => a.tipo === "critico").length === 0;

    return NextResponse.json({
      status: aprovado ? "APROVADO" : "RESTRICAO_IDENTIFICADA",
      scoreConformidade: aprovado ? 95 : 45,
      totalAlertas: alertas.length,
      alertas: alertas.length > 0 ? alertas : [
        {
          tipo: "info",
          mensagem: "Nenhuma irregularidade explícita encontrada perante as diretrizes eleitorais vigentes.",
          regra: "Lei das Eleições 9.504/97."
        }
      ],
      recomendacao: aprovado 
        ? "Texto em conformidade com as diretrizes do TSE para veiculação estratégica." 
        : "Recomenda-se ajustar os termos assinalados antes de disparar materiais ou veicular na imprensa/redes."
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao validar compliance eleitoral" },
      { status: 500 }
    );
  }
}