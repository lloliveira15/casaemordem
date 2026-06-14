-- Migration 00006: Seed default shopping categories for existing households

INSERT INTO shopping_categories (household_id, name, keywords, sort_order)
SELECT h.id, cat.name, cat.keywords, cat.sort_order
FROM households h
CROSS JOIN (
  VALUES
    ('Hortifrúti',    ARRAY['fruta', 'verdura', 'legume', 'salada', 'alface', 'tomate', 'banana', 'maçã', 'batata', 'cebola', 'alho'], 0),
    ('Mercearia',     ARRAY['arroz', 'feijão', 'macarrão', 'óleo', 'açúcar', 'sal', 'café', 'farinha', 'leite em pó', 'tempero'], 1),
    ('Laticínios',    ARRAY['leite', 'queijo', 'manteiga', 'iogurte', 'requeijão', 'creme de leite', 'coalhada'], 2),
    ('Carnes',        ARRAY['carne', 'frango', 'peixe', 'bovina', 'suína', 'linguiça', 'hambúrguer'], 3),
    ('Limpeza',       ARRAY['detergente', 'sabão', 'desinfetante', 'álcool', 'cloro', 'limpador', 'esponja', 'luva'], 4),
    ('Higiene',       ARRAY['sabonete', 'shampoo', 'condicionador', 'pasta de dente', 'desodorante', 'papel higiênico', 'absorvente'], 5),
    ('Bebidas',       ARRAY['água', 'refrigerante', 'suco', 'cerveja', 'vinho', 'bebida'], 6),
    ('Outros',        ARRAY[]::TEXT[], 7)
) AS cat(name, keywords, sort_order)
ON CONFLICT DO NOTHING;
