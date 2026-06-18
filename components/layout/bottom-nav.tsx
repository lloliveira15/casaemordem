"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  ListChecks,
  Users,
  GearSix,
} from "phosphor-react"

const navItems = [
  { href: "/app/comodos", label: "Cômodos", icon: ListChecks },
  { href: "/app/membros", label: "Membros", icon: Users },
  { href: "/app/configuracoes", label: "Notificações", icon: GearSix },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-border bg-white z-50 pb-safe">
      <div className="flex justify-around py-2 h-[64px]">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 px-3 py-1 text-[10px] font-medium transition-colors min-w-[64px] focus-visible:ring-2 focus-visible:ring-primary",
                isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
              )}
            >
              <Icon className="size-5" weight={isActive ? "fill" : "regular"} />
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
