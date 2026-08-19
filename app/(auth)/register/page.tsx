"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErro("");

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: { data: { nome } },
    });

    setLoading(false);

    if (error) {
      setErro(error.message);
      return;
    }

    setOk(true);
  }

  if (ok) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <div className="max-w-sm text-center">
          <h1 className="text-2xl font-semibold">Confirme seu e-mail</h1>
          <p className="mt-3 text-sm text-slate-400">
            Enviamos um link de confirmação para {email}. Depois de confirmar, você já pode entrar.
          </p>
          <Link href="/login" className="mt-6 inline-block text-accent-500 hover:underline">
            Ir para o login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <p className="font-mono text-xs tracking-widest text-accent-500">PLEITOINTEL</p>
        <h1 className="mt-3 text-2xl font-semibold">Criar conta</h1>
        <p className="mt-1 text-sm text-slate-400">Para candidato, partido ou consultoria.</p>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
          <input
            required
            placeholder="Nome / razão social"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="rounded-lg border border-white/10 bg-base-850 px-4 py-3 text-sm outline-none focus:border-accent-500"
          />
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
            minLength={6}
            placeholder="Senha (mín. 6 caracteres)"
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
            {loading ? "Criando..." : "Criar conta"}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-500">
          Já tem conta?{" "}
          <Link href="/login" className="text-accent-500 hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </main>
  );
}
