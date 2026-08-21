import { NextResponse } from "next/server";
import { getMunicipiosPorUF } from "@/lib/geo";

// GET /api/dados/municipios?uf=TO
// Retorna os municipios ativos de um estado.
// Alimenta o filtro de cidade no Filtros.tsx.
// Cache de 1h — so muda quando um novo ETL de municipio roda.
export const revalidate = 3600;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const uf = searchParams.get("uf");

  if (!uf || uf.length !== 2) {
    return NextResponse.json({ error: "parametro uf invalido" }, { status: 400 });
  }

  try {
    const municipios = await getMunicipiosPorUF(uf.toUpperCase());
    return NextResponse.json(municipios);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
