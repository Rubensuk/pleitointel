"use client";

import { useMemo } from "react";

type SecaoProps = {
  codigoSecao: string;
  zona: string;
  bairro: string;
  municipioIbge: string;
  totalVotosValidos: number;
  votosPorCandidato: Record<string, number>;
  candidatoVencedorId: string;
  percentualVencedor: number;
};

type SecaoFeature = {
  type: "Feature";
  properties: SecaoProps;
  geometry: unknown;
};

type SecaoFeatureCollection = {
  type: "FeatureCollection";
  features: SecaoFeature[];
};

const NOMES_CANDIDATOS: Record<string, string> = {
  "cand-a": "Candidato A",
  "cand-b": "Candidato B",
};

const CORES: Record<string, string> = {
  "cand-a": "#1d4ed8",
  "cand-b": "#7f1d1d",
};

export default function ConfrontoCliente({
  dados,
}: {
  dados: SecaoFeatureCollection;
}) {
  const resumo = useMemo(() => {
    const porCandidato: Record<
      string,
      {
        totalVotos: number;
        secoesVencidas: number;
        bairros: string[];
        somaPercentual: number;
      }
    > = {};

    dados.features.forEach((f) => {
      const p = f.properties;
      Object.entries(p.votosPorCandidato).forEach(([id, votos]) => {
        if (!porCandidato[id]) {
          porCandidato[id] = {
            totalVotos: 0,
            secoesVencidas: 0,
            bairros: [],
            somaPercentual: 0,
          };
        }
        porCandidato[id].totalVotos += votos;
      });
      const vencedor = p.candidatoVencedorId;
      porCandidato[vencedor].secoesVencidas += 1;
      porCandidato[vencedor].bairros.push(p.bairro);
      porCandidato[vencedor].somaPercentual += p.percentualVencedor;
    });

    return porCandidato;
  }, [dados]);

  const candidatoIds = Object.keys(resumo);

  return (
    <div className="mt-8">
      <div className="grid gap-4 sm:grid-cols-2">
        {candidatoIds.map((id) => {
          const r = resumo[id];
          const percentualMedio =
            r.secoesVencidas > 0 ? r.somaPercentual / r.secoesVencidas : 0;
          return (
            <div
              key={id}
              className="rounded-xl border border-white/10 bg-base-900 p-6"
              style={{ borderTopColor: CORES[id], borderTopWidth: 4 }}
            >
              <h3 className="text-lg font-semibold text-white">
                {NOMES_CANDIDATOS[id] ?? id}
              </h3>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-400">Votos totais</dt>
                  <dd className="font-mono text-white">{r.totalVotos}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-400">Seções vencidas</dt>
                  <dd className="font-mono text-white">
                    {r.secoesVencidas}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-400">
                    % médio nas seções vencidas
                  </dt>
                  <dd className="font-mono text-white">
                    {percentualMedio.toFixed(1)}%
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400">Bairros com maioria</dt>
                  <dd className="mt-1 text-white">{r.bairros.join(", ")}</dd>
                </div>
              </dl>
            </div>
          );
        })}
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-base-900 text-slate-400">
            <tr>
              <th className="p-3">Seção</th>
              <th className="p-3">Bairro</th>
              <th className="p-3">Vencedor</th>
              <th className="p-3">Margem</th>
              <th className="p-3">Votos válidos</th>
            </tr>
          </thead>
          <tbody>
            {dados.features.map((f) => {
              const p = f.properties;
              return (
                <tr key={p.codigoSecao} className="border-t border-white/5">
                  <td className="p-3 font-mono text-slate-400">
                    {p.codigoSecao}
                  </td>
                  <td className="p-3 text-white">{p.bairro}</td>
                  <td className="p-3">
                    <span
                      className="rounded px-2 py-1 text-xs text-white"
                      style={{
                        backgroundColor:
                          CORES[p.candidatoVencedorId] ?? "#334155",
                      }}
                    >
                      {NOMES_CANDIDATOS[p.candidatoVencedorId] ??
                        p.candidatoVencedorId}
                    </span>
                  </td>
                  <td className="p-3 text-white">{p.percentualVencedor}%</td>
                  <td className="p-3 text-white">
                    {p.totalVotosValidos}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
