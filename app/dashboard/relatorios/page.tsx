"use client";

import { useState } from "react";
import ValidadorComplianceCard from "@/components/ai/ValidadorComplianceCard";

export default function RelatoriosPage() {
  const [tipoRelatorio, setTipoRelatorio] = useState("executivo");
  const [gerando, setGerando] = useState(false);
  const [conteudo, setConteudo] = useState<string | null>(null);

  const handleGerar = async () => {
    setGerando(true);
    try {
      const res = await fetch("/api/ai/relatorio-executivo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo: tipoRelatorio }),
      });
      const data = await res.json();
      setConteudo(data.relatorio || data.mensagem || "Relatório gerado com sucesso.");
    } catch (e) {
      console.error(e);
    } finally {
      setGerando(false);
    }
  };

  return (
    <div className="p-8 space-y-8 bg-slate-950 text-white min-h-screen">
      <div>
        <p className="font-mono text-xs tracking-widest text-slate-500">MÓDULO 5 & MÓDULO 9</p>
        <h1 className="mt-1 text-2xl font-bold">Relatórios Estratégicos & Compliance Legal</h1>
        <p className="text-slate-400 text-sm">
          Geração de sínteses para WhatsApp e validação jurídica de materiais de campanha.
        </p>
      </div>

      {/* Módulo 9: Validador Jurídico de Compliance */}
      <ValidadorComplianceCard />

      {/* Gerador de Relatórios Executivos */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 space-y-4">
        <h2 className="text-base font-semibold text-white">Exportação e Síntese Executiva</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={tipoRelatorio}
            onChange={(e) => setTipoRelatorio(e.target.value)}
            className="bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
          >
            <option value="executivo">Síntese Semanal de Campanha (WhatsApp)</option>
            <option value="bairros">Relatório de Priorização Territorial</option>
            <option value="liderancas">Balanço de Metas do CRM de Lideranças</option>
          </select>
          <button
            onClick={handleGerar}
            disabled={gerando}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
          >
            {gerando ? "Gerando..." : "Gerar Síntese Formatada"}
          </button>
        </div>

        {conteudo && (
          <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-white/10 font-mono text-xs text-slate-300 whitespace-pre-wrap">
            {conteudo}
          </div>
        )}
      </div>
    </div>
  );
}