-- Migration: Add avatar column to staffs table
ALTER TABLE staffs ADD COLUMN avatar VARCHAR(500) DEFAULT NULL AFTER phone;
