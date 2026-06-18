interface Category {
  id: string
  name: string
  keywords: string[]
  sort_order: number
}

interface DefaultCategory {
  name: string
  keywords: string[]
  sort_order: number
}

export const DEFAULT_CATEGORIES: DefaultCategory[] = [
  { name: "Hortifrúti",  keywords: ["fruta", "verdura", "legume", "salada", "alface", "tomate", "banana", "maçã", "batata", "cebola", "alho"], sort_order: 0 },
  { name: "Mercearia",   keywords: ["arroz", "feijão", "macarrão", "óleo", "açúcar", "sal", "café", "farinha", "leite em pó", "tempero"], sort_order: 1 },
  { name: "Laticínios",  keywords: ["leite", "queijo", "manteiga", "iogurte", "requeijão", "creme de leite", "coalhada"], sort_order: 2 },
  { name: "Carnes",      keywords: ["carne", "frango", "peixe", "bovina", "suína", "linguiça", "hambúrguer"], sort_order: 3 },
  { name: "Limpeza",     keywords: ["detergente", "sabão", "desinfetante", "álcool", "cloro", "limpador", "esponja", "luva"], sort_order: 4 },
  { name: "Higiene",     keywords: ["sabonete", "shampoo", "condicionador", "pasta de dente", "desodorante", "papel higiênico", "absorvente"], sort_order: 5 },
  { name: "Bebidas",     keywords: ["água", "refrigerante", "suco", "cerveja", "vinho", "bebida"], sort_order: 6 },
  { name: "Outros",      keywords: [], sort_order: 7 },
]

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
