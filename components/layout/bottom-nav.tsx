"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  ChartBar,
  ListChecks,
  Users,
  GearSix,
} from "phosphor-react"

const navItems = [
  { href: "/app/dashboard", label: "Dashboard", icon: ChartBar },
  { href: "/app/tarefas", label: "Tarefas", icon: ListChecks },
  { href: "/app/membros", label: "Membros", icon: Users },
  { href: "/app/configuracoes", label: "Ajustes", icon: GearSix },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-[#E5E7EB] bg-white z-50 pb-safe">
      <div className="flex justify-around py-2 h-[64px]">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 px-3 py-1 text-[10px] font-medium transition-colors min-w-[64px]",
                isActive ? "text-[#A78BFA]" : "text-[#9CA3AF]"
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
