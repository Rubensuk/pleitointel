"use client";

import { useState } from "react";

interface ResultadoViabilidade {
  quocienteEleitoral: number;
  quocientePartidario: number;
  vagasDiretas: number;
  metaSugerida: number;
}

export default function ViabilidadeCliente() {
  const [votosValidos, setVotosValidos] = useState<number>(100000);
  const [vagas, setVagas] = useState<number>(15);
  const [votosLegenda, setVotosLegenda] = useState<number>(18000);
  const [resultado, setResultado] = useState<ResultadoViabilidade | null>(null);

  const calcularViabilidade = (e: React.FormEvent) => {
    e.preventDefault();

    if (vagas <= 0 || votosValidos <= 0) return;

    const qe = Math.round(votosValidos / vagas);
    const qp = Math.floor(votosLegenda / qe);
    const meta = Math.round(qe * 1.15); // Meta com margem de segurança de 15%

    setResultado({
      quocienteEleitoral: qe,
      quocientePartidario: qp,
      vagasDiretas: qp,
      metaSugerida: meta,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Formulário de Parâmetros */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 space-y-6">
        <h2 className="text-lg font-medium text-white">Parâmetros do Pleito</h2>

        <form onSubmit={calcularViabilidade} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
              Estimativa de Votos Válidos
            </label>
            <input
              type="number"
              value={votosValidos}
              onChange={(e) => setVotosValidos(Number(e.target.value))}
              className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-2.5 text-white focus:border-orange-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
              Total de Vagas em Disputa (Câmara/Assembleia)
            </label>
            <input
              type="number"
              value={vagas}
              onChange={(e) => setVagas(Number(e.target.value))}
              className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-2.5 text-white focus:border-orange-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
              Estimativa de Votos da Sua Nominata / Partido
            </label>
            <input
              type="number"
              value={votosLegenda}
              onChange={(e) => setVotosLegenda(Number(e.target.value))}
              className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-2.5 text-white focus:border-orange-500 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 rounded-lg bg-orange-500 py-3 text-sm font-semibold text-slate-950 hover:bg-orange-400 transition"
          >
            Calcular Projeção
          </button>
        </form>
      </div>

      {/* Exibição dos Resultados */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-lg font-medium text-white mb-4">Cálculo de Quociente e Vagas</h2>

          {resultado ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-white/5">
                <span className="text-xs font-mono text-slate-400 uppercase">Quociente Eleitoral (QE)</span>
                <p className="text-2xl font-bold text-white mt-1">
                  {resultado.quocienteEleitoral.toLocaleString("pt-BR")} votos
                </p>
                <p className="text-xs text-slate-500 mt-1">Média necessária para 1 cadeira direta.</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-white/5">
                <span className="text-xs font-mono text-slate-400 uppercase">Quociente Partidário (QP)</span>
                <p className="text-2xl font-bold text-orange-400 mt-1">
                  {resultado.quocientePartidario} vaga(s) garantida(s)
                </p>
                <p className="text-xs text-slate-500 mt-1">Vagas obtidas diretamente por quociente.</p>
              </div>

              <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
                <span className="text-xs font-mono text-orange-400 uppercase">Meta de Segurança Sugerida</span>
                <p className="text-xl font-bold text-white mt-1">
                  {resultado.metaSugerida.toLocaleString("pt-BR")} votos
                </p>
                <p className="text-xs text-slate-400 mt-1">+15% de margem contra oscilações de abstenção.</p>
              </div>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-slate-500 text-sm text-center">
              <p>Preencha os dados ao lado e clique em</p>
              <p className="font-semibold text-slate-400 mt-1">"Calcular Projeção"</p>
            </div>
          )}
        </div>

        <p className="text-[11px] text-slate-500 mt-4 text-center">
          Simulador baseado nas regras de cálculo proporcional da legislação eleitoral brasileira.
        </p>
      </div>
    </div>
  );
}