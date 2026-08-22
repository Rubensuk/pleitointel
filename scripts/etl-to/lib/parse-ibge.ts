/**
 * Parser dos Setores Censitários do IBGE.
 *
 * O IBGE distribui os shapefiles dos setores censitários por UF.
 * Este módulo:
 *   1. Lê o shapefile (.shp) usando a biblioteca `shapefile`
 *   2. Simplifica os polígonos com @turf/simplify (reduz tamanho ~80%)
 *   3. Retorna features GeoJSON prontas para inserção no Supabase
 */

import path from "path";
import fs from "fs";
import * as shapefile from "shapefile";
import * as turf from "@turf/turf";

export interface SetorCensitario {
  codigoSetor: string;       // código de 15 dígitos do IBGE
  municipioIbge: string;     // primeiros 7 dígitos do código do setor
  bairro: string | null;
  geom: object;              // GeoJSON simplificado
}

/**
 * Lê o shapefile de setores censitários do IBGE e retorna os setores de uma UF.
 * @param dir   Diretório onde o shapefile foi extraído
 * @param uf    Sigla do estado (ex: 'TO')
 */
export async function parseSetoresIBGE(dir: string, uf: string): Promise<SetorCensitario[]> {
  // Encontra o arquivo .shp no diretório
  const shpFile = encontrarShapefile(dir);
  const setores: SetorCensitario[] = [];

  const source = await shapefile.open(shpFile);

  while (true) {
    const result = await source.read();
    if (result.done) break;

    const feature = result.value;
    const props = feature.properties ?? {};

    // Código do setor: campo CD_SETOR ou CD_GEOCODI (varia por ano do Censo)
    const codigoSetor: string =
      props.CD_SETOR ?? props.CD_GEOCODI ?? props.Cod_setor ?? "";

    if (!codigoSetor || codigoSetor.length < 7) continue;

    // Código IBGE do município = 7 primeiros dígitos do código do setor
    const municipioIbge = codigoSetor.substring(0, 7);

    // Simplifica o polígono para reduzir o tamanho do GeoJSON (~80%)
    // tolerance de 0.0001 graus ≈ ~11m — suficiente para o zoom do mapa
    let geomSimplificada: object;
    try {
      const simplified = turf.simplify(feature as turf.Feature<turf.Polygon | turf.MultiPolygon>, {
        tolerance: 0.0001,
        highQuality: false,
      });
      geomSimplificada = simplified.geometry;
    } catch {
      geomSimplificada = feature.geometry; // mantém original se simplificação falhar
    }

    setores.push({
      codigoSetor,
      municipioIbge,
      bairro: props.NM_BAIRRO ?? props.NM_SUBDIST ?? null,
      geom: geomSimplificada,
    });
  }

  return setores;
}

function encontrarShapefile(dir: string): string {
  const arquivos = fs.readdirSync(dir, { recursive: true } as any) as string[];
  const shp = arquivos.find((f) => f.endsWith(".shp"));
  if (!shp) throw new Error(`Nenhum .shp encontrado em ${dir}`);
  return path.join(dir, shp);
}
