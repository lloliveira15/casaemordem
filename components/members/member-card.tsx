"use client"

import { useState } from "react"
import { updateMember, toggleNotifications } from "@/lib/actions/household"
import { Button } from "@/components/ui/button"
import { Pencil, Check, X, User, Bell, BellSlash } from "phosphor-react"

interface MemberData {
  user_id: string
  username: string
  email: string
  phone: string | null
  role: string
  notifications_enabled: boolean
}

export function MemberCard({ member, isAdmin }: { member: MemberData; isAdmin: boolean }) {
  const [editing, setEditing] = useState(false)
  const [notifEnabled, setNotifEnabled] = useState(member.notifications_enabled)

  async function handleSave(formData: FormData) {
    await updateMember(member.user_id, formData)
    setEditing(false)
  }

  async function handleToggleNotif() {
    const newVal = !notifEnabled
    setNotifEnabled(newVal)
    await toggleNotifications(member.user_id, newVal)
  }

  const inputClass = "px-2 py-1.5 border border-input rounded-lg bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"

  return (
    <div className="p-5 bg-card border border-border rounded-xl shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5 transition-all duration-150">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="size-10 rounded-full bg-secondary flex items-center justify-center text-primary shrink-0">
            <User className="size-5" weight="fill" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-foreground truncate">
              {member.username}
              {member.role === "admin" && <span className="text-xs text-primary ml-1">(admin)</span>}
            </p>
            <p className="text-sm text-muted-foreground truncate">{member.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {isAdmin && (
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={handleToggleNotif}
              className="text-muted-foreground hover:text-primary hover:bg-primary/10"
              title={notifEnabled ? "Desativar notificações" : "Ativar notificações"}
            >
              {notifEnabled ? <Bell className="size-4 text-primary" weight="fill" /> : <BellSlash className="size-4" />}
            </Button>
          )}
          {isAdmin && (
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => setEditing(true)}
              className="text-muted-foreground hover:text-primary hover:bg-primary/10"
            >
              <Pencil className="size-4" />
            </Button>
          )}
        </div>
      </div>

      {editing && (
        <form action={handleSave} className="mt-3 pt-3 border-t border-border flex flex-wrap gap-2">
          <div className="flex-1 min-w-[120px]">
            <label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground block mb-0.5">Nome</label>
            <input name="username" defaultValue={member.username} className={inputClass} />
          </div>
          <div className="flex-1 min-w-[120px]">
            <label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground block mb-0.5">Telefone</label>
            <input name="phone" defaultValue={member.phone ?? ""} placeholder="(11) 99999-9999" className={inputClass} />
          </div>
          <div className="flex items-end gap-1">
            <Button size="icon-xs" variant="ghost" type="submit" className="text-primary hover:text-primary hover:bg-primary/10">
              <Check className="size-4" />
            </Button>
            <Button size="icon-xs" variant="ghost" onClick={() => setEditing(false)} type="button" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10">
              <X className="size-4" />
            </Button>
          </div>
        </form>
      )}

      {member.phone && !editing && (
        <p className="text-xs text-muted-foreground mt-1">{member.phone}</p>
      )}
    </div>
  )
}
