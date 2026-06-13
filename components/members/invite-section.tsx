"use client"

import { useState } from "react"
import { regenerateCode } from "@/lib/actions/household"
import { Button } from "@/components/ui/button"
import { Copy, ArrowsClockwise } from "phosphor-react"

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
    <div className="space-y-4 p-5 bg-card border border-border rounded-2xl shadow-[var(--shadow-sm)]">
      <div>
        <h3 className="font-semibold text-foreground">Convidar Membros</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Compartilhe o código abaixo com seu parceiro(a) para ele(a) entrar na casa:
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <code className="px-5 py-2.5 bg-secondary rounded-xl text-lg font-mono tracking-[0.2em] text-primary font-bold">
          {code}
        </code>
        <Button variant="outline" size="sm" onClick={copyCode} className="rounded-lg border-border bg-white hover:bg-primary/[0.04] hover:text-primary">
          <Copy className="size-4 mr-1" />
          {copied ? "Copiado!" : "Copiar"}
        </Button>
      </div>
      <Button variant="ghost" size="sm" onClick={handleRegenerate} className="text-muted-foreground hover:text-primary hover:bg-primary/10">
        <ArrowsClockwise className="size-4 mr-1" />
        Gerar novo código
      </Button>
    </div>
  )
}
