import Link from "next/link";
import LeadForm from "@/components/LeadForm";
import OnboardingChat from "@/components/ai/OnboardingChat";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white selection:bg-orange-500 selection:text-slate-950">
      {/* 1. Header / Navegação Fixa */}
      <header className="border-b border-white/10 px-6 py-4 sticky top-0 bg-slate-950/85 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-orange-500 font-black tracking-wider text-lg">PLEITO</span>
            <span className="text-white font-black tracking-wider text-lg">INTEL</span>
          </div>

          <nav className="flex items-center gap-6">
            <a href="#dores" className="hidden md:block text-xs font-medium text-slate-400 hover:text-white transition">
              Por que usar?
            </a>
            <a href="#recursos" className="hidden md:block text-xs font-medium text-slate-400 hover:text-white transition">
              Recursos
            </a>
            <a href="#planos" className="hidden md:block text-xs font-medium text-slate-400 hover:text-white transition">
              Planos
            </a>
            <a href="#faq" className="hidden md:block text-xs font-medium text-slate-400 hover:text-white transition">
              Dúvidas
            </a>
            <Link
              href="/login"
              className="text-xs font-medium text-slate-300 hover:text-white transition"
            >
              Acessar Painel
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 rounded-lg bg-orange-500 text-slate-950 font-bold text-xs hover:bg-orange-400 transition shadow-lg shadow-orange-500/20"
            >
              Começar Agora
            </Link>
          </nav>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="px-6 pt-16 pb-14 max-w-5xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></span>
          Inteligência Eleitoral & Ciência de Dados para Campanhas
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
          Pare de queimar dinheiro com campanha no escuro. <br />
          <span className="text-orange-500">Conquiste votos onde a vitória se decide.</span>
        </h1>

        <p className="text-slate-300 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
          O <strong>PleitoIntel</strong> cruza o histórico de votação seção a seção com a demografia do IBGE e calcula, com inteligência artificial, exatamente onde focar agendas e como superar seus concorrentes.
        </p>

        <div className="pt-4 max-w-md mx-auto">
          <div className="bg-slate-900/80 p-6 rounded-2xl border border-white/15 shadow-2xl backdrop-blur">
            <h3 className="text-sm font-semibold text-white mb-3 text-left">
              🚀 Solicite uma demonstração tática da sua cidade:
            </h3>
            <LeadForm />
          </div>
        </div>
      </section>

      {/* 3. Faixa de Autoridade */}
      <section className="border-y border-white/10 bg-slate-900/40 py-8 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-orange-400 font-mono">100%</p>
            <p className="text-xs text-slate-400 mt-1 uppercase font-medium">Dados Oficiais TSE & IBGE</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono">Seção a Seção</p>
            <p className="text-xs text-slate-400 mt-1 uppercase font-medium">Microgeografia Eleitoral</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-orange-400 font-mono">&lt; 30s</p>
            <p className="text-xs text-slate-400 mt-1 uppercase font-medium">Resumos com IA para WhatsApp</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono">+ROI</p>
            <p className="text-xs text-slate-400 mt-1 uppercase font-medium">Eficiência na Equipe de Rua</p>
          </div>
        </div>
      </section>

      {/* 4. Dores vs. Solução */}
      <section id="dores" className="px-6 py-20 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <p className="text-xs font-mono text-orange-400 uppercase tracking-widest">O Custo da Incerteza</p>
          <h2 className="text-3xl font-bold text-white">Eleição não aceita improviso nem achismo</h2>
          <p className="text-sm text-slate-400">A diferença real entre uma campanha amadora e uma campanha orientada por dados.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-2xl border border-red-500/20 bg-red-950/10 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-red-400 text-xl font-bold">✕</span>
              <h3 className="font-bold text-lg text-red-200">Campanha no Escuro (Sem Dados)</h3>
            </div>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">•</span>
                <span>Equipe de rua distribuindo material onde o eleitorado rejeita sua bandeira.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">•</span>
                <span>Cálculo manual e impreciso de quocientes para a montagem de nominata.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">•</span>
                <span>Desperdício de combustível e material sem direcionamento geográfico.</span>
              </li>
            </ul>
          </div>

          <div className="p-8 rounded-2xl border border-orange-500/30 bg-orange-950/10 space-y-4 shadow-lg shadow-orange-500/5">
            <div className="flex items-center gap-3">
              <span className="text-orange-400 text-xl font-bold">✓</span>
              <h3 className="font-bold text-lg text-orange-200">Com a Inteligência PleitoIntel</h3>
            </div>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-orange-400 font-bold">•</span>
                <span>Direcionamento de caminhadas e lideranças nas seções de maior potencial.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400 font-bold">•</span>
                <span>Simulador de viabilidade com alertas de quociente partidário e sobras.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400 font-bold">•</span>
                <span>IA que gera resumos executivos prontos para copiar e despachar via WhatsApp.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 5. Pilares da Plataforma */}
      <section id="recursos" className="px-6 py-20 border-t border-white/10 bg-slate-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <p className="text-xs font-mono text-orange-400 uppercase tracking-widest">Tecnologia & Estratégia</p>
            <h2 className="text-3xl font-bold text-white">4 Módulos Estratégicos Integrados</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl border border-white/10 bg-slate-950 space-y-3">
              <div className="text-3xl">🗺️</div>
              <h3 className="font-bold text-white text-base">Diagnóstico Territorial</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Mapeie a densidade de votos por bairro e localize áreas prioritárias e pontos de abstenção.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-white/10 bg-slate-950 space-y-3">
              <div className="text-3xl">⚔️</div>
              <h3 className="font-bold text-white text-base">Confronto Direto</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Compare o desempenho seção a seção contra adversários diretos para planejar ações de virada.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-white/10 bg-slate-950 space-y-3">
              <div className="text-3xl">⚖️</div>
              <h3 className="font-bold text-white text-base">Simulador de Viabilidade</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Cálculo instantâneo de QE e QP com recomendações táticas sobre o alcance de cadeiras.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-white/10 bg-slate-950 space-y-3">
              <div className="text-3xl">⚡</div>
              <h3 className="font-bold text-white text-base">Relatórios para WhatsApp</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Sínteses executivas em texto formatado para envio direto à coordenação e assessoria de campo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Planos de Investimento (4 Tiers) */}
      <section id="planos" className="px-6 py-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <p className="text-xs font-mono text-orange-400 uppercase tracking-widest">Investimento Tático por Pleito</p>
            <h2 className="text-3xl font-bold text-white">Escolha a escala ideal para sua campanha</h2>
            <p className="text-sm text-slate-400">Sem mensalidades após a eleição. Pacote único válido para todo o ciclo de campanha.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Gratuito */}
            <div className="p-6 rounded-2xl border border-white/10 bg-slate-950 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/10 text-slate-300">
                  Degustação
                </span>
                <h3 className="text-base font-semibold text-white mt-3">Gratuito</h3>
                <p className="text-2xl font-black text-white mt-3">R$ 0</p>
                <p className="text-xs text-slate-400 mt-1">Para conhecer a plataforma.</p>
                
                <ul className="mt-6 space-y-2.5 text-xs text-slate-400">
                  <li>✓ Acesso ao painel inicial</li>
                  <li>✓ 1 zona de exemplo</li>
                  <li>✓ Onboarding básico</li>
                  <li className="text-slate-600">✕ Sem mapas completos</li>
                  <li className="text-slate-600">✕ Sem diagnósticos de IA</li>
                  <li className="text-slate-600">✕ Sem exportações</li>
                </ul>
              </div>
              <Link
                href="/register"
                className="mt-8 block text-center py-2.5 rounded-lg border border-white/20 text-white font-semibold text-xs hover:bg-white/5 transition"
              >
                Acessar Grátis
              </Link>
            </div>

            {/* Básico */}
            <div className="p-6 rounded-2xl border border-white/10 bg-slate-950 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/10 text-slate-300">
                  Vereador / Cidades Médias
                </span>
                <h3 className="text-base font-semibold text-white mt-3">Básico</h3>
                <p className="text-2xl font-black text-white mt-3">R$ 1.999</p>
                <p className="text-xs text-slate-400 mt-1">Direcionamento tático de base.</p>
                
                <ul className="mt-6 space-y-2.5 text-xs text-slate-400">
                  <li>✓ Mapa interativo da cidade</li>
                  <li>✓ Histórico de 2 eleições</li>
                  <li>✓ Filtros por bairro e seção</li>
                  <li>✓ Assistente de Onboarding</li>
                  <li className="text-slate-600">✕ Sem exportações</li>
                  <li className="text-slate-600">✕ Sem módulos avançados de IA</li>
                </ul>
              </div>
              <Link
                href="/register"
                className="mt-8 block text-center py-2.5 rounded-lg border border-white/20 text-white font-semibold text-xs hover:bg-white/5 transition"
              >
                Contratar Básico
              </Link>
            </div>

            {/* Pro */}
            <div className="p-8 rounded-2xl border border-orange-500/50 bg-slate-900 flex flex-col justify-between relative shadow-xl shadow-orange-500/10">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-orange-500 text-slate-950 text-[9px] font-bold uppercase tracking-wider">
                Mais Escolhido
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-orange-500/20 text-orange-400">
                  Prefeito / Deputado
                </span>
                <h3 className="text-base font-semibold text-white mt-3">Profissional</h3>
                <p className="text-2xl font-black text-orange-400 mt-3">R$ 4.999</p>
                <p className="text-xs text-slate-400 mt-1">Para campanhas de alta disputa.</p>
                
                <ul className="mt-6 space-y-2.5 text-xs text-slate-300">
                  <li>✓ Tudo do Plano Básico</li>
                  <li>✓ Confronto Direto de Candidatos</li>
                  <li>✓ Camadas demográficas (IBGE)</li>
                  <li>✓ Leitura Interpretativa com IA</li>
                  <li>✓ Síntese para WhatsApp com 1 clique</li>
                  <li>✓ Relatórios Executivos em PDF</li>
                </ul>
              </div>
              <Link
                href="/register"
                className="mt-8 block text-center py-2.5 rounded-lg bg-orange-500 text-slate-950 font-bold text-xs hover:bg-orange-400 transition shadow-lg"
              >
                Contratar Pro
              </Link>
            </div>

            {/* Enterprise */}
            <div className="p-6 rounded-2xl border border-purple-500/30 bg-slate-950 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-purple-500/20 text-purple-400">
                  Partidos / Consultorias
                </span>
                <h3 className="text-base font-semibold text-white mt-3">Enterprise</h3>
                <p className="text-2xl font-black text-purple-400 mt-3">R$ 11.999</p>
                <p className="text-xs text-slate-400 mt-1">Gestão de chapas completas.</p>
                
                <ul className="mt-6 space-y-2.5 text-xs text-slate-400">
                  <li>✓ Todas as funções Pro</li>
                  <li>✓ Estrategista IA de Viabilidade</li>
                  <li>✓ Análise de chapas e sobras</li>
                  <li>✓ Multi-cidades e candidatos</li>
                  <li>✓ Exportação Microdados em Excel</li>
                  <li>✓ Suporte estratégico dedicado</li>
                </ul>
              </div>
              <Link
                href="/register"
                className="mt-8 block text-center py-2.5 rounded-lg border border-purple-500/40 text-purple-300 font-semibold text-xs hover:bg-purple-500/10 transition"
              >
                Contratar Enterprise
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ */}
      <section id="faq" className="px-6 py-20 border-t border-white/10 max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <p className="text-xs font-mono text-orange-400 uppercase tracking-widest">Tire Suas Dúvidas</p>
          <h2 className="text-3xl font-bold text-white">Perguntas Frequentes</h2>
        </div>

        <div className="space-y-4">
          <div className="p-5 rounded-xl bg-slate-900/50 border border-white/10 space-y-2">
            <h4 className="font-semibold text-white text-sm">De onde vêm os dados da plataforma?</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Todos os dados são 100% oficiais, extraídos e tratados diretamente das bases públicas do Tribunal Superior Eleitoral (TSE) e do Instituto Brasileiro de Geografia e Estatística (IBGE).
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/50 border border-white/10 space-y-2">
            <h4 className="font-semibold text-white text-sm">Preciso de equipe técnica para operar o sistema?</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Não. O PleitoIntel foi criado para ser intuitivo. Nossos assistentes de IA geram diagnósticos claros e resumos automáticos prontos para repassar à coordenação.
            </p>
          </div>
        </div>
      </section>

      {/* 8. Rodapé */}
      <footer className="border-t border-white/10 px-6 py-8 text-center text-xs text-slate-500">
        <p>© 2026 PleitoIntel — Plataforma de Inteligência Eleitoral e Análise de Dados.</p>
      </footer>

      {/* Assistente Conversacional Flutuante */}
      <OnboardingChat />
    </main>
  );
}