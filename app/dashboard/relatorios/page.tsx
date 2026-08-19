"use client";

import { exportarParaExcel, exportarParaPDF } from "@/lib/export";

const dadosExemplo = [
  { secao: "0001", bairro: "Centro", totalVotos: 450, comparecimento: "82%" },
  { secao: "0002", bairro: "Novo Horizonte", totalVotos: 380, comparecimento: "79%" },
  { secao: "0003", bairro: "São Sebastião", totalVotos: 510, comparecimento: "85%" },
  { secao: "0004", bairro: "Boa Vista", totalVotos: 420, comparecimento: "80%" },
  { secao: "0005", bairro: "Setor Industrial", totalVotos: 310, comparecimento: "74%" },
  { secao: "0006", bairro: "Beira Rio", totalVotos: 490, comparecimento: "88%" },
];

export default function RelatoriosPage() {
  const handleExportPDF = () => {
    const colunas = ["Seção", "Bairro", "Total de Votos", "Comparecimento"];
    const linhas = dadosExemplo.map((item) => [
      item.secao,
      item.bairro,
      item.totalVotos,
      item.comparecimento,
    ]);

    exportarParaPDF(
      "Relatório de Diagnóstico Territorial",
      colunas,
      linhas,
      "relatorio-diagnostico"
    );
  };

  const handleExportExcel = () => {
    exportarParaExcel(dadosExemplo, "relatorio-diagnostico");
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <p className="font-mono text-xs tracking-widest text-slate-500">MÓDULO 4</p>
        <h1 className="mt-2 text-2xl font-semibold text-white">Relatórios e Exportação</h1>
        <p className="mt-1 text-slate-400 text-sm">
          Exporte diagnósticos territoriais e projeções consolidadas em PDF ou planilha Excel.
        </p>
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleExportPDF}
          className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-orange-400 transition"
        >
          Exportar PDF (.pdf)
        </button>
        <button
          onClick={handleExportExcel}
          className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition"
        >
          Exportar Planilha (.xlsx)
        </button>
      </div>

      <div className="rounded-xl border border-white/10 bg-slate-900/50 p-6">
        <h2 className="text-lg font-medium text-white mb-4">Pré-visualização dos Dados</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="border-b border-white/10 text-xs uppercase text-slate-400">
              <tr>
                <th className="py-3 px-4">Seção</th>
                <th className="py-3 px-4">Bairro</th>
                <th className="py-3 px-4">Total de Votos</th>
                <th className="py-3 px-4">Comparecimento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {dadosExemplo.map((row) => (
                <tr key={row.secao}>
                  <td className="py-3 px-4 font-mono">{row.secao}</td>
                  <td className="py-3 px-4">{row.bairro}</td>
                  <td className="py-3 px-4">{row.totalVotos}</td>
                  <td className="py-3 px-4">{row.comparecimento}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}