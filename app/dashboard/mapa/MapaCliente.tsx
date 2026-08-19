"use client";

import { useMemo, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";

type SecaoProps = {
  codigoSecao: string;
  zona: string;
  bairro: string;
  municipioIbge: string;
  totalVotosValidos: number;
  votosPorCandidato: Record<string, number>;
  candidatoVencedorId: string;
  percentualVencedor: number;
};

type SecaoFeature = {
  type: "Feature";
  properties: SecaoProps;
  geometry: { type: string; coordinates: number[][][] };
};

type SecaoFeatureCollection = {
  type: "FeatureCollection";
  features: SecaoFeature[];
};

const CORES: Record<string, string> = {
  "cand-a": "#1d4ed8", // azul
  "cand-b": "#7f1d1d", // vermelho
};

const NOMES_CANDIDATOS: Record<string, string> = {
  "cand-a": "Candidato A",
  "cand-b": "Candidato B",
};

export default function MapaCliente({
  dadosIniciais,
}: {
  dadosIniciais: SecaoFeatureCollection;
}) {
  const [dados] = useState<SecaoFeatureCollection>(dadosIniciais);
  const [candidatoFiltro, setCandidatoFiltro] = useState<string>("todos");
  const [secaoSelecionada, setSecaoSelecionada] = useState<string | null>(
    null
  );

  const featuresFiltradas = useMemo(() => {
    if (candidatoFiltro === "todos") return dados.features;
    return dados.features.filter(
      (f) => f.properties.candidatoVencedorId === candidatoFiltro
    );
  }, [dados, candidatoFiltro]);

  const candidatosDisponiveis = useMemo(() => {
    const ids = new Set(
      dados.features.map((f) => f.properties.candidatoVencedorId)
    );
    return Array.from(ids);
  }, [dados]);

  const centro = useMemo<[number, number]>(() => {
    if (dados.features.length === 0) return [-5.625, -48.121];
    let latSoma = 0;
    let lngSoma = 0;
    let pontos = 0;
    dados.features.forEach((f) => {
      f.geometry.coordinates[0].forEach(([lng, lat]) => {
        latSoma += lat;
        lngSoma += lng;
        pontos += 1;
      });
    });
    return [latSoma / pontos, lngSoma / pontos];
  }, [dados]);

  return (
    <div className="flex flex-1 overflow-hidden">
      <aside className="w-80 shrink-0 overflow-y-auto border-r border-white/10 p-4">
        <div className="mb-4">
          <label className="block font-mono text-[10px] tracking-widest text-slate-500">
            CANDIDATO
          </label>
          <select
            value={candidatoFiltro}
            onChange={(e) => setCandidatoFiltro(e.target.value)}
            className="mt-1 w-full rounded-lg border border-white/10 bg-base-900 p-2 text-sm text-white"
          >
            <option value="todos">Todos</option>
            {candidatosDisponiveis.map((id) => (
              <option key={id} value={id}>
                {NOMES_CANDIDATOS[id] ?? id}
              </option>
            ))}
          </select>
        </div>

        <p className="mb-2 font-mono text-[10px] tracking-widest text-slate-500">
          {featuresFiltradas.length} SEÇÕES
        </p>

        <div className="space-y-2">
          {featuresFiltradas.map((f) => {
            const p = f.properties;
            const cor = CORES[p.candidatoVencedorId] ?? "#334155";
            const selecionada = secaoSelecionada === p.codigoSecao;
            return (
              <button
                key={p.codigoSecao}
                onClick={() => setSecaoSelecionada(p.codigoSecao)}
                className={`w-full rounded-lg border p-3 text-left transition ${
                  selecionada ? "border-white" : "border-white/10"
                }`}
                style={{ backgroundColor: cor }}
              >
                <p className="font-mono text-xs text-white/70">
                  {p.codigoSecao}
                </p>
                <p className="font-semibold text-white">{p.bairro}</p>
                <p className="text-sm text-white/70">
                  {p.percentualVencedor}%
                </p>
              </button>
            );
          })}
        </div>
      </aside>

      <div className="flex-1">
        <MapContainer
          center={centro}
          zoom={14}
          className="h-full w-full"
          scrollWheelZoom
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <GeoJSON
            key={candidatoFiltro}
            data={
              {
                type: "FeatureCollection",
                features: featuresFiltradas,
              } as any
            }
            style={(feature: any) => ({
              color: "#0f172a",
              weight: 1,
              fillColor:
                CORES[feature?.properties.candidatoVencedorId] ?? "#334155",
              fillOpacity:
                feature?.properties.codigoSecao === secaoSelecionada
                  ? 0.9
                  : 0.6,
            })}
            onEachFeature={(feature: any, layer: any) => {
              const p = feature.properties as SecaoProps;
              layer.bindPopup(
                `<strong>${p.bairro}</strong><br/>Seção ${p.codigoSecao} · Zona ${p.zona}<br/>${
                  NOMES_CANDIDATOS[p.candidatoVencedorId] ??
                  p.candidatoVencedorId
                } — ${p.percentualVencedor}%<br/>${p.totalVotosValidos} votos válidos`
              );
              layer.on("click", () => setSecaoSelecionada(p.codigoSecao));
            }}
          />
        </MapContainer>
      </div>
    </div>
  );
}
