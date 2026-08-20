export default function RelatoriosPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Cabeçalho da Página */}
      <div className="border-b border-gray-800 pb-5">
        <span className="text-xs font-semibold tracking-wider text-orange-500 uppercase">
          Módulo 5 & Módulo 9
        </span>
        <h1 className="text-3xl font-bold text-white mt-1">
          Relatórios Estratégicos & Compliance Legal
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Geração de sínteses para WhatsApp e validação jurídica de materiais de campanha.
        </p>
      </div>

      {/* Grid de Conteúdo Centralizado */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Card 1: Validador de Compliance */}
        <div className="bg-[#0f172a] border border-gray-800 rounded-xl p-6 shadow-sm">
          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-950 text-emerald-400 border border-emerald-800/50 mb-4">
            MÓDULO 9 — IA LEGAL TSE
          </span>
          <h2 className="text-xl font-bold text-white mb-4">
            Validador de Compliance Jurídico-Eleitoral
          </h2>
          
          {/* Formulário do Validador */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Cargo Alvo
              </label>
              <select className="w-full bg-black/40 border border-gray-700 rounded-lg p-2.5 text-white text-sm focus:border-orange-500 focus:outline-none">
                <option value="vereador">Vereador</option>
                <option value="prefeito">Prefeito</option>
                <option value="deputado_estadual">Deputado Estadual</option>
                <option value="deputado_federal">Deputado Federal</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Texto / Discurso para Auditoria
              </label>
              <textarea
                rows={5}
                className="w-full bg-black/40 border border-gray-700 rounded-lg p-2.5 text-white text-sm focus:border-orange-500 focus:outline-none resize-none"
                placeholder="Cole o discurso, legenda de post ou texto de panfleto para análise..."
              />
            </div>

            <button className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg text-sm transition">
              Verificar Compliance TSE
            </button>
          </div>
        </div>

        {/* Card 2: Exportação e Síntese Executiva */}
        <div className="bg-[#0f172a] border border-gray-800 rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">
              Exportação e Síntese Executiva
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              Gere relatórios rápidos formatados diretamente para envio no WhatsApp da coordenação.
            </p>
          </div>

          <div className="space-y-3">
            <button className="w-full py-3 px-4 bg-gray-900 border border-gray-700 hover:border-orange-500 rounded-lg text-left text-white text-sm font-medium flex items-center justify-between transition">
              <span>Síntese Semanal de Campanha (WhatsApp)</span>
              <span className="text-xs text-orange-400">Gerar →</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}