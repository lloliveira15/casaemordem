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
        scrolled ? "bg-card/95 backdrop-blur shadow-[var(--shadow-sm)] border-b border-border" : ""
      }`}
    >
      <div className="max-w-[1200px] mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-primary flex items-center gap-2">
          <Flower className="text-primary size-6" />
          Casa em Ordem
        </Link>

        <div
          className={`${
            open ? "flex" : "hidden"
          } md:flex flex-col md:flex-row fixed md:static top-[72px] left-4 right-4 bg-card md:bg-transparent p-6 md:p-0 rounded-2xl shadow-[var(--shadow-lg)] md:shadow-none border border-border md:border-none gap-3 md:gap-6 md:items-center`}
        >
          <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors" onClick={() => setOpen(false)}>
            Funcionalidades
          </Link>
          <Link href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors" onClick={() => setOpen(false)}>
            Depoimentos
          </Link>
          <Link href="#plans" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors" onClick={() => setOpen(false)}>
            Planos
          </Link>
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center px-5 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
            onClick={() => setOpen(false)}
          >
            Entrar
          </Link>
        </div>

        <button
          className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="size-6" /> : <List className="size-6" />}
        </button>
      </div>
    </nav>
  )
}
