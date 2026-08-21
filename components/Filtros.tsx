"use client";

import { useEffect, useState } from "react";
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

// Fallback estatico — garante que o filtro funcione mesmo antes do banco ter dados.
const ESTADOS_FALLBACK = [
  { sigla: "TO", nome: "Tocantins (TO)" },
];

const MUNICIPIOS_FALLBACK: Record<string, { value: string; label: string }[]> = {
  TO: [
    { value: "1721000", label: "Palmas" },
    { value: "1702109", label: "Araguaína" },
    { value: "1709500", label: "Gurupi" },
    { value: "1718204", label: "Porto Nacional" },
    { value: "1716109", label: "Paraíso do Tocantins" },
  ],
};




// Cargos que abrangem o estado inteiro (não se limitam a um único município)
export const CARGOS_ESTADUAIS: Cargo[] = [
  "GOVERNADOR",
  "DEPUTADO_ESTADUAL",
  "DEPUTADO_FEDERAL",
  "SENADOR",
  "PRESIDENTE",
];

const BAIRROS_EXEMPLO: Record<string, string[]> = {
  "1721000": ["Todos os Bairros", "Plano Diretor Sul", "Plano Diretor Norte", "Taquaralto", "Aureny III", "Jardim Taquari"],
  "1702109": ["Todos os Bairros", "Centro", "Setor Noroeste", "Setor Maracanã", "Araguaína Sul", "Cimba", "Entroncamento"],
  "1709500": ["Todos os Bairros", "Centro", "Setor Sol Nascente", "Parque das Acácias", "Vila Nova"],
  "1718204": ["Todos os Bairros", "Centro", "Setor Industrial", "Vila Maranata"],
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
  // Estados dinamicos: carregados da API; fallback para lista estatica se vazia
  const [estadosApi, setEstadosApi] = useState<{ sigla: string; nome: string }[]>([]);
  const [municipiosApi, setMunicipiosApi] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    fetch("/api/dados/estados")
      .then((r) => r.json())
      .then((data: { sigla: string; nome: string }[]) => {
        if (data?.length) setEstadosApi(data.map((e) => ({ sigla: e.sigla, nome: `${e.nome} (${e.sigla})` })));
      })
      .catch(() => {/* fallback estatico abaixo */});
  }, []);

  useEffect(() => {
    if (!filtros.uf) return;
    fetch(`/api/dados/municipios?uf=${filtros.uf}`)
      .then((r) => r.json())
      .then((data: { codigo_ibge: string; nome: string }[]) => {
        if (data?.length)
          setMunicipiosApi(data.map((m) => ({ value: m.codigo_ibge, label: m.nome })));
        else
          setMunicipiosApi([]);
      })
      .catch(() => setMunicipiosApi([]));
  }, [filtros.uf]);

  // Usa dados da API se disponiveis; senao usa fallback estatico
  const estadosDisponiveis = estadosApi.length ? estadosApi : ESTADOS_FALLBACK;
  const municipiosBase = municipiosApi.length
    ? municipiosApi
    : (MUNICIPIOS_FALLBACK[filtros.uf] || []);

  // Para cargos estaduais/federais: adiciona opção "Estado Inteiro (Total)"
  // que compila os votos de todos os municípios do estado
  const isCargoEstadual = CARGOS_ESTADUAIS.includes(filtros.cargo as any);
  const municipiosDisponiveis = isCargoEstadual
    ? [{ value: "TOTAL", label: `📊 Estado Inteiro (Total)` }, ...municipiosBase]
    : municipiosBase;

  // Quando troca para cargo estadual e não tem TOTAL selecionado, seleciona automaticamente
  useEffect(() => {
    if (isCargoEstadual && filtros.municipioIbge !== "TOTAL") {
      onChange({ ...filtros, municipioIbge: "TOTAL", bairro: "Todos os Bairros" });
    }
    if (!isCargoEstadual && filtros.municipioIbge === "TOTAL") {
      const primeiro = municipiosBase[0]?.value || "";
      onChange({ ...filtros, municipioIbge: primeiro, bairro: "Todos os Bairros" });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtros.cargo]);

  const bairrosDisponiveis = filtros.municipioIbge === "TOTAL"
    ? ["Todos os Bairros"] // Estado inteiro não filtra por bairro
    : BAIRROS_EXEMPLO[filtros.municipioIbge] || [
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
              // O useEffect vai buscar os municipios da nova UF via API;
              // por ora reseta para vazio e o select de cidade sera preenchido
              onChange({
                ...filtros,
                uf: novaUf,
                municipioIbge: (MUNICIPIOS_FALLBACK[novaUf] || [])[0]?.value || "",
                bairro: "Todos os Bairros",
              });
            }}
          >
            {estadosDisponiveis.map((uf) => (
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