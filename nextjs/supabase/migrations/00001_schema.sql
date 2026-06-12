-- 1. PROFILES (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  household_id UUID,
  role TEXT DEFAULT 'member',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. HOUSEHOLDS
CREATE TABLE households (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  admin_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  invite_code TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(3), 'hex'),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. HOUSEHOLD MEMBERS
CREATE TABLE household_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member',
  notifications_enabled BOOLEAN DEFAULT true,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(household_id, user_id)
);

-- 4. TASK TEMPLATES
CREATE TABLE task_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  room TEXT DEFAULT 'Geral',
  assigned_to TEXT,
  frequency TEXT DEFAULT 'daily' CHECK (frequency IN ('daily','weekly','biweekly','monthly')),
  day_value INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TASKS
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  template_id UUID REFERENCES task_templates(id) ON DELETE SET NULL,
  description TEXT NOT NULL,
  room TEXT DEFAULT 'Geral',
  assigned_to TEXT,
  due_date DATE NOT NULL,
  completed BOOLEAN DEFAULT false,
  completed_by UUID REFERENCES profiles(id),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. EVENTS
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES profiles(id),
  description TEXT NOT NULL,
  event_date_time TIMESTAMPTZ NOT NULL,
  completed BOOLEAN DEFAULT false,
  completed_by UUID REFERENCES profiles(id),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. NOTIFICATION SETTINGS
CREATE TABLE notification_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID UNIQUE NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  email_enabled BOOLEAN DEFAULT true,
  reminder_time TEXT DEFAULT '16:00',
  reminder_freq TEXT DEFAULT 'daily',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TRIGGER: auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, username, email)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'username', NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- TRIGGER: auto-create household for profiles without household_id
CREATE OR REPLACE FUNCTION handle_new_profile()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.household_id IS NULL THEN
    INSERT INTO households (name, admin_id)
    VALUES ('Minha Casa', NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_profile_created
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION handle_new_profile();

-- TRIGGER: add admin as household_member after household creation
CREATE OR REPLACE FUNCTION handle_new_household()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO household_members (household_id, user_id, role)
  VALUES (NEW.id, NEW.admin_id, 'admin');

  UPDATE profiles SET household_id = NEW.id WHERE id = NEW.admin_id;

  INSERT INTO notification_settings (household_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_household_created
  AFTER INSERT ON households
  FOR EACH ROW EXECUTE FUNCTION handle_new_household();

-- RLS POLICIES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE households ENABLE ROW LEVEL SECURITY;
ALTER TABLE household_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;

-- Profiles: user sees own + household members
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (
  id = auth.uid() OR
  household_id IN (
    SELECT household_id FROM household_members WHERE user_id = auth.uid()
  )
);

CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (
  id = auth.uid()
);

-- Households: members can select, admin can update
CREATE POLICY "households_select" ON households FOR SELECT USING (
  id IN (
    SELECT household_id FROM household_members WHERE user_id = auth.uid()
  )
);

CREATE POLICY "households_update" ON households FOR UPDATE USING (
  admin_id = auth.uid()
);

CREATE POLICY "households_insert" ON households FOR INSERT WITH CHECK (
  admin_id = auth.uid()
);

-- Household members: members can read, admin can manage
CREATE POLICY "members_select" ON household_members FOR SELECT USING (
  household_id IN (
    SELECT household_id FROM household_members WHERE user_id = auth.uid()
  )
);

CREATE POLICY "members_insert" ON household_members FOR INSERT WITH CHECK (
  household_id IN (
    SELECT household_id FROM household_members WHERE user_id = auth.uid()
  )
);

CREATE POLICY "members_update" ON household_members FOR UPDATE USING (
  household_id IN (
    SELECT household_id FROM household_members WHERE user_id = auth.uid()
  )
);

-- Tasks RLS
CREATE POLICY "tasks_select" ON tasks FOR SELECT USING (
  household_id IN (SELECT household_id FROM household_members WHERE user_id = auth.uid())
);
CREATE POLICY "tasks_insert" ON tasks FOR INSERT WITH CHECK (
  household_id IN (SELECT household_id FROM household_members WHERE user_id = auth.uid())
);
CREATE POLICY "tasks_update" ON tasks FOR UPDATE USING (
  household_id IN (SELECT household_id FROM household_members WHERE user_id = auth.uid())
);
CREATE POLICY "tasks_delete" ON tasks FOR DELETE USING (
  household_id IN (SELECT household_id FROM household_members WHERE user_id = auth.uid())
);

-- Templates RLS
CREATE POLICY "templates_select" ON task_templates FOR SELECT USING (
  household_id IN (SELECT household_id FROM household_members WHERE user_id = auth.uid())
);
CREATE POLICY "templates_insert" ON task_templates FOR INSERT WITH CHECK (
  household_id IN (SELECT household_id FROM household_members WHERE user_id = auth.uid())
);
CREATE POLICY "templates_update" ON task_templates FOR UPDATE USING (
  household_id IN (SELECT household_id FROM household_members WHERE user_id = auth.uid())
);
CREATE POLICY "templates_delete" ON task_templates FOR DELETE USING (
  household_id IN (SELECT household_id FROM household_members WHERE user_id = auth.uid())
);

-- Events RLS
CREATE POLICY "events_select" ON events FOR SELECT USING (
  household_id IN (SELECT household_id FROM household_members WHERE user_id = auth.uid())
);
CREATE POLICY "events_insert" ON events FOR INSERT WITH CHECK (
  household_id IN (SELECT household_id FROM household_members WHERE user_id = auth.uid())
);
CREATE POLICY "events_update" ON events FOR UPDATE USING (
  household_id IN (SELECT household_id FROM household_members WHERE user_id = auth.uid())
);
CREATE POLICY "events_delete" ON events FOR DELETE USING (
  household_id IN (SELECT household_id FROM household_members WHERE user_id = auth.uid())
);

-- Notification settings RLS
CREATE POLICY "notif_select" ON notification_settings FOR SELECT USING (
  household_id IN (SELECT household_id FROM household_members WHERE user_id = auth.uid())
);
CREATE POLICY "notif_insert" ON notification_settings FOR INSERT WITH CHECK (
  household_id IN (SELECT household_id FROM household_members WHERE user_id = auth.uid())
);
CREATE POLICY "notif_update" ON notification_settings FOR UPDATE USING (
  household_id IN (SELECT household_id FROM household_members WHERE user_id = auth.uid())
);
