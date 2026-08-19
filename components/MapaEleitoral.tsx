"use client";

import { useMemo, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import type { Layer, PathOptions, StyleFunction } from "leaflet";
import type {
  AreaDemografiaProps,
  CamadaMapa,
  Candidato,
  FeatureCollectionGenerica,
  SecaoVotacaoProps,
} from "@/lib/types";

const CAMADAS: { value: CamadaMapa; label: string }[] = [
  { value: "votacao", label: "Votação" },
  { value: "densidade", label: "Densidade demográfica" },
  { value: "renda", label: "Renda média" },
];

function escalaCor(valor: number, min: number, max: number, corBase: string) {
  const t = max === min ? 1 : (valor - min) / (max - min);
  const alpha = 0.15 + t * 0.65;
  return { color: corBase, fillOpacity: Math.min(alpha, 0.8) };
}

export default function MapaEleitoral({
  votacao,
  demografia,
  candidatos,
  candidatoFiltroId,
}: {
  votacao: FeatureCollectionGenerica<SecaoVotacaoProps>;
  demografia: FeatureCollectionGenerica<AreaDemografiaProps>;
  candidatos: Candidato[];
  candidatoFiltroId: string;
}) {
  const [camada, setCamada] = useState<CamadaMapa>("votacao");

  const candidatoPorId = useMemo(
    () => Object.fromEntries(candidatos.map((c) => [c.id, c])),
    [candidatos]
  );

  const rendaValores = demografia.features.map((f) => f.properties.rendaMediaDomiciliar);
  const densidadeValores = demografia.features.map((f) => f.properties.densidadeHabKm2);
  const rendaMin = Math.min(...rendaValores);
  const rendaMax = Math.max(...rendaValores);
  const densMin = Math.min(...densidadeValores);
  const densMax = Math.max(...densidadeValores);

  const centro: [number, number] = [-5.6245, -48.1215];

  const styleVotacao: StyleFunction<SecaoVotacaoProps> = (feature) => {
    const props = feature!.properties;
    const emFoco = !candidatoFiltroId || props.candidatoVencedorId === candidatoFiltroId;
    const cand = candidatoPorId[props.candidatoVencedorId];
    return {
      color: cand?.cor ?? "#64748b",
      weight: 1,
      fillOpacity: emFoco ? 0.55 : 0.08,
      opacity: emFoco ? 1 : 0.3,
    } as PathOptions;
  };

  const styleDensidade: StyleFunction<AreaDemografiaProps> = (feature) => {
    const props = feature!.properties;
    const s = escalaCor(props.densidadeHabKm2, densMin, densMax, "#3b82f6");
    return { ...s, weight: 1 } as PathOptions;
  };

  const styleRenda: StyleFunction<AreaDemografiaProps> = (feature) => {
    const props = feature!.properties;
    const s = escalaCor(props.rendaMediaDomiciliar, rendaMin, rendaMax, "#22c55e");
    return { ...s, weight: 1 } as PathOptions;
  };

  function onEachVotacao(feature: GeoJSON.Feature, layer: Layer) {
    const p = feature.properties as SecaoVotacaoProps;
    const cand = candidatoPorId[p.candidatoVencedorId];
    layer.bindTooltip(
      `<div class="font-mono text-[11px]">
        <strong>${p.bairro}</strong> — seção ${p.codigoSecao}<br/>
        Vencedor: ${cand?.nome ?? p.candidatoVencedorId} (${p.percentualVencedor}%)<br/>
        Total votos válidos: ${p.totalVotosValidos}
      </div>`,
      { sticky: true }
    );
  }

  function onEachDemografia(feature: GeoJSON.Feature, layer: Layer) {
    const p = feature.properties as AreaDemografiaProps;
    layer.bindTooltip(
      `<div class="font-mono text-[11px]">
        <strong>${p.bairro}</strong><br/>
        Densidade: ${p.densidadeHabKm2} hab/km²<br/>
        Renda média: R$ ${p.rendaMediaDomiciliar.toLocaleString("pt-BR")}
      </div>`,
      { sticky: true }
    );
  }

  return (
    <div className="relative h-full w-full">
      <div className="absolute right-4 top-4 z-[1000] flex gap-1 rounded-lg border border-white/10 bg-base-900/90 p-1 backdrop-blur">
        {CAMADAS.map((c) => (
          <button
            key={c.value}
            onClick={() => setCamada(c.value)}
            className={`rounded-md px-3 py-1.5 text-xs transition ${
              camada === c.value
                ? "bg-accent-500 text-base-950 font-semibold"
                : "text-slate-300 hover:bg-white/10"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {camada === "votacao" && (
        <div className="absolute bottom-4 left-4 z-[1000] rounded-lg border border-white/10 bg-base-900/90 p-3 text-xs backdrop-blur">
          <p className="mb-2 font-mono text-[10px] text-slate-500">LEGENDA — VENCEDOR POR SEÇÃO</p>
          {candidatos.map((c) => (
            <div key={c.id} className="flex items-center gap-2 py-0.5">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ background: c.cor }} />
              <span className="text-slate-300">
                {c.nome} ({c.numero})
              </span>
            </div>
          ))}
        </div>
      )}

      <MapContainer
        center={centro}
        zoom={13}
        scrollWheelZoom
        className="h-full w-full"
        preferCanvas
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a> &copy; OpenStreetMap'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {camada === "votacao" && (
          <GeoJSON
            key="votacao"
            data={votacao as unknown as GeoJSON.FeatureCollection}
            style={styleVotacao}
            onEachFeature={onEachVotacao}
          />
        )}

        {camada === "densidade" && (
          <GeoJSON
            key="densidade"
            data={demografia as unknown as GeoJSON.FeatureCollection}
            style={styleDensidade}
            onEachFeature={onEachDemografia}
          />
        )}

        {camada === "renda" && (
          <GeoJSON
            key="renda"
            data={demografia as unknown as GeoJSON.FeatureCollection}
            style={styleRenda}
            onEachFeature={onEachDemografia}
          />
        )}
      </MapContainer>
    </div>
  );
}
