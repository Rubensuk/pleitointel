import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { mensagem, etapa, estadoAtual } = await req.json();

    let resposta = "";
    let proximaEtapa = etapa;
    let novoEstado = { ...estadoAtual };

    if (etapa === "inicio") {
      resposta = "Olá! Sou o assistente da PleitoIntel. Qual é o seu município de interesse para a análise estratégica?";
      proximaEtapa = "aguardando_municipio";
    } else if (etapa === "aguardando_municipio") {
      novoEstado.municipio = mensagem;
      resposta = `Excelente! Mapeamos dados para ${mensagem}. Qual cargo ou pleito você deseja monitorar (ex: Vereador, Prefeito, Deputado)?`;
      proximaEtapa = "aguardando_cargo";
    } else if (etapa === "aguardando_cargo") {
      novoEstado.cargo = mensagem;
      resposta = `Perfeito! Configuramos o diagnóstico para ${novoEstado.municipio} (${mensagem}). Digite seu e-mail institucional ou WhatsApp para liberarmos seu acesso experimental ao painel.`;
      proximaEtapa = "aguardando_contato";
    } else if (etapa === "aguardando_contato") {
      novoEstado.contato = mensagem;
      resposta = "🎉 Pronto! Seu pré-cadastro foi registrado com sucesso. Nossa equipe liberou seu ambiente de teste.";
      proximaEtapa = "concluido";
    } else {
      resposta = "Seu ambiente já está pré-configurado! Acesse o painel pelo menu superior.";
    }

    return NextResponse.json({
      sucesso: true,
      resposta,
      proximaEtapa,
      estado: novoEstado,
    });
  } catch (error) {
    return NextResponse.json(
      { sucesso: false, erro: "Erro no assistente de onboarding." },
      { status: 500 }
    );
  }
}