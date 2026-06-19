-- Migration 00007: Seed default shopping categories on household creation and backfill

-- 0. Deduplicate: remove duplicate categories (from repeated migration runs)
DELETE FROM shopping_categories
WHERE id IN (
  SELECT id FROM (
    SELECT id, ROW_NUMBER() OVER (
      PARTITION BY household_id, name ORDER BY sort_order
    ) AS rn
    FROM shopping_categories
  ) sub
  WHERE rn > 1
);

-- 1. Update trigger function to seed shopping_categories for new households
CREATE OR REPLACE FUNCTION handle_new_household()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO household_members (household_id, user_id, role)
  VALUES (NEW.id, NEW.admin_id, 'admin');

  UPDATE profiles SET household_id = NEW.id WHERE id = NEW.admin_id;

  INSERT INTO notification_settings (household_id)
  VALUES (NEW.id);

  INSERT INTO shopping_categories (household_id, name, keywords, sort_order)
  VALUES
    (NEW.id, 'Hortifrúti',  ARRAY['fruta', 'verdura', 'legume', 'salada', 'alface', 'tomate', 'banana', 'maçã', 'batata', 'cebola', 'alho'], 0),
    (NEW.id, 'Mercearia',   ARRAY['arroz', 'feijão', 'macarrão', 'óleo', 'açúcar', 'sal', 'café', 'farinha', 'leite em pó', 'tempero'], 1),
    (NEW.id, 'Laticínios',  ARRAY['leite', 'queijo', 'manteiga', 'iogurte', 'requeijão', 'creme de leite', 'coalhada'], 2),
    (NEW.id, 'Carnes',      ARRAY['carne', 'frango', 'peixe', 'bovina', 'suína', 'linguiça', 'hambúrguer'], 3),
    (NEW.id, 'Limpeza',     ARRAY['detergente', 'sabão', 'desinfetante', 'álcool', 'cloro', 'limpador', 'esponja', 'luva'], 4),
    (NEW.id, 'Higiene',     ARRAY['sabonete', 'shampoo', 'condicionador', 'pasta de dente', 'desodorante', 'papel higiênico', 'absorvente'], 5),
    (NEW.id, 'Bebidas',     ARRAY['água', 'refrigerante', 'suco', 'cerveja', 'vinho', 'bebida'], 6),
    (NEW.id, 'Outros',      ARRAY[]::TEXT[], 7);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';

-- 2. Backfill: seed default categories for households that don't have any
INSERT INTO shopping_categories (household_id, name, keywords, sort_order)
SELECT h.id, cat.name, cat.keywords, cat.sort_order
FROM households h
CROSS JOIN (
  VALUES
    ('Hortifrúti',  ARRAY['fruta', 'verdura', 'legume', 'salada', 'alface', 'tomate', 'banana', 'maçã', 'batata', 'cebola', 'alho'], 0),
    ('Mercearia',   ARRAY['arroz', 'feijão', 'macarrão', 'óleo', 'açúcar', 'sal', 'café', 'farinha', 'leite em pó', 'tempero'], 1),
    ('Laticínios',  ARRAY['leite', 'queijo', 'manteiga', 'iogurte', 'requeijão', 'creme de leite', 'coalhada'], 2),
    ('Carnes',      ARRAY['carne', 'frango', 'peixe', 'bovina', 'suína', 'linguiça', 'hambúrguer'], 3),
    ('Limpeza',     ARRAY['detergente', 'sabão', 'desinfetante', 'álcool', 'cloro', 'limpador', 'esponja', 'luva'], 4),
    ('Higiene',     ARRAY['sabonete', 'shampoo', 'condicionador', 'pasta de dente', 'desodorante', 'papel higiênico', 'absorvente'], 5),
    ('Bebidas',     ARRAY['água', 'refrigerante', 'suco', 'cerveja', 'vinho', 'bebida'], 6),
    ('Outros',      ARRAY[]::TEXT[], 7)
) AS cat(name, keywords, sort_order)
WHERE NOT EXISTS (
  SELECT 1 FROM shopping_categories sc
  WHERE sc.household_id = h.id
);
