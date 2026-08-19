"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "ok" | "error";

export default function LeadForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setStatus("ok");
      form.reset();
    } catch {
      setStatus("error");
      setErrorMsg("Não foi possível enviar agora. Tente novamente em instantes.");
    }
  }

  if (status === "ok") {
    return (
      <div className="rounded-xl border border-signal-green/30 bg-signal-green/10 p-6">
        <p className="font-mono text-sm text-signal-green">SOLICITAÇÃO REGISTRADA</p>
        <p className="mt-2 text-slate-300">
          Recebemos seu pedido de demonstração. Nossa equipe entra em contato em breve.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          name="nome"
          required
          placeholder="Nome completo"
          className="rounded-lg border border-white/10 bg-base-850 px-4 py-3 text-sm outline-none focus:border-accent-500"
        />
        <input
          name="email"
          type="email"
          required
          placeholder="E-mail"
          className="rounded-lg border border-white/10 bg-base-850 px-4 py-3 text-sm outline-none focus:border-accent-500"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          name="telefone"
          placeholder="WhatsApp / telefone"
          className="rounded-lg border border-white/10 bg-base-850 px-4 py-3 text-sm outline-none focus:border-accent-500"
        />
        <select
          name="cargo"
          className="rounded-lg border border-white/10 bg-base-850 px-4 py-3 text-sm outline-none focus:border-accent-500"
          defaultValue=""
        >
          <option value="" disabled>
            Cargo de interesse
          </option>
          <option value="VEREADOR">Vereador</option>
          <option value="PREFEITO">Prefeito</option>
          <option value="DEPUTADO_ESTADUAL">Deputado Estadual</option>
          <option value="DEPUTADO_FEDERAL">Deputado Federal</option>
          <option value="OUTRO">Consultoria / Partido</option>
        </select>
      </div>
      <textarea
        name="mensagem"
        rows={3}
        placeholder="Conte rapidamente sua região e objetivo de campanha"
        className="rounded-lg border border-white/10 bg-base-850 px-4 py-3 text-sm outline-none focus:border-accent-500"
      />
      {status === "error" && <p className="text-sm text-signal-red">{errorMsg}</p>}
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-lg bg-accent-500 px-6 py-3 text-sm font-semibold text-base-950 transition hover:bg-accent-600 disabled:opacity-60"
      >
        {status === "loading" ? "Enviando..." : "Solicitar demonstração"}
      </button>
    </form>
  );
}
