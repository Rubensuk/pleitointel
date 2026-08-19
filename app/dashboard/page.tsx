import Link from "next/link";

const modulos = [
  {
    titulo: "Diagnóstico territorial",
    descricao: "Mapa de votação, densidade e renda por seção/bairro.",
    href: "/dashboard/mapa",
    icone: "🗺️",
  },
  {
    titulo: "Projeções eleitorais",
    descricao: "Tendência de votação por seção nas últimas eleições.",
    href: "/dashboard/projecoes",
    icone: "📈",
  },
  {
    titulo: "Simulador de viabilidade",
    descricao: "Simulação de quociente eleitoral e meta de votos.",
    href: "/dashboard/viabilidade",
    icone: "🎯",
  },
  {
    titulo: "Confronto de candidatos",
    descricao: "Comparativo de desempenho direto entre candidatos e seções.",
    href: "/dashboard/confronto",
    icone: "📊",
  },
  {
    titulo: "Relatórios & Exportação",
    descricao: "Exportação em PDF e Excel para reuniões de coordenação.",
    href: "/dashboard/relatorios",
    icone: "📄",
  },
];

export default function DashboardPage() {
  return (
    <div className="p-8 space-y-8 bg-slate-950 text-white min-h-screen">
      <div>
        <p className="font-mono text-xs tracking-widest text-slate-500">
          PAINEL PRINCIPAL
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Visão geral</h1>
        <p className="mt-1 text-slate-400">
          Todos os 5 módulos de inteligência eleitoral operacionais.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modulos.map((modulo) => (
          <Link
            key={modulo.titulo}
            href={modulo.href}
            className="block p-6 rounded-2xl border border-white/10 bg-slate-900/40 hover:border-orange-500/50 hover:bg-slate-900/80 transition-all cursor-pointer"
          >
            <div className="text-2xl mb-4">{modulo.icone}</div>
            <h3 className="text-lg font-medium text-white mb-2">
              {modulo.titulo}
            </h3>
            <p className="text-sm text-slate-400">{modulo.descricao}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}