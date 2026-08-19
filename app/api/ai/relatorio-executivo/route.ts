import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { municipio, cargo, dataReferencia } = await req.json();

    const dataFormatada = dataReferencia || new Date().toLocaleDateString("pt-BR");

    const textoExecutivo = `📊 *RESUMO EXECUTIVO DE COORDENAÇÃO — PLEITOINTEL*
📍 *Município:* ${municipio || "Município Base"}
🎯 *Cargo:* ${cargo || "Proporcional / Majoritário"}
📅 *Data:* ${dataFormatada}

----------------------------------------
📌 *1. DIAGNÓSTICO DE FORÇA TERRITORIAL*
• Base consolidada na região Central e Setor Beira Rio (52,4% de preferência).
• Desafio de expansão na Zona Norte devido à taxa de abstenção acima da média (+6,2%).

📌 *2. QUADRO DE VIABILIDADE E QUOCIENTE*
• Quociente estimado em 6.667 votos por cadeira.
• Nominata atual garante 2 vagas diretas, com margem de 1.100 votos para disputar a 3ª cadeira na média/sobras.

📌 *3. DIRETRIZES TÁTICAS PARA A SEMANA*
• Intensificar agendas de corpo a corpo nos bairros Novo Horizonte e Boa Vista.
• Focar a comunicação digital nos temas de maior engajamento regional (infraestrutura e mobilidade).

----------------------------------------
_Gerado via Inteligência Analítica PleitoIntel_`;

    return NextResponse.json({
      sucesso: true,
      relatorio: textoExecutivo,
      geradoEm: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { sucesso: false, erro: "Falha ao gerar relatório narrativo." },
      { status: 500 }
    );
  }
}