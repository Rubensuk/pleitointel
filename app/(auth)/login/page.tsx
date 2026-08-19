"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErro("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });

    setLoading(false);

    if (error) {
      setErro("E-mail ou senha inválidos.");
      return;
    }

    router.push(searchParams.get("next") ?? "/dashboard");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <p className="font-mono text-xs tracking-widest text-accent-500">PLEITOINTEL</p>
        <h1 className="mt-3 text-2xl font-semibold">Entrar na conta</h1>
        <p className="mt-1 text-sm text-slate-400">Acesso de candidato ou consultoria.</p>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
          <input
            type="email"
            required
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-white/10 bg-base-850 px-4 py-3 text-sm outline-none focus:border-accent-500"
          />
          <input
            type="password"
            required
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="rounded-lg border border-white/10 bg-base-850 px-4 py-3 text-sm outline-none focus:border-accent-500"
          />
          {erro && <p className="text-sm text-signal-red">{erro}</p>}
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-accent-500 px-6 py-3 text-sm font-semibold text-base-950 transition hover:bg-accent-600 disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-500">
          Ainda não tem conta?{" "}
          <Link href="/register" className="text-accent-500 hover:underline">
            Criar conta
          </Link>
        </p>
      </div>
    </main>
  );
}
