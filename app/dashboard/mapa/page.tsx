"use client";

import dynamic from "next/dynamic";
import PainelInsights from "@/components/ai/PainelInsights";

const MapaEleitoral = dynamic(() => import("@/components/MapaEleitoral"), {
  ssr: false,
  loading: () => (
    <div className="h-[480px] w-full rounded-2xl border border-white/10 bg-slate-900/40 flex items-center justify-center text-slate-500 font-mono text-xs animate-pulse">
      Carregando camadas geoespaciais e zonas eleitorais...
    </div>
  ),
});

export default function MapaPage() {
  return (
    <div className="p-8 space-y-6 bg-slate-950 text-white min-h-screen">
      <div>
        <p className="font-mono text-xs tracking-widest text-slate-500">MÓDULO 1</p>
        <h1 className="mt-2 text-2xl font-semibold">Diagnóstico Territorial</h1>
        <p className="mt-1 text-slate-400 text-sm">
          Mapeamento geoespacial de densidade de votos, locais de votação e taxas de abstenção.
        </p>
      </div>

      {/* Assistente IA - Leitura Estratégica do Mapa */}
      <PainelInsights tipo="mapa" />

      {/* Camada do Mapa Interativo */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4 overflow-hidden">
        <MapaEleitoral />
      </div>
    </div>
  );
}