/**
 * ETL Principal — Tocantins (2024 Municipal + 2022 Geral)
 *
 * Orquestra o pipeline completo de carga de dados:
 *   A. Setores censitários IBGE (polígonos do mapa)
 *   B. Locais de votação TSE (lat/lng das seções)
 *   C. Spatial join (seção → setor)
 *   D. Resultados eleitorais 2024
 *   E. Resultados eleitorais 2022
 *   F. Ativa TO no banco
 *
 * Uso: npx tsx scripts/etl-to/etl.ts
 */

import { downloadAndExtract } from "./lib/download";
import { parseSetoresIBGE } from "./lib/parse-ibge";
import { parseLocaisVotacao, parseCandidatos, parseResultados } from "./lib/parse-tse";
import { spatialJoin } from "./lib/spatial-join";
import { SupabaseLoader } from "./lib/supabase-loader";

const UF = "TO";
const MUNICIPIOS_TO_IBGE: string[] = []; // preenchido pelo ETL de municipios

// URLs das fontes públicas
const URLS = {
  setoresIBGE: `https://ftp.ibge.gov.br/Cartas_e_Mapas/Malhas_digitais/Municipio_2022/UFs/TO/TO_setores_CD2022.zip`,
  locaisVotacao: `https://cdn.tse.jus.br/estatistica/sead/eleitorado/eleitores-locais-votacao/eleitorado-local-votacao-2024.zip`,
  votacao2024: `https://cdn.tse.jus.br/estatistica/sead/odsele/votacao_secao/votacao_secao_2024_TO.zip`,
  cand2024:    `https://cdn.tse.jus.br/estatistica/sead/odsele/consulta_cand/consulta_cand_2024_TO.zip`,
  votacao2022: `https://cdn.tse.jus.br/estatistica/sead/odsele/votacao_secao/votacao_secao_2022_TO.zip`,
  cand2022:    `https://cdn.tse.jus.br/estatistica/sead/odsele/consulta_cand/consulta_cand_2022_TO.zip`,
};

const TEMP_DIR = "./tmp";

async function main() {
  const loader = new SupabaseLoader();

  console.log("\n═══════════════════════════════════════════════════");
  console.log("  PleitoIntel ETL — Tocantins 2024 + 2022");
  console.log("═══════════════════════════════════════════════════\n");

  // ── FASE A: Setores Censitários IBGE ────────────────────────────────────────
  console.log("[A] Baixando malha de setores censitários IBGE (TO)...");
  const setoresDir = await downloadAndExtract(URLS.setoresIBGE, `${TEMP_DIR}/ibge`);
  const setores = await parseSetoresIBGE(setoresDir, UF);
  console.log(`    → ${setores.length} setores extraídos`);

  console.log("[A] Inserindo setores no Supabase...");
  await loader.inserirSetores(setores);
  console.log(`    → OK`);

  // ── FASE B: Locais de Votação (lat/lng das seções) ──────────────────────────
  console.log("\n[B] Baixando locais de votação TSE...");
  const locaisDir = await downloadAndExtract(URLS.locaisVotacao, `${TEMP_DIR}/locais`);
  const locais = await parseLocaisVotacao(locaisDir, UF);
  console.log(`    → ${locais.length} seções com coordenadas`);

  console.log("[B] Inserindo zonas e seções no Supabase...");
  await loader.inserirSecoesComLocais(locais);
  console.log(`    → OK`);

  // ── FASE C: Spatial Join (seção → setor) ────────────────────────────────────
  console.log("\n[C] Executando spatial join seção → setor censitário...");
  const vinculadas = await spatialJoin(locais, setores);
  console.log(`    → ${vinculadas} seções vinculadas a setores`);

  await loader.atualizarVinculoSetores();
  console.log(`    → Vínculos gravados no Supabase`);

  // ── FASE D: Eleição Municipal 2024 ──────────────────────────────────────────
  console.log("\n[D] Processando eleição municipal 2024...");

  const candDir2024 = await downloadAndExtract(URLS.cand2024, `${TEMP_DIR}/cand2024`);
  const candidatos2024 = await parseCandidatos(candDir2024, UF, 2024);
  console.log(`    → ${candidatos2024.length} candidatos`);

  const votDir2024 = await downloadAndExtract(URLS.votacao2024, `${TEMP_DIR}/vot2024`);
  const resultados2024 = await parseResultados(votDir2024, UF, 2024);
  console.log(`    → ${resultados2024.length} registros de votação`);

  await loader.inserirEleicaoCandidatosResultados(2024, "municipal", candidatos2024, resultados2024);
  console.log(`    → OK`);

  // ── FASE E: Eleição Geral 2022 ──────────────────────────────────────────────
  console.log("\n[E] Processando eleição geral 2022...");

  const candDir2022 = await downloadAndExtract(URLS.cand2022, `${TEMP_DIR}/cand2022`);
  const candidatos2022 = await parseCandidatos(candDir2022, UF, 2022);
  console.log(`    → ${candidatos2022.length} candidatos`);

  const votDir2022 = await downloadAndExtract(URLS.votacao2022, `${TEMP_DIR}/vot2022`);
  const resultados2022 = await parseResultados(votDir2022, UF, 2022);
  console.log(`    → ${resultados2022.length} registros de votação`);

  await loader.inserirEleicaoCandidatosResultados(2022, "geral", candidatos2022, resultados2022);
  console.log(`    → OK`);

  // ── FASE F: Ativa TO no banco ────────────────────────────────────────────────
  console.log("\n[F] Ativando Tocantins nos filtros da plataforma...");
  await loader.ativarEstado(UF);
  console.log(`    → estados.ativo = true WHERE sigla = '${UF}'`);

  console.log("\n═══════════════════════════════════════════════════");
  console.log("  ETL concluído com sucesso! 🗳️");
  console.log("  Tocantins agora aparece nos filtros do PleitoIntel.");
  console.log("═══════════════════════════════════════════════════\n");
}

main().catch((err) => {
  console.error("\n❌ Erro no ETL:", err);
  process.exit(1);
});
