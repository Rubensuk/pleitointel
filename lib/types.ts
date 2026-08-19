// Tipos centrais do módulo de Diagnóstico Territorial

export interface FiltroDiagnostico {
  ano: number;
  cargo: Cargo;
  municipioIbge: string; // código IBGE do município
  candidatoId?: string;
  partidoSigla?: string;
}

export type Cargo =
  | "PRESIDENTE"
  | "GOVERNADOR"
  | "SENADOR"
  | "DEPUTADO_FEDERAL"
  | "DEPUTADO_ESTADUAL"
  | "PREFEITO"
  | "VEREADOR";

export interface Candidato {
  id: string;
  nome: string;
  numero: string;
  partidoSigla: string;
  cargo: Cargo;
  cor: string; // cor usada no mapa/legenda
}

// Propriedades de cada seção eleitoral no GeoJSON de votação
export interface SecaoVotacaoProps {
  codigoSecao: string;
  zona: string;
  bairro: string;
  municipioIbge: string;
  totalVotosValidos: number;
  votosPorCandidato: Record<string, number>; // candidatoId -> votos
  candidatoVencedorId: string;
  percentualVencedor: number;
}

// Propriedades de dados demográficos/renda por área (IBGE/Censo)
export interface AreaDemografiaProps {
  codigoArea: string;
  bairro: string;
  municipioIbge: string;
  populacao: number;
  densidadeHabKm2: number;
  rendaMediaDomiciliar: number;
}

export type CamadaMapa = "votacao" | "densidade" | "renda";

export interface FeatureCollectionGenerica<P> {
  type: "FeatureCollection";
  features: Array<{
    type: "Feature";
    properties: P;
    geometry: GeoJSON.Geometry;
  }>;
}
