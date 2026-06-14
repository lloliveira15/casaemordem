-- Migration 00005: Add rooms, shopping tables and schema changes

-- 1. Create rooms table
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "rooms_select" ON rooms FOR SELECT USING (
  household_id IN (SELECT household_id FROM household_members WHERE user_id = auth.uid())
);
CREATE POLICY "rooms_insert" ON rooms FOR INSERT WITH CHECK (
  household_id IN (SELECT household_id FROM household_members WHERE user_id = auth.uid())
);
CREATE POLICY "rooms_update" ON rooms FOR UPDATE USING (
  household_id IN (SELECT household_id FROM household_members WHERE user_id = auth.uid())
);
CREATE POLICY "rooms_delete" ON rooms FOR DELETE USING (
  household_id IN (SELECT household_id FROM household_members WHERE user_id = auth.uid())
);

-- 2. Add columns to task_templates
ALTER TABLE task_templates
  ADD COLUMN room_id UUID REFERENCES rooms(id) ON DELETE SET NULL,
  ADD COLUMN assigned_to_id UUID REFERENCES household_members(id) ON DELETE SET NULL,
  ADD COLUMN is_sporadic BOOLEAN DEFAULT false;

-- 3. Add columns to tasks
ALTER TABLE tasks
  ADD COLUMN room_id UUID REFERENCES rooms(id) ON DELETE SET NULL,
  ADD COLUMN assigned_to_id UUID REFERENCES household_members(id) ON DELETE SET NULL;

-- 4. Update notification_settings
ALTER TABLE notification_settings
  ADD COLUMN reminder_times TEXT[] DEFAULT '{ "08:00", "14:00", "18:00" }',
  ADD COLUMN deadline_time TEXT DEFAULT '21:00';

-- 5. Create shopping_items table
CREATE TABLE shopping_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  category TEXT,
  quantity TEXT,
  completed BOOLEAN DEFAULT false,
  completed_by UUID REFERENCES profiles(id),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE shopping_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "shopping_select" ON shopping_items FOR SELECT USING (
  household_id IN (SELECT household_id FROM household_members WHERE user_id = auth.uid())
);
CREATE POLICY "shopping_insert" ON shopping_items FOR INSERT WITH CHECK (
  household_id IN (SELECT household_id FROM household_members WHERE user_id = auth.uid())
);
CREATE POLICY "shopping_update" ON shopping_items FOR UPDATE USING (
  household_id IN (SELECT household_id FROM household_members WHERE user_id = auth.uid())
);
CREATE POLICY "shopping_delete" ON shopping_items FOR DELETE USING (
  household_id IN (SELECT household_id FROM household_members WHERE user_id = auth.uid())
);

-- 6. Create shopping_categories table
CREATE TABLE shopping_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  keywords TEXT[] DEFAULT '{}',
  sort_order INTEGER DEFAULT 0
);

ALTER TABLE shopping_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "shopcat_select" ON shopping_categories FOR SELECT USING (
  household_id IN (SELECT household_id FROM household_members WHERE user_id = auth.uid())
);
CREATE POLICY "shopcat_insert" ON shopping_categories FOR INSERT WITH CHECK (
  household_id IN (SELECT household_id FROM household_members WHERE user_id = auth.uid())
);
CREATE POLICY "shopcat_update" ON shopping_categories FOR UPDATE USING (
  household_id IN (SELECT household_id FROM household_members WHERE user_id = auth.uid())
);
CREATE POLICY "shopcat_delete" ON shopping_categories FOR DELETE USING (
  household_id IN (SELECT household_id FROM household_members WHERE user_id = auth.uid())
);
