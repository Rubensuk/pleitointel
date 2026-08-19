"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectedFrom") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        router.push(redirectTo);
        router.refresh();
      }
    } catch {
      setError("Erro inesperado ao realizar login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8 rounded-2xl border border-white/10 bg-slate-900/60 p-8">
      <div>
        <span className="text-orange-500 font-bold tracking-wider text-sm">PLEITO</span>
        <span className="text-white font-bold tracking-wider text-sm">INTEL</span>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-white">
          Acessar plataforma
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Entre com suas credenciais para gerenciar suas análises
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <form className="mt-8 space-y-4" onSubmit={handleLogin}>
        <div>
          <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
            E-mail
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-2.5 text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none"
            placeholder="seu@email.com"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
            Senha
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-2.5 text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-orange-500 py-3 text-sm font-semibold text-slate-950 transition hover:bg-orange-400 disabled:opacity-50"
        >
          {loading ? "Entrando..." : "Entrar no Painel"}
        </button>
      </form>

      <div className="text-center text-xs text-slate-500 space-y-2">
        <p>
          Não tem uma conta?{" "}
          <Link href="/register" className="text-orange-400 hover:underline">
            Cadastre-se
          </Link>
        </p>
        <p>
          <Link href="/" className="text-slate-400 hover:text-slate-200">
            ← Voltar para a página inicial
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <Suspense
        fallback={
          <div className="text-slate-400 text-sm font-mono">
            Carregando tela de acesso...
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}