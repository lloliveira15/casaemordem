"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { addFamilyMember } from "@/lib/actions/family"
import { Button } from "@/components/ui/button"
import { Plus } from "phosphor-react"

export function AddFamilyMember() {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const form = e.currentTarget as HTMLFormElement
    const formData = new FormData(form)
    const result = await addFamilyMember(formData)
    if (!result?.error) {
      form.reset()
      setOpen(false)
      router.refresh()
    }
  }

  const inputClass = "px-3 py-2 border border-input rounded-lg bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"

  if (!open) {
    return (
      <Button variant="outline" size="sm" onClick={() => setOpen(true)} className="rounded-lg border-border bg-white hover:bg-primary/[0.04] hover:text-primary">
        <Plus className="size-4 mr-1" />
        Adicionar membro da família
      </Button>
    )
  }

  return (
    <div className="p-5 bg-card border border-border rounded-2xl shadow-[var(--shadow-sm)]">
      <h3 className="font-semibold text-foreground mb-3">Novo membro da família</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <div className="flex-1 min-w-[140px]">
            <label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground block mb-0.5">Nome</label>
            <input name="name" required placeholder="Nome" className={`${inputClass} w-full`} />
          </div>
          <div className="min-w-[100px]">
            <label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground block mb-0.5">Tipo</label>
            <select name="type" defaultValue="baby" className={`${inputClass} w-full`}>
              <option value="baby">Bebê</option>
              <option value="pet">Pet</option>
              <option value="other">Outro</option>
            </select>
          </div>
          <div className="flex-1 min-w-[140px]">
            <label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground block mb-0.5">Telefone</label>
            <input name="phone" placeholder="(11) 99999-9999" className={`${inputClass} w-full`} />
          </div>
        </div>
        <div>
          <label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground block mb-0.5">Observação</label>
          <input name="notes" placeholder="Ex: alérgico a leite, castrado, cuidadora 2x por semana" className={`${inputClass} w-full`} />
        </div>
        <div className="flex gap-2">
          <Button type="submit" className="rounded-lg">
            <Plus className="size-4 mr-1" />
            Adicionar
          </Button>
          <Button variant="ghost" type="button" onClick={() => setOpen(false)} className="text-muted-foreground">
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  )
}
