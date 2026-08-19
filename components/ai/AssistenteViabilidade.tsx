"use client";

import { useState } from "react";

interface AssistenteViabilidadeProps {
  dados: {
    votosValidos: number;
    vagas: number;
    votosLegenda: number;
    qe: number;
    qp: number;
    metaSugerida: number;
  };
}

export default function AssistenteViabilidade({ dados }: AssistenteViabilidadeProps) {
  const [analise, setAnalise] = useState<string[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [aberto, setAberto] = useState(false);

  const solicitarDiagnostico = async () => {
    setCarregando(true);
    setAberto(true);
    try {
      const res = await fetch("/api/ai/viabilidade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });
      const json = await res.json();
      if (json.sucesso) {
        setAnalise(json.analise);
      }
    } catch {
      setAnalise(["Não foi possível gerar a análise tática no momento."]);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="mt-6 rounded-2xl border border-purple-500/20 bg-purple-950/10 p-5 backdrop-blur">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
            <h3 className="font-semibold text-white text-base">Estrategista Eleitoral IA</h3>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
              Enterprise
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Interpretação estratégica do quociente eleitoral e plano de conquista de cadeiras.
          </p>
        </div>

        <button
          onClick={solicitarDiagnostico}
          disabled={carregando}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-purple-600 text-white font-semibold text-xs transition hover:bg-purple-500 disabled:opacity-50"
        >
          {carregando ? "Calculando projeção..." : "🔮 Gerar Diagnóstico Tático"}
        </button>
      </div>

      {aberto && (
        <div className="mt-4 pt-4 border-t border-purple-500/20 space-y-2">
          {carregando ? (
            <div className="py-4 text-xs font-mono text-slate-400 flex items-center gap-2">
              <span className="animate-spin text-purple-400">⚙</span> Modelando curvas de quociente e sobras...
            </div>
          ) : (
            <ul className="space-y-2.5">
              {analise.map((item, index) => (
                <li key={index} className="text-xs text-slate-300 flex items-start gap-2.5 bg-slate-950/50 p-3 rounded-lg border border-white/5">
                  <span className="text-purple-400 font-bold">↳</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}