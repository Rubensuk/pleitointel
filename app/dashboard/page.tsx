"use client";

import { useState } from "react";
import Link from "next/link";
import Filtros, { EstadoFiltros } from "@/components/Filtros";

const modulos = [
  {
    nome: "Diagnóstico territorial",
    slug: "mapa",
    icone: "🗺️",
    desc: "Mapa de votação, densidade e renda por seção/bairro.",
    cor: "from-blue-600/20 to-transparent",
  },
  {
    nome: "Projeções eleitorais",
    slug: "projecoes",
    icone: "📈",
    desc: "Tendência de votação por seção nas últimas eleições.",
    cor: "from-indigo-600/20 to-transparent",
  },
  {
    nome: "Simulador de viabilidade",
    slug: "viabilidade",
    icone: "🎯",
    desc: "Simulação de quociente eleitoral e meta de votos.",
    cor: "from-pink-600/20 to-transparent",
  },
  {
    nome: "Confronto de candidatos",
    slug: "confronto",
    icone: "📊",
    desc: "Comparativo de desempenho direto entre candidatos e seções.",
    cor: "from-emerald-600/20 to-transparent",
  },
  {
    nome: "Relatórios & Exportação",
    slug: "relatorios",
    icone: "📄",
    desc: "Exportação em PDF e Excel para reuniões de coordenação.",
    cor: "from-amber-600/20 to-transparent",
  },
];

export default function DashboardPage() {
  const [filtros, setFiltros] = useState<EstadoFiltros>({
    uf: "TO",
    ano: 2024,
    cargo: "VEREADOR",
    municipioIbge: "1721000",
    bairro: "Todos os Bairros",
    candidatoId: "",
    partidoSigla: "",
  });

  const queryUrl = `?uf=${filtros.uf}&municipio=${filtros.municipioIbge}&bairro=${encodeURIComponent(
    filtros.bairro
  )}&ano=${filtros.ano}&cargo=${filtros.cargo}&candidato=${filtros.candidatoId}`;

  return (
    <div className="space-y-6">
      <div>
        <span className="font-mono text-xs font-semibold text-orange-500 uppercase tracking-widest">
          Painel Principal
        </span>
        <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
          Visão Geral Estratégica
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Selecione o Estado, Cidade, Bairro e Cargo para filtrar todas as análises.
        </p>
      </div>

      {/* Barra de Filtros com Estado, Cidade e Bairro */}
      <Filtros filtros={filtros} onChange={setFiltros} />

      {/* Grid de Módulos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {modulos.map((mod) => (
          <Link
            key={mod.slug}
            href={`/dashboard/${mod.slug}${queryUrl}`}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 p-6 transition-all duration-300 hover:border-orange-500/50 hover:bg-slate-900 hover:shadow-lg hover:shadow-orange-500/5"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${mod.cor} opacity-0 transition-opacity group-hover:opacity-100`} />
            <div className="relative z-10">
              <div className="text-3xl mb-4">{mod.icone}</div>
              <h3 className="font-semibold text-lg text-white group-hover:text-orange-400 transition-colors">
                {mod.nome}
              </h3>
              <p className="text-sm text-slate-400 mt-2 line-clamp-2">
                {mod.desc}
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity">
                Abrir módulo com filtros aplicados →
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}