"use client";

import { useState } from "react";

interface PainelInsightsProps {
  tipo: "mapa" | "confronto";
  dadosContexto?: any;
}

export default function PainelInsights({ tipo, dadosContexto }: PainelInsightsProps) {
  const [insights, setInsights] = useState<string[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [aberto, setAberto] = useState(false);

  const gerarInsights = async () => {
    setCarregando(true);
    setAberto(true);
    try {
      const res = await fetch("/api/ai/interpretacao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo, dados: dadosContexto }),
      });
      const data = await res.json();
      if (data.sucesso) {
        setInsights(data.insights);
      }
    } catch (err) {
      setInsights(["Não foi possível gerar a leitura analítica no momento."]);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="rounded-2xl border border-orange-500/20 bg-slate-900/60 p-5 backdrop-blur">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-orange-400 animate-pulse"></span>
            <h3 className="font-semibold text-white text-base">Assistente de Inteligência Eleitoral</h3>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">
              Plano Pro
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Gera leitura estratégica em linguagem clara e direta sobre o cenário atual.
          </p>
        </div>

        <button
          onClick={gerarInsights}
          disabled={carregando}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-orange-500 text-slate-950 font-semibold text-xs transition hover:bg-orange-400 disabled:opacity-50"
        >
          {carregando ? "Analisando dados..." : "✨ Gerar Leitura Estratégica"}
        </button>
      </div>

      {aberto && (
        <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
          {carregando ? (
            <div className="py-4 text-xs font-mono text-slate-400 flex items-center gap-2">
              <span className="animate-spin text-orange-400">⚙</span> Cruzando métricas de votação e densidade...
            </div>
          ) : (
            <ul className="space-y-2.5">
              {insights.map((item, index) => (
                <li key={index} className="text-xs text-slate-300 flex items-start gap-2.5 bg-slate-950/40 p-3 rounded-lg border border-white/5">
                  <span className="text-orange-400 font-bold">↳</span>
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