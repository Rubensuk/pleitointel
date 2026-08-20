import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { bairro, rendaMedia, faixaEtaria, escolaridadeSuperiorPct } = body;

    return NextResponse.json({
      bairro: bairro || "Região Selecionada",
      perfilSocioeconomico: `Predomínio de eleitores na faixa ${faixaEtaria || "25-44 anos"}, renda média de R$ ${rendaMedia || "2.800"} e escolaridade com ${escolaridadeSuperiorPct || 28}% de nível superior.`,
      diagnosticoPolitico: "Região com alta volatilidade de votos e sensibilidade a pautas de gestão pública e serviços locais.",
      pautasSugeridas: [
        {
          tema: "Infraestrutura Urbana & Eficiência",
          anguloDiscurso: "Focar em zeladoria urbana, transparência no uso dos recursos municipais e agilidade nos serviços da prefeitura.",
          gatilhoEmocional: "Sensação de retorno real dos impostos pagos."
        },
        {
          tema: "Segurança Comunitária e Iluminação",
          anguloDiscurso: "Proposta de reforço na iluminação em LED nos pontos de ônibus e integração de câmeras locais.",
          gatilhoEmocional: "Proteção da família e valorização dos imóveis do bairro."
        },
        {
          tema: "Apoio ao Comércio e Empreendedorismo Local",
          anguloDiscurso: "Desburocratização de alvarás e incentivo à feira e comércio do setor.",
          gatilhoEmocional: "Geração de renda e autonomia econômica para a comunidade."
        }
      ],
      linhasEvitar: [
        "Evitar promessas genéricas de grandes obras sem cronograma financeiro crível.",
        "Não adotar tom excessivamente polarizado ou agressivo, pois o eleitorado local tende ao pragmatismo."
      ]
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao gerar microdirecionamento narrativo" },
      { status: 500 }
    );
  }
}