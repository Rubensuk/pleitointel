"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Filtros, { EstadoFiltros } from "@/components/Filtros";

interface MetricasDashboard {
  eleitoradoTotal: number;
  totalSecoes: number;
  rendaMediaBairro: number;
  quocienteEstimado: number;
  metaVotosSugerida: number;
  abstencaoEstimadaPct: number;
  densidadeEleitoral: number;
}

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

  const [metricas, setMetricas] = useState<MetricasDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarMetricas() {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/dashboard/stats?uf=${filtros.uf}&municipio=${filtros.municipioIbge}&bairro=${encodeURIComponent(
            filtros.bairro
          )}&cargo=${filtros.cargo}&ano=${filtros.ano}`
        );
        const data = await res.json();
        setMetricas(data.metricas);
      } catch (err) {
        console.error("Erro ao buscar métricas:", err);
      } finally {
        setLoading(false);
      }
    }

    carregarMetricas();
  }, [filtros.uf, filtros.municipioIbge, filtros.bairro, filtros.cargo, filtros.ano]);

  const queryUrl = `?uf=${filtros.uf}&municipio=${filtros.municipioIbge}&bairro=${encodeURIComponent(
    filtros.bairro
  )}&ano=${filtros.ano}&cargo=${filtros.cargo}&candidato=${filtros.candidatoId}`;

  const formatNumero = (num?: number) =>
    num !== undefined ? num.toLocaleString("pt-BR") : "---";

  const formatMoeda = (num?: number) =>
    num !== undefined
      ? `R$ ${num.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
      : "---";

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
          Altere os seletores territoriais para recalcular os indicadores em tempo real.
        </p>
      </div>

      {/* Barra de Filtros */}
      <Filtros filtros={filtros} onChange={setFiltros} />

      {/* Faixa de KPIs Rápidos */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-white/10 p-4 rounded-xl">
          <span className="text-[11px] font-mono uppercase text-slate-400">Eleitorado Apto</span>
          <p className="text-2xl font-bold text-white mt-1">
            {loading ? "..." : formatNumero(metricas?.eleitoradoTotal)}
          </p>
          <span className="text-[10px] text-slate-500">Recorte TSE oficial</span>
        </div>
        <div className="bg-slate-900/60 border border-white/10 p-4 rounded-xl">
          <span className="text-[11px] font-mono uppercase text-slate-400">Locais / Seções</span>
          <p className="text-2xl font-bold text-orange-400 mt-1">
            {loading ? "..." : formatNumero(metricas?.totalSecoes)}
          </p>
          <span className="text-[10px] text-slate-500">Média {metricas?.densidadeEleitoral} eleit/seção</span>
        </div>
        <div className="bg-slate-900/60 border border-white/10 p-4 rounded-xl">
          <span className="text-[11px] font-mono uppercase text-slate-400">Renda Média (IBGE)</span>
          <p className="text-2xl font-bold text-emerald-400 mt-1">
            {loading ? "..." : formatMoeda(metricas?.rendaMediaBairro)}
          </p>
          <span className="text-[10px] text-slate-500">Ponderada por setor</span>
        </div>
        <div className="bg-slate-900/60 border border-white/10 p-4 rounded-xl">
          <span className="text-[11px] font-mono uppercase text-slate-400">Quociente Estimado</span>
          <p className="text-2xl font-bold text-blue-400 mt-1">
            {loading ? "..." : `${formatNumero(metricas?.quocienteEstimado)} votos`}
          </p>
          <span className="text-[10px] text-slate-500">Projeção para {filtros.cargo}</span>
        </div>
      </div>

      {/* Grid de Módulos com Métricas Dinâmicas Integradas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Card 1: Mapa */}
        <Link
          href={`/dashboard/mapa${queryUrl}`}
          className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 p-6 transition-all duration-300 hover:border-orange-500/50 hover:bg-slate-900 hover:shadow-lg hover:shadow-orange-500/5"
        >
          <div className="text-3xl mb-4">🗺️</div>
          <h3 className="font-semibold text-lg text-white group-hover:text-orange-400 transition-colors">
            Diagnóstico Territorial
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Mapa de calor com <strong>{loading ? "..." : metricas?.totalSecoes} seções</strong> mapeadas em {filtros.bairro}.
          </p>
          <div className="mt-4 text-xs font-medium text-orange-400">
            Explorar mapa e seções →
          </div>
        </Link>

        {/* Card 2: Projeções */}
        <Link
          href={`/dashboard/projecoes${queryUrl}`}
          className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 p-6 transition-all duration-300 hover:border-indigo-500/50 hover:bg-slate-900 hover:shadow-lg"
        >
          <div className="text-3xl mb-4">📈</div>
          <h3 className="font-semibold text-lg text-white group-hover:text-indigo-400 transition-colors">
            Projeções Eleitorais
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Histórico de comparecimento com taxa de abstenção estimada em <strong>{metricas?.abstencaoEstimadaPct}%</strong>.
          </p>
          <div className="mt-4 text-xs font-medium text-indigo-400">
            Ver tendência das urnas →
          </div>
        </Link>

        {/* Card 3: Viabilidade */}
        <Link
          href={`/dashboard/viabilidade${queryUrl}`}
          className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 p-6 transition-all duration-300 hover:border-pink-500/50 hover:bg-slate-900 hover:shadow-lg"
        >
          <div className="text-3xl mb-4">🎯</div>
          <h3 className="font-semibold text-lg text-white group-hover:text-pink-400 transition-colors">
            Simulador de Viabilidade
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Meta estimada: <strong>{loading ? "..." : formatNumero(metricas?.metaVotosSugerida)} votos</strong> para competitividade.
          </p>
          <div className="mt-4 text-xs font-medium text-pink-400">
            Calcular quociente e sobras →
          </div>
        </Link>

        {/* Card 4: Confronto */}
        <Link
          href={`/dashboard/confronto${queryUrl}`}
          className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 p-6 transition-all duration-300 hover:border-emerald-500/50 hover:bg-slate-900 hover:shadow-lg"
        >
          <div className="text-3xl mb-4">📊</div>
          <h3 className="font-semibold text-lg text-white group-hover:text-emerald-400 transition-colors">
            Confronto de Candidatos
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Comparação direta urna a urna no território de {filtros.bairro}.
          </p>
          <div className="mt-4 text-xs font-medium text-emerald-400">
            Comparar votos por seção →
          </div>
        </Link>

        {/* Card 5: Relatórios */}
        <Link
          href={`/dashboard/relatorios${queryUrl}`}
          className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 p-6 transition-all duration-300 hover:border-amber-500/50 hover:bg-slate-900 hover:shadow-lg"
        >
          <div className="text-3xl mb-4">📄</div>
          <h3 className="font-semibold text-lg text-white group-hover:text-amber-400 transition-colors">
            Relatórios & Exportação
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Gerar dossiê com dados cruzados do TSE e Censo IBGE em PDF/Excel.
          </p>
          <div className="mt-4 text-xs font-medium text-amber-400">
            Exportar inteligência territorial →
          </div>
        </Link>
      </div>
    </div>
  );
}