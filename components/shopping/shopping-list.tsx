"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { addShoppingItem, toggleShoppingItem, deleteShoppingItem, clearCompletedItems } from "@/lib/actions/shopping"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Plus, Trash, Eraser } from "phosphor-react"

interface ShoppingItem {
  id: string
  item_name: string
  category: string | null
  quantity: string | null
  completed: boolean
  completed_by: string | null
}

const CATEGORY_EMOJIS: Record<string, string> = {
  Hortifrúti: "🥦",
  Mercearia: "🥫",
  Laticínios: "🥛",
  Carnes: "🥩",
  Limpeza: "🧴",
  Higiene: "🧻",
  Bebidas: "🧃",
  Outros: "📦",
}

export function ShoppingList({ items }: { items: ShoppingItem[] }) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [newItem, setNewItem] = useState("")

  const grouped: Record<string, ShoppingItem[]> = {}
  const categoryOrder: string[] = []

  for (const item of items) {
    const cat = item.category || "Outros"
    if (!grouped[cat]) {
      grouped[cat] = []
      categoryOrder.push(cat)
    }
    grouped[cat].push(item)
  }

  async function handleAdd() {
    if (!newItem.trim()) return
    const fd = new FormData()
    fd.set("item_name", newItem.trim())
    await addShoppingItem(fd)
    setNewItem("")
    inputRef.current?.focus()
    router.refresh()
  }

  async function handleToggle(id: string) {
    await toggleShoppingItem(id)
    router.refresh()
  }

  async function handleDelete(id: string) {
    await deleteShoppingItem(id)
    router.refresh()
  }

  async function handleClearCompleted() {
    await clearCompletedItems()
    router.refresh()
  }

  const hasCompleted = items.some(i => i.completed)

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          ref={inputRef}
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleAdd() }}
          placeholder="Adicionar item..."
          className="flex-1 px-3 py-2 border border-input rounded-lg bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <Button onClick={handleAdd} className="rounded-lg">
          <Plus className="size-4" />
        </Button>
      </div>

      {hasCompleted && (
        <Button variant="ghost" size="sm" onClick={handleClearCompleted} className="text-muted-foreground hover:text-destructive">
          <Eraser className="size-4 mr-1" />
          Limpar concluídos
        </Button>
      )}

      {items.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">Lista de compras vazia.</p>
      )}

      <div className="space-y-6">
        {categoryOrder.map(cat => (
          <div key={cat}>
            <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5">
              <span>{CATEGORY_EMOJIS[cat] || "📦"}</span>
              {cat}
              <span className="text-xs text-muted-foreground font-normal">({grouped[cat].length})</span>
            </h3>
            <div className="space-y-1">
              {grouped[cat].map(item => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 bg-card border border-border rounded-xl hover:border-primary/30 transition-all group"
                >
                  <Checkbox
                    checked={item.completed}
                    onCheckedChange={() => handleToggle(item.id)}
                    className="cursor-pointer"
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${item.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                      {item.item_name}
                    </p>
                  </div>
                  {item.quantity && (
                    <span className="text-xs text-muted-foreground shrink-0">{item.quantity}</span>
                  )}
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="size-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
