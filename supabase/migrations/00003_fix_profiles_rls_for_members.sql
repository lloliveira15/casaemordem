-- Allow users to view profiles of other members in the same household
DROP POLICY IF EXISTS "profiles_select" ON profiles;
CREATE POLICY "profiles_select" ON profiles FOR SELECT
USING (
  id = auth.uid()
  OR household_id = public.get_user_household()
);
