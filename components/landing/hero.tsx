"use client"

import Link from "next/link"
import { Flower, ListChecks, CalendarBlank } from "phosphor-react"

export function Hero() {
  return (
    <section className="max-w-[1200px] mx-auto px-6 pt-[120px] pb-20 grid md:grid-cols-2 gap-16 items-center min-h-[90vh]">
      <div>
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-[#1F1B2E] mb-5">
          Organize as tarefas da sua casa{" "}
          <span className="bg-gradient-to-r from-[#7C3AED] to-[#EA580C] bg-clip-text text-transparent">
            com quem você ama
          </span>
        </h1>
        <p className="text-lg text-[#6B5B8D] leading-relaxed mb-8">
          Crie, atribua e acompanhe tarefas domésticas em casal. Com templates inteligentes,
          lembretes por email e relatórios de produtividade, sua casa nunca esteve tão em ordem.
        </p>
        <div className="flex gap-4 flex-wrap">
          <Link
            href="/auth/cadastro"
            className="inline-flex items-center justify-center px-8 py-4 bg-[#7C3AED] text-white rounded-lg text-base font-semibold hover:bg-[#5B21B6] hover:-translate-y-0.5 transition-all"
          >
            Criar conta gratuita
          </Link>
          <Link
            href="#features"
            className="inline-flex items-center justify-center px-8 py-4 bg-transparent text-[#1F1B2E] border-2 border-[#E8E0F0] rounded-lg text-base font-semibold hover:border-[#7C3AED] hover:text-[#7C3AED] transition-all"
          >
            Ver funcionalidades
          </Link>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="w-full max-w-[420px] bg-white rounded-xl shadow-[var(--shadow-lg)] overflow-hidden border border-[#E8E0F0]">
          <div className="bg-[#FAF5FF] px-4 py-3 flex gap-1.5 border-b border-[#E8E0F0]">
            <span className="size-2.5 rounded-full bg-red-500" />
            <span className="size-2.5 rounded-full bg-amber-400" />
            <span className="size-2.5 rounded-full bg-emerald-500" />
          </div>
          <div className="flex min-h-[280px]">
            <div className="w-12 bg-[#5B21B6] pt-3 pb-3 flex flex-col items-center gap-4">
              <Flower className="size-5 text-white" />
              <div className="size-8 flex items-center justify-center rounded-md bg-white/15 text-white">
                <ListChecks className="size-4" />
              </div>
            </div>
            <div className="flex-1 p-4 flex flex-col gap-2.5">
              <div className="text-sm font-semibold text-[#5B21B6] flex items-center gap-1.5 mb-1">
                <CalendarBlank className="size-4" /> Hoje
              </div>
              <div className="flex items-center gap-2.5 px-3 py-2.5 bg-[#FAF5FF] rounded-lg text-xs">
                <input type="checkbox" defaultChecked className="accent-[#7C3AED]" />
                <span className="flex-1 line-through opacity-50">Lavar louça</span>
                <span className="px-2 py-0.5 bg-[#F5F3FF] rounded-full text-[11px] text-[#7C3AED] font-semibold">Maria</span>
              </div>
              <div className="flex items-center gap-2.5 px-3 py-2.5 bg-[#FAF5FF] rounded-lg text-xs">
                <input type="checkbox" className="accent-[#7C3AED]" />
                <span className="flex-1">Aspirar sala</span>
                <span className="px-2 py-0.5 bg-[#F5F3FF] rounded-full text-[11px] text-[#7C3AED] font-semibold">João</span>
              </div>
              <div className="flex items-center gap-2.5 px-3 py-2.5 bg-[#FAF5FF] rounded-lg text-xs">
                <input type="checkbox" className="accent-[#7C3AED]" />
                <span className="flex-1">Regar plantas</span>
                <span className="px-2 py-0.5 bg-[#F5F3FF] rounded-full text-[11px] text-[#7C3AED] font-semibold">Maria</span>
              </div>
              <div className="px-3 py-2.5 border border-dashed border-[#A78BFA] rounded-lg text-xs text-[#A78BFA] text-center">
                + Adicionar tarefa
              </div>
            </div>
          </div>
          <div className="px-4 py-3 border-t border-[#E8E0F0] bg-[#FAF5FF] flex items-center gap-2.5 text-xs font-semibold text-[#7C3AED]">
            <div className="flex-1 h-1.5 bg-[#E8E0F0] rounded-full overflow-hidden">
              <div className="h-full w-1/3 bg-gradient-to-r from-[#7C3AED] to-[#EA580C] rounded-full" />
            </div>
            <span>33%</span>
          </div>
        </div>
      </div>
    </section>
  )
}
