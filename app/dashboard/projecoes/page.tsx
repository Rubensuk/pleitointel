import { redirect } from "next/navigation";
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@/lib/supabase/server";
// ⚠️ mesmo aviso das outras páginas: confira esse caminho de import
import ProjecoesCliente from "./ProjecoesCliente";

export default async function ProjecoesPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const caminhoArquivo = path.join(
    process.cwd(),
    "data",
    "historico-eleitoral-municipio-exemplo.json"
  );
  const conteudo = fs.readFileSync(caminhoArquivo, "utf-8");
  const dados = JSON.parse(conteudo);

  return (
    <div className="p-8">
      <p className="font-mono text-xs tracking-widest text-slate-500">
        PROJEÇÕES ELEITORAIS
      </p>
      <h1 className="mt-2 text-2xl font-semibold">
        Município Exemplo — histórico 2016 · 2020 · 2022
      </h1>
      <p className="mt-1 text-slate-400">
        Tendência de votação por seção nas últimas 3 eleições. Dados de
        exemplo (fictícios).
      </p>
      <ProjecoesCliente dados={dados} />
    </div>
  );
}
