/**
 * SupabaseLoader — insere os dados do ETL no banco em lotes.
 * Usa a service_role key para burlar o RLS durante a carga.
 *
 * Requer variáveis de ambiente:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import type { SetorCensitario } from "./parse-ibge";
import type { LocalVotacao, CandidatoETL, ResultadoETL } from "./parse-tse";
import { getVinculos } from "./spatial-join";

dotenv.config({ path: ".env" });

const LOTE = 500; // registros por insert (evita timeouts)

export class SupabaseLoader {
  private db: SupabaseClient;

  constructor() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) throw new Error("Variáveis NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórias.");
    this.db = createClient(url, key);
  }

  /** Insere setores censitários em lote */
  async inserirSetores(setores: SetorCensitario[]) {
    const rows = setores.map((s) => ({
      codigo_setor: s.codigoSetor,
      municipio_ibge: s.municipioIbge,
      bairro: s.bairro,
      geom: s.geom,
    }));
    await this.inserirEmLotes("setores_censitarios", rows, "codigo_setor");
  }

  /** Insere zonas e seções com coordenadas */
  async inserirSecoesComLocais(locais: LocalVotacao[]) {
    // Zonas únicas
    const zonasUnicas = [...new Set(locais.map((l) => `${l.municipioIbge}|${l.zona}`))];
    const zonaRows = zonasUnicas.map((z) => {
      const [municipioIbge, numero_zona] = z.split("|");
      return { municipio_ibge: municipioIbge, numero_zona };
    });
    await this.inserirEmLotes("zonas", zonaRows, "municipio_ibge,numero_zona");

    // Busca IDs das zonas inseridas
    const { data: zonasDb } = await this.db
      .from("zonas")
      .select("id, municipio_ibge, numero_zona");
    const zonaMap = new Map(zonasDb?.map((z) => [`${z.municipio_ibge}|${z.numero_zona}`, z.id]) ?? []);

    // Seções
    const secaoRows = locais.map((l) => ({
      zona_id: zonaMap.get(`${l.municipioIbge}|${l.zona}`),
      numero_secao: l.secao,
      local_votacao: l.localVotacao,
      bairro: null,
      lat: l.lat,
      lng: l.lng,
    })).filter((r) => r.zona_id);

    await this.inserirEmLotes("secoes", secaoRows, "zona_id,numero_secao");
  }

  /** Atualiza setor_ibge_id nas seções com base no spatial join */
  async atualizarVinculoSetores() {
    const vinculos = getVinculos();

    // Busca mapa zona_id → secao_id
    const { data: secoesDb } = await this.db
      .from("secoes")
      .select("id, numero_secao, zona_id");

    const { data: setoresDb } = await this.db
      .from("setores_censitarios")
      .select("id, codigo_setor");

    const setorMap = new Map(setoresDb?.map((s) => [s.codigo_setor, s.id]) ?? []);

    for (const v of vinculos) {
      const setorId = setorMap.get(v.codigoSetor);
      if (!setorId) continue;

      const secao = secoesDb?.find(
        (s) => s.numero_secao === v.secao
      );
      if (!secao) continue;

      await this.db
        .from("secoes")
        .update({ setor_ibge_id: setorId })
        .eq("id", secao.id);
    }
  }

  /** Insere eleição, candidatos e resultados */
  async inserirEleicaoCandidatosResultados(
    ano: number,
    tipo: "municipal" | "geral",
    candidatos: CandidatoETL[],
    resultados: ResultadoETL[]
  ) {
    // Eleição
    const { data: eleicao } = await this.db
      .from("eleicoes")
      .upsert({ ano, turno: 1, tipo }, { onConflict: "ano,turno,tipo" })
      .select("id")
      .single();
    if (!eleicao) throw new Error(`Não foi possível inserir eleicao ${ano}`);

    // Candidatos
    const candRows = candidatos.map((c) => ({
      nome: c.nome,
      numero: c.numero,
      partido: c.partido,
      cargo: c.cargo,
      uf: c.uf,
      municipio_ibge: null, // resolvido no ETL via lookup de codigo_municipio_tse
      eleicao_id: eleicao.id,
      cor: null,
    }));
    await this.inserirEmLotes("candidatos", candRows, "nome,numero,eleicao_id");

    // Busca candidatos inseridos para montar mapa numero → id
    const { data: candDb } = await this.db
      .from("candidatos")
      .select("id, numero")
      .eq("eleicao_id", eleicao.id);
    const candMap = new Map(candDb?.map((c) => [c.numero, c.id]) ?? []);

    // Resultados
    const { data: secoesDb } = await this.db.from("secoes").select("id, numero_secao");
    const secaoMap = new Map(secoesDb?.map((s) => [s.numero_secao, s.id]) ?? []);

    const resRows = resultados
      .map((r) => ({
        secao_id: secaoMap.get(r.secao),
        candidato_id: candMap.get(r.numeroCandidato),
        eleicao_id: eleicao.id,
        votos: r.votos,
      }))
      .filter((r) => r.secao_id && r.candidato_id);

    await this.inserirEmLotes("resultados_secao", resRows, "secao_id,candidato_id,eleicao_id");
  }

  /** Ativa um estado nos filtros da plataforma */
  async ativarEstado(sigla: string) {
    await this.db
      .from("estados")
      .update({ ativo: true })
      .eq("sigla", sigla);
  }

  /** Insere registros em lotes de LOTE para evitar timeouts */
  private async inserirEmLotes(tabela: string, rows: object[], onConflict?: string) {
    for (let i = 0; i < rows.length; i += LOTE) {
      const lote = rows.slice(i, i + LOTE);
      const query = this.db.from(tabela).upsert(lote as any, {
        onConflict,
        ignoreDuplicates: true,
      });
      const { error } = await query;
      if (error) console.warn(`  ⚠ Aviso em ${tabela}:`, error.message);
    }
  }
}
