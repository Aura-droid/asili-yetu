-- The "Savannah-Eye" Telemetry Grid
CREATE TABLE IF NOT EXISTS fleet_telemetry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id UUID REFERENCES guides(id) ON DELETE CASCADE,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  speed FLOAT DEFAULT 0,
  battery_level INT DEFAULT 100,
  signal_strength INT DEFAULT 100,
  status TEXT DEFAULT 'Active',
  timestamp TIMESTAMPTZ DEFAULT now()
);

-- Enable realtime for the telemetry grid (Idempotent check)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'fleet_telemetry'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE fleet_telemetry;
  END IF;
END $$;
