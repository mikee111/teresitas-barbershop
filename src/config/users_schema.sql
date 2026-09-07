-- ==============================================================================
-- TERESITAS BARBERSHOP - USERS & ALL TABLES PERMISSIONS SCHEMA
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard)
-- Safe to run whether the table already exists or is brand new!
-- ==============================================================================

-- 1. Create the users table if it doesn't already exist
CREATE TABLE IF NOT EXISTS public.users (
  id          BIGSERIAL PRIMARY KEY,
  first_name  TEXT NOT NULL DEFAULT '',
  middle_name TEXT DEFAULT '',
  last_name   TEXT NOT NULL DEFAULT '',
  birthdate   DATE,
  age         INTEGER,
  email       TEXT UNIQUE NOT NULL,
  address     TEXT DEFAULT '',
  password    TEXT NOT NULL,
  contact     TEXT DEFAULT '',
  role        TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 2. If the table already existed, ensure all required columns exist
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS first_name TEXT DEFAULT '';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS middle_name TEXT DEFAULT '';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS last_name TEXT DEFAULT '';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS birthdate DATE;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS age INTEGER;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS address TEXT DEFAULT '';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS contact TEXT DEFAULT '';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 4. Drop old policies to prevent duplicate errors
DROP POLICY IF EXISTS "Public can read users" ON public.users;
DROP POLICY IF EXISTS "Allow anon and auth full access to users" ON public.users;

-- 5. Create policy allowing read and write access
CREATE POLICY "Allow anon and auth full access to users"
  ON public.users FOR ALL
  USING (true)
  WITH CHECK (true);

-- 6. CRITICAL: Grant table & sequence privileges (Fixes "permission denied" error)
GRANT ALL ON TABLE public.users TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.services TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.barbers TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- 7. Enable Real-Time replication on users table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'users'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
  END IF;
END $$;

-- 8. Seed default accounts if not existing
INSERT INTO public.users (first_name, last_name, email, password, role, contact, address)
VALUES 
  ('Admin', 'User', 'admin@teresitas.com', 'admin123', 'admin', '0912-345-6789', 'Teresitas Barbershop HQ, Manila')
ON CONFLICT (email) DO NOTHING;

INSERT INTO public.users (first_name, middle_name, last_name, birthdate, age, email, password, role, contact, address)
VALUES 
  ('Juan', 'Santos', 'Dela Cruz', '1998-05-15', 28, 'user@teresitas.com', 'user123', 'user', '0917-890-1234', '123 Rizal St., Sampaloc, Manila')
ON CONFLICT (email) DO NOTHING;
