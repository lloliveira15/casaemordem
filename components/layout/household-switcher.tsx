"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CaretDown, Plus, House, SignIn } from "phosphor-react"
import { switchHousehold, createNewHousehold, joinHousehold } from "@/lib/actions/household-switch"

interface Household {
  id: string
  name: string
}

export function HouseholdSwitcher({ current, households }: { current: Household; households: Household[] }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [newName, setNewName] = useState("")
  const [showJoin, setShowJoin] = useState(false)
  const [inviteCode, setInviteCode] = useState("")
  const [joinError, setJoinError] = useState("")

  async function handleSwitch(id: string) {
    await switchHousehold(id)
    setOpen(false)
    router.refresh()
  }

  async function handleCreate() {
    if (!newName.trim()) return
    await createNewHousehold(newName.trim())
    setNewName("")
    setShowNew(false)
    setOpen(false)
    router.refresh()
  }

  async function handleJoin() {
    if (!inviteCode.trim()) return
    setJoinError("")
    const result = await joinHousehold(inviteCode.trim())
    if (result?.error) {
      setJoinError(result.error)
    } else {
      setInviteCode("")
      setShowJoin(false)
      setOpen(false)
      router.refresh()
    }
  }

  return (
    <div className="relative mb-4 px-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium bg-[#F3E8FF] text-[#A78BFA] hover:bg-[#EDE9FE] transition-colors"
      >
        <House className="size-4" weight="fill" />
        <span className="flex-1 text-left truncate">{current.name}</span>
        <CaretDown className="size-3" />
      </button>

      {open && (
        <div className="absolute top-full left-4 right-4 mt-1 bg-white border border-[#E5E7EB] rounded-xl shadow-lg z-50 overflow-hidden">
          {households.map(h => (
            <button
              key={h.id}
              onClick={() => handleSwitch(h.id)}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-[#F9FAFB] ${
                h.id === current.id ? "text-[#A78BFA] font-semibold bg-[#F3E8FF]" : "text-[#374151]"
              }`}
            >
              {h.name}
            </button>
          ))}
          <div className="border-t border-[#E5E7EB]">
            {showNew ? (
              <div className="p-3 flex gap-2">
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Nome da nova casa"
                  className="flex-1 px-3 py-1.5 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  autoFocus
                  onKeyDown={(e) => { if (e.key === "Enter") handleCreate(); if (e.key === "Escape") setShowNew(false) }}
                />
                <button onClick={handleCreate} className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-semibold">Criar</button>
              </div>
            ) : (
              <button
                onClick={() => { setShowNew(true); setShowJoin(false) }}
                className="w-full text-left px-4 py-2.5 text-sm text-[#374151] hover:bg-[#F9FAFB] flex items-center gap-2"
              >
                <Plus className="size-4" />
                Nova Casa
              </button>
            )}
          </div>
          <div className="border-t border-[#E5E7EB]">
            {showJoin ? (
              <div className="p-3">
                <div className="flex gap-2">
                  <input
                    value={inviteCode}
                    onChange={(e) => { setInviteCode(e.target.value); setJoinError("") }}
                    placeholder="Código de convite"
                    className="flex-1 px-3 py-1.5 border border-input rounded-lg text-sm uppercase focus:outline-none focus:ring-2 focus:ring-ring"
                    autoFocus
                    onKeyDown={(e) => { if (e.key === "Enter") handleJoin(); if (e.key === "Escape") setShowJoin(false) }}
                  />
                  <button onClick={handleJoin} className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-semibold">Entrar</button>
                </div>
                {joinError && (
                  <p className="text-xs text-destructive mt-1">{joinError}</p>
                )}
              </div>
            ) : (
              <button
                onClick={() => { setShowJoin(true); setShowNew(false) }}
                className="w-full text-left px-4 py-2.5 text-sm text-[#374151] hover:bg-[#F9FAFB] flex items-center gap-2"
              >
                <SignIn className="size-4" />
                Entrar em uma casa
              </button>
            )}
          </div>
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
      )}
    </div>
  )
}
