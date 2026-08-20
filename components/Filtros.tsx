import type { Cargo, Candidato } from "@/lib/types";

export interface EstadoFiltros {
  ano: number;
  cargo: Cargo;
  municipioIbge: string;
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

export default function Filtros({
  filtros,
  candidatos = [],
  onChange,
}: {
  filtros: EstadoFiltros;
  candidatos?: Candidato[];
  onChange: (novo: EstadoFiltros) => void;
}) {
  const partidos = Array.from(new Set(candidatos.map((c) => c.partidoSigla).filter(Boolean)));

  function set<K extends keyof EstadoFiltros>(key: K, value: EstadoFiltros[K]) {
    onChange({ ...filtros, [key]: value });
  }

  const selectClass =
    "w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:border-orange-500 transition";

  return (
    <div className="grid grid-cols-2 gap-3 border border-white/10 bg-slate-950/60 p-4 rounded-xl shadow-md sm:grid-cols-3 lg:grid-cols-5 mb-6 backdrop-blur">
      <div>
        <label className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-slate-400">Ano</label>
        <select
          className={selectClass}
          value={filtros.ano}
          onChange={(e) => set("ano", Number(e.target.value))}
        >
          <option value={2024}>2024</option>
          <option value={2022}>2022</option>
          <option value={2020}>2020</option>
          <option value={2018}>2018</option>
        </select>
      </div>

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

      <div>
        <label className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-slate-400">Município / Cidade</label>
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
        <label className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-slate-400">Candidato</label>
        <select
          className={selectClass}
          value={filtros.candidatoId}
          onChange={(e) => set("candidatoId", e.target.value)}
        >
          <option value="">Todos os Candidatos</option>
          {candidatos.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome} ({c.numero})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-slate-400">Partido</label>
        <select
          className={selectClass}
          value={filtros.partidoSigla}
          onChange={(e) => set("partidoSigla", e.target.value)}
        >
          <option value="">Todos os Partidos</option>
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