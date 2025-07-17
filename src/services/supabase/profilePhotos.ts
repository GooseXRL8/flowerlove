import { supabase } from '@/integrations/supabase/client';

export interface ProfilePhoto {
  id: string;
  url: string;
  user_id: string;
  created_at: string;
}

export const supabaseProfilePhotos = {
  // Get photos for a specific user
  getByUserId: async (userId: string): Promise<ProfilePhoto[]> => {
    try {
      const { data, error } = await supabase
        .from('profile_photos')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching profile photos:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getByUserId:', error);
      return [];
    }
  },

  // Create new photo
  create: async (photo: Omit<ProfilePhoto, 'id' | 'created_at'>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('profile_photos')
        .insert({
          url: photo.url,
          user_id: photo.user_id
        });

      if (error) {
        console.error('Error creating profile photo:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in create:', error);
      return false;
    }
  },

  // Delete photo by ID
  deleteById: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('profile_photos')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting profile photo:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteById:', error);
      return false;
    }
  },

  // Count photos for a user
  countByUserId: async (userId: string): Promise<number> => {
    try {
      const { count, error } = await supabase
        .from('profile_photos')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (error) {
        console.error('Error counting profile photos:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('Error in countByUserId:', error);
      return 0;
    }
  }
};