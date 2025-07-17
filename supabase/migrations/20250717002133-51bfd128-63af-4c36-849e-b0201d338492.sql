-- Create profile_photos table
CREATE TABLE public.profile_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profile_photos ENABLE ROW LEVEL SECURITY;

-- Create policies for profile_photos
CREATE POLICY "Users can view their own photos" 
ON public.profile_photos 
FOR SELECT 
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create their own photos" 
ON public.profile_photos 
FOR INSERT 
WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own photos" 
ON public.profile_photos 
FOR DELETE 
USING (auth.uid()::text = user_id::text);

-- Add is_favorite field to memories table
ALTER TABLE public.memories 
ADD COLUMN is_favorite BOOLEAN NOT NULL DEFAULT false;

-- Create index for better performance on favorite queries
CREATE INDEX idx_memories_user_favorite ON public.memories(profile_id, is_favorite, created_at DESC);
CREATE INDEX idx_profile_photos_user_created ON public.profile_photos(user_id, created_at DESC);