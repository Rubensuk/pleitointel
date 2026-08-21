/**
 * Parser dos arquivos CSV do TSE.
 *
 * Atenção: arquivos do TSE usam:
 *   - Encoding: ISO-8859-1
 *   - Separador: ponto-e-vírgula (;)
 *   - Strings entre aspas duplas
 */

import fs from "fs";
import path from "path";
import iconv from "iconv-lite";

export interface LocalVotacao {
  uf: string;
  codigoMunicipio: string; // codigo TSE
  municipioIbge: string;   // preenchido via lookup
  zona: string;
  secao: string;
  localVotacao: string;
  endereco: string;
  lat: number;
  lng: number;
}

export interface CandidatoETL {
  nome: string;
  numero: string;
  partido: string;
  cargo: string;
  uf: string;
  codigoMunicipioTse: string;
  situacao: string; // deferido, indeferido, etc.
}

export interface ResultadoETL {
  uf: string;
  codigoMunicipioTse: string;
  zona: string;
  secao: string;
  numeroCandidato: string;
  cargo: string;
  votos: number;
}

/** Lê um CSV do TSE (ISO-8859-1, separador ;) e retorna as linhas como arrays */
function lerCsvTse(filePath: string): string[][] {
  const buffer = fs.readFileSync(filePath);
  const content = iconv.decode(buffer, "ISO-8859-1");
  return content
    .split("\n")
    .slice(1) // pula o cabeçalho
    .filter((line) => line.trim().length > 0)
    .map((line) =>
      line
        .split(";")
        .map((cell) => cell.replace(/^"|"$/g, "").trim())
    );
}

/** Encontra o primeiro arquivo CSV em um diretório */
function encontrarCsv(dir: string, sufixo?: string): string {
  const arquivos = fs.readdirSync(dir).filter((f) =>
    f.endsWith(".csv") && (!sufixo || f.includes(sufixo))
  );
  if (!arquivos.length) throw new Error(`Nenhum CSV encontrado em ${dir}`);
  return path.join(dir, arquivos[0]);
}

/** Parse do arquivo de locais de votação */
export async function parseLocaisVotacao(dir: string, uf: string): Promise<LocalVotacao[]> {
  const csvPath = encontrarCsv(dir);
  const linhas = lerCsvTse(csvPath);

  return linhas
    .filter((cols) => cols[0]?.toUpperCase() === uf)
    .map((cols) => ({
      uf: cols[0],
      codigoMunicipio: cols[2],
      municipioIbge: "",      // preenchido depois via lookup de municipios
      zona: cols[5]?.padStart(4, "0"),
      secao: cols[6]?.padStart(4, "0"),
      localVotacao: cols[8] ?? "",
      endereco: cols[9] ?? "",
      lat: parseFloat(cols[10]?.replace(",", ".") ?? "0"),
      lng: parseFloat(cols[11]?.replace(",", ".") ?? "0"),
    }))
    .filter((l) => l.lat !== 0 && l.lng !== 0); // descarta seções sem coordenada
}

/** Parse do arquivo de candidatos */
export async function parseCandidatos(dir: string, uf: string, ano: number): Promise<CandidatoETL[]> {
  const csvPath = encontrarCsv(dir, `${ano}`);
  const linhas = lerCsvTse(csvPath);

  return linhas
    .filter((cols) => cols[5]?.toUpperCase() === uf)
    .map((cols) => ({
      nome: cols[17] ?? "",
      numero: cols[14] ?? "",
      partido: cols[20] ?? "",
      cargo: normalizarCargo(cols[13] ?? ""),
      uf: cols[5],
      codigoMunicipioTse: cols[8] ?? "",
      situacao: cols[56] ?? "",
    }))
    .filter((c) => c.situacao.toLowerCase().includes("deferido")); // só candidatos válidos
}

/** Parse do arquivo de resultados por seção */
export async function parseResultados(dir: string, uf: string, ano: number): Promise<ResultadoETL[]> {
  const csvPath = encontrarCsv(dir, `${ano}`);
  const linhas = lerCsvTse(csvPath);

  return linhas
    .filter((cols) => cols[3]?.toUpperCase() === uf)
    .map((cols) => ({
      uf: cols[3],
      codigoMunicipioTse: cols[6] ?? "",
      zona: cols[9]?.padStart(4, "0"),
      secao: cols[10]?.padStart(4, "0"),
      cargo: normalizarCargo(cols[14] ?? ""),
      numeroCandidato: cols[18] ?? "",
      votos: parseInt(cols[21] ?? "0", 10),
    }))
    .filter((r) => r.votos > 0);
}

function normalizarCargo(cargoTse: string): string {
  const mapa: Record<string, string> = {
    "PREFEITO":              "PREFEITO",
    "VICE-PREFEITO":         "PREFEITO",
    "VEREADOR":              "VEREADOR",
    "DEPUTADO ESTADUAL":     "DEPUTADO_ESTADUAL",
    "DEPUTADO FEDERAL":      "DEPUTADO_FEDERAL",
    "SENADOR":               "SENADOR",
    "GOVERNADOR":            "GOVERNADOR",
    "VICE-GOVERNADOR":       "GOVERNADOR",
    "PRESIDENTE":            "PRESIDENTE",
    "VICE-PRESIDENTE":       "PRESIDENTE",
  };
  const chave = cargoTse.toUpperCase().trim();
  return mapa[chave] ?? chave;
}
