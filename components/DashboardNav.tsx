"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Painel", href: "/dashboard" },
  { label: "Diagnóstico territorial", href: "/dashboard/mapa" },
  { label: "Projeções eleitorais", href: "/dashboard/projecoes" },
  { label: "Simulador de viabilidade", href: "/dashboard/viabilidade" },
  { label: "Relatórios & Exportação", href: "/dashboard/relatorios" },
];

export default function DashboardNav() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen border-r border-white/10 bg-slate-950 p-4 flex flex-col justify-between">
      <div className="space-y-6">
        <div className="px-3 py-2">
          <span className="text-orange-500 font-bold tracking-wider text-sm">PLEITO</span>
          <span className="text-white font-bold tracking-wider text-sm">INTEL</span>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-orange-500/10 text-orange-400 font-medium"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-white/10 pt-4 px-3">
        <Link
          href="/login"
          className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          ← Sair
        </Link>
      </div>
    </aside>
  );
}