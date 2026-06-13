import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-24 px-6 text-center">
      <div className="max-w-[640px] mx-auto bg-card rounded-3xl p-10 md:p-14 border border-border shadow-[var(--shadow-sm)]">
        <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">
          Pronto para organizar sua casa?
        </h2>
        <p className="text-base text-muted-foreground mb-8 leading-relaxed">
          Cadastre-se grátis e comece a dividir as tarefas domésticas de forma justa e transparente.
        </p>
        <Link
          href="/auth/cadastro"
          className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground rounded-xl text-base font-semibold hover:bg-primary/90 hover:-translate-y-0.5 transition-all"
        >
          Começar grátis
        </Link>
      </div>
    </section>
  )
}
