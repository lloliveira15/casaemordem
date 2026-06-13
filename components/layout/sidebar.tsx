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
    <>
      <aside className="hidden md:flex flex-col w-64 border-r border-border bg-secondary text-muted-foreground p-4">
        <div className="text-lg font-bold mb-8 px-4 flex items-center gap-2 text-primary">
          <span className="size-2 rounded-full bg-primary" />
          Casa em Ordem
        </div>
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
                  isActive
                    ? "bg-card text-primary shadow-[var(--shadow-sm)] border border-border"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="size-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground border-t border-border mb-2">
          {isAdmin && <Crown className="size-3 text-primary" weight="fill" />}
          <span className="font-medium text-foreground truncate">{username}</span>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-muted-foreground hover:bg-muted hover:text-foreground w-full transition-colors"
          >
            <SignOut className="size-5" />
            Sair
          </button>
        </form>
      </aside>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-border bg-card/95 backdrop-blur text-card-foreground z-50">
        <div className="flex justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-3 py-1 text-xs font-medium transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className="size-5" />
                {item.label}
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
