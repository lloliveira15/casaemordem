import Link from "next/link"
import { Check, X, Tag } from "phosphor-react"

export function Plans() {
  return (
    <section id="plans" className="py-24 px-6 max-w-[900px] mx-auto">
      <div className="text-center max-w-[640px] mx-auto mb-12">
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#F5F3FF] text-[#7C3AED] rounded-full text-sm font-semibold mb-4">
          <Tag className="size-4" /> Planos
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-[#1F1B2E] mb-3">
          Escolha o plano ideal para você
        </h2>
        <p className="text-base text-[#6B5B8D] leading-relaxed">
          Comece grátis e faça upgrade quando precisar de mais
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="bg-white rounded-xl p-10 border border-[#F0E8F8]">
          <div className="text-sm font-bold text-[#6B5B8D] uppercase tracking-wide mb-4">Grátis</div>
          <div className="text-5xl font-extrabold text-[#1F1B2E] mb-6">
            R$ 0<span className="text-base font-normal text-[#6B5B8D]">/mês</span>
          </div>
          <ul className="flex flex-col gap-3 mb-8">
            {[
              ["Até 2 membros", true],
              ["Templates básicos", true],
              ["Notificações diárias", true],
              ["Convite por código", true],
              ["Membros ilimitados", false],
              ["Relatórios avançados", false],
              ["Suporte prioritário", false],
            ].map(([label, included]) => (
              <li key={label as string} className="flex items-center gap-2.5 text-sm text-[#1F1B2E]">
                {included ? (
                  <Check className="size-4 text-[#059669]" />
                ) : (
                  <X className="size-4 text-[#9C89B8]" />
                )}
                {label as string}
              </li>
            ))}
          </ul>
          <Link
            href="/auth/cadastro"
            className="block text-center py-3 bg-[#7C3AED] text-white rounded-lg text-sm font-semibold hover:bg-[#5B21B6] transition-colors"
          >
            Começar grátis
          </Link>
        </div>

        <div className="bg-white rounded-xl p-10 border-2 border-[#7C3AED] shadow-[0_4px_20px_rgba(124,58,237,0.15)] relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#7C3AED] text-white px-4 py-1 rounded-full text-xs font-bold whitespace-nowrap">
            Mais Popular
          </div>
          <div className="text-sm font-bold text-[#6B5B8D] uppercase tracking-wide mb-4">Premium</div>
          <div className="text-5xl font-extrabold text-[#1F1B2E] mb-6">
            Em breve<span className="text-base font-normal text-[#6B5B8D]" />
          </div>
          <ul className="flex flex-col gap-3 mb-8">
            {[
              ["Membros ilimitados", true],
              ["Templates avançados", true],
              ["Notificações personalizadas", true],
              ["Relatórios de produtividade", true],
              ["Suporte prioritário", true],
              ["Histórico completo", true],
              ["Exportação de dados", true],
            ].map(([label, included]) => (
              <li key={label as string} className="flex items-center gap-2.5 text-sm text-[#1F1B2E]">
                {included ? (
                  <Check className="size-4 text-[#059669]" />
                ) : (
                  <X className="size-4 text-[#9C89B8]" />
                )}
                {label as string}
              </li>
            ))}
          </ul>
          <Link
            href="/auth/login"
            className="block text-center py-3 bg-[#7C3AED] text-white rounded-lg text-sm font-semibold hover:bg-[#5B21B6] transition-colors"
          >
            Lista de espera
          </Link>
        </div>
      </div>
    </section>
  )
}
