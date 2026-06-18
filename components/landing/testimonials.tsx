"use client"

import { useState, useCallback } from "react"
import { Star, CaretLeft, CaretRight, Chats } from "phosphor-react"

const testimonials = [
  {
    text: "Desde que começamos a usar o Casa em Ordem, as brigas por tarefa doméstica acabaram. Sabemos exatamente quem faz o quê e quando.",
    author: "Ana e Carlos",
    time: "Usuários há 6 meses",
    initial: "A",
  },
  {
    text: "Os templates semanais são incríveis! Montamos nossa rotina de limpeza uma vez e as tarefas são geradas automaticamente toda semana.",
    author: "Marina e Pedro",
    time: "Usuários há 3 meses",
    initial: "M",
  },
  {
    text: "O relatório de produtividade virou nosso aliado. Dá para ver claramente quem está ajudando mais e ajustar a divisão das tarefas.",
    author: "Rafael e Julia",
    time: "Usuários há 1 ano",
    initial: "R",
  },
]

export function Testimonials() {
  const [slide, setSlide] = useState(0)
  const totalSlides = testimonials.length

  const goTo = useCallback(
    (i: number) => {
      setSlide(Math.max(0, Math.min(i, totalSlides - 1)))
    },
    [totalSlides]
  )

  return (
    <section id="testimonials" className="py-24 px-6">
      <div className="text-center max-w-[640px] mx-auto mb-12">
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-card text-primary border border-border rounded-full text-sm font-semibold mb-4">
          <Chats className="size-4" /> Depoimentos
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Quem usa, aprova</h2>
        <p className="text-base text-muted-foreground leading-relaxed">
          Veja o que outros casais estão dizendo sobre o Casa em Ordem
        </p>
      </div>

      <div className="max-w-[1000px] mx-auto">
        {/* Mobile carousel — hidden on md and up */}
        <div className="md:hidden overflow-hidden mb-8">
          <div
            className="flex transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${slide * 100}%)` }}
          >
            {testimonials.map((t, i) => (
              <div key={i} className="flex-shrink-0 w-full px-1">
                <TestimonialCard testimonial={t} />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop grid — hidden below md */}
        <div className="hidden md:grid grid-cols-3 gap-6 mb-8">
          {testimonials.map((t, i) => (
            <TestimonialCard key={i} testimonial={t} />
          ))}
        </div>

        {/* Mobile controls — hidden on md and up */}
        <div className="flex md:hidden items-center justify-center gap-4">
          <button
            onClick={() => goTo(slide - 1)}
            className="size-10 rounded-full border border-border bg-card flex items-center justify-center text-muted-foreground hover:border-primary/60 hover:text-primary transition-all"
            aria-label="Anterior"
          >
            <CaretLeft className="size-4" />
          </button>
          <div className="flex gap-1.5">
            {[...Array(totalSlides)].map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  i === slide ? "w-6 bg-primary" : "w-2 bg-border hover:bg-primary/30"
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
          <button
            onClick={() => goTo(slide + 1)}
            className="size-10 rounded-full border border-border bg-card flex items-center justify-center text-muted-foreground hover:border-primary/60 hover:text-primary transition-all"
            aria-label="Próximo"
          >
            <CaretRight className="size-4" />
          </button>
        </div>
      </div>
    </section>
  )
}

function TestimonialCard({ testimonial }: { testimonial: typeof testimonials[0] }) {
  return (
    <div className="bg-card rounded-2xl p-8 border border-border h-full">
      <div className="flex gap-1 text-accent mb-4">
        {[...Array(5)].map((_, j) => (
          <Star key={j} className="size-4" weight="fill" />
        ))}
      </div>
      <p className="text-sm text-foreground leading-relaxed mb-5">
        &ldquo;{testimonial.text}&rdquo;
      </p>
      <div className="flex items-center gap-3">
        <div className="size-11 rounded-full flex items-center justify-center text-primary font-bold text-lg shrink-0 bg-primary/[0.06] border border-border">
          {testimonial.initial}
        </div>
        <div>
          <strong className="block text-sm text-foreground">{testimonial.author}</strong>
          <span className="text-xs text-muted-foreground">{testimonial.time}</span>
        </div>
      </div>
    </div>
  )
}
