-- Create profile_photos table
CREATE TABLE public.profile_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profile_photos ENABLE ROW LEVEL SECURITY;

-- Create policies for profile_photos
CREATE POLICY "Users can view their own photos" 
ON public.profile_photos 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own photos" 
ON public.profile_photos 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can delete their own photos" 
ON public.profile_photos 
FOR DELETE 
USING (true);

-- Fix function search path warning
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$;