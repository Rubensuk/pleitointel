"use client";

import type { Cargo, Candidato } from "@/lib/types";

export interface EstadoFiltros {
  uf: string;
  ano: number;
  cargo: Cargo;
  municipioIbge: string;
  bairro: string;
  candidatoId: string;
  partidoSigla: string;
}

const ESTADOS = [
  { sigla: "TO", nome: "Tocantins (TO)" },
  { sigla: "PA", nome: "Pará (PA)" },
  { sigla: "MA", nome: "Maranhão (MA)" },
  { sigla: "GO", nome: "Goiás (GO)" },
  { sigla: "SP", nome: "São Paulo (SP)" },
  { sigla: "DF", nome: "Distrito Federal (DF)" },
  { sigla: "MG", nome: "Minas Gerais (MG)" },
  { sigla: "BA", nome: "Bahia (BA)" },
];

const MUNICIPIOS_POR_UF: Record<string, { value: string; label: string }[]> = {
  TO: [
    { value: "1721000", label: "Palmas" },
    { value: "1702109", label: "Araguaína" },
    { value: "1709500", label: "Gurupi" },
    { value: "1718204", label: "Porto Nacional" },
    { value: "1716109", label: "Paraíso do Tocantins" },
    { value: "1701002", label: "Ananás" },
    { value: "1702406", label: "Araguatins" },
    { value: "1722107", label: "Xambioá" },
  ],
  PA: [
    { value: "1501402", label: "Belém" },
    { value: "1504208", label: "Marabá" },
    { value: "1506807", label: "Santarém" },
    { value: "1505536", label: "Parauapebas" },
  ],
  MA: [
    { value: "2111300", label: "São Luís" },
    { value: "2105302", label: "Imperatriz" },
    { value: "2103000", label: "Caxias" },
  ],
  GO: [
    { value: "5208707", label: "Goiânia" },
    { value: "5201405", label: "Aparecida de Goiânia" },
    { value: "5201108", label: "Anápolis" },
  ],
  SP: [
    { value: "3550308", label: "São Paulo" },
    { value: "3509502", label: "Campinas" },
    { value: "3549805", label: "São José dos Campos" },
  ],
  DF: [{ value: "5300108", label: "Brasília" }],
  MG: [{ value: "3106200", label: "Belo Horizonte" }],
  BA: [{ value: "2927408", label: "Salvador" }],
};

const BAIRROS_EXEMPLO: Record<string, string[]> = {
  "1721000": ["Todos os Bairros", "Plano Diretor Sul", "Plano Diretor Norte", "Taquaralto", "Aureny III", "Jardim Taquari"],
  "1702109": ["Todos os Bairros", "Centro", "Setor Noroeste", "Setor Maracanã", "Araguaína Sul", "Cimba", "Entroncamento"],
  "1709500": ["Todos os Bairros", "Centro", "Setor Sol Nascente", "Parque das Acácias", "Vila Nova"],
  "1504208": ["Todos os Bairros", "Nova Marabá", "Marabá Pioneira", "Cidade Nova", "São Félix"],
  "2105302": ["Todos os Bairros", "Centro", "Bacuri", "Nova Imperatriz", "Santa Rita"],
};

const CARGOS: { value: Cargo; label: string }[] = [
  { value: "PREFEITO", label: "Prefeito" },
  { value: "VEREADOR", label: "Vereador" },
  { value: "DEPUTADO_ESTADUAL", label: "Deputado Estadual" },
  { value: "DEPUTADO_FEDERAL", label: "Deputado Federal" },
  { value: "SENADOR", label: "Senador" },
  { value: "GOVERNADOR", label: "Governador" },
  { value: "PRESIDENTE", label: "Presidente" },
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
  const municipiosDisponiveis = MUNICIPIOS_POR_UF[filtros.uf] || [];
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
            Recorte de Inteligência Territorial
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-400 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
          Base: TSE & IBGE
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* 1. Estado (UF) */}
        <div>
          <label className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-slate-400">Estado (UF)</label>
          <select
            className={selectClass}
            value={filtros.uf}
            onChange={(e) => {
              const novaUf = e.target.value;
              const novosMunicipios = MUNICIPIOS_POR_UF[novaUf] || [];
              const primeiroMunicipio = novosMunicipios[0]?.value || "";
              onChange({
                ...filtros,
                uf: novaUf,
                municipioIbge: primeiroMunicipio,
                bairro: "Todos os Bairros",
              });
            }}
          >
            {ESTADOS.map((uf) => (
              <option key={uf.sigla} value={uf.sigla}>
                {uf.nome}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Município */}
        <div>
          <label className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-slate-400">Cidade</label>
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
            {municipiosDisponiveis.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Bairro / Região */}
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

        {/* 4. Ano */}
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

        {/* 5. Cargo */}
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

        {/* 6. Candidato Alvo */}
        <div>
          <label className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-slate-400">Candidato</label>
          <select
            className={selectClass}
            value={filtros.candidatoId}
            onChange={(e) => set("candidatoId", e.target.value)}
          >
            <option value="">Todos / Geral</option>
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