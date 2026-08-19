import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { votosValidos, vagas, votosLegenda, qe, qp, metaSugerida } = await req.json();

    const analise = [
      `Cenário de Quociente: Com QE estimado em ${qe.toLocaleString("pt-BR")} votos, cada cadeira exige ${((qe / votosValidos) * 100).toFixed(1)}% do eleitorado válido total.`,
      `Eficiência da Chapa: A nominata com ${votosLegenda.toLocaleString("pt-BR")} votos assegura ${qp} vaga(s) direta(s). Para alcançar a próxima cadeira na sobra, faltam aproximadamente ${(qe - (votosLegenda % qe)).toLocaleString("pt-BR")} votos.`,
      `Estratégia Recomendada: A meta de segurança (${metaSugerida.toLocaleString("pt-BR")} votos) protege contra variações de abstenção. Foque a retenção nas 3 principais zonas de maior densidade eleitoral.`
    ];

    return NextResponse.json({
      sucesso: true,
      analise,
      geradoEm: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { sucesso: false, erro: "Erro ao gerar diagnóstico de viabilidade." },
      { status: 500 }
    );
  }
}