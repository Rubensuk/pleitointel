"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface DashboardNavProps {
  email?: string;
}

const navItems = [
  { label: "Visão Geral", href: "/dashboard" },
  { label: "Diagnóstico Territorial", href: "/dashboard/mapa" },
  { label: "Projeções", href: "/dashboard/projecoes" },
  { label: "Confronto", href: "/dashboard/confronto" },
  { label: "Viabilidade", href: "/dashboard/viabilidade" },
  { label: "CRM Territorial", href: "/dashboard/crm-territorial" },
  { label: "Relatórios & IA", href: "/dashboard/relatorios" },
];

export default function DashboardNav({ email }: DashboardNavProps) {
  const pathname = usePathname();

  return (
    <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-mono font-bold text-orange-500 tracking-wider text-sm">
            PLEITOINTEL
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    active
                      ? "bg-white/10 text-white"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {email && (
            <span className="text-xs text-slate-400 font-mono hidden sm:inline-block">
              {email}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Enterprise
          </span>
        </div>
      </div>
    </header>
  );
}