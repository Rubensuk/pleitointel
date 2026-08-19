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
-- Próxima entrega: tabelas para trocar os arquivos de /data/sample por
-- dados reais servidos pelo pipeline TSE + IBGE (ver lib/tse.ts e lib/ibge.ts)
-- ---------------------------------------------------------------------

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
  geom jsonb not null -- geometria GeoJSON da seção
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
