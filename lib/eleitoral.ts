export interface CalculoViabilidadeParams {
  cargoTipo: 'proporcional' | 'majoritario';
  votosValidosTotais: number;
  cadeirasDisponiveis: number;
  votosProjetadosLegenda: number;
  posicaoNaChapa: number;
}

export interface ResultadoViabilidade {
  quocienteEleitoral?: number;
  quocientePartidario?: number;
  cadeirasDiretas?: number;
  statusViabilidade: 'Alta' | 'Média' | 'Baixa';
  mensagem: string;
}

export function calcularViabilidade(params: CalculoViabilidadeParams): ResultadoViabilidade {
  const { cargoTipo, votosValidosTotais, cadeirasDisponiveis, votosProjetadosLegenda, posicaoNaChapa } = params;

  if (cargoTipo === 'majoritario') {
    const votosNecessarios = Math.floor(votosValidosTotais / 2) + 1;
    return {
      statusViabilidade: votosProjetadosLegenda >= votosNecessarios ? 'Alta' : 'Média',
      mensagem: `Eleição majoritária. Meta estimada para vitória direta: ${votosNecessarios.toLocaleString('pt-BR')} votos.`
    };
  }

  if (!cadeirasDisponiveis || cadeirasDisponiveis <= 0) {
    return { statusViabilidade: 'Baixa', mensagem: 'Número de cadeiras inválido.' };
  }

  const qe = Math.round(votosValidosTotais / cadeirasDisponiveis);
  const qp = Math.floor(votosProjetadosLegenda / qe);

  let status: 'Alta' | 'Média' | 'Baixa' = 'Baixa';
  if (posicaoNaChapa <= qp && qp > 0) {
    status = 'Alta';
  } else if (posicaoNaChapa <= qp + 2) {
    status = 'Média';
  }

  return {
    quocienteEleitoral: qe,
    quocientePartidario: qp,
    cadeirasDiretas: qp,
    statusViabilidade: status,
    mensagem: `QE estimado em ${qe.toLocaleString('pt-BR')} votos. A legenda projeta ${qp} cadeira(s) direta(s).`
  };
}