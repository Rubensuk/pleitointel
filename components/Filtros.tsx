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
    { value: "1700251", label: "Abreulândia" },
    { value: "1700301", label: "Aguiarnópolis" },
    { value: "1700350", label: "Aliança do Tocantins" },
    { value: "1700400", label: "Almas" },
    { value: "1700707", label: "Alvorada" },
    { value: "1701002", label: "Ananás" },
    { value: "1701051", label: "Angico" },
    { value: "1701101", label: "Aparecida do Rio Negro" },
    { value: "1701309", label: "Aragominas" },
    { value: "1701903", label: "Araguacema" },
    { value: "1702000", label: "Araguaçu" },
    { value: "1702109", label: "Araguaína" },
    { value: "1702158", label: "Araguanã" },
    { value: "1702208", label: "Araguatins" },
    { value: "1702307", label: "Arapoema" },
    { value: "1702406", label: "Arraias" },
    { value: "1702554", label: "Augustinópolis" },
    { value: "1702703", label: "Aurora do Tocantins" },
    { value: "1702901", label: "Axixá do Tocantins" },
    { value: "1703008", label: "Babaçulândia" },
    { value: "1703057", label: "Bandeirantes do Tocantins" },
    { value: "1703073", label: "Barra do Ouro" },
    { value: "1703107", label: "Barrolândia" },
    { value: "1703206", label: "Bernardo Sayão" },
    { value: "1703305", label: "Bom Jesus do Tocantins" },
    { value: "1703602", label: "Brasilândia do Tocantins" },
    { value: "1703701", label: "Brejinho de Nazaré" },
    { value: "1703800", label: "Buriti do Tocantins" },
    { value: "1703826", label: "Cachoeirinha" },
    { value: "1703842", label: "Campos Lindos" },
    { value: "1703867", label: "Cariri do Tocantins" },
    { value: "1703883", label: "Carmolândia" },
    { value: "1703891", label: "Carrasco Bonito" },
    { value: "1703909", label: "Caseara" },
    { value: "1704105", label: "Centenário" },
    { value: "1704600", label: "Chapada de Areia" },
    { value: "1705102", label: "Chapada da Natividade" },
    { value: "1705508", label: "Colinas do Tocantins" },
    { value: "1705557", label: "Combinado" },
    { value: "1705607", label: "Conceição do Tocantins" },
    { value: "1706001", label: "Couto de Magalhães" },
    { value: "1706100", label: "Cristalândia" },
    { value: "1706258", label: "Crixás do Tocantins" },
    { value: "1706506", label: "Darcinópolis" },
    { value: "1707009", label: "Dianópolis" },
    { value: "1707108", label: "Divinópolis do Tocantins" },
    { value: "1707207", label: "Dois Irmãos do Tocantins" },
    { value: "1707306", label: "Duerê" },
    { value: "1707405", label: "Esperantina" },
    { value: "1707553", label: "Fátima" },
    { value: "1707652", label: "Figueirópolis" },
    { value: "1707702", label: "Filadélfia" },
    { value: "1708205", label: "Formoso do Araguaia" },
    { value: "1708304", label: "Fortaleza do Tabocão" },
    { value: "1708502", label: "Goianorte" },
    { value: "1709005", label: "Goiatins" },
    { value: "1709302", label: "Guaraí" },
    { value: "1709500", label: "Gurupi" },
    { value: "1709807", label: "Ipueiras" },
    { value: "1710508", label: "Itacajá" },
    { value: "1710706", label: "Itaguatins" },
    { value: "1710904", label: "Itapiratins" },
    { value: "1711100", label: "Itaporã do Tocantins" },
    { value: "1711506", label: "Jaú do Tocantins" },
    { value: "1711803", label: "Juarina" },
    { value: "1711902", label: "Lagoa da Confusão" },
    { value: "1711951", label: "Lagoa do Tocantins" },
    { value: "1712009", label: "Lajeado" },
    { value: "1712157", label: "Lavandeira" },
    { value: "1712405", label: "Lizarda" },
    { value: "1712454", label: "Luzinópolis" },
    { value: "1712503", label: "Marianópolis do Tocantins" },
    { value: "1712702", label: "Mateiros" },
    { value: "1712801", label: "Maurilândia do Tocantins" },
    { value: "1713205", label: "Miracema do Tocantins" },
    { value: "1713304", label: "Miranorte" },
    { value: "1713601", label: "Monte do Carmo" },
    { value: "1713700", label: "Monte Santo do Tocantins" },
    { value: "1713957", label: "Muricilândia" },
    { value: "1714203", label: "Natividade" },
    { value: "1714302", label: "Nazaré" },
    { value: "1714880", label: "Nova Olinda" },
    { value: "1715002", label: "Nova Rosalândia" },
    { value: "1715101", label: "Novo Acordo" },
    { value: "1715150", label: "Novo Alegre" },
    { value: "1715259", label: "Novo Jardim" },
    { value: "1715507", label: "Oliveira de Fátima" },
    { value: "1721000", label: "Palmas" },
    { value: "1715705", label: "Palmeirante" },
    { value: "1715754", label: "Palmeiras do Tocantins" },
    { value: "1715804", label: "Palmeirópolis" },
    { value: "1716109", label: "Paraíso do Tocantins" },
    { value: "1716208", label: "Paranã" },
    { value: "1716307", label: "Pau D'Arco" },
    { value: "1716505", label: "Pedro Afonso" },
    { value: "1716604", label: "Peixe" },
    { value: "1716653", label: "Pequizeiro" },
    { value: "1716703", label: "Colméia" },
    { value: "1717008", label: "Pindorama do Tocantins" },
    { value: "1717206", label: "Piraquê" },
    { value: "1717503", label: "Pium" },
    { value: "1717800", label: "Ponte Alta do Bom Jesus" },
    { value: "1717909", label: "Ponte Alta do Tocantins" },
    { value: "1718006", label: "Porto Alegre do Tocantins" },
    { value: "1718204", label: "Porto Nacional" },
    { value: "1718303", label: "Praia Norte" },
    { value: "1718402", label: "Presidente Kennedy" },
    { value: "1718451", label: "Pugmil" },
    { value: "1718501", label: "Recursolândia" },
    { value: "1718550", label: "Riachinho" },
    { value: "1718659", label: "Rio da Conceição" },
    { value: "1718709", label: "Rio dos Bois" },
    { value: "1718758", label: "Rio Sono" },
    { value: "1718808", label: "Sampaio" },
    { value: "1718840", label: "Sandolândia" },
    { value: "1718865", label: "Santa Fé do Araguaia" },
    { value: "1718881", label: "Santa Maria do Tocantins" },
    { value: "1718899", label: "Santa Rita do Tocantins" },
    { value: "1718907", label: "Santa Rosa do Tocantins" },
    { value: "1719004", label: "Santa Tereza do Tocantins" },
    { value: "1720002", label: "Santa Terezinha do Tocantins" },
    { value: "1720101", label: "São Bento do Tocantins" },
    { value: "1720150", label: "São Félix do Tocantins" },
    { value: "1720200", label: "São Miguel do Tocantins" },
    { value: "1720259", label: "São Salvador do Tocantins" },
    { value: "1720309", label: "São Sebastião do Tocantins" },
    { value: "1720499", label: "São Valério da Natividade" },
    { value: "1720655", label: "Silvanópolis" },
    { value: "1720804", label: "Sítio Novo do Tocantins" },
    { value: "1720853", label: "Sucupira" },
    { value: "1720903", label: "Taguatinga" },
    { value: "1720937", label: "Taipas do Tocantins" },
    { value: "1720978", label: "Talismã" },
    { value: "1716109", label: "Paraíso do Tocantins" }, // já listado acima, mantido por segurança
    { value: "1721109", label: "Tocantínia" },
    { value: "1721208", label: "Tocantinópolis" },
    { value: "1721257", label: "Tupirama" },
    { value: "1721307", label: "Tupiratins" },
    { value: "1722081", label: "Wanderlândia" },
    { value: "1722107", label: "Xambioá" },
  ].filter((m, i, arr) => arr.findIndex(x => x.value === m.value) === i) // remove duplicatas
   .sort((a, b) => a.label.localeCompare(b.label, "pt-BR")), // ordena alfabeticamente
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
  // Palmas
  "1721000": ["Todos os Bairros", "Plano Diretor Sul", "Plano Diretor Norte", "Taquaralto", "Aureny III", "Jardim Taquari", "Setor Buritis", "Santa Bárbara"],
  // Araguaína
  "1702109": ["Todos os Bairros", "Centro", "Setor Noroeste", "Setor Maracanã", "Araguaína Sul", "Cimba", "Entroncamento"],
  // Gurupi
  "1709500": ["Todos os Bairros", "Centro", "Setor Sol Nascente", "Parque das Acácias", "Vila Nova"],
  // Porto Nacional
  "1718204": ["Todos os Bairros", "Centro", "Setor Industrial", "Vila Maranata", "Jardim Querência"],
  // Paraíso do Tocantins
  "1716109": ["Todos os Bairros", "Centro", "Setor Oeste", "Jardim América", "Aeroporto"],
  // Araguatins
  "1702208": ["Todos os Bairros", "Centro", "Setor Norte", "Setor Leste"],
  // Colinas do Tocantins
  "1705508": ["Todos os Bairros", "Centro", "Setor Sul", "Setor Norte"],
  // Guaraí
  "1709302": ["Todos os Bairros", "Centro", "Setor Leste", "Setor Oeste"],
  // Miracema do Tocantins
  "1713205": ["Todos os Bairros", "Centro", "Setor Norte", "Setor Sul"],
  // Dianópolis
  "1707009": ["Todos os Bairros", "Centro", "Setor Leste", "Setor Oeste"],
  // Taguatinga
  "1720903": ["Todos os Bairros", "Centro", "Setor Sul"],
  // Tocantinópolis
  "1721208": ["Todos os Bairros", "Centro", "Setor Norte", "Setor Sul"],
  // Augustinópolis
  "1702554": ["Todos os Bairros", "Centro", "Setor Leste"],
  // Natividade
  "1714203": ["Todos os Bairros", "Centro", "Setor Sul"],
  // Demais municípios — bairros genéricos usados como fallback
  "DEFAULT":  ["Todos os Bairros", "Centro", "Setor Norte", "Setor Sul", "Setor Leste", "Setor Oeste", "Zona Rural"],
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
  const [candidatosApi, setCandidatosApi] = useState<Candidato[]>([]);

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

  // Busca candidatos da API quando municipio, cargo ou ano mudam
  useEffect(() => {
    if (!filtros.municipioIbge || filtros.municipioIbge === "TOTAL") {
      setCandidatosApi([]);
      return;
    }
    fetch(`/api/dados/candidatos?municipio=${filtros.municipioIbge}&cargo=${filtros.cargo}&ano=${filtros.ano}`)
      .then((r) => r.json())
      .then((data: Candidato[]) => setCandidatosApi(data ?? []))
      .catch(() => setCandidatosApi([]));
  }, [filtros.municipioIbge, filtros.cargo, filtros.ano]);

  // Candidatos: da API se disponíveis, senao usa prop passado pelo componente pai
  const candidatosDisponiveis = candidatosApi.length ? candidatosApi : candidatos;

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
    : (BAIRROS_EXEMPLO[filtros.municipioIbge] ?? BAIRROS_EXEMPLO["DEFAULT"] ?? ["Todos os Bairros"]);

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
            {candidatosDisponiveis.map((c) => (
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