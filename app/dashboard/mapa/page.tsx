"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import PainelInsights from "@/components/ai/PainelInsights";
import { Candidato, FeatureCollectionGenerica, SecaoVotacaoProps, AreaDemografiaProps } from "@/lib/types";

const MapaEleitoral = dynamic(() => import("@/components/MapaEleitoral"), {
  ssr: false,
  loading: () => (
    <div className="h-[480px] w-full rounded-2xl border border-white/10 bg-slate-900/40 flex items-center justify-center text-slate-500 font-mono text-xs animate-pulse">
      Carregando camadas geoespaciais e zonas eleitorais...
    </div>
  ),
});

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
      } as any,
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
      } as any,
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
        bairro: "Centro",
        municipioIbge: "1702109",
        populacaoTotal: 45200,
        rendaMedia: 3.8,
        faixaEtariaPredominante: "25-44 anos",
        escolaridadeSuperiorPct: 32.5,
      } as any,
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