"use client"

import { useState } from "react"
import { updateMember } from "@/lib/actions/household"
import { Button } from "@/components/ui/button"
import { Pencil, Check, X } from "phosphor-react"

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

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="space-y-1">
        {editing ? (
          <form action={handleSave} className="flex gap-2">
            <input
              name="username"
              defaultValue={member.username}
              className="px-2 py-1 border rounded text-sm"
            />
            <input
              name="phone"
              defaultValue={member.phone ?? ""}
              placeholder="Telefone"
              className="px-2 py-1 border rounded text-sm"
            />
            <Button size="icon" variant="ghost" type="submit">
              <Check className="size-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => setEditing(false)} type="button">
              <X className="size-4" />
            </Button>
          </form>
        ) : (
          <>
            <p className="font-medium">{member.username}</p>
            <p className="text-sm text-muted-foreground">{member.email}</p>
            {member.phone && <p className="text-xs text-muted-foreground">{member.phone}</p>}
          </>
        )}
      </div>
      {!editing && isAdmin && (
        <Button variant="ghost" size="icon" onClick={() => setEditing(true)}>
          <Pencil className="size-4" />
        </Button>
      )}
    </div>
  )
}
