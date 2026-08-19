# PleitoIntel — Estampa 1 (Setup + MVP Diagnóstico Territorial)

*A inteligência analítica do seu pleito.*

Plataforma de inteligência eleitoral (referência de mercado: GeoVoto 3.0),
separada do projeto "mapa eleitoral". Esta entrega cobre o Módulo 1
(diagnóstico territorial) funcionando de ponta a ponta com dados de exemplo
no mesmo formato do pipeline TSE + IBGE.

## Rodando localmente

```bash
npm install
cp .env.example .env.local   # preencher com as chaves do seu projeto Supabase
npm run dev
```

Abre em `http://localhost:3000`.

## Configurar o Supabase (autenticação + leads)

1. Criar um projeto novo no Supabase (separado do projeto do mapa-eleitoral,
   se você já tiver um).
2. Em Project Settings → API, copiar `URL` e `anon key` para `.env.local`.
3. Em Authentication → Providers, deixar Email/Password habilitado (padrão).
4. Rodar `supabase/schema.sql` no SQL Editor — cria a tabela `leads` e já
   deixa `votacao_secoes` / `demografia_areas` prontas para a próxima
   entrega, quando o pipeline real substituir os arquivos de `/data/sample`.
5. Para a rota `/api/leads` gravar com a service role (recomendado), adicionar
   `SUPABASE_SERVICE_ROLE_KEY` no `.env.local` e trocar o client usado em
   `app/api/leads/route.ts` por um client com essa chave (hoje ele usa o
   client de cookies do usuário — funciona para candidato logado, mas a
   landing pública precisa da service role ou de uma policy de insert anônimo).

## Deploy na Vercel

1. `vercel` (ou conectar o repositório pela dashboard da Vercel).
2. Adicionar as mesmas variáveis de `.env.local` em Project Settings →
   Environment Variables.
3. Deploy.

## O que está funcionando nesta entrega

- Setup Next.js (App Router) + Tailwind + estrutura de pastas.
- Autenticação (cadastro/login/logout) via Supabase Auth, com `/dashboard/**`
  protegido por middleware.
- Landing (`/`) com apresentação dos módulos, planos e captura de lead.
- `/dashboard` — painel com atalho para o módulo disponível.
- `/dashboard/mapa` — diagnóstico territorial: mapa Leaflet com 3 camadas
  (votação por seção, densidade demográfica, renda), filtros de ano, cargo,
  município, candidato e partido, tooltip por seção/bairro e legenda.
- Dados de exemplo em `/data/sample` no formato de saída esperado do
  pipeline TSE + IBGE (`lib/tse.ts` e `lib/ibge.ts` isolam essa leitura —
  trocar por query ao Supabase é a única mudança necessária para plugar
  dados reais).

## Trocando os dados de exemplo pelos dados reais

O ponto de troca é só em dois arquivos:

- `lib/tse.ts` → `getVotacaoPorMunicipio` e `getCandidatos`
- `lib/ibge.ts` → `getDemografiaPorMunicipio`

Hoje eles leem os JSON de `/data/sample`. Trocar o corpo dessas funções por
`supabase.from('votacao_secoes').select(...)` (e o equivalente para
demografia) plugará o mapa direto no pipeline já validado no projeto
mapa-eleitoral — nada no resto da aplicação (API routes, filtros, mapa)
precisa mudar.

## Performance com grandes volumes de GeoJSON

Para municípios grandes / eleições com muitas seções:

- **Simplificar a geometria** antes de subir para o Supabase (ex.: `mapshaper`
  ou `turf.simplify`), mantendo só a precisão necessária para o zoom do mapa.
- **Servir por bounding box / município** em vez de carregar o país inteiro —
  a API já filtra por `municipioIbge`; ao escalar para múltiplos municípios,
  manter esse filtro no banco (índice já incluso no schema).
- Se o módulo de projeções (M3) evoluir para exibir muitos pontos (endereços,
  eventos de campanha), usar clustering (`leaflet.markercluster`, já nas
  dependências) em vez de plotar todos os marcadores.
- `preferCanvas` já habilitado no `MapContainer` para renderizar os polígonos
  em canvas em vez de SVG — melhora bastante com muitas seções simultâneas.

## Roteiro (próximas entregas)

- **M2** — Confronto entre candidatos (comparativo lado a lado por região).
- **M3** — Projeções e cenários.
- **M4** — Relatórios exportáveis (PDF/Excel).
- Trocar dados de exemplo pelo pipeline real (TSE + IBGE) via Supabase.
- Onboarding de conta por tier (Básico/Pro/Enterprise) e controle de acesso
  por município/candidato conforme o plano contratado.
