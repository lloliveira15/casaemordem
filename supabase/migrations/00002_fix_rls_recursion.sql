-- Fix RLS infinite recursion by creating a SECURITY DEFINER helper function

-- 1. Create helper function to get current user's household_id safely
CREATE OR REPLACE FUNCTION public.get_user_household()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT household_id FROM profiles WHERE id = auth.uid()
$$;

-- 2. Fix profiles_select - don't reference household_members
DROP POLICY IF EXISTS "profiles_select" ON profiles;
CREATE POLICY "profiles_select" ON profiles FOR SELECT
USING (id = auth.uid());

-- 3. Fix members_select
DROP POLICY IF EXISTS "members_select" ON household_members;
CREATE POLICY "members_select" ON household_members FOR SELECT
USING (household_id = public.get_user_household());

-- 4. Fix members_insert
DROP POLICY IF EXISTS "members_insert" ON household_members;
CREATE POLICY "members_insert" ON household_members FOR INSERT WITH CHECK (
  household_id = public.get_user_household()
);

-- 5. Fix members_update
DROP POLICY IF EXISTS "members_update" ON household_members;
CREATE POLICY "members_update" ON household_members FOR UPDATE USING (
  household_id = public.get_user_household()
);

-- 6. Fix households_select
DROP POLICY IF EXISTS "households_select" ON households;
CREATE POLICY "households_select" ON households FOR SELECT
USING (id = public.get_user_household());

-- 7. Fix households_update
DROP POLICY IF EXISTS "households_update" ON households;
-- Admin can update their own household
CREATE POLICY "households_update" ON households FOR UPDATE
USING (admin_id = auth.uid());

-- 8. Fix households_insert
DROP POLICY IF EXISTS "households_insert" ON households;
CREATE POLICY "households_insert" ON households FOR INSERT WITH CHECK (
  admin_id = auth.uid()
);

-- 9. Fix tasks RLS policies
DROP POLICY IF EXISTS "tasks_select" ON tasks;
DROP POLICY IF EXISTS "tasks_insert" ON tasks;
DROP POLICY IF EXISTS "tasks_update" ON tasks;
DROP POLICY IF EXISTS "tasks_delete" ON tasks;

CREATE POLICY "tasks_select" ON tasks FOR SELECT
USING (household_id = public.get_user_household());
CREATE POLICY "tasks_insert" ON tasks FOR INSERT WITH CHECK (
  household_id = public.get_user_household()
);
CREATE POLICY "tasks_update" ON tasks FOR UPDATE USING (
  household_id = public.get_user_household()
);
CREATE POLICY "tasks_delete" ON tasks FOR DELETE USING (
  household_id = public.get_user_household()
);

-- 10. Fix templates RLS policies
DROP POLICY IF EXISTS "templates_select" ON task_templates;
DROP POLICY IF EXISTS "templates_insert" ON task_templates;
DROP POLICY IF EXISTS "templates_update" ON task_templates;
DROP POLICY IF EXISTS "templates_delete" ON task_templates;

CREATE POLICY "templates_select" ON task_templates FOR SELECT
USING (household_id = public.get_user_household());
CREATE POLICY "templates_insert" ON task_templates FOR INSERT WITH CHECK (
  household_id = public.get_user_household()
);
CREATE POLICY "templates_update" ON task_templates FOR UPDATE USING (
  household_id = public.get_user_household()
);
CREATE POLICY "templates_delete" ON task_templates FOR DELETE USING (
  household_id = public.get_user_household()
);

-- 11. Fix events RLS policies
DROP POLICY IF EXISTS "events_select" ON events;
DROP POLICY IF EXISTS "events_insert" ON events;
DROP POLICY IF EXISTS "events_update" ON events;
DROP POLICY IF EXISTS "events_delete" ON events;

CREATE POLICY "events_select" ON events FOR SELECT
USING (household_id = public.get_user_household());
CREATE POLICY "events_insert" ON events FOR INSERT WITH CHECK (
  household_id = public.get_user_household()
);
CREATE POLICY "events_update" ON events FOR UPDATE USING (
  household_id = public.get_user_household()
);
CREATE POLICY "events_delete" ON events FOR DELETE USING (
  household_id = public.get_user_household()
);

-- 12. Fix notification_settings RLS
DROP POLICY IF EXISTS "notif_select" ON notification_settings;
DROP POLICY IF EXISTS "notif_insert" ON notification_settings;
DROP POLICY IF EXISTS "notif_update" ON notification_settings;

CREATE POLICY "notif_select" ON notification_settings FOR SELECT
USING (household_id = public.get_user_household());
CREATE POLICY "notif_insert" ON notification_settings FOR INSERT WITH CHECK (
  household_id = public.get_user_household()
);
CREATE POLICY "notif_update" ON notification_settings FOR UPDATE USING (
  household_id = public.get_user_household()
);
