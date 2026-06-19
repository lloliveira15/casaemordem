"use client"

import { useState } from "react"
import { updateFamilyMember, removeFamilyMember } from "@/lib/actions/family"
import { Button } from "@/components/ui/button"
import { Pencil, Check, X, Trash, Baby, Dog, User } from "phosphor-react"

interface FamilyMemberData {
  id: string
  name: string
  type: string
  phone: string | null
  notes: string | null
}

const TYPE_CONFIG: Record<string, { label: string; icon: typeof Baby }> = {
  baby: { label: "Bebê", icon: Baby },
  pet: { label: "Pet", icon: Dog },
  other: { label: "Outro", icon: User },
}

export function FamilyMemberCard({ member, isAdmin }: { member: FamilyMemberData; isAdmin: boolean }) {
  const [editing, setEditing] = useState(false)
  const config = TYPE_CONFIG[member.type] ?? TYPE_CONFIG.other
  const Icon = config.icon

  async function handleSave(formData: FormData) {
    await updateFamilyMember(member.id, formData)
    setEditing(false)
  }

  async function handleRemove() {
    if (confirm(`Remover ${member.name} da família?`)) {
      await removeFamilyMember(member.id)
    }
  }

  const inputClass = "px-2 py-1.5 border border-input rounded-lg bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"

  return (
    <div className="p-5 bg-card border border-border rounded-xl shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5 transition-all duration-150">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="size-10 rounded-full bg-secondary flex items-center justify-center text-primary shrink-0">
            <Icon className="size-5" weight="fill" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-foreground truncate">
              {member.name}
              <span className="text-xs text-muted-foreground ml-1">({config.label})</span>
            </p>
            {member.phone && (
              <p className="text-sm text-muted-foreground truncate">{member.phone}</p>
            )}
          </div>
        </div>
        {isAdmin && (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => setEditing(true)}
              className="text-muted-foreground hover:text-primary hover:bg-primary/10"
            >
              <Pencil className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={handleRemove}
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <Trash className="size-4" />
            </Button>
          </div>
        )}
      </div>

      {member.notes && !editing && (
        <p className="text-xs text-muted-foreground mt-2 italic">{member.notes}</p>
      )}

      {editing && (
        <form action={handleSave} className="mt-3 pt-3 border-t border-border flex flex-wrap gap-2">
          <div className="flex-1 min-w-[120px]">
            <label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground block mb-0.5">Nome</label>
            <input name="name" defaultValue={member.name} required className={inputClass} />
          </div>
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground block mb-0.5">Tipo</label>
            <select name="type" defaultValue={member.type} className={inputClass}>
              <option value="baby">Bebê</option>
              <option value="pet">Pet</option>
              <option value="other">Outro</option>
            </select>
          </div>
          <div className="flex-1 min-w-[120px]">
            <label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground block mb-0.5">Telefone</label>
            <input name="phone" defaultValue={member.phone ?? ""} placeholder="(11) 99999-9999" className={inputClass} />
          </div>
          <div className="w-full">
            <label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground block mb-0.5">Observação</label>
            <input name="notes" defaultValue={member.notes ?? ""} placeholder="Ex: alérgico a leite" className={`${inputClass} w-full`} />
          </div>
          <div className="flex items-end gap-1 w-full justify-end">
            <Button size="icon-xs" variant="ghost" type="submit" className="text-primary hover:text-primary hover:bg-primary/10">
              <Check className="size-4" />
            </Button>
            <Button size="icon-xs" variant="ghost" onClick={() => setEditing(false)} type="button" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10">
              <X className="size-4" />
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
