import { NextRequest, NextResponse } from "next/server";
import { getCandidatos, getVotacaoPorMunicipio } from "@/lib/tse";
import type { Cargo } from "@/lib/types";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const ano = Number(searchParams.get("ano") ?? "2022");
  const cargo = (searchParams.get("cargo") ?? "PRESIDENTE") as Cargo;
  const municipioIbge = searchParams.get("municipioIbge") ?? "1700251";
  const candidatoId = searchParams.get("candidatoId") ?? undefined;
  const partidoSigla = searchParams.get("partidoSigla") ?? undefined;

  try {
    const [votacao, candidatos] = await Promise.all([
      getVotacaoPorMunicipio({ ano, cargo, municipioIbge, candidatoId, partidoSigla }),
      getCandidatos(),
    ]);

    return NextResponse.json({ votacao, candidatos });
  } catch (error) {
    console.error("Erro ao carregar dados de votação:", error);
    return NextResponse.json(
      { error: "Falha ao carregar dados de votação" },
      { status: 500 }
    );
  }
}
