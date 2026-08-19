"use client";

import { useMemo } from "react";

type PontoHistorico = {
  ano: number;
  totalVotosValidos: number;
  votosPorCandidato: Record<string, number>;
  candidatoVencedorId: string;
  percentualVencedor: number;
};

type Secao = {
  codigoSecao: string;
  bairro: string;
  historico: PontoHistorico[];
};

type DadosHistoricos = {
  municipioIbge: string;
  secoes: Secao[];
};

const NOMES_CANDIDATOS: Record<string, string> = {
  "cand-a": "Candidato A",
  "cand-b": "Candidato B",
};

const CORES: Record<string, string> = {
  "cand-a": "#1d4ed8",
  "cand-b": "#7f1d1d",
};

function shareCandidatoA(ponto: PontoHistorico) {
  const votosA = ponto.votosPorCandidato["cand-a"] ?? 0;
  return (votosA / ponto.totalVotosValidos) * 100;
}

function MiniGrafico({ valores }: { valores: number[] }) {
  const largura = 180;
  const altura = 48;
  const min = Math.min(...valores);
  const max = Math.max(...valores);
  const escala = max - min || 1;

  const pontos = valores
    .map((v, i) => {
      const x = (i / (valores.length - 1)) * largura;
      const y = altura - ((v - min) / escala) * altura;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={largura} height={altura} className="overflow-visible">
      <polyline
        points={pontos}
        fill="none"
        stroke="#f59e0b"
        strokeWidth={2}
      />
      {valores.map((v, i) => {
        const x = (i / (valores.length - 1)) * largura;
        const y = altura - ((v - min) / escala) * altura;
        return <circle key={i} cx={x} cy={y} r={3} fill="#f59e0b" />;
      })}
    </svg>
  );
}

export default function ProjecoesCliente({
  dados,
}: {
  dados: DadosHistoricos;
}) {
  const linhas = useMemo(() => {
    return dados.secoes.map((secao) => {
      const historicoOrdenado = [...secao.historico].sort(
        (a, b) => a.ano - b.ano
      );
      const sharesA = historicoOrdenado.map(shareCandidatoA);
      const diff = sharesA[sharesA.length - 1] - sharesA[0];

      let tendencia: string;
      let corTendencia: string;
      if (diff > 3) {
        tendencia = `Alta para ${NOMES_CANDIDATOS["cand-a"]}`;
        corTendencia = CORES["cand-a"];
      } else if (diff < -3) {
        tendencia = `Alta para ${NOMES_CANDIDATOS["cand-b"]}`;
        corTendencia = CORES["cand-b"];
      } else {
        tendencia = "Estável";
        corTendencia = "#64748b";
      }

      const ultimo = historicoOrdenado[historicoOrdenado.length - 1];

      return {
        codigoSecao: secao.codigoSecao,
        bairro: secao.bairro,
        historicoOrdenado,
        sharesA,
        tendencia,
        corTendencia,
        ultimoVencedor: ultimo.candidatoVencedorId,
      };
    });
  }, [dados]);

  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {linhas.map((l) => (
        <div
          key={l.codigoSecao}
          className="rounded-xl border border-white/10 bg-base-900 p-5"
        >
          <p className="font-mono text-xs text-slate-500">
            {l.codigoSecao}
          </p>
          <h3 className="font-semibold text-white">{l.bairro}</h3>

          <div className="mt-3">
            <MiniGrafico valores={l.sharesA} />
          </div>

          <div className="mt-2 flex justify-between font-mono text-[10px] text-slate-500">
            {l.historicoOrdenado.map((h) => (
              <span key={h.ano}>{h.ano}</span>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between">
            <span
              className="rounded px-2 py-1 text-xs text-white"
              style={{
                backgroundColor: CORES[l.ultimoVencedor] ?? "#334155",
              }}
            >
              Vencedor 2022: {NOMES_CANDIDATOS[l.ultimoVencedor]}
            </span>
          </div>

          <p
            className="mt-2 text-sm font-semibold"
            style={{ color: l.corTendencia }}
          >
            Tendência: {l.tendencia}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            % de {NOMES_CANDIDATOS["cand-a"]} na seção ao longo do tempo
          </p>
        </div>
      ))}
    </div>
  );
}
