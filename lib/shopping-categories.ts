interface Category {
  id: string
  name: string
  keywords: string[]
  sort_order: number
}

export function autoCategorize(itemName: string, categories: Category[]): string | null {
  const normalized = itemName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  for (const cat of categories) {
    if (cat.name === "Outros") continue
    for (const kw of cat.keywords) {
      const normalizedKw = kw.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      if (normalized.includes(normalizedKw)) return cat.name
    }
  }
  return "Outros"
}
