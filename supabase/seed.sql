-- supabase/seed.sql
DO $$
DECLARE
  test_user_id UUID := 'YOUR_TEST_USER_UUID';
  test_household_id UUID;
BEGIN
  UPDATE profiles SET username = 'Admin Teste' WHERE id = test_user_id;

  SELECT id INTO test_household_id FROM households WHERE admin_id = test_user_id;

  INSERT INTO task_templates (household_id, description, room, frequency, day_value)
  VALUES
    (test_household_id, 'Varrer a sala', 'Sala', 'daily', 0),
    (test_household_id, 'Lavar banheiro', 'Banheiro', 'weekly', 6),
    (test_household_id, 'Trocar roupa de cama', 'Quarto', 'biweekly', 1),
    (test_household_id, 'Limpar geladeira', 'Cozinha', 'monthly', 1);
END $$;
