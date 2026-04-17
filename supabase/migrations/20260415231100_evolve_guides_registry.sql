-- Evolution of the Guide Registry for the "Expedition Heartbeat"
ALTER TABLE guides ADD COLUMN IF NOT EXISTS phone_number TEXT;
ALTER TABLE guides ADD COLUMN IF NOT EXISTS fleet_assigned TEXT DEFAULT 'Land Cruiser 300';
ALTER TABLE guides ADD COLUMN IF NOT EXISTS current_status TEXT DEFAULT 'Ready';
