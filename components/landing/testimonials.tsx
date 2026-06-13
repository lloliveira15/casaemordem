"use client"

import { useState, useEffect, useCallback } from "react"
import { Star, CaretLeft, CaretRight, Chats } from "phosphor-react"

const testimonials = [
  {
    text: "Desde que começamos a usar o Casa em Ordem, as brigas por tarefa doméstica acabaram. Sabemos exatamente quem faz o quê e quando.",
    author: "Ana e Carlos",
    time: "Usuários há 6 meses",
    color: "#7C3AED",
    initial: "A",
  },
  {
    text: "Os templates semanais são incríveis! Montamos nossa rotina de limpeza uma vez e as tarefas são geradas automaticamente toda semana.",
    author: "Marina e Pedro",
    time: "Usuários há 3 meses",
    color: "#EA580C",
    initial: "M",
  },
  {
    text: "O relatório de produtividade virou nosso aliado. Dá para ver claramente quem está ajudando mais e ajustar a divisão das tarefas.",
    author: "Rafael e Julia",
    time: "Usuários há 1 ano",
    color: "#059669",
    initial: "R",
  },
]

export function Testimonials() {
  const [slide, setSlide] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768)
    function onResize() {
      const mobile = window.innerWidth <= 768
      setIsMobile(mobile)
      setSlide((prev) => Math.min(prev, mobile ? testimonials.length - 1 : Math.ceil(testimonials.length / 2) - 1))
    }
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  const totalSlides = isMobile ? testimonials.length - 1 : Math.ceil(testimonials.length / 2) - 1
  const goTo = useCallback((i: number) => {
    setSlide(Math.max(0, Math.min(i, totalSlides)))
  }, [totalSlides])

  return (
    <section id="testimonials" className="py-24 px-6">
      <div className="text-center max-w-[640px] mx-auto mb-12">
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#F5F3FF] text-[#7C3AED] rounded-full text-sm font-semibold mb-4">
          <Chats className="size-4" /> Depoimentos
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-[#1F1B2E] mb-3">Quem usa, aprova</h2>
        <p className="text-base text-[#6B5B8D] leading-relaxed">
          Veja o que outros casais estão dizendo sobre o Casa em Ordem
        </p>
      </div>
      <div className="max-w-[1000px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden mb-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-8 border border-[#F0E8F8] transition-all duration-300"
              style={{
                display: isMobile && i < slide ? "none" : undefined,
              }}
            >
              <div className="flex gap-1 text-amber-400 text-base mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="size-4" weight="fill" />
                ))}
              </div>
              <p className="text-sm text-[#1F1B2E] leading-relaxed italic mb-5">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="size-11 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0"
                  style={{ background: t.color }}
                >
                  {t.initial}
                </div>
                <div>
                  <strong className="block text-sm text-[#1F1B2E]">{t.author}</strong>
                  <span className="text-xs text-[#6B5B8D]">{t.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => goTo(slide - 1)}
            className="size-10 rounded-full border border-[#E8E0F0] bg-white flex items-center justify-center text-[#6B5B8D] hover:border-[#7C3AED] hover:text-[#7C3AED] transition-all"
            aria-label="Anterior"
          >
            <CaretLeft className="size-4" />
          </button>
          <div className="flex gap-1.5">
            {[...Array(totalSlides + 1)].map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  i === slide ? "w-6 bg-[#7C3AED]" : "w-2 bg-[#E8E0F0]"
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
          <button
            onClick={() => goTo(slide + 1)}
            className="size-10 rounded-full border border-[#E8E0F0] bg-white flex items-center justify-center text-[#6B5B8D] hover:border-[#7C3AED] hover:text-[#7C3AED] transition-all"
            aria-label="Próximo"
          >
            <CaretRight className="size-4" />
          </button>
        </div>
      </div>
    </section>
  )
}
