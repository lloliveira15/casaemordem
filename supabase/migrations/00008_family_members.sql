-- Migration 00008: Create family_members table for non-user household members

CREATE TABLE family_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('baby', 'pet', 'other')),
  phone TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "family_members_select" ON family_members FOR SELECT USING (
  household_id IN (
    SELECT household_id FROM household_members WHERE user_id = auth.uid()
  )
);

CREATE POLICY "family_members_insert" ON family_members FOR INSERT WITH CHECK (
  household_id IN (
    SELECT household_id FROM household_members WHERE user_id = auth.uid()
  )
);

CREATE POLICY "family_members_update" ON family_members FOR UPDATE USING (
  household_id IN (
    SELECT household_id FROM household_members WHERE user_id = auth.uid()
  )
);

CREATE POLICY "family_members_delete" ON family_members FOR DELETE USING (
  household_id IN (
    SELECT household_id FROM household_members WHERE user_id = auth.uid()
  )
);
