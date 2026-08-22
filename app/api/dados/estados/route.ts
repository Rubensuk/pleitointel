import { NextResponse } from "next/server";
import { getEstadosAtivos } from "@/lib/geo";

// GET /api/dados/estados
// Retorna os estados com dados reais carregados (ativo = true).
// Alimenta o filtro de UF no Filtros.tsx.
// Cache de 1h — raramente muda (só quando um novo ETL de estado roda).
export const revalidate = 3600;

export async function GET() {
  try {
    const estados = await getEstadosAtivos();
    return NextResponse.json(estados);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
