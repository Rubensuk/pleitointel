import Link from "next/link";
import LeadForm from "@/components/LeadForm";

const MODULOS = [
  {
    codigo: "M1",
    titulo: "Diagnóstico territorial",
    texto:
      "Mapa por seção eleitoral e bairro cruzando votação, densidade populacional e renda — disponível nesta entrega.",
    ativo: true,
  },
  {
    codigo: "M2",
    titulo: "Confronto entre candidatos",
    texto: "Comparativo lado a lado de desempenho por região, com histórico entre eleições.",
    ativo: false,
  },
  {
    codigo: "M3",
    titulo: "Projeções e cenários",
    texto: "Estimativas de voto por território a partir de tendências e perfil socioeconômico.",
    ativo: false,
  },
  {
    codigo: "M4",
    titulo: "Relatórios de campanha",
    texto: "Exportação em PDF e Excel prontos para reunião de coordenação e prestação de contas.",
    ativo: false,
  },
];

const PLANOS = [
  {
    nome: "Básico",
    faixa: "R$ 800 – R$ 2.000",
    publico: "Vereador",
  },
  {
    nome: "Pro",
    faixa: "R$ 2.500 – R$ 6.000",
    publico: "Prefeito / Dep. Estadual",
  },
  {
    nome: "Enterprise",
    faixa: "R$ 8.000 – R$ 15.000",
    publico: "Consultoria / Partido — múltiplos candidatos",
  },
];

export default function LandingPage() {
  return (
    <main className="relative overflow-hidden">
      {/* grade de coordenadas — motivo de fundo baseado em seções eleitorais reais */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <header className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <span className="font-mono text-sm tracking-widest text-accent-500">
          PLEITO<span className="text-slate-500">INTEL</span>
        </span>
        <nav className="flex items-center gap-6 text-sm text-slate-300">
          <a href="#modulos" className="hover:text-white">
            Módulos
          </a>
          <a href="#planos" className="hover:text-white">
            Planos
          </a>
          <Link href="/login" className="hover:text-white">
            Entrar
          </Link>
        </nav>
      </header>

      {/* hero */}
      <section className="relative mx-auto max-w-6xl px-6 pb-20 pt-12">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="font-mono text-xs tracking-[0.2em] text-accent-500">
              A INTELIGÊNCIA ANALÍTICA DO SEU PLEITO
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
              Leia o território
              <br />
              antes do adversário.
            </h1>
            <p className="mt-6 max-w-lg text-lg text-slate-400">
              Cruze votação por seção, densidade populacional e renda em um único
              mapa. Decisões de campanha baseadas em dado real do TSE e do IBGE,
              não em achismo de rua.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#lead"
                className="rounded-lg bg-accent-500 px-6 py-3 text-sm font-semibold text-base-950 transition hover:bg-accent-600"
              >
                Solicitar demonstração
              </a>
              <Link
                href="/dashboard/mapa"
                className="rounded-lg border border-white/15 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-white/30"
              >
                Ver mapa de exemplo
              </Link>
            </div>
          </div>

          {/* signature: mini-choropleth ilustrativo, codificado com dados reais de seção */}
          <div className="rounded-2xl border border-white/10 bg-base-900 p-4">
            <div className="mb-3 flex items-center justify-between font-mono text-[11px] text-slate-500">
              <span>municipio_exemplo.geojson</span>
              <span>6 seções</span>
            </div>
            <div className="grid grid-cols-3 grid-rows-2 gap-1.5">
              {[
                { cod: "0001", bairro: "Centro", pct: 55.6, vencedor: "A" },
                { cod: "0002", bairro: "Novo Horizonte", pct: 58.2, vencedor: "B" },
                { cod: "0003", bairro: "São Sebastião", pct: 57.9, vencedor: "A" },
                { cod: "0004", bairro: "Boa Vista", pct: 59.8, vencedor: "B" },
                { cod: "0005", bairro: "Setor Industrial", pct: 53.1, vencedor: "B" },
                { cod: "0006", bairro: "Beira Rio", pct: 63.6, vencedor: "A" },
              ].map((s) => (
                <div
                  key={s.cod}
                  className={`aspect-square rounded-md p-2 text-[10px] ${
                    s.vencedor === "A"
                      ? "bg-map-600/40 border border-map-500/50"
                      : "bg-signal-red/25 border border-signal-red/40"
                  }`}
                >
                  <div className="font-mono text-slate-300">{s.cod}</div>
                  <div className="mt-1 text-slate-200">{s.bairro}</div>
                  <div className="mt-1 font-mono text-slate-400">{s.pct}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* módulos */}
      <section id="modulos" className="relative mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-mono text-xs tracking-[0.2em] text-slate-500">MÓDULOS DA PLATAFORMA</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MODULOS.map((m) => (
            <div
              key={m.codigo}
              className={`rounded-xl border p-5 ${
                m.ativo ? "border-accent-500/40 bg-accent-500/5" : "border-white/10 bg-base-900"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-slate-500">{m.codigo}</span>
                {m.ativo && (
                  <span className="rounded-full bg-accent-500/20 px-2 py-0.5 font-mono text-[10px] text-accent-500">
                    DISPONÍVEL
                  </span>
                )}
              </div>
              <h3 className="mt-3 font-semibold">{m.titulo}</h3>
              <p className="mt-2 text-sm text-slate-400">{m.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* planos */}
      <section id="planos" className="relative mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-mono text-xs tracking-[0.2em] text-slate-500">PLANOS</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {PLANOS.map((p) => (
            <div key={p.nome} className="rounded-xl border border-white/10 bg-base-900 p-6">
              <h3 className="font-semibold">{p.nome}</h3>
              <p className="mt-1 text-sm text-slate-500">{p.publico}</p>
              <p className="mt-4 font-mono text-lg text-accent-500">{p.faixa}</p>
            </div>
          ))}
        </div>
      </section>

      {/* lead */}
      <section id="lead" className="relative mx-auto max-w-2xl px-6 py-20">
        <h2 className="text-2xl font-semibold">Solicitar demonstração</h2>
        <p className="mt-2 text-slate-400">
          Preencha os dados abaixo e mostramos o diagnóstico territorial da sua região.
        </p>
        <div className="mt-8">
          <LeadForm />
        </div>
      </section>

      <footer className="relative border-t border-white/10 px-6 py-8 text-center text-xs text-slate-500">
        PleitoIntel — a inteligência analítica do seu pleito. Dados públicos TSE / IBGE, tratados e georreferenciados.
      </footer>
    </main>
  );
}
