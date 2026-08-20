"use client";

import type { Cargo, Candidato } from "@/lib/types";

export interface EstadoFiltros {
  ano: number;
  cargo: Cargo;
  municipioIbge: string;
  bairro: string;
  candidatoId: string;
  partidoSigla: string;
}

const CARGOS: { value: Cargo; label: string }[] = [
  { value: "PREFEITO", label: "Prefeito" },
  { value: "VEREADOR", label: "Vereador" },
  { value: "DEPUTADO_ESTADUAL", label: "Deputado Estadual" },
  { value: "DEPUTADO_FEDERAL", label: "Deputado Federal" },
  { value: "SENADOR", label: "Senador" },
  { value: "GOVERNADOR", label: "Governador" },
  { value: "PRESIDENTE", label: "Presidente" },
];

const MUNICIPIOS = [
  { value: "1721000", label: "Palmas (TO)" },
  { value: "1702109", label: "Araguaína (TO)" },
  { value: "1709500", label: "Gurupi (TO)" },
  { value: "1718204", label: "Porto Nacional (TO)" },
  { value: "1716109", label: "Paraíso do Tocantins (TO)" },
  { value: "1701002", label: "Ananás (TO)" },
  { value: "1702406", label: "Araguatins (TO)" },
  { value: "1722107", label: "Xambioá (TO)" },
  { value: "1504208", label: "Marabá (PA)" },
  { value: "2105302", label: "Imperatriz (MA)" },
];

const BAIRROS_EXEMPLO: Record<string, string[]> = {
  "1721000": ["Todos os Bairros", "Plano Diretor Sul", "Plano Diretor Norte", "Taquaralto", "Aureny III", "Jardim Taquari"],
  "1702109": ["Todos os Bairros", "Centro", "Setor Noroeste", "Setor Maracanã", "Araguaína Sul", "Cimba"],
  "1709500": ["Todos os Bairros", "Centro", "Setor Sol Nascente", "Parque das Acácias", "Vila Nova"],
};

export default function Filtros({
  filtros,
  candidatos = [],
  onChange,
}: {
  filtros: EstadoFiltros;
  candidatos?: Candidato[];
  onChange: (novo: EstadoFiltros) => void;
}) {
  const bairrosDisponiveis = BAIRROS_EXEMPLO[filtros.municipioIbge] || [
    "Todos os Bairros",
    "Região Central",
    "Zona Norte",
    "Zona Sul",
    "Zona Leste",
    "Zona Oeste",
    "Zona Rural",
  ];

  function set<K extends keyof EstadoFiltros>(key: K, value: EstadoFiltros[K]) {
    onChange({ ...filtros, [key]: value });
  }

  const selectClass =
    "w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-xs text-slate-100 outline-none focus:border-orange-500 transition";

  return (
    <div className="bg-slate-900/80 border border-white/10 p-5 rounded-2xl shadow-xl backdrop-blur mb-8">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-orange-500 animate-pulse"></span>
          <span className="text-xs font-mono font-bold tracking-wider text-slate-300 uppercase">
            Recorte de Inteligência Eleitoral
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-400 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
          Base: TSE & IBGE Oficial
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Município */}
        <div>
          <label className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-slate-400">Cidade / Município</label>
          <select
            className={selectClass}
            value={filtros.municipioIbge}
            onChange={(e) => {
              onChange({
                ...filtros,
                municipioIbge: e.target.value,
                bairro: "Todos os Bairros",
              });
            }}
          >
            {MUNICIPIOS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* Bairro / Região */}
        <div>
          <label className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-slate-400">Bairro / Região</label>
          <select
            className={selectClass}
            value={filtros.bairro}
            onChange={(e) => set("bairro", e.target.value)}
          >
            {bairrosDisponiveis.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        {/* Ano */}
        <div>
          <label className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-slate-400">Ano Eleição</label>
          <select
            className={selectClass}
            value={filtros.ano}
            onChange={(e) => set("ano", Number(e.target.value))}
          >
            <option value={2024}>2024 (Municipal)</option>
            <option value={2022}>2022 (Geral)</option>
            <option value={2020}>2020 (Municipal)</option>
            <option value={2018}>2018 (Geral)</option>
          </select>
        </div>

        {/* Cargo */}
        <div>
          <label className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-slate-400">Cargo</label>
          <select
            className={selectClass}
            value={filtros.cargo}
            onChange={(e) => set("cargo", e.target.value as Cargo)}
          >
            {CARGOS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Candidato */}
        <div>
          <label className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-slate-400">Candidato Alvo</label>
          <select
            className={selectClass}
            value={filtros.candidatoId}
            onChange={(e) => set("candidatoId", e.target.value)}
          >
            <option value="">Todos / Visão Geral</option>
            {candidatos.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome} ({c.numero})
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}