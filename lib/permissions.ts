export type Tier = 'basico' | 'pro' | 'enterprise';

export interface TierPermissions {
  podeExportarRelatorios: boolean;
  podeVerConfronto: boolean;
  podeVerViabilidade: boolean;
  podeMultiplosMunicipios: boolean;
}

export const TIER_CONFIG: Record<Tier, TierPermissions> = {
  basico: {
    podeExportarRelatorios: false,
    podeVerConfronto: false,
    podeVerViabilidade: false,
    podeMultiplosMunicipios: false,
  },
  pro: {
    podeExportarRelatorios: true,
    podeVerConfronto: true,
    podeVerViabilidade: true,
    podeMultiplosMunicipios: false,
  },
  enterprise: {
    podeExportarRelatorios: true,
    podeVerConfronto: true,
    podeVerViabilidade: true,
    podeMultiplosMunicipios: true,
  },
};