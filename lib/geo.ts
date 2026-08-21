import "server-only";
import { createClient } from "@/lib/supabase/server";

export interface EstadoItem {
  sigla: string;
  nome: string;
}

export interface MunicipioItem {
  codigo_ibge: string;
  nome: string;
}

/**
 * Retorna os estados com dados reais carregados (ativo = true).
 * Alimenta o filtro de UF no Filtros.tsx via /api/dados/estados.
 * Retorna array vazio se o banco ainda nao tiver dados (MVP usa fallback no cliente).
 */
export async function getEstadosAtivos(): Promise<EstadoItem[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("estados")
      .select("sigla, nome")
      .eq("ativo", true)
      .order("nome");

    if (error || !data?.length) return [];
    return data as EstadoItem[];
  } catch {
    return [];
  }
}

/**
 * Retorna os municipios ativos de uma UF.
 * Alimenta o filtro de cidade no Filtros.tsx via /api/dados/municipios.
 */
export async function getMunicipiosPorUF(uf: string): Promise<MunicipioItem[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("municipios")
      .select("codigo_ibge, nome")
      .eq("uf", uf)
      .eq("ativo", true)
      .order("nome");

    if (error || !data?.length) return [];
    return data as MunicipioItem[];
  } catch {
    return [];
  }
}
