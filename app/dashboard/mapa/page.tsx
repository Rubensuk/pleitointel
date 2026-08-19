"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import PainelInsights from "@/components/ai/PainelInsights";
import { Candidato, FeatureCollectionGenerica, SecaoVotacaoProps, AreaDemografiaProps } from "@/types";

const MapaEleitoral = dynamic(() => import("@/components/MapaEleitoral"), {
  ssr: false,
  loading: () => (
    <div className="h-[480px] w-full rounded-2xl border border-white/10 bg-slate-900/40 flex items-center justify-center text-slate-500 font-mono text-xs animate-pulse">
      Carregando camadas geoespaciais e zonas eleitorais...
    </div>
  ),
});

// Mock de dados territoriais iniciais para renderização do mapa
const mockCandidatos: Candidato[] = [
  { id: "cand_1", nome: "Candidato Principal", numero: 10, partido: "PARTIDO A", votos: 18450, percentual: 34.2, cor: "#f97316" },
  { id: "cand_2", nome: "Adversário Direto", numero: 20, partido: "PARTIDO B", votos: 15320, percentual: 28.4, cor: "#3b82f6" },
];

const mockVotacao: FeatureCollectionGenerica<SecaoVotacaoProps> = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [-48.2045, -7.1923] },
      properties: {
        secao_id: "sec_001",
        zona: "001",
        secao: "0012",
        local_votacao: "Colégio Estadual Central",
        total_votos: 1420,
        abstencao_pct: 14.5,
        candidatos: {
          cand_1: { votos: 650, pct: 45.7 },
          cand_2: { votos: 480, pct: 33.8 },
        },
      },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [-48.198, -7.185] },
      properties: {
        secao_id: "sec_002",
        zona: "001",
        secao: "0013",
        local_votacao: "Escola Municipal Norte",
        total_votos: 1180,
        abstencao_pct: 18.2,
        candidatos: {
          cand_1: { votos: 390, pct: 33.0 },
          cand_2: { votos: 520, pct: 44.0 },
        },
      },
    },
  ],
};

const mockDemografia: FeatureCollectionGenerica<AreaDemografiaProps> = {
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
        bairro_id: "bairro_central",
        nome_bairro: "Região Central",
        populacao_total: 45200,
        renda_media_salarios: 3.8,
        faixa_etaria_predominante: "25-44 anos",
        grau_escolaridade_superior_pct: 32.5,
      },
    },
  ],
};

export default function MapaPage() {
  const [candidatoSelecionado, setCandidatoSelecionado] = useState<string>("cand_1");

  return (
    <div className="p-8 space-y-6 bg-slate-950 text-white min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="font-mono text-xs tracking-widest text-slate-500">MÓDULO 1</p>
          <h1 className="mt-1 text-2xl font-bold">Diagnóstico Territorial</h1>
          <p className="text-slate-400 text-sm">
            Mapeamento geoespacial de densidade de votos, locais de votação e taxas de abstenção.
          </p>
        </div>

        {/* Filtro rápido de candidato */}
        <div className="flex items-center gap-3">
          <label className="text-xs text-slate-400 font-medium">Visualizar candidato:</label>
          <select
            value={candidatoSelecionado}
            onChange={(e) => setCandidatoSelecionado(e.target.value)}
            className="bg-slate-900 border border-white/10 text-xs text-white rounded-lg px-3 py-2 focus:border-orange-500 focus:outline-none"
          >
            {mockCandidatos.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome} ({c.partido})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Assistente IA - Leitura Estratégica do Mapa */}
      <PainelInsights tipo="mapa" />

      {/* Camada do Mapa Interativo com Props Completas */}
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