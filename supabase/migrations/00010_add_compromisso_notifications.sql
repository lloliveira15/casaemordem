-- Migration 00010: Add compromisso notification columns

ALTER TABLE events ADD COLUMN notified_1h BOOLEAN DEFAULT false;
ALTER TABLE events ADD COLUMN notified_30min BOOLEAN DEFAULT false;

ALTER TABLE notification_settings ADD COLUMN events_enabled BOOLEAN DEFAULT true;
