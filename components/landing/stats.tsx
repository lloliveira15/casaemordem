"use client"

import { useEffect, useRef, useState } from "react"

function AnimatedNumber({ target, suffix = "+" }: { target: number; suffix?: string }) {
  const [current, setCurrent] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const duration = 2000
          const start = performance.now()

          function update(now: number) {
            const elapsed = now - start
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            const value = Math.round(eased * target)
            setCurrent(value)
            if (progress < 1) requestAnimationFrame(update)
          }

          requestAnimationFrame(update)
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [target])

  const display =
    target === 98 ? `${current}%` : `${current.toLocaleString("pt-BR")}${suffix}`

  return <div ref={ref} className="text-4xl md:text-5xl font-extrabold leading-none mb-2 text-primary">{display}</div>
}

export function Stats() {
  return (
    <section className="py-12 px-6">
      <div className="max-w-[900px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-card rounded-2xl p-8 border border-border text-center shadow-[var(--shadow-sm)]">
          <AnimatedNumber target={10000} suffix="+" />
          <div className="text-base text-muted-foreground font-medium mt-2">tarefas concluídas</div>
        </div>
        <div className="bg-card rounded-2xl p-8 border border-border text-center shadow-[var(--shadow-sm)]">
          <AnimatedNumber target={500} suffix="+" />
          <div className="text-base text-muted-foreground font-medium mt-2">casas organizadas</div>
        </div>
        <div className="bg-card rounded-2xl p-8 border border-border text-center shadow-[var(--shadow-sm)]">
          <AnimatedNumber target={98} suffix="%" />
          <div className="text-base text-muted-foreground font-medium mt-2">% de satisfação</div>
        </div>
      </div>
    </section>
  )
}
