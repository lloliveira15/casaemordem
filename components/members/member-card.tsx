"use client"

import { useState } from "react"
import { updateMember } from "@/lib/actions/household"
import { Button } from "@/components/ui/button"
import { Pencil, Check, X, User } from "phosphor-react"

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

  async function handleSave(formData: FormData) {
    await updateMember(member.user_id, formData)
    setEditing(false)
  }

  const inputClass = "px-2 py-1.5 border border-input rounded-lg bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"

  return (
    <div className="flex items-center justify-between p-4 bg-card border border-border rounded-2xl shadow-[var(--shadow-sm)] hover:border-primary/30 transition-all">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="size-10 rounded-full bg-secondary flex items-center justify-center text-primary shrink-0">
          <User className="size-5" />
        </div>
        <div className="min-w-0">
          {editing ? (
            <form action={handleSave} className="flex flex-wrap gap-2">
              <input name="username" defaultValue={member.username} className={inputClass} />
              <input name="phone" defaultValue={member.phone ?? ""} placeholder="Telefone" className={inputClass} />
              <Button size="icon" variant="ghost" type="submit" className="text-primary hover:text-primary hover:bg-primary/10">
                <Check className="size-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => setEditing(false)} type="button" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                <X className="size-4" />
              </Button>
            </form>
          ) : (
            <>
              <p className="font-semibold text-foreground">{member.username}</p>
              <p className="text-sm text-muted-foreground">{member.email}</p>
              {member.phone && <p className="text-xs text-muted-foreground">{member.phone}</p>}
            </>
          )}
        </div>
      </div>
      {!editing && isAdmin && (
        <Button variant="ghost" size="icon" onClick={() => setEditing(true)} className="text-muted-foreground hover:text-primary hover:bg-primary/10">
          <Pencil className="size-4" />
        </Button>
      )}
    </div>
  )
}
