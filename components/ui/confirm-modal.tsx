"use client"

import { Warning, Trash, Info } from "phosphor-react"
import { Button } from "@/components/ui/button"

interface ConfirmModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: "warning" | "danger" | "info"
}

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title = "Confirmar",
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  type = "warning",
}: ConfirmModalProps) {
  if (!open) return null

  const iconMap = {
    warning: <Warning className="size-6 text-amber-500" weight="fill" />,
    danger: <Trash className="size-6 text-destructive" />,
    info: <Info className="size-6 text-primary" weight="fill" />,
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-card border border-border rounded-2xl shadow-lg p-6 max-w-sm w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <div className="mt-0.5">{iconMap[type]}</div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground">{message}</p>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" size="sm" onClick={onClose} className="rounded-lg">
            {cancelText}
          </Button>
          <Button
            variant={type === "danger" ? "destructive" : "default"}
            size="sm"
            onClick={() => { onConfirm(); onClose() }}
            className="rounded-lg"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  )
}
