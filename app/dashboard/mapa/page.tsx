"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import PainelInsights from "@/components/ai/PainelInsights";
import MicrodirecionamentoCard from "@/components/ai/MicrodirecionamentoCard";

const MapaEleitoral = dynamic(() => import("@/components/MapaEleitoral"), {
  ssr: false,
  loading: () => (
    <div className="h-[480px] w-full rounded-2xl border border-white/10 bg-slate-900/40 flex items-center justify-center text-slate-500 font-mono text-xs animate-pulse">
      Carregando camadas geoespaciais e zonas eleitorais...
    </div>
  ),
});

const mockCandidatos: any[] = [
  { id: "cand_1", nome: "Candidato Principal", numero: "10", siglaPartido: "PARTIDO A", votos: 18450, percentual: 34.2, cor: "#f97316" },
  { id: "cand_2", nome: "Adversário Direto", numero: "20", siglaPartido: "PARTIDO B", votos: 15320, percentual: 28.4, cor: "#3b82f6" },
];

const mockVotacao: any = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [-48.2045, -7.1923] },
      properties: {
        codigoSecao: "0012",
        zona: "001",
        secao: "0012",
        bairro: "Centro",
        municipioIbge: "1702109",
        localVotacao: "Colégio Estadual Central",
        totalEleitoresAptos: 1650,
        totalVotosValidos: 1420,
        taxaAbstencao: 14.5,
        votosPorCandidato: {
          cand_1: { votos: 650, percentual: 45.7 },
          cand_2: { votos: 480, percentual: 33.8 },
        },
      },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [-48.198, -7.185] },
      properties: {
        codigoSecao: "0013",
        zona: "001",
        secao: "0013",
        bairro: "Setor Norte",
        municipioIbge: "1702109",
        localVotacao: "Escola Municipal Norte",
        totalEleitoresAptos: 1400,
        totalVotosValidos: 1180,
        taxaAbstencao: 18.2,
        votosPorCandidato: {
          cand_1: { votos: 390, percentual: 33.0 },
          cand_2: { votos: 520, percentual: 44.0 },
        },
      },
    },
  ],
};

const mockDemografia: any = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-48.22, -7.21],
            [-48.18, -7.21],
            [-48.18, -7.17],
            [-48.22, -7.17],
            [-48.22, -7.21],
          ],
        ],
      },
      properties: {
        bairro: "Centro",
        municipioIbge: "1702109",
        populacaoTotal: 45200,
        rendaMedia: 3.8,
        faixaEtariaPredominante: "25-44 anos",
        escolaridadeSuperiorPct: 32.5,
      },
    },
  ],
};

export default function MapaPage() {
  const [candidatoSelecionado, setCandidatoSelecionado] = useState<string>("cand_1");
  const [bairroFoco, setBairroFoco] = useState<string>("Centro");

  return (
    <div className="p-8 space-y-6 bg-slate-950 text-white min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="font-mono text-xs tracking-widest text-slate-500">MÓDULO 1 & MÓDULO 6</p>
          <h1 className="mt-1 text-2xl font-bold">Diagnóstico Territorial & Microdirecionamento</h1>
          <p className="text-slate-400 text-sm">
            Mapeamento geoespacial e geração de pautas de discurso por setor.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs text-slate-400 font-medium">Bairro Foco:</label>
          <select
            value={bairroFoco}
            onChange={(e) => setBairroFoco(e.target.value)}
            className="bg-slate-900 border border-white/10 text-xs text-white rounded-lg px-3 py-2 focus:border-orange-500 focus:outline-none"
          >
            <option value="Centro">Centro</option>
            <option value="Setor Norte">Setor Norte</option>
            <option value="Vila Nova">Vila Nova</option>
          </select>
        </div>
      </div>

      {/* Assistente IA - Leitura Estratégica Geral do Mapa */}
      <PainelInsights tipo="mapa" />

      {/* Módulo 6 - Microdirecionamento Narrativo Específico do Bairro */}
      <MicrodirecionamentoCard bairroSelecionado={bairroFoco} />

      {/* Camada do Mapa Interativo */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4 overflow-hidden">
        <MapaEleitoral
          votacao={mockVotacao}
          demografia={mockDemografia}
          candidatos={mockCandidatos}
          candidatoFiltroId={candidatoSelecionado}
        />
      </div>
    </div>
  );
}