import "server-only";
import fs from "fs/promises";
import path from "path";
import type { AreaDemografiaProps, FeatureCollectionGenerica } from "./types";

// Mesma lógica de lib/tse.ts: hoje lê o arquivo de exemplo, depois troca
// pela malha real (GeoJSON simplificado) + Censo, servidos via Supabase Storage
// ou tabela `demografia_areas`.

export async function getDemografiaPorMunicipio(
  municipioIbge: string
): Promise<FeatureCollectionGenerica<AreaDemografiaProps>> {
  const filePath = path.join(process.cwd(), "data/sample/demografia-municipio-exemplo.json");
  const raw = await fs.readFile(filePath, "utf-8");
  const geojson = JSON.parse(raw) as FeatureCollectionGenerica<AreaDemografiaProps>;

  return {
    ...geojson,
    features: geojson.features.filter((f) => f.properties.municipioIbge === municipioIbge),
  };
}
