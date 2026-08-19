import Link from "next/link";
import LeadForm from "@/components/LeadForm";
import OnboardingChat from "@/components/ai/OnboardingChat";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white selection:bg-orange-500 selection:text-slate-950">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-orange-500 font-bold tracking-wider text-base">PLEITO</span>
          <span className="text-white font-bold tracking-wider text-base">INTEL</span>
        </div>

        <nav className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-xs font-medium text-slate-400 hover:text-white transition"
          >
            Acessar Painel
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 rounded-lg bg-orange-500 text-slate-950 font-semibold text-xs hover:bg-orange-400 transition"
          >
            Começar Grátis
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="px-6 py-20 max-w-4xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-mono">
          <span>●</span> Inteligência Eleitoral com IA para Campanhas Modernas
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white">
          Transforme dados eleitorais em <span className="text-orange-500">estratégia vitoriosa</span>.
        </h1>

        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Diagnósticos territoriais, projeções de votos, cálculo de quociente partidário e relatórios automáticos para WhatsApp em uma única plataforma.
        </p>

        <div className="pt-4 max-w-md mx-auto">
          <LeadForm />
        </div>
      </section>

      {/* Assistente Conversacional Flutuante */}
      <OnboardingChat />
    </main>
  );
}