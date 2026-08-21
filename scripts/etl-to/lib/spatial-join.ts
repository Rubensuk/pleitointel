/**
 * Spatial Join: para cada seção eleitoral (ponto lat/lng),
 * encontra qual setor censitário do IBGE a contém.
 *
 * Usa @turf/boolean-point-in-polygon — não requer PostGIS.
 * Roda em Node.js puro durante o ETL.
 */

import * as turf from "@turf/turf";
import type { LocalVotacao } from "./parse-tse";
import type { SetorCensitario } from "./parse-ibge";

export interface VinculoSecaoSetor {
  zona: string;
  secao: string;
  codigoSetor: string;
}

/**
 * Para cada seção eleitoral, encontra o setor censitário que contém sua lat/lng.
 * @returns número de seções vinculadas com sucesso
 */
export async function spatialJoin(
  locais: LocalVotacao[],
  setores: SetorCensitario[]
): Promise<number> {
  let vinculadas = 0;
  const resultados: VinculoSecaoSetor[] = [];

  // Pré-computa features Turf para todos os setores (evita recriar em loop interno)
  const setoresFeatures = setores.map((s) => ({
    codigoSetor: s.codigoSetor,
    municipioIbge: s.municipioIbge,
    feature: turf.feature(s.geom as turf.Polygon | turf.MultiPolygon),
  }));

  for (const local of locais) {
    if (!local.lat || !local.lng) continue;

    const ponto = turf.point([local.lng, local.lat]);

    // Filtra setores do mesmo município (reduz o loop interno drasticamente)
    const setoresDoMunicipio = setoresFeatures.filter(
      (s) => s.municipioIbge === local.municipioIbge
    );

    let setor: string | null = null;
    for (const s of setoresDoMunicipio) {
      try {
        if (turf.booleanPointInPolygon(ponto, s.feature as turf.Feature<turf.Polygon>)) {
          setor = s.codigoSetor;
          break;
        }
      } catch {
        // polígono inválido — ignora
      }
    }

    if (setor) {
      resultados.push({ zona: local.zona, secao: local.secao, codigoSetor: setor });
      vinculadas++;
    }
  }

  // Armazena em memória para o SupabaseLoader usar
  (global as any).__etlVinculos = resultados;

  return vinculadas;
}

export function getVinculos(): VinculoSecaoSetor[] {
  return (global as any).__etlVinculos ?? [];
}
