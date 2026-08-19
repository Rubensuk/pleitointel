"use client";

import ViabilidadeCliente from "@/components/ViabilidadeCliente";

export default function ViabilidadePage() {
  return (
    <div className="p-8 space-y-6 bg-slate-950 text-white min-h-screen">
      <div>
        <p className="font-mono text-xs tracking-widest text-slate-500">MÓDULO 3</p>
        <h1 className="mt-2 text-2xl font-semibold">Simulador de Viabilidade Eleitoral</h1>
        <p className="mt-1 text-slate-400 text-sm">
          Calcule o quociente eleitoral (QE), quociente partidário (QP) e a meta de votos da sua nominata.
        </p>
      </div>

      <ViabilidadeCliente />
    </div>
  );
}