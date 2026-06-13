"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { logout } from "@/app/auth/actions"
import {
  ChartBar,
  ListChecks,
  Users,
  GearSix,
  SignOut,
  Crown,
  Flower,
} from "phosphor-react"

const navItems = [
  { href: "/app/dashboard", label: "Dashboard", icon: ChartBar },
  { href: "/app/tarefas", label: "Tarefas", icon: ListChecks },
  { href: "/app/membros", label: "Membros", icon: Users },
  { href: "/app/configuracoes", label: "Configurações", icon: GearSix },
]

export function Sidebar({ username, isAdmin }: { username: string; isAdmin: boolean }) {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex flex-col w-[260px] border-r border-[#E5E7EB] bg-white text-[#374151] p-4">
      {/* Logo */}
      <div className="mb-8 px-4 flex items-center gap-2">
        <Flower className="size-6 text-[#A78BFA]" weight="fill" />
        <span className="text-lg font-semibold text-[#A78BFA]">Casa em Ordem</span>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-[#EDE9FE] text-[#A78BFA] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-5 before:w-[3px] before:bg-[#A78BFA] before:rounded-r"
                  : "text-[#374151] hover:bg-[#F9FAFB] hover:text-[#1F2937]"
              )}
            >
              <Icon className="size-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User Info */}
      <div className="flex items-center gap-2 px-4 py-2 text-sm border-t border-[#E5E7EB] mb-2">
        {isAdmin && <Crown className="size-3 text-[#A78BFA]" weight="fill" />}
        <span className="font-medium truncate">{username}</span>
      </div>

      {/* Logout */}
      <form action={logout}>
        <button
          type="submit"
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-[#374151] hover:bg-[#F9FAFB] w-full transition-colors"
        >
          <SignOut className="size-5" />
          Sair
        </button>
      </form>
    </aside>
  )
}