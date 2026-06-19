-- Migration 00009: Add location column to events table for compromissos
ALTER TABLE events ADD COLUMN location TEXT;
