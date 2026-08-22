import "server-only";
import fs from "fs/promises";
import path from "path";
import { createClient } from "@/lib/supabase/server";
import type { Candidato, FeatureCollectionGenerica, FiltroDiagnostico, SecaoVotacaoProps } from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// ESTRATEGIA DE DADOS:
// 1. Tenta buscar dados reais do Supabase (tabelas da base nacional).
// 2. Se o banco estiver vazio ou indisponivel, cai para os arquivos de /data/sample.
// Isso garante que a plataforma continue funcionando durante a transicao.
// ─────────────────────────────────────────────────────────────────────────────

export async function getVotacaoPorMunicipio(
  filtro: FiltroDiagnostico
): Promise<FeatureCollectionGenerica<SecaoVotacaoProps>> {

  // ── Tentativa 1: dados reais do Supabase ──────────────────────────────────
  try {
    const supabase = createClient();

    // Busca a eleicao correspondente ao ano e cargo do filtro
    const tipoEleicao = [2020, 2024].includes(filtro.ano) ? "municipal" : "geral";
    const { data: eleicaoData } = await supabase
      .from("eleicoes")
      .select("id")
      .eq("ano", filtro.ano)
      .eq("tipo", tipoEleicao)
      .eq("turno", 1)
      .maybeSingle();

    if (!eleicaoData) throw new Error("eleicao nao encontrada no banco");

    // Busca candidatos do municipio e eleicao (para montar o mapa de ids)
    const { data: candidatosData } = await supabase
      .from("candidatos")
      .select("id, nome, numero, partido, cargo, cor")
      .eq("municipio_ibge", filtro.municipioIbge)
      .eq("eleicao_id", eleicaoData.id)
      .eq("cargo", filtro.cargo);

    if (!candidatosData?.length) throw new Error("sem candidatos no banco para este filtro");

    const candidatoIds = candidatosData.map((c) => c.id);

    // Busca setores censitarios do municipio com geometria
    const { data: setoresData } = await supabase
      .from("setores_censitarios")
      .select("id, codigo_setor, bairro, geom, renda_media, populacao")
      .eq("municipio_ibge", filtro.municipioIbge);

    if (!setoresData?.length) throw new Error("sem setores censitarios no banco");

    // Para cada setor, agrega os votos das secoes vinculadas
    const features: FeatureCollectionGenerica<SecaoVotacaoProps>["features"] = [];

    for (const setor of setoresData) {
      // Secoes dentro deste setor
      const { data: secoesData } = await supabase
        .from("secoes")
        .select("id, numero_secao, zona:zonas(numero_zona)")
        .eq("setor_ibge_id", setor.id);

      if (!secoesData?.length) continue;

      const secaoIds = secoesData.map((s) => s.id);

      // Resultados agregados por candidato neste setor
      const { data: resultados } = await supabase
        .from("resultados_secao")
        .select("candidato_id, votos")
        .in("secao_id", secaoIds)
        .eq("eleicao_id", eleicaoData.id)
        .in("candidato_id", filtro.candidatoId ? [filtro.candidatoId] : candidatoIds);

      if (!resultados?.length) continue;

      // Monta votosPorCandidato e calcula vencedor
      const votosPorCandidato: Record<string, number> = {};
      let totalVotos = 0;
      resultados.forEach((r) => {
        votosPorCandidato[r.candidato_id] = (votosPorCandidato[r.candidato_id] || 0) + r.votos;
        totalVotos += r.votos;
      });

      const vencedorId = Object.entries(votosPorCandidato).sort((a, b) => b[1] - a[1])[0]?.[0];
      const percentualVencedor = totalVotos > 0
        ? Math.round((votosPorCandidato[vencedorId] / totalVotos) * 1000) / 10
        : 0;

      features.push({
        type: "Feature",
        properties: {
          codigoSecao: setor.codigo_setor,
          zona: "setor",
          bairro: setor.bairro ?? "",
          municipioIbge: filtro.municipioIbge,
          totalVotosValidos: totalVotos,
          votosPorCandidato,
          candidatoVencedorId: vencedorId ?? "",
          percentualVencedor,
        },
        geometry: setor.geom as GeoJSON.Geometry,
      });
    }

    if (features.length > 0) {
      return { type: "FeatureCollection", features };
    }
    throw new Error("features vazias, usando fallback");
  } catch {
    // ── Fallback: arquivo de exemplo (mantido para nao quebrar o MVP) ─────────
    const filePath = path.join(process.cwd(), "data/sample/votacao-2022-2t-municipio-exemplo.json");
    const raw = await fs.readFile(filePath, "utf-8");
    const geojson = JSON.parse(raw) as FeatureCollectionGenerica<SecaoVotacaoProps>;
    return {
      ...geojson,
      features: geojson.features.filter(
        (f) => f.properties.municipioIbge === filtro.municipioIbge
      ),
    };
  }
}

export async function getCandidatos(filtro?: FiltroDiagnostico): Promise<Candidato[]> {
  // ── Tentativa 1: dados reais do Supabase ──────────────────────────────────
  if (filtro) {
    try {
      const supabase = createClient();
      const tipoEleicao = [2020, 2024].includes(filtro.ano) ? "municipal" : "geral";
      const { data: eleicaoData } = await supabase
        .from("eleicoes")
        .select("id")
        .eq("ano", filtro.ano)
        .eq("tipo", tipoEleicao)
        .eq("turno", 1)
        .maybeSingle();

      if (!eleicaoData) throw new Error("eleicao nao encontrada");

      const query = supabase
        .from("candidatos")
        .select("id, nome, numero, partido, cargo, cor")
        .eq("municipio_ibge", filtro.municipioIbge)
        .eq("eleicao_id", eleicaoData.id)
        .eq("cargo", filtro.cargo);

      const { data } = await query;
      if (data?.length) {
        return data.map((c) => ({
          id: c.id,
          nome: c.nome,
          numero: c.numero,
          partidoSigla: c.partido,
          cargo: filtro.cargo,
          cor: c.cor ?? "#64748b",
        }));
      }
    } catch {
      // cai para fallback
    }
  }

  // ── Fallback: arquivo de exemplo ──────────────────────────────────────────
  const filePath = path.join(process.cwd(), "data/sample/candidatos-exemplo.json");
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw) as Candidato[];
}

/**
 * Retorna os anos de eleicao disponiveis no banco.
 * Alimenta o filtro de ano no Filtros.tsx.
 */
export async function getEleicoes(): Promise<{ ano: number; tipo: string }[]> {
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("eleicoes")
      .select("ano, tipo")
      .order("ano", { ascending: false });

    return data ?? [];
  } catch {
    return [];
  }
}
