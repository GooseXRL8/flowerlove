-- Create users table for authentication and user management
CREATE TABLE public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  is_admin BOOLEAN NOT NULL DEFAULT false,
  assigned_profile_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profiles table for couple profiles
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_by TEXT NOT NULL,
  start_date DATE NOT NULL,
  custom_title TEXT,
  assigned_user_id UUID,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create memories table for couple memories
CREATE TABLE public.memories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  memory_date DATE NOT NULL,
  location TEXT,
  image_url TEXT,
  tags TEXT[],
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add foreign key constraint for assigned_profile_id
ALTER TABLE public.users 
ADD CONSTRAINT fk_users_assigned_profile 
FOREIGN KEY (assigned_profile_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

-- Add foreign key constraint for assigned_user_id
ALTER TABLE public.profiles 
ADD CONSTRAINT fk_profiles_assigned_user 
FOREIGN KEY (assigned_user_id) REFERENCES public.users(id) ON DELETE SET NULL;

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view their own data" 
ON public.users 
FOR SELECT 
USING (true); -- For now, allow all reads for compatibility

CREATE POLICY "Users can update their own data" 
ON public.users 
FOR UPDATE 
USING (true); -- For now, allow all updates for compatibility

CREATE POLICY "Admins can manage users" 
ON public.users 
FOR ALL 
USING (true); -- For now, allow all operations for compatibility

-- Create policies for profiles table
CREATE POLICY "Users can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create profiles" 
ON public.profiles 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update profiles they're assigned to" 
ON public.profiles 
FOR UPDATE 
USING (true);

CREATE POLICY "Admins can delete profiles" 
ON public.profiles 
FOR DELETE 
USING (true);

-- Create policies for memories table
CREATE POLICY "Users can view memories of their assigned profile" 
ON public.memories 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create memories for their assigned profile" 
ON public.memories 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update memories of their assigned profile" 
ON public.memories 
FOR UPDATE 
USING (true);

CREATE POLICY "Users can delete memories of their assigned profile" 
ON public.memories 
FOR DELETE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_memories_updated_at
  BEFORE UPDATE ON public.memories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default admin user
INSERT INTO public.users (username, password, is_admin)
VALUES ('joao', 'joao123', true);

-- Insert default test profile and user
INSERT INTO public.profiles (name, created_by, start_date, image_url)
VALUES ('Perfil de Teste', 'system', CURRENT_DATE, '/lovable-uploads/a60a0dbc-45be-4ae8-9b7d-eb2cbc8e133e.png');

-- Get the profile ID to assign to test user
DO $$
DECLARE
    profile_uuid UUID;
BEGIN
    SELECT id INTO profile_uuid FROM public.profiles WHERE name = 'Perfil de Teste' LIMIT 1;
    
    INSERT INTO public.users (username, password, is_admin, assigned_profile_id)
    VALUES ('teste', 'abacate123', false, profile_uuid);
    
    UPDATE public.profiles 
    SET assigned_user_id = (SELECT id FROM public.users WHERE username = 'teste' LIMIT 1)
    WHERE id = profile_uuid;
END $$;