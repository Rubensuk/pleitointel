"use client";

import RelatorioNarrativo from "@/components/ai/RelatorioNarrativo";

export default function RelatoriosPage() {
  const baixarPDF = () => {
    alert("Gerando e baixando Relatório Executivo Territorial em PDF...");
  };

  const baixarExcel = () => {
    alert("Gerando e exportando Planilha de Microdados Eleitorais (.xlsx)...");
  };

  return (
    <div className="p-8 space-y-8 bg-slate-950 text-white min-h-screen">
      <div>
        <p className="font-mono text-xs tracking-widest text-slate-500">MÓDULO 4</p>
        <h1 className="mt-2 text-2xl font-semibold">Central de Relatórios & Exportações</h1>
        <p className="mt-1 text-slate-400 text-sm">
          Exporte dossiês completos e resumos estratégicos para tomadas de decisão.
        </p>
      </div>

      {/* Camada de IA - Resumo Narrativo */}
      <RelatorioNarrativo />

      {/* Opções de Download Tradicionais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="text-3xl">📑</div>
            <h2 className="text-lg font-medium text-white">Dossiê Estratégico em PDF</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Documento formatado para impressão e apresentação, contendo mapas de calor, projeções e viabilidade de chapas.
            </p>
          </div>
          <button
            onClick={baixarPDF}
            className="mt-6 w-full py-2.5 rounded-lg bg-orange-500 text-slate-950 font-semibold text-xs hover:bg-orange-400 transition"
          >
            Baixar Dossiê em PDF
          </button>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="text-3xl">📊</div>
            <h2 className="text-lg font-medium text-white">Microdados em Excel (.xlsx)</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tabelas completas com votação seção a seção, bairros, renda média e séries históricas consolidadas.
            </p>
          </div>
          <button
            onClick={baixarExcel}
            className="mt-6 w-full py-2.5 rounded-lg bg-white/10 text-white font-semibold text-xs hover:bg-white/20 transition"
          >
            Exportar Planilha Excel
          </button>
        </div>
      </div>
    </div>
  );
}