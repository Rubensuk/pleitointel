"use client";

import { useState } from "react";

interface Alerta {
  tipo: "critico" | "aviso" | "info";
  mensagem: string;
  regra: string;
}

interface ComplianceResponse {
  status: string;
  scoreConformidade: number;
  totalAlertas: number;
  alertas: Alerta[];
  recomendacao: string;
}

export default function ValidadorComplianceCard() {
  const [texto, setTexto] = useState("");
  const [cargo, setCargo] = useState("Vereador");
  const [carregando, setCarregando] = useState(false);
  const [resultado, setResultado] = useState<ComplianceResponse | null>(null);

  const handleValidar = async () => {
    if (!texto.trim()) return;
    setCarregando(true);
    try {
      const res = await fetch("/api/ai/compliance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto, cargo }),
      });
      const data = await res.json();
      setResultado(data);
    } catch (error) {
      console.error("Erro ao validar compliance", error);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            MÓDULO 9 — IA LEGAL TSE
          </span>
          <h3 className="text-base font-semibold text-white mt-1">
            Validador de Compliance Jurídico-Eleitoral
          </h3>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex gap-4">
          <div className="w-1/3">
            <label className="text-xs text-slate-400">Cargo Alvo</label>
            <select
              value={cargo}
              onChange={(e) => setCargo(e.target.value)}
              className="mt-1 w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
            >
              <option value="Vereador">Vereador</option>
              <option value="Prefeito">Prefeito</option>
              <option value="Deputado Estadual">Deputado Estadual</option>
            </select>
          </div>
          <div className="w-2/3">
            <label className="text-xs text-slate-400">Texto / Discurso para Auditoria</label>
            <textarea
              rows={3}
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Cole o discurso, legenda de post ou texto de panfleto para verificar riscos perante o TSE..."
              className="mt-1 w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>

        <button
          onClick={handleValidar}
          disabled={carregando || !texto.trim()}
          className="w-full bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-medium py-2 rounded-lg text-xs transition-colors border border-white/10"
        >
          {carregando ? "Auditando perante Resoluções do TSE..." : "Verificar Compliance TSE"}
        </button>
      </div>

      {resultado && (
        <div className="pt-3 border-t border-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  resultado.status === "APROVADO" ? "bg-emerald-400" : "bg-red-400"
                }`}
              />
              <span className="text-xs font-bold text-white">
                {resultado.status === "APROVADO" ? "Conformidade Aprovada" : "Atenção: Risco Identificado"}
              </span>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Score: <strong className="text-white">{resultado.scoreConformidade}/100</strong>
            </span>
          </div>

          <div className="space-y-2">
            {resultado.alertas.map((alerta, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg border text-xs space-y-1 ${
                  alerta.tipo === "critico"
                    ? "bg-red-950/20 border-red-500/30 text-red-200"
                    : alerta.tipo === "aviso"
                    ? "bg-amber-950/20 border-amber-500/30 text-amber-200"
                    : "bg-emerald-950/20 border-emerald-500/30 text-emerald-200"
                }`}
              >
                <p className="font-semibold">{alerta.mensagem}</p>
                <p className="text-[10px] opacity-75 font-mono">Fundamentação: {alerta.regra}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}