"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { logout } from "@/app/auth/actions"
import {
  ListChecks,
  Users,
  GearSix,
  SignOut,
  Crown,
  Flower,
  ShoppingCart,
  ClockCounterClockwise,
  Armchair,
  CaretDown,
} from "phosphor-react"
import { HouseholdSwitcher } from "@/components/layout/household-switcher"

interface Household {
  id: string
  name: string
}

const navItems = [
  { href: "/app/dashboard", label: "Tarefas", icon: ListChecks },
  {
    label: "Rotinas",
    icon: ClockCounterClockwise,
    subItems: [
      { href: "/app/configuracoes", label: "Rotinas", icon: ClockCounterClockwise },
      { href: "/app/comodos", label: "Cômodos", icon: Armchair },
    ],
  },
  { href: "/app/compras", label: "Compras", icon: ShoppingCart },
  { href: "/app/membros", label: "Membros", icon: Users },
  { href: "/app/configuracoes/notificacoes", label: "Configurações", icon: GearSix },
]

export function Sidebar({ username, isAdmin, currentHousehold, households }: { username: string; isAdmin: boolean; currentHousehold: Household; households: Household[] }) {
  const pathname = usePathname()
  const [expandedMenus, setExpandedMenus] = useState<string[]>(["Rotinas"])

  const toggleMenu = (label: string) => {
    setExpandedMenus((prev) =>
      prev.includes(label) ? prev.filter((m) => m !== label) : [...prev, label]
    )
  }

  const isSubActive = (subItems: { href: string }[]) =>
    subItems.some((sub) => pathname.startsWith(sub.href))

  return (
    <aside className="hidden md:flex flex-col w-[260px] border-r border-[#E5E7EB] bg-white text-[#374151] p-4">
      {/* Logo */}
      <div className="mb-2 px-4 flex items-center gap-2">
        <Flower className="size-6 text-[#A78BFA]" weight="fill" />
        <span className="text-lg font-semibold text-[#A78BFA]">Casa em Ordem</span>
      </div>

      <HouseholdSwitcher current={currentHousehold} households={households} />

      {/* Nav Items */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          if ("subItems" in item && item.subItems) {
            const Icon = item.icon
            const isOpen = expandedMenus.includes(item.label)
            const anyActive = isSubActive(item.subItems)

            return (
              <div key={item.label}>
                <button
                  onClick={() => toggleMenu(item.label)}
                  className={cn(
                    "relative flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 w-full text-left",
                    anyActive
                      ? "bg-[#EDE9FE] text-[#A78BFA] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-5 before:w-[3px] before:bg-[#A78BFA] before:rounded-r"
                      : "text-[#374151] hover:bg-[#F9FAFB] hover:text-[#1F2937]"
                  )}
                >
                  <Icon className="size-5" />
                  <span className="flex-1">{item.label}</span>
                  <CaretDown
                    className={cn(
                      "size-4 transition-transform duration-200",
                      isOpen ? "rotate-0" : "-rotate-90"
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-200",
                    isOpen ? "max-h-40 mt-1" : "max-h-0"
                  )}
                >
                  <div className="ml-2 space-y-1">
                    {item.subItems.map((sub) => {
                      const SubIcon = sub.icon
                      const isActive = pathname.startsWith(sub.href)
                      return (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className={cn(
                            "relative flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                            isActive
                              ? "bg-[#EDE9FE] text-[#A78BFA]"
                              : "text-[#374151] hover:bg-[#F9FAFB] hover:text-[#1F2937]"
                          )}
                        >
                          <SubIcon className="size-4" />
                          {sub.label}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          }

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
