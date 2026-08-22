import "server-only";
import fs from "fs/promises";
import path from "path";
import { createClient } from "@/lib/supabase/server";
import type { AreaDemografiaProps, FeatureCollectionGenerica } from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// ESTRATEGIA DE DADOS:
// 1. Tenta buscar dados demograficos reais do Supabase (setores_censitarios).
// 2. Se o banco estiver vazio ou indisponivel, cai para o arquivo de /data/sample.
// Isso garante retrocompatibilidade total durante a transicao.
// ─────────────────────────────────────────────────────────────────────────────

export async function getDemografiaPorMunicipio(
  municipioIbge: string
): Promise<FeatureCollectionGenerica<AreaDemografiaProps>> {

  // -- Tentativa 1: dados reais do Supabase (setores censitarios do IBGE) -----
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("setores_censitarios")
      .select("codigo_setor, bairro, municipio_ibge, populacao, renda_media, geom")
      .eq("municipio_ibge", municipioIbge);

    if (error || !data?.length) throw new Error("sem dados no banco");

    const features: FeatureCollectionGenerica<AreaDemografiaProps>["features"] =
      data.map((setor) => ({
        type: "Feature",
        properties: {
          codigoArea: setor.codigo_setor,
          bairro: setor.bairro ?? "",
          municipioIbge: setor.municipio_ibge,
          populacao: setor.populacao ?? 0,
          // densidade aproximada; refinada quando o ETL incluir area_km2
          densidadeHabKm2: setor.populacao ?? 0,
          rendaMediaDomiciliar: setor.renda_media ?? 0,
        },
        geometry: setor.geom as GeoJSON.Geometry,
      }));

    return { type: "FeatureCollection", features };
  } catch {
    // -- Fallback: arquivo de exemplo (mantido para nao quebrar o MVP) ---------
    const filePath = path.join(process.cwd(), "data/sample/demografia-municipio-exemplo.json");
    const raw = await fs.readFile(filePath, "utf-8");
    const geojson = JSON.parse(raw) as FeatureCollectionGenerica<AreaDemografiaProps>;
    return {
      ...geojson,
      features: geojson.features.filter(
        (f) => f.properties.municipioIbge === municipioIbge
      ),
    };
  }
}
