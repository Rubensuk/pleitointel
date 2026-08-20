"use client";

import { useState } from "react";

interface Lideranca {
  id: string;
  nome: string;
  telefone: string;
  bairro: string;
  metaVotos: number;
  capacidadeEstimada: number;
  status: "Ativo" | "Em Validação" | "Atenção";
}

const liderancasIniciais: Lideranca[] = [
  { id: "lid_1", nome: "Marcos Oliveira", telefone: "(63) 98111-2233", bairro: "Centro", metaVotos: 800, capacidadeEstimada: 750, status: "Ativo" },
  { id: "lid_2", nome: "Ana Paula Mendes", telefone: "(63) 98422-5566", bairro: "Setor Norte", metaVotos: 1200, capacidadeEstimada: 450, status: "Atenção" },
  { id: "lid_3", nome: "Carlos Eduardo Santos", telefone: "(63) 99233-8899", bairro: "Vila Nova", metaVotos: 600, capacidadeEstimada: 580, status: "Ativo" },
];

export default function CrmTerritorialPage() {
  const [liderancas, setLiderancas] = useState<Lideranca[]>(liderancasIniciais);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [bairro, setBairro] = useState("Centro");
  const [metaVotos, setMetaVotos] = useState(500);
  const [capacidadeEstimada, setCapacidadeEstimada] = useState(400);

  const totalMeta = liderancas.reduce((acc, curr) => acc + curr.metaVotos, 0);
  const totalCapacidade = liderancas.reduce((acc, curr) => acc + curr.capacidadeEstimada, 0);
  const gapGeral = totalMeta - totalCapacidade;
  const coberturaPct = totalMeta > 0 ? Math.round((totalCapacidade / totalMeta) * 100) : 0;

  const handleCadastrar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;

    const novaLid: Lideranca = {
      id: `lid_${Date.now()}`,
      nome,
      telefone,
      bairro,
      metaVotos: Number(metaVotos),
      capacidadeEstimada: Number(capacidadeEstimada),
      status: Number(capacidadeEstimada) >= Number(metaVotos) * 0.8 ? "Ativo" : "Atenção",
    };

    setLiderancas([...liderancas, novaLid]);
    setNome("");
    setTelefone("");
  };

  return (
    <div className="p-8 space-y-8 bg-slate-950 text-white min-h-screen">
      <div>
        <p className="font-mono text-xs tracking-widest text-slate-500">MÓDULO 7</p>
        <h1 className="mt-1 text-2xl font-bold">CRM Georreferenciado & Lideranças</h1>
        <p className="text-slate-400 text-sm">
          Acompanhamento de articuladores de campo e análise de gaps de cobertura territorial.
        </p>
      </div>

      {/* Cards de Métricas e Gap */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-white/10 bg-slate-900/40 p-4">
          <p className="text-xs text-slate-400">Total de Articuladores</p>
          <p className="text-2xl font-bold mt-1 text-white">{liderancas.length}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-slate-900/40 p-4">
          <p className="text-xs text-slate-400">Meta Territorial de Votos</p>
          <p className="text-2xl font-bold mt-1 text-white">{totalMeta.toLocaleString("pt-BR")}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-slate-900/40 p-4">
          <p className="text-xs text-slate-400">Capacidade Real Mapeada</p>
          <p className="text-2xl font-bold mt-1 text-emerald-400">{totalCapacidade.toLocaleString("pt-BR")}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-slate-900/40 p-4">
          <p className="text-xs text-slate-400">Gap de Cobertura ({coberturaPct}%)</p>
          <p className={`text-2xl font-bold mt-1 ${gapGeral > 0 ? "text-amber-400" : "text-emerald-400"}`}>
            {gapGeral > 0 ? `-${gapGeral.toLocaleString("pt-BR")} votos` : "Meta Atingida"}
          </p>
        </div>
      </div>

      {/* Grid: Formulário + Tabela */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário de Cadastro */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 space-y-4">
          <h2 className="text-base font-semibold text-white">Cadastrar Novo Articulador</h2>
          <form onSubmit={handleCadastrar} className="space-y-4">
            <div>
              <label className="text-xs text-slate-400">Nome da Liderança</label>
              <input
                type="text"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: João da Silva"
                className="mt-1 w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400">Telefone / WhatsApp</label>
              <input
                type="text"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(00) 00000-0000"
                className="mt-1 w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400">Bairro / Setor de Atuação</label>
              <select
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
                className="mt-1 w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
              >
                <option value="Centro">Centro</option>
                <option value="Setor Norte">Setor Norte</option>
                <option value="Vila Nova">Vila Nova</option>
                <option value="Zona Rural">Zona Rural</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400">Meta (Votos)</label>
                <input
                  type="number"
                  value={metaVotos}
                  onChange={(e) => setMetaVotos(Number(e.target.value))}
                  className="mt-1 w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400">Estimado Real</label>
                <input
                  type="number"
                  value={capacidadeEstimada}
                  onChange={(e) => setCapacidadeEstimada(Number(e.target.value))}
                  className="mt-1 w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-500 text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
            >
              Salvar Articulador
            </button>
          </form>
        </div>

        {/* Tabela de Lideranças Cadastradas */}
        <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-slate-900/40 p-6 space-y-4">
          <h2 className="text-base font-semibold text-white">Quadro de Articuladores e Cobertura</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-white/10 text-xs text-slate-400">
                <tr>
                  <th className="pb-3">Nome</th>
                  <th className="pb-3">Bairro</th>
                  <th className="pb-3">Meta</th>
                  <th className="pb-3">Capacidade</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {liderancas.map((lid) => {
                  const gap = lid.metaVotos - lid.capacidadeEstimada;
                  return (
                    <tr key={lid.id} className="hover:bg-white/[0.02]">
                      <td className="py-3 font-medium text-white">
                        {lid.nome}
                        <span className="block text-xs text-slate-500 font-normal">{lid.telefone}</span>
                      </td>
                      <td className="py-3 text-slate-400">{lid.bairro}</td>
                      <td className="py-3">{lid.metaVotos}</td>
                      <td className="py-3 text-emerald-400 font-semibold">{lid.capacidadeEstimada}</td>
                      <td className="py-3">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                            gap <= 100
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          }`}
                        >
                          {gap <= 100 ? "Meta Alinhada" : `Gap: -${gap}`}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}