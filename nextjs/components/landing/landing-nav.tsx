"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Flower, List, X } from "phosphor-react"

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-200 ${
        scrolled ? "bg-white/95 backdrop-blur shadow-[var(--shadow-sm)]" : ""
      }`}
    >
      <div className="max-w-[1200px] mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-[#5B21B6] flex items-center gap-2">
          <Flower className="text-[#7C3AED] size-6" />
          Casa em Ordem
        </Link>

        <div
          className={`${
            open ? "flex" : "hidden"
          } md:flex flex-col md:flex-row fixed md:static top-[60px] left-0 right-0 bg-white md:bg-transparent p-6 md:p-0 shadow-lg md:shadow-none gap-3 md:gap-6 md:items-center`}
        >
          <Link href="#features" className="text-sm font-medium text-[#6B5B8D] hover:text-[#7C3AED] transition-colors" onClick={() => setOpen(false)}>
            Funcionalidades
          </Link>
          <Link href="#testimonials" className="text-sm font-medium text-[#6B5B8D] hover:text-[#7C3AED] transition-colors" onClick={() => setOpen(false)}>
            Depoimentos
          </Link>
          <Link href="#plans" className="text-sm font-medium text-[#6B5B8D] hover:text-[#7C3AED] transition-colors" onClick={() => setOpen(false)}>
            Planos
          </Link>
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center px-5 py-2 bg-[#7C3AED] text-white rounded-lg text-sm font-semibold hover:bg-[#5B21B6] transition-colors"
            onClick={() => setOpen(false)}
          >
            Entrar
          </Link>
        </div>

        <button
          className="md:hidden p-2 rounded-lg hover:bg-[#F5F3FF] transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="size-6" /> : <List className="size-6" />}
        </button>
      </div>
    </nav>
  )
}
