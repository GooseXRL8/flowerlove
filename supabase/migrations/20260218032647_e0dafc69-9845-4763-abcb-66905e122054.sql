
-- 1. Users table
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT false,
  assigned_profile_id UUID NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_by TEXT NOT NULL,
  start_date DATE NOT NULL,
  custom_title TEXT NULL,
  assigned_user_id TEXT NULL,
  image_url TEXT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Memories table
CREATE TABLE public.memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NULL,
  memory_date DATE NOT NULL,
  location TEXT NULL,
  image_url TEXT NULL,
  tags TEXT[] DEFAULT '{}',
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Profile photos table
CREATE TABLE public.profile_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS policies for users
CREATE POLICY "Allow all select on users" ON public.users FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow all insert on users" ON public.users FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow all update on users" ON public.users FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all delete on users" ON public.users FOR DELETE TO anon, authenticated USING (true);

-- RLS policies for profiles
CREATE POLICY "Allow all select on profiles" ON public.profiles FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow all insert on profiles" ON public.profiles FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow all update on profiles" ON public.profiles FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all delete on profiles" ON public.profiles FOR DELETE TO anon, authenticated USING (true);

-- RLS policies for memories
CREATE POLICY "Allow all select on memories" ON public.memories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow all insert on memories" ON public.memories FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow all update on memories" ON public.memories FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all delete on memories" ON public.memories FOR DELETE TO anon, authenticated USING (true);

-- RLS policies for profile_photos
CREATE POLICY "Allow all select on profile_photos" ON public.profile_photos FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow all insert on profile_photos" ON public.profile_photos FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow all update on profile_photos" ON public.profile_photos FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all delete on profile_photos" ON public.profile_photos FOR DELETE TO anon, authenticated USING (true);
