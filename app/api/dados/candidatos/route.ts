import { NextResponse } from "next/server";
import { getCandidatos } from "@/lib/tse";
import type { Cargo } from "@/lib/types";

// GET /api/dados/candidatos?municipio=1721000&cargo=VEREADOR&ano=2024
// Retorna candidatos filtrados por municipio, cargo e ano.
// Tenta banco Supabase primeiro (via lib/tse.ts), fallback para sample.
export const revalidate = 3600;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const municipio = searchParams.get("municipio") || "1721000";
  const cargo     = (searchParams.get("cargo") || "VEREADOR") as Cargo;
  const ano       = Number(searchParams.get("ano") || "2024");

  try {
    const candidatos = await getCandidatos({
      municipioIbge: municipio,
      cargo,
      ano,
      candidatoId: undefined,
      partidoSigla: undefined,
    });
    return NextResponse.json(candidatos);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
