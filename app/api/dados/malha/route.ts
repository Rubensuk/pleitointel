import { NextRequest, NextResponse } from "next/server";
import { getDemografiaPorMunicipio } from "@/lib/ibge";

export async function GET(request: NextRequest) {
  const municipioIbge = request.nextUrl.searchParams.get("municipioIbge") ?? "1700251";

  try {
    const demografia = await getDemografiaPorMunicipio(municipioIbge);
    return NextResponse.json({ demografia });
  } catch (error) {
    console.error("Erro ao carregar dados demográficos:", error);
    return NextResponse.json(
      { error: "Falha ao carregar dados demográficos" },
      { status: 500 }
    );
  }
}
