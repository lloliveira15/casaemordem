import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-24 px-6 text-center bg-gradient-to-br from-[#5B21B6] to-[#7C3AED]">
      <div className="max-w-[600px] mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
          Pronto para organizar sua casa?
        </h2>
        <p className="text-base text-white/85 mb-8 leading-relaxed">
          Cadastre-se grátis e comece a dividir as tarefas domésticas de forma justa e transparente.
        </p>
        <Link
          href="/auth/cadastro"
          className="inline-flex items-center justify-center px-8 py-4 bg-white text-[#5B21B6] rounded-lg text-base font-semibold hover:bg-[#F5F3FF] hover:-translate-y-0.5 transition-all"
        >
          Começar grátis
        </Link>
      </div>
    </section>
  )
}
