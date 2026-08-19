"use client";

import PainelInsights from "@/components/ai/PainelInsights";

const dadosComparativo = [
  {
    secao: "0001 - Centro",
    candA: { nome: "Candidato A", votos: 250, pct: "55.6%" },
    candB: { nome: "Candidato B", votos: 200, pct: "44.4%" },
    diferenca: "+11.2% (Cand. A)",
  },
  {
    secao: "0002 - Novo Horizonte",
    candA: { nome: "Candidato A", votos: 159, pct: "41.8%" },
    candB: { nome: "Candidato B", votos: 221, pct: "58.2%" },
    diferenca: "+16.4% (Cand. B)",
  },
  {
    secao: "0003 - São Sebastião",
    candA: { nome: "Candidato A", votos: 295, pct: "57.9%" },
    candB: { nome: "Candidato B", votos: 215, pct: "42.1%" },
    diferenca: "+15.8% (Cand. A)",
  },
  {
    secao: "0004 - Boa Vista",
    candA: { nome: "Candidato A", votos: 169, pct: "40.2%" },
    candB: { nome: "Candidato B", votos: 251, pct: "59.8%" },
    diferenca: "+19.6% (Cand. B)",
  },
  {
    secao: "0005 - Setor Industrial",
    candA: { nome: "Candidato A", votos: 145, pct: "46.9%" },
    candB: { nome: "Candidato B", votos: 165, pct: "53.1%" },
    diferenca: "+6.2% (Cand. B)",
  },
  {
    secao: "0006 - Beira Rio",
    candA: { nome: "Candidato A", votos: 279, pct: "57.0%" },
    candB: { nome: "Candidato B", votos: 211, pct: "43.0%" },
    diferenca: "+14.0% (Cand. A)",
  },
];

export default function ConfrontoPage() {
  return (
    <div className="p-8 space-y-6 bg-slate-950 text-white min-h-screen">
      <div>
        <p className="font-mono text-xs tracking-widest text-slate-500">MÓDULO 5</p>
        <h1 className="mt-2 text-2xl font-semibold">Confronto de Candidatos</h1>
        <p className="mt-1 text-slate-400 text-sm">
          Comparativo direto de desempenho voto a voto entre candidatos por seção e região.
        </p>
      </div>

      {/* Camada de Inteligência Artificial */}
      <PainelInsights tipo="confronto" dadosContexto={dadosComparativo} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-blue-500/20 bg-blue-950/20 p-5">
          <span className="text-xs font-mono text-blue-400 uppercase">Liderança 1</span>
          <h2 className="text-xl font-bold mt-1 text-white">Candidato A</h2>
          <p className="text-2xl font-semibold text-blue-400 mt-2">1.297 votos (50.5%)</p>
          <p className="text-xs text-slate-400 mt-1">3 seções em vantagem (Centro, São Sebastião, Beira Rio)</p>
        </div>

        <div className="rounded-xl border border-red-500/20 bg-red-950/20 p-5">
          <span className="text-xs font-mono text-red-400 uppercase">Liderança 2</span>
          <h2 className="text-xl font-bold mt-1 text-white">Candidato B</h2>
          <p className="text-2xl font-semibold text-red-400 mt-2">1.263 votos (49.5%)</p>
          <p className="text-xs text-slate-400 mt-1">3 seções em vantagem (Novo Horizonte, Boa Vista, Setor Industrial)</p>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-slate-900/40 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-white">Desempenho Seção a Seção</h3>
          <span className="text-xs font-mono text-slate-500">Base: 2º Turno 2022</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="border-b border-white/10 text-xs uppercase text-slate-400">
              <tr>
                <th className="py-3 px-4">Seção / Local</th>
                <th className="py-3 px-4">Candidato A</th>
                <th className="py-3 px-4">Candidato B</th>
                <th className="py-3 px-4">Vantagem Direta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {dadosComparativo.map((row) => (
                <tr key={row.secao} className="hover:bg-white/5">
                  <td className="py-3 px-4 font-medium text-white">{row.secao}</td>
                  <td className="py-3 px-4 text-blue-400 font-mono">
                    {row.candA.votos} ({row.candA.pct})
                  </td>
                  <td className="py-3 px-4 text-red-400 font-mono">
                    {row.candB.votos} ({row.candB.pct})
                  </td>
                  <td className="py-3 px-4 font-semibold text-orange-400 font-mono">
                    {row.diferenca}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}