import React from 'react';

interface TierGateProps {
  recursoNecessario: string;
  tierMinimo: string;
}

export default function TierGate({ recursoNecessario, tierMinimo }: TierGateProps) {
  return (
    <div className="p-8 rounded-xl border border-amber-500/30 bg-amber-950/10 text-center max-w-lg mx-auto my-12">
      <h3 className="text-xl font-bold text-amber-400 mb-2">Recurso Exclusivo ({tierMinimo.toUpperCase()})</h3>
      <p className="text-zinc-400 text-sm mb-4">
        O módulo de <strong className="text-zinc-200">{recursoNecessario}</strong> requer o upgrade de plano.
      </p>
      <button className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg text-sm transition-colors">
        Falar com Consultor
      </button>
    </div>
  );
}