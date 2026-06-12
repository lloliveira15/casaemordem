"use client"

import { useState } from "react"
import { regenerateCode } from "@/lib/actions/household"
import { Button } from "@/components/ui/button"

export function InviteSection({ inviteCode }: { inviteCode: string }) {
  const [code, setCode] = useState(inviteCode)
  const [copied, setCopied] = useState(false)

  async function handleRegenerate() {
    const result = await regenerateCode()
    if (result.code) setCode(result.code)
  }

  async function copyCode() {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="font-semibold">Convidar Membros</h3>
      <p className="text-sm text-muted-foreground">
        Compartilhe o código abaixo com seu parceiro(a) para ele(a) entrar na casa:
      </p>
      <div className="flex items-center gap-2">
        <code className="px-4 py-2 bg-muted rounded-md text-lg font-mono tracking-widest">
          {code}
        </code>
        <Button variant="outline" size="sm" onClick={copyCode}>
          {copied ? "Copiado!" : "Copiar"}
        </Button>
      </div>
      <Button variant="ghost" size="sm" onClick={handleRegenerate}>
        Gerar novo código
      </Button>
    </div>
  )
}
