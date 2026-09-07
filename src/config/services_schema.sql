-- ==============================================================================
-- TERESITAS BARBERSHOP - SUPABASE SERVICES TABLE SCHEMA
-- Run this script in your Supabase SQL Editor (https://supabase.com/dashboard)
-- ==============================================================================

-- 1. Create the services table
CREATE TABLE IF NOT EXISTS public.services (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  category    TEXT NOT NULL DEFAULT 'Haircut',
  price       TEXT NOT NULL DEFAULT '₱200',
  price_value NUMERIC(10,2) DEFAULT 200.00,
  duration    TEXT NOT NULL DEFAULT '30 mins',
  description TEXT,
  status      TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
  image_url   TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies if any to prevent conflicts
DROP POLICY IF EXISTS "Public can read services" ON public.services;
DROP POLICY IF EXISTS "Allow anon and auth full access to services" ON public.services;

-- 4. Create policies: allow read for public, and allow add/edit/delete for app
CREATE POLICY "Public can read services"
  ON public.services FOR SELECT
  USING (true);

CREATE POLICY "Allow anon and auth full access to services"
  ON public.services FOR ALL
  USING (true)
  WITH CHECK (true);

-- 5. Enable Real-Time replication on services table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'services'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.services;
  END IF;
END $$;

-- 6. Insert initial default services if table is empty
INSERT INTO public.services (name, category, price, price_value, duration, description, status)
SELECT 'Taper Fade', 'Haircut', '₱250', 250, '45 mins', 'Clean fade with seamless blend on sides and back, scissor styled top.', 'Active'
WHERE NOT EXISTS (SELECT 1 FROM public.services WHERE name = 'Taper Fade');

INSERT INTO public.services (name, category, price, price_value, duration, description, status)
SELECT 'Buzz Cut', 'Haircut', '₱180', 180, '30 mins', 'Even length all over with clean edge lineup.', 'Active'
WHERE NOT EXISTS (SELECT 1 FROM public.services WHERE name = 'Buzz Cut');

INSERT INTO public.services (name, category, price, price_value, duration, description, status)
SELECT 'Crew Cut', 'Haircut', '₱200', 200, '35 mins', 'Classic tapered short cut, styled neatly at the top.', 'Active'
WHERE NOT EXISTS (SELECT 1 FROM public.services WHERE name = 'Crew Cut');

INSERT INTO public.services (name, category, price, price_value, duration, description, status)
SELECT 'French Crop', 'Haircut', '₱250', 250, '40 mins', 'Modern textured crop with blunt fringe and tapered fade sides.', 'Active'
WHERE NOT EXISTS (SELECT 1 FROM public.services WHERE name = 'French Crop');

INSERT INTO public.services (name, category, price, price_value, duration, description, status)
SELECT 'Undercut', 'Haircut', '₱250', 250, '45 mins', 'Short sides and back with distinct long top contrast.', 'Active'
WHERE NOT EXISTS (SELECT 1 FROM public.services WHERE name = 'Undercut');

INSERT INTO public.services (name, category, price, price_value, duration, description, status)
SELECT 'Beard Trim & Shave', 'Beard & Shave', '₱150', 150, '25 mins', 'Precision beard shaping and hot towel razor line detailing.', 'Active'
WHERE NOT EXISTS (SELECT 1 FROM public.services WHERE name = 'Beard Trim & Shave');

INSERT INTO public.services (name, category, price, price_value, duration, description, status)
SELECT 'Hair Treatment & Wash', 'Hair Care', '₱300', 300, '50 mins', 'Deep conditioning scalp wash with relaxing head massage.', 'Inactive'
WHERE NOT EXISTS (SELECT 1 FROM public.services WHERE name = 'Hair Treatment & Wash');
