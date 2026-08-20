import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const alertasGerados = [
      {
        id: "alt_01",
        data: new Date().toLocaleDateString("pt-BR"),
        prioridade: "ALTA",
        titulo: "Movimentação de Quociente Eleitoral",
        descricao: "Projeção de Quociente Eleitoral (QE) ajustada para 8.450 votos no município. Sua chapa necessita de mais 320 votos na Região Norte para consolidar a 2ª cadeira direta.",
        acaoRecomendada: "Intensificar agendas de rua e reforçar equipe no Setor Norte."
      },
      {
        id: "alt_02",
        data: new Date().toLocaleDateString("pt-BR"),
        prioridade: "MEDIA",
        titulo: "Alerta de Gap de Lideranças",
        descricao: "O bairro Vila Nova possui meta de 1.200 votos, mas conta com apenas 1 liderança cadastrada no CRM (capacidade de 350 votos). Gap identificado de 850 votos.",
        acaoRecomendada: "Cadastrar novos articuladores comunitários no CRM Territorial."
      }
    ];

    return NextResponse.json({
      status: "EXECUTADO",
      totalAlertas: alertasGerados.length,
      alertas: alertasGerados
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao processar alertas semanais" },
      { status: 500 }
    );
  }
}