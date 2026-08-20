"use client";

import { useState } from "react";

interface Pauta {
  tema: string;
  anguloDiscurso: string;
  gatilhoEmocional: string;
}

interface MicrodirecionamentoData {
  bairro: string;
  perfilSocioeconomico: string;
  diagnosticoPolitico: string;
  pautasSugeridas: Pauta[];
  linhasEvitar: string[];
}

interface Props {
  bairroSelecionado: string;
  rendaMedia?: number;
  faixaEtaria?: string;
  escolaridadeSuperiorPct?: number;
}

export default function MicrodirecionamentoCard({
  bairroSelecionado,
  rendaMedia = 3.8,
  faixaEtaria = "25-44 anos",
  escolaridadeSuperiorPct = 32.5,
}: Props) {
  const [carregando, setCarregando] = useState(false);
  const [dados, setDados] = useState<MicrodirecionamentoData | null>(null);

  const handleGerarDirecionamento = async () => {
    setCarregando(true);
    try {
      const res = await fetch("/api/ai/microdirecionamento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bairro: bairroSelecionado,
          rendaMedia,
          faixaEtaria,
          escolaridadeSuperiorPct,
        }),
      });
      const data = await res.json();
      setDados(data);
    } catch (error) {
      console.error("Erro ao gerar microdirecionamento", error);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="rounded-2xl border border-orange-500/20 bg-slate-900/60 p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">
            MICRODIRECIONAMENTO NARRATIVO
          </span>
          <h3 className="text-base font-semibold text-white mt-1">
            Estratégia Local: {bairroSelecionado}
          </h3>
        </div>
        <button
          onClick={handleGerarDirecionamento}
          disabled={carregando}
          className="px-4 py-2 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-2"
        >
          {carregando ? "Cruzando IBGE + TSE..." : "Gerar Pautas por IA"}
        </button>
      </div>

      {dados && (
        <div className="space-y-4 pt-2 border-t border-white/5 text-sm">
          <div className="rounded-lg bg-slate-950/60 p-3 border border-white/5">
            <p className="text-xs text-slate-400 font-medium">Perfil Sociodemográfico</p>
            <p className="text-xs text-slate-300 mt-1">{dados.perfilSocioeconomico}</p>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-orange-400">Pautas Recomendadas para o Bairro:</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {dados.pautasSugeridas.map((p, idx) => (
                <div key={idx} className="rounded-xl border border-white/10 bg-slate-950 p-3 space-y-1.5">
                  <span className="text-xs font-bold text-white block">{p.tema}</span>
                  <p className="text-[11px] text-slate-300 leading-relaxed">{p.anguloDiscurso}</p>
                  <p className="text-[10px] text-orange-300 font-mono">Gatilho: {p.gatilhoEmocional}</p>
                </div>
              ))}
            </div>
          </div>

          {dados.linhasEvitar && (
            <div className="rounded-lg bg-red-950/20 border border-red-500/20 p-3">
              <p className="text-xs font-semibold text-red-400">Linhas a Evitar no Discurso:</p>
              <ul className="mt-1 list-disc list-inside text-[11px] text-red-200 space-y-1">
                {dados.linhasEvitar.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}