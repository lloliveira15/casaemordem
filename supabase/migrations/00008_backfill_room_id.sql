-- Backfill room_id for existing task_templates that have room_id = null
-- Uses the legacy room TEXT column and the existing rooms table
UPDATE task_templates tt
SET room_id = r.id
FROM rooms r
WHERE r.household_id = tt.household_id
  AND r.name = COALESCE(NULLIF(tt.room, ''), 'Geral')
  AND tt.room_id IS NULL;

-- Backfill room_id for existing tasks that have room_id = null
UPDATE tasks t
SET room_id = r.id
FROM rooms r
WHERE r.household_id = t.household_id
  AND r.name = COALESCE(NULLIF(t.room, ''), 'Geral')
  AND t.room_id IS NULL;
