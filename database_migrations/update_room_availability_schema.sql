-- Migration: Update room_availability table schema
-- Date: 2025-11-12
-- Description: Renames availability_date to date, adds missing columns, and removes reason column

-- Step 1: Rename availability_date column to date
ALTER TABLE room_availability 
RENAME COLUMN availability_date TO date;

-- Step 2: Add missing columns
ALTER TABLE room_availability 
ADD COLUMN IF NOT EXISTS total_rooms INTEGER,
ADD COLUMN IF NOT EXISTS booked_rooms INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'available';

-- Step 3: Update total_rooms from room_types for existing records
UPDATE room_availability ra
SET total_rooms = rt.total_rooms
FROM room_types rt
WHERE ra.room_type_id = rt.id
AND ra.total_rooms IS NULL;

-- Step 4: Calculate booked_rooms for existing records
UPDATE room_availability
SET booked_rooms = COALESCE(total_rooms, 0) - COALESCE(available_rooms, 0) - COALESCE(blocked_rooms, 0)
WHERE booked_rooms = 0 OR booked_rooms IS NULL;

-- Step 5: Update status based on available_rooms
UPDATE room_availability
SET status = CASE
  WHEN available_rooms = 0 THEN 'sold_out'
  WHEN available_rooms <= (total_rooms * 0.2) THEN 'limited'
  WHEN blocked_rooms > 0 THEN 'blocked'
  ELSE 'available'
END
WHERE status IS NULL OR status = 'available';

-- Step 6: Make total_rooms NOT NULL after populating
ALTER TABLE room_availability 
ALTER COLUMN total_rooms SET NOT NULL;

-- Step 7: Drop reason column if it exists
ALTER TABLE room_availability 
DROP COLUMN IF EXISTS reason;

-- Step 8: Update the unique constraint
ALTER TABLE room_availability 
DROP CONSTRAINT IF EXISTS room_availability_room_type_id_availability_date_key;

ALTER TABLE room_availability 
ADD CONSTRAINT room_availability_room_type_id_date_key UNIQUE (room_type_id, date);

-- Step 9: Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_room_availability_date ON room_availability(date);
CREATE INDEX IF NOT EXISTS idx_room_availability_room_type ON room_availability(room_type_id);
CREATE INDEX IF NOT EXISTS idx_room_availability_status ON room_availability(status);

-- Add comments
COMMENT ON COLUMN room_availability.date IS 'Date for which availability is tracked';
COMMENT ON COLUMN room_availability.total_rooms IS 'Total number of rooms of this type';
COMMENT ON COLUMN room_availability.booked_rooms IS 'Number of rooms currently booked';
COMMENT ON COLUMN room_availability.status IS 'Availability status: available, limited, sold_out, blocked';

