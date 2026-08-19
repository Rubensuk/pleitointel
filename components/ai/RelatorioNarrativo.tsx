"use client";

import { useState } from "react";

export default function RelatorioNarrativo() {
  const [relatorio, setRelatorio] = useState<string>("");
  const [carregando, setCarregando] = useState(false);
  const [copiado, setCopiado] = useState(false);

  const gerarRelatorio = async () => {
    setCarregando(true);
    try {
      const res = await fetch("/api/ai/relatorio-executivo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          municipio: "Araguaína - TO",
          cargo: "Vereador / Deputado",
        }),
      });
      const data = await res.json();
      if (data.sucesso) {
        setRelatorio(data.relatorio);
      }
    } catch {
      setRelatorio("Erro ao gerar a síntese executiva.");
    } finally {
      setCarregando(false);
    }
  };

  const copiarTexto = () => {
    if (!relatorio) return;
    navigator.clipboard.writeText(relatorio);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  };

  return (
    <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/10 p-6 space-y-4 backdrop-blur">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <h3 className="font-semibold text-white text-base">
              Síntese Narrativa para Coordenação (WhatsApp)
            </h3>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Plano Pro
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Transforma os gráficos e tabelas em um resumo pronto para envio aos assessores e candidato.
          </p>
        </div>

        <button
          onClick={gerarRelatorio}
          disabled={carregando}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 text-white font-semibold text-xs transition hover:bg-emerald-500 disabled:opacity-50"
        >
          {carregando ? "Gerando síntese..." : "⚡ Gerar Resumo Executivo"}
        </button>
      </div>

      {relatorio && (
        <div className="space-y-3 pt-4 border-t border-emerald-500/20">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-white/10 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
            {relatorio}
          </div>

          <div className="flex justify-end">
            <button
              onClick={copiarTexto}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition"
            >
              {copiado ? "✅ Copiado para Área de Transferência!" : "📋 Copiar Texto para WhatsApp"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}