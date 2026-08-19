import "server-only";
import fs from "fs/promises";
import path from "path";
import type { Candidato, FeatureCollectionGenerica, FiltroDiagnostico, SecaoVotacaoProps } from "./types";

// NOTA: nesta entrega (MVP), os dados vêm de arquivos de exemplo em /data/sample,
// no mesmo formato de saída do pipeline TSE + IBGE já usado no projeto "mapa-eleitoral".
// Para produção: trocar a leitura de arquivo por uma query ao Supabase
// (tabela `votacao_secoes`, populada pelo ETL do pipeline existente).

export async function getVotacaoPorMunicipio(
  filtro: FiltroDiagnostico
): Promise<FeatureCollectionGenerica<SecaoVotacaoProps>> {
  const filePath = path.join(process.cwd(), "data/sample/votacao-2022-2t-municipio-exemplo.json");
  const raw = await fs.readFile(filePath, "utf-8");
  const geojson = JSON.parse(raw) as FeatureCollectionGenerica<SecaoVotacaoProps>;

  // Filtro básico por município; ano/cargo/candidato/partido plugam aqui
  // quando o pipeline real tiver múltiplas eleições carregadas.
  return {
    ...geojson,
    features: geojson.features.filter(
      (f) => f.properties.municipioIbge === filtro.municipioIbge
    ),
  };
}

export async function getCandidatos(): Promise<Candidato[]> {
  const filePath = path.join(process.cwd(), "data/sample/candidatos-exemplo.json");
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw) as Candidato[];
}
