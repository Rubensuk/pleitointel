"use client";

import { useState } from "react";

interface Mensagem {
  remetente: "bot" | "user";
  texto: string;
}

export default function OnboardingChat() {
  const [aberto, setAberto] = useState(false);
  const [mensagens, setMensagens] = useState<Mensagem[]>([
    {
      remetente: "bot",
      texto: "Olá! 👋 Quer simular o potencial eleitoral do seu município em segundos? Me diga qual cidade você quer analisar!",
    },
  ]);
  const [input, setInput] = useState("");
  const [etapa, setEtapa] = useState("aguardando_municipio");
  const [estadoLead, setEstadoLead] = useState<any>({});
  const [carregando, setCarregando] = useState(false);

  const enviarMensagem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || carregando) return;

    const msgUsuario = input.trim();
    setInput("");
    setMensagens((prev) => [...prev, { remetente: "user", texto: msgUsuario }]);
    setCarregando(true);

    try {
      const res = await fetch("/api/ai/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mensagem: msgUsuario,
          etapa,
          estadoAtual: estadoLead,
        }),
      });

      const data = await res.json();
      if (data.sucesso) {
        setMensagens((prev) => [
          ...prev,
          { remetente: "bot", texto: data.resposta },
        ]);
        setEtapa(data.proximaEtapa);
        setEstadoLead(data.estado);
      }
    } catch {
      setMensagens((prev) => [
        ...prev,
        { remetente: "bot", texto: "Desculpe, tive uma instabilidade momentânea." },
      ]);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!aberto ? (
        <button
          onClick={() => setAberto(true)}
          className="flex items-center gap-3 px-5 py-3.5 rounded-full bg-orange-500 text-slate-950 font-bold text-sm shadow-xl hover:bg-orange-400 hover:scale-105 transition-all"
        >
          <span>💬</span>
          <span>Assistente de Configuração</span>
          <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping"></span>
        </button>
      ) : (
        <div className="w-80 sm:w-96 rounded-2xl border border-white/10 bg-slate-900/95 shadow-2xl backdrop-blur flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-4 bg-slate-950 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-400"></span>
              <span className="text-xs font-semibold text-white">Setup Inteligente • PleitoIntel</span>
            </div>
            <button
              onClick={() => setAberto(false)}
              className="text-slate-400 hover:text-white text-sm"
            >
              ✕
            </button>
          </div>

          {/* Mensagens */}
          <div className="p-4 h-72 overflow-y-auto space-y-3 text-xs">
            {mensagens.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.remetente === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-xl ${
                    msg.remetente === "user"
                      ? "bg-orange-500 text-slate-950 font-medium"
                      : "bg-slate-800 text-slate-200 border border-white/5"
                  }`}
                >
                  {msg.texto}
                </div>
              </div>
            ))}
            {carregando && (
              <div className="text-slate-500 font-mono text-[11px] animate-pulse">
                Digitando...
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={enviarMensagem} className="p-3 bg-slate-950 border-t border-white/10 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua resposta..."
              className="flex-1 bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={carregando}
              className="px-3 py-2 bg-orange-500 text-slate-950 rounded-lg font-semibold text-xs hover:bg-orange-400 disabled:opacity-50"
            >
              Enviar
            </button>
          </form>
        </div>
      )}
    </div>
  );
}