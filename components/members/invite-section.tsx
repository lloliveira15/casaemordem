"use client"

import { useState } from "react"
import { regenerateCode, sendInvite } from "@/lib/actions/household"
import { Button } from "@/components/ui/button"
import { Copy, ArrowsClockwise, Envelope } from "phosphor-react"

export function InviteSection({ inviteCode }: { inviteCode: string }) {
  const [code, setCode] = useState(inviteCode)
  const [copied, setCopied] = useState(false)
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [email, setEmail] = useState("")
  const [emailSent, setEmailSent] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [sending, setSending] = useState(false)

  async function handleRegenerate() {
    const result = await regenerateCode()
    if (result.code) {
      setCode(result.code)
      setCopied(false)
    }
  }

  async function copyCode() {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleSendInvite() {
    if (!email) return
    setSending(true)
    setEmailError("")
    const fd = new FormData()
    fd.set("email", email)
    const result = await sendInvite(fd)
    setSending(false)
    if (result.success) {
      setEmailSent(true)
      setShowEmailForm(false)
      setEmail("")
      setTimeout(() => setEmailSent(false), 3000)
    } else if (result.error) {
      setEmailError(result.error)
    }
  }

  const inviteLink = typeof window !== "undefined"
    ? `${window.location.origin}/auth/cadastro?invite=${encodeURIComponent(code)}`
    : ""
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(inviteLink)}`

  return (
    <div className="space-y-5 p-5 bg-card border border-border rounded-2xl shadow-[var(--shadow-sm)]">
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

      {inviteLink && (
        <div className="flex justify-center">
          <img
            src={qrUrl}
            alt="QR Code para convidar"
            className="w-40 h-40 rounded-xl border border-border"
            loading="lazy"
          />
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowEmailForm(!showEmailForm)}
          className="rounded-lg border-border bg-white hover:bg-primary/[0.04] hover:text-primary"
        >
          <Envelope className="size-4 mr-1" />
          Convidar por email
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRegenerate}
          className="text-muted-foreground hover:text-primary hover:bg-primary/10"
        >
          <ArrowsClockwise className="size-4 mr-1" />
          Novo código
        </Button>
      </div>

      {showEmailForm && (
        <div className="space-y-2">
          <div className="flex gap-2 items-center">
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setEmailError("") }}
              placeholder="Email do convidado"
              className="flex-1 px-3 py-2 border border-input rounded-lg bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <Button
              size="sm"
              onClick={handleSendInvite}
              disabled={sending || !email}
              className="rounded-lg"
            >
              {sending ? "Enviando..." : "Enviar"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowEmailForm(false)}
              className="text-muted-foreground"
            >
              Cancelar
            </Button>
          </div>
          {emailError && (
            <p className="text-sm text-destructive">{emailError}</p>
          )}
        </div>
      )}

      {emailSent && (
        <p className="text-sm text-success font-medium">Convite enviado com sucesso!</p>
      )}
    </div>
  )
}
