-- Executar no SQL Editor do Supabase (projeto novo, separado do mapa-eleitoral)

-- Leads capturados na landing page
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  email text not null,
  telefone text,
  cargo_interesse text,
  mensagem text,
  created_at timestamptz not null default now()
);

alter table public.leads enable row level security;

-- Permite que a API (com a service role, via route handler) grave leads.
-- Ajustar policy se decidir inserir direto do client com a anon key.
create policy "service role insere leads"
  on public.leads for insert
  to service_role
  with check (true);

-- ---------------------------------------------------------------------
-- BASE NACIONAL ESCALÁVEL — extensão do schema original
-- As tabelas abaixo substituem progressivamente os arquivos de /data/sample.
-- A tabela `leads` acima e suas policies permanecem intactas.
-- ---------------------------------------------------------------------

-- ── DIMENSÃO GEOGRÁFICA ───────────────────────────────────────────────

-- Estados brasileiros.
-- ativo = false → não aparece nos filtros (dados ainda não carregados).
-- ativo = true  → aparece automaticamente, sem alterar código.
create table if not exists public.estados (
  sigla      char(2)  primary key,
  nome       text     not null,
  codigo_tse text,
  ativo      boolean  not null default false
);

-- Municípios vinculados ao estado.
create table if not exists public.municipios (
  codigo_ibge text    primary key,
  nome        text    not null,
  uf          char(2) not null references public.estados(sigla),
  codigo_tse  text,
  ativo       boolean not null default false
);

create index if not exists idx_municipios_uf on public.municipios (uf);

-- Zonas eleitorais (TSE).
create table if not exists public.zonas (
  id             uuid    primary key default gen_random_uuid(),
  municipio_ibge text    not null references public.municipios(codigo_ibge),
  numero_zona    text    not null,
  unique (municipio_ibge, numero_zona)
);

-- Setores censitários do IBGE — fonte dos polígonos do mapa.
-- Um setor pode conter múltiplas seções eleitorais.
create table if not exists public.setores_censitarios (
  id             uuid    primary key default gen_random_uuid(),
  codigo_setor   text    not null unique,
  municipio_ibge text    not null references public.municipios(codigo_ibge),
  bairro         text,
  populacao      int,
  domicilios     int,
  renda_media    numeric(10,2),
  geom           jsonb   not null
);

create index if not exists idx_setores_municipio
  on public.setores_censitarios (municipio_ibge);

-- Seções eleitorais (TSE). Vinculadas a um setor censitário para exibição no mapa.
create table if not exists public.secoes (
  id             uuid    primary key default gen_random_uuid(),
  zona_id        uuid    not null references public.zonas(id),
  numero_secao   text    not null,
  local_votacao  text,
  bairro         text,
  lat            numeric(10,6),
  lng            numeric(10,6),
  setor_ibge_id  uuid    references public.setores_censitarios(id),
  unique (zona_id, numero_secao)
);

create index if not exists idx_secoes_zona   on public.secoes (zona_id);
create index if not exists idx_secoes_setor  on public.secoes (setor_ibge_id);

-- ── DIMENSÃO ELEITORAL ────────────────────────────────────────────────

-- Eleições disponíveis na plataforma (alimenta o filtro de ano).
create table if not exists public.eleicoes (
  id    uuid    primary key default gen_random_uuid(),
  ano   int     not null,
  turno int     not null,
  tipo  text    not null,
  unique (ano, turno, tipo)
);

-- Candidatos por eleição e município.
create table if not exists public.candidatos (
  id             uuid    primary key default gen_random_uuid(),
  nome           text    not null,
  numero         text    not null,
  partido        text    not null,
  cargo          text    not null,
  uf             char(2) references public.estados(sigla),
  municipio_ibge text    references public.municipios(codigo_ibge),
  eleicao_id     uuid    not null references public.eleicoes(id),
  cor            text
);

create index if not exists idx_candidatos_municipio
  on public.candidatos (municipio_ibge, eleicao_id);

-- Resultados por seção — tabela relacional (substitui votos_por_candidato jsonb).
-- Permite queries eficientes por candidato em qualquer granularidade geográfica.
create table if not exists public.resultados_secao (
  id           uuid primary key default gen_random_uuid(),
  secao_id     uuid not null references public.secoes(id),
  candidato_id uuid not null references public.candidatos(id),
  eleicao_id   uuid not null references public.eleicoes(id),
  votos        int  not null default 0,
  unique (secao_id, candidato_id, eleicao_id)
);

create index if not exists idx_resultados_secao
  on public.resultados_secao (secao_id, eleicao_id);
create index if not exists idx_resultados_candidato
  on public.resultados_secao (candidato_id, eleicao_id);

-- ── COMPATIBILIDADE — tabelas do MVP original ─────────────────────────
-- Mantidas para não quebrar código existente durante a transição.

create table if not exists public.votacao_secoes (
  id uuid primary key default gen_random_uuid(),
  ano int not null,
  cargo text not null,
  municipio_ibge text not null,
  codigo_secao text not null,
  zona text not null,
  bairro text,
  total_votos_validos int not null,
  votos_por_candidato jsonb not null,
  candidato_vencedor_id text not null,
  percentual_vencedor numeric(5,2) not null,
  geom jsonb not null
);

create index if not exists idx_votacao_municipio_ano_cargo
  on public.votacao_secoes (municipio_ibge, ano, cargo);

create table if not exists public.demografia_areas (
  id uuid primary key default gen_random_uuid(),
  municipio_ibge text not null,
  codigo_area text not null,
  bairro text,
  populacao int,
  densidade_hab_km2 numeric(10,2),
  renda_media_domiciliar numeric(10,2),
  geom jsonb not null
);

create index if not exists idx_demografia_municipio
  on public.demografia_areas (municipio_ibge);
