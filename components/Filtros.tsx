"use client";

import type { Cargo, Candidato } from "@/lib/types";

export interface EstadoFiltros {
  ano: number;
  cargo: Cargo;
  municipioIbge: string;
  candidatoId: string;
  partidoSigla: string;
}

const CARGOS: { value: Cargo; label: string }[] = [
  { value: "PRESIDENTE", label: "Presidente" },
  { value: "GOVERNADOR", label: "Governador" },
  { value: "SENADOR", label: "Senador" },
  { value: "DEPUTADO_FEDERAL", label: "Deputado Federal" },
  { value: "DEPUTADO_ESTADUAL", label: "Deputado Estadual" },
  { value: "PREFEITO", label: "Prefeito" },
  { value: "VEREADOR", label: "Vereador" },
];

// Nesta entrega há apenas um município carregado no pipeline de validação.
const MUNICIPIOS = [{ value: "1700251", label: "Município exemplo (piloto)" }];

export default function Filtros({
  filtros,
  candidatos,
  onChange,
}: {
  filtros: EstadoFiltros;
  candidatos: Candidato[];
  onChange: (novo: EstadoFiltros) => void;
}) {
  const partidos = Array.from(new Set(candidatos.map((c) => c.partidoSigla)));

  function set<K extends keyof EstadoFiltros>(key: K, value: EstadoFiltros[K]) {
    onChange({ ...filtros, [key]: value });
  }

  const selectClass =
    "w-full rounded-lg border border-white/10 bg-base-850 px-3 py-2 text-sm outline-none focus:border-accent-500";

  return (
    <div className="grid grid-cols-2 gap-3 border-b border-white/10 p-4 sm:grid-cols-3 lg:grid-cols-5">
      <div>
        <label className="mb-1 block font-mono text-[10px] text-slate-500">ANO</label>
        <select
          className={selectClass}
          value={filtros.ano}
          onChange={(e) => set("ano", Number(e.target.value))}
        >
          <option value={2022}>2022</option>
          <option value={2020}>2020</option>
          <option value={2018}>2018</option>
        </select>
      </div>

      <div>
        <label className="mb-1 block font-mono text-[10px] text-slate-500">CARGO</label>
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

      <div>
        <label className="mb-1 block font-mono text-[10px] text-slate-500">MUNICÍPIO</label>
        <select
          className={selectClass}
          value={filtros.municipioIbge}
          onChange={(e) => set("municipioIbge", e.target.value)}
        >
          {MUNICIPIOS.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block font-mono text-[10px] text-slate-500">CANDIDATO</label>
        <select
          className={selectClass}
          value={filtros.candidatoId}
          onChange={(e) => set("candidatoId", e.target.value)}
        >
          <option value="">Todos</option>
          {candidatos.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome} ({c.numero})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block font-mono text-[10px] text-slate-500">PARTIDO</label>
        <select
          className={selectClass}
          value={filtros.partidoSigla}
          onChange={(e) => set("partidoSigla", e.target.value)}
        >
          <option value="">Todos</option>
          {partidos.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
