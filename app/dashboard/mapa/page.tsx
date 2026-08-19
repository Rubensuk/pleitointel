import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@/lib/supabase/server";
// ⚠️ Confira esse caminho de import. Se o seu arquivo estiver em
// utils/supabase/server.ts (padrão dos exemplos oficiais do Supabase),
// troque a linha acima por:
// import { createClient } from "@/utils/supabase/server";

const MapaCliente = dynamic(() => import("./MapaCliente"), { ssr: false });

export default async function MapaPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Lê o JSON de exemplo direto da pasta /data na raiz do projeto
  // (a mesma pasta citada no schema.sql: "/data/sample").
  const caminhoArquivo = path.join(
    process.cwd(),
    "data",
    "votacao-2022-2t-municipio-exemplo.json"
  );
  const conteudo = fs.readFileSync(caminhoArquivo, "utf-8");
  const dadosIniciais = JSON.parse(conteudo);

  return (
    <div className="flex h-screen flex-col">
      <div className="border-b border-white/10 p-6">
        <p className="font-mono text-xs tracking-widest text-slate-500">
          DIAGNÓSTICO TERRITORIAL
        </p>
        <h1 className="mt-2 text-2xl font-semibold">
          Município Exemplo — 2022, 2º turno
        </h1>
        <p className="mt-1 text-slate-400">
          Votação por seção. Dados de exemplo — pipeline TSE/IBGE entra na
          próxima entrega.
        </p>
      </div>
      <MapaCliente dadosIniciais={dadosIniciais} />
    </div>
  );
}
