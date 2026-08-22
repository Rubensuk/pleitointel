# ETL — Tocantins (2024 Municipal + 2022 Geral)

Script de carga dos dados reais do TSE + IBGE para o Supabase.
Roda **uma única vez localmente** por estado/ano. Não é executado na Vercel.

## Pré-requisitos

```bash
npm install -D tsx @types/node dotenv adm-zip iconv-lite @turf/turf shapefile
```

## Variáveis de ambiente necessárias

Crie um arquivo `scripts/etl-to/.env` com:

```
NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui
```

> Use a `service_role` key (não a `anon` key) — o ETL precisa burlar o RLS para inserir dados.

## Ordem de execução

```bash
# 1. Instalar dependências do script
cd scripts/etl-to
npm install

# 2. Rodar o ETL completo (baixa, transforma e insere tudo)
npx tsx etl.ts

# O script roda as fases nesta ordem:
#   A. Setores censitários do IBGE (geometria dos polígonos)
#   B. Locais de votação (lat/lng das seções)
#   C. Spatial join (vincula seções aos setores)
#   D. Candidatos e resultados 2024 (municipal)
#   E. Candidatos e resultados 2022 (geral)
#   F. Ativa TO no banco (SET ativo = true)
```

## Fontes de dados (download automático pelo script)

| Dado | URL |
|---|---|
| Setores IBGE TO | `https://ftp.ibge.gov.br/Cartas_e_Mapas/Malhas_digitais/Municipio_2022/UFs/TO/TO_setores_CD2022.zip` |
| Locais votação | `https://cdn.tse.jus.br/estatistica/sead/eleitorado/eleitores-locais-votacao/eleitorado-local-votacao-2024.zip` |
| Votação seção 2024 | `https://cdn.tse.jus.br/estatistica/sead/odsele/votacao_secao/votacao_secao_2024_TO.zip` |
| Candidatos 2024 | `https://cdn.tse.jus.br/estatistica/sead/odsele/consulta_cand/consulta_cand_2024_TO.zip` |
| Votação seção 2022 | `https://cdn.tse.jus.br/estatistica/sead/odsele/votacao_secao/votacao_secao_2022_TO.zip` |
| Candidatos 2022 | `https://cdn.tse.jus.br/estatistica/sead/odsele/consulta_cand/consulta_cand_2022_TO.zip` |

## Para adicionar um novo estado depois

```bash
# Duplicar este script para o novo estado (ex: PA)
cp -r scripts/etl-to scripts/etl-pa

# Editar scripts/etl-pa/etl.ts: trocar 'TO' por 'PA' nas URLs e no filtro
# Rodar o ETL do PA
npx tsx scripts/etl-pa/etl.ts

# Resultado: PA aparece automaticamente nos filtros sem alterar código
```
